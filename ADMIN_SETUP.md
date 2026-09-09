# Grand Central admin setup

The admin panel is available at `/admin`. It edits the live portfolio content and stores every publish in `data/site-content.json` on GitHub.

## Required AWS environment variables

Add these variables to the AWS service that runs the Next.js server, then redeploy:

- `ADMIN_PASSWORD`: a long password used only for the portfolio admin.
- `ADMIN_SESSION_SECRET`: a different random string of at least 32 characters.
- `GITHUB_CONTENT_TOKEN`: a fine-grained GitHub personal access token.
- `GITHUB_CONTENT_REPO`: `Supermally/Portfolio`
- `GITHUB_CONTENT_BRANCH`: `main`

Create the GitHub token under **GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens**. Limit repository access to `Supermally/Portfolio` and grant only **Repository permissions → Contents → Read and write**. Do not place the token in source code or commit a `.env` file.

## Local development

Copy `.env.example` to `.env.local`, fill in the values, and run `npm run dev`. Without a GitHub token, local admin publishes write directly to `data/site-content.json`. Production requires the GitHub token.

## Publishing behavior

Each publish creates a GitHub commit. The public site requests the current content through `/api/content`, so visitors receive the newly published content without exposing the GitHub token to the browser.
