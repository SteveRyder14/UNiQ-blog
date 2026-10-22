# UNiQ — under the hood

Personal blog for **UNiQ** — Android modding, Linux, local AI, audio, and budget builds.

**Stack:** Next.js 16 (App Router) · PostgreSQL (Neon) · Drizzle ORM · Tailwind CSS 4 · Netlify

## Before you deploy

This project is a **full-stack Next.js app**, not a static site. It uses server routes and PostgreSQL for posts, comments, subscriptions, and engagement stats. Deploy it to Netlify with the Next.js plugin; do not use a static export.

### 1. Configure Neon locally

1. In the Neon console, open your project and copy the pooled connection string.
2. Copy `.env.example` to a local file named `.env` in the project root.
3. Replace the example `DATABASE_URL` with your Neon connection string. Keep `.env` private and never commit it.
4. In Neon, make sure the database is the one you intend to use. Schema changes affect that database.

Example commands in Windows PowerShell:

```powershell
Copy-Item .env.example .env
notepad .env
npm install
npm run db:push
```

`npm run db:push` creates/updates the tables defined in `src/db/schema.ts` (`posts`, `comments`, `subscribers`, and `post_stats`).

### 2. Seed the initial blog content (optional)

The repo includes seven example posts in `scripts/content/`. If your Neon database is brand new and empty, you can seed it:

```powershell
npm run db:seed
```

**Warning:** the current seed script clears existing rows in `post_stats`, `comments`, `subscribers`, and `posts` before inserting its sample data. Do not run it against a database containing anything you need to keep. If you already have real data, import the content with a non-destructive script instead.

### 3. Test before deployment

```powershell
npm run typecheck
npm run lint
npm run build
```

Then test locally with `npm run dev`. Check the blog, a post detail page, comments, newsletter submission, and `/api/health`.

## Deploy to Netlify

1. Push this project to your GitHub repository.
2. In Netlify, choose **Add new site → Import an existing project** and select that repository.
3. Build command: `npm run build`. Publish directory: `.next`. `netlify.toml` includes the Next.js plugin configuration.
4. In **Site configuration → Environment variables**, add:
   - Key: `DATABASE_URL`
   - Value: your Neon pooled connection string
   - Scopes/contexts: include the deploy contexts you use (production and deploy previews if needed).
5. Trigger a new deploy. Netlify needs the database URL at runtime, and the schema must already exist in Neon.
6. Verify `https://YOUR-SITE.netlify.app/api/health` returns `{"ok":true}` and that posts load.

Do **not** commit your `.env` file or paste the database URL into source code, screenshots, public issues, or chat. Netlify environment variables are configured in the Netlify dashboard, not in `netlify.toml`.

## Automatic game-hub articles

The GitHub Actions workflow in `.github/workflows/auto-post.yml` checks `SteveRyder14/game-hub` each day at 09:00 India Standard Time. When that repository has commits from the last seven days, it asks Gemini to draft an evidence-based development update and inserts it into the same PostgreSQL `posts` table used by the site. The home page and archive read from the database at request time, so a published post appears without rebuilding the site. A commit-based slug prevents the same update from being inserted twice. These posts use `public/images/cover-checkers.jpg`; existing posts with an empty cover use it as a display fallback too.

In **UNiQ-blog → Settings → Secrets and variables → Actions**, add these repository secrets:

- `GEMINI_API_KEY` — an API key for the Gemini API.
- `DATABASE_URL` — the production Neon connection string for the blog database. The `posts` table must already exist.
- `SOURCE_REPOSITORY_TOKEN` — only needed if `SteveRyder14/game-hub` is private. Use a token that can read that repository; leave this secret unset for a public repository.

After saving the secrets, open **Actions → Automatic Game Development Updates → Run workflow** to try it immediately. The run log reports whether it published a post, found no recent commits, or skipped commits that did not support a useful article. GitHub may delay scheduled runs, and scheduled workflows only run from the repository's default branch.

## Scripts

- `npm run dev` — local development server
- `npm run build` — production build
- `npm run start` — run the built app locally
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript checks
- `npm run db:push` — apply the Drizzle schema to the database in `DATABASE_URL`
- `npm run db:seed` — insert bundled demo content (destructive to existing rows; see warning above)

## Features

- Command palette — `Ctrl+K` (or `/`) to search posts and navigate
- Archive and tag pages
- PostgreSQL-backed views and likes
- Comments with server-side validation
- Newsletter subscription endpoint
- RSS, sitemap, and robots.txt

## GitHub

Profile: https://github.com/SteveRyder14

## Important deployment notes

- All pages read from PostgreSQL at request time; a working `DATABASE_URL` and the tables are required.
- This project is not compatible with plain static hosting/export because its API routes and server-side database access need a runtime.
- Rotate your Neon database password if the connection string has been shared publicly or with anyone who should not have access.
