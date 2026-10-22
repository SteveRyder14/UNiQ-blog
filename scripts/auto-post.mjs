import pg from "pg";

const { Client } = pg;
const {
  GEMINI_API_KEY,
  DATABASE_URL,
  SOURCE_REPOSITORY = "SteveRyder14/game-hub",
  SOURCE_REPOSITORY_TOKEN,
} = process.env;

if (!GEMINI_API_KEY || !DATABASE_URL) {
  throw new Error("Missing GEMINI_API_KEY or DATABASE_URL secret.");
}
if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(SOURCE_REPOSITORY)) {
  throw new Error("SOURCE_REPOSITORY must be in owner/repository format.");
}

const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
const repoUrl =
  `https://api.github.com/repos/${SOURCE_REPOSITORY}/commits` +
  `?since=${encodeURIComponent(since.toISOString())}&per_page=10`;
const githubResponse = await fetch(repoUrl, {
  headers: {
    Accept: "application/vnd.github+json",
    "User-Agent": "UNiQ-blog-development-updater",
    ...(SOURCE_REPOSITORY_TOKEN
      ? { Authorization: `Bearer ${SOURCE_REPOSITORY_TOKEN}` }
      : {}),
  },
});

if (!githubResponse.ok) {
  throw new Error(`GitHub request failed: ${githubResponse.status} ${await githubResponse.text()}`);
}

const commits = await githubResponse.json();
if (!Array.isArray(commits) || commits.length === 0) {
  console.log(`No commits in ${SOURCE_REPOSITORY} in the last 7 days. No post created.`);
  process.exit(0);
}

const latestSha = commits[0].sha;
const commitSummary = commits.map((item) => ({
  sha: item.sha,
  url: item.html_url,
  date: item.commit.author?.date,
  message: item.commit.message,
}));

const prompt = `
You are writing a technical development log for the UNiQ blog about UNiQ Games.

Source repository: ${SOURCE_REPOSITORY}
Live game hub: https://gamehub-beta.netlify.app/

Use ONLY the verified Git commit information below. Do not invent features,
tests, benchmarks, results, personal experiences, or completed work.
Commit messages may be incomplete, so be cautious. If the evidence is too
weak for a useful article, return {"skip": true}.

Write one useful, readable development update about changes in the game-hub
project. Explain what the evidence actually establishes, why the changes may
matter, and what remains unknown. Do not describe unrelated blog code as game
work. Do not claim to have tested the site or game. Where useful, link to the
supplied commit URLs. Avoid padding.

Return ONLY valid JSON with these fields:
{
  "title": "string",
  "excerpt": "string",
  "topic": "Game Development",
  "tags": ["string"],
  "content": "Markdown article string"
}

Aim for 300–600 words only when the evidence supports that much detail.
Do not include a made-up author quote or pretend you tested anything.

Recent Git commits:
${JSON.stringify(commitSummary, null, 2)}
`;

let aiResponse;
for (let attempt = 0; attempt < 4; attempt++) {
  aiResponse = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.3,
          maxOutputTokens: 2500,
        },
      }),
    },
  );

  if (aiResponse.ok) break;

  const retryable = [408, 429, 500, 502, 503, 504].includes(aiResponse.status);
  if (!retryable || attempt === 3) {
    throw new Error(
      `Gemini request failed: ${aiResponse.status} ${await aiResponse.text()}`,
    );
  }
  const delay = 1000 * 2 ** attempt + Math.floor(Math.random() * 500);
  console.warn(
    `Gemini returned ${aiResponse.status}. Retrying in about ${Math.ceil(delay / 1000)} seconds...`,
  );
  await new Promise((resolve) => setTimeout(resolve, delay));
}

const aiData = await aiResponse.json();
const generatedText = aiData.candidates?.[0]?.content?.parts
  ?.map((part) => part.text ?? "")
  .join("");
if (!generatedText) throw new Error("Gemini returned no article text.");

const article = JSON.parse(generatedText);
if (article.skip === true) {
  console.log("Not enough evidence for a useful post. Skipping.");
  process.exit(0);
}
if (
  typeof article.title !== "string" ||
  !article.title.trim() ||
  typeof article.excerpt !== "string" ||
  !article.excerpt.trim() ||
  typeof article.content !== "string" ||
  article.content.trim().length < 300 ||
  !Array.isArray(article.tags)
) {
  throw new Error("Generated article failed validation.");
}

// A stable slug prevents repeated runs on the same latest commit from duplicating a post.
const slug = `gamehub-dev-${latestSha.slice(0, 12)}`;
const client = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  const existing = await client.query(
    "SELECT id FROM posts WHERE slug = $1 LIMIT 1",
    [slug],
  );
  if (existing.rows.length > 0) {
    console.log("This source commit already has a post. Skipping.");
  } else {
    await client.query(
      `INSERT INTO posts
        (slug, title, excerpt, content, cover, topic, tags,
         featured, published_at, updated_at, position)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW(), $9)`,
      [
        slug,
        article.title.trim(),
        article.excerpt.trim(),
        article.content.trim(),
        "",
        String(article.topic || "Game Development"),
        article.tags.map(String).slice(0, 8),
        false,
        0,
      ],
    );
    console.log(`Published game-hub development post: ${article.title}`);
  }
} finally {
  await client.end();
}
