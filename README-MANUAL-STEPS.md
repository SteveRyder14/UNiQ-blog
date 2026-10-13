# UNiQ Game Hub automation handoff

Included:
- `scripts/auto-post.mjs`: reads commits from `SteveRyder14/game-hub`, asks Gemini to draft an evidence-based development update, and inserts it into the existing `posts` table.
- `.github/workflows/auto-post.yml`: runs daily at 09:00 India Standard Time and supports manual runs.
- `checkers-article.sql`: inserts the introductory Checkers article into Neon once without duplicating it.

## Manual steps still required

1. In your local clone of `SteveRyder14/UNiQ-blog`, replace `scripts/auto-post.mjs` with the included version.
2. Replace `.github/workflows/auto-post.yml` with the included version.
3. Commit and push both files to `main` in `UNiQ-blog`.
4. In GitHub, open `UNiQ-blog` → Settings → Secrets and variables → Actions. Confirm `GEMINI_API_KEY` and `DATABASE_URL` exist. Never paste their values into chat.
5. Open `UNiQ-blog` → Actions → `Automatic Game Development Updates` → Run workflow. Check the log, then confirm a post appears on the blog. The workflow runs from the blog repository but reads the public `game-hub` commit history.
6. Open the Neon SQL Editor for the blog database, paste `checkers-article.sql`, and run it. Then check the live blog for the article.

## Notes

- The schedule is `03:30 UTC`, which is `09:00` India Standard Time.
- The script uses commit messages and metadata only; it cannot infer implementation details not represented in commits.
- Gemini can still fail after four attempts if its endpoint repeatedly returns rate-limit or service-unavailable errors. Check the Actions log before retrying.
- `DATABASE_URL` must point to the existing blog database.
- Do not run `scripts/seed.mjs` for this task; it can delete existing blog data.
