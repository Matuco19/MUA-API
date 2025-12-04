# MUA API - Changelog

Below, there are all the MUA API changelogs, from the most recent to the oldest, respectively, and with the date in the format `mm.dd.yyyy`.

## v0.9.0 - 12.xx.2025

- Published as Open-Source in Github

## v0.1.0 - 12.04.2025

- First Version
- Implement `/api/llm/token-counter` endpoint for efficient token counting.
- Allow selection of `cl100k_base` or `o200k_base` tokenizer models for tokenization.
- Refactor route loading in `src/index.js` to support nested directory structures for routes.
- Add `gpt-tokenizer` as a new project dependency to handle tokenization.
- Update `CHANGELOG.md`, `README.md`, and `todo.md` to reflect the new feature.
- Include MUA API logo files (`.ico`, `.pixi`, `.png`) in the `public/` directory.
- Enhance the `/api/about` description for improved clarity.
- Rename base route file from `src/routes/.js` to `src/routes/index.js`.
- Add `server.log` to `.gitignore` to prevent unnecessary tracking.
- Standardize the license URL format in `LICENSE` for better readability.
- Adjusted `todo.md` to update the YT-Downloader entry and add a new "Password-Strength Endpoint" entry.
- Set up an Express.js server to dynamically load routes from the `src/routes` directory.
- Added `package.json` and `package-lock.json` with initial dependencies for web scraping (puppeteer), sentiment analysis, OCR (tesseract.js), and YouTube video processing (ytdl-core).
- Implemented the following API endpoints:
  - `/api/screenshot`: Captures a screenshot of a given URL using Puppeteer.
  - `/api/about`: Provides basic information about the API.
  - `/api/analyze-sentiment`: Analyzes the sentiment of provided text.
  - `/api/cors-proxy`: Acts as a CORS proxy for external URLs, supporting raw and JSON output with caching.
- Included project documentation and configuration files:
  - `README.md`: Detailed project overview, installation, usage, and API endpoint documentation.
  - `CHANGELOG.md`: Initial changelog detailing the v0.1.0 release.
  - `LICENSE`: The MATCO-Open-Source V1 license.
  - `.env.example`: Example environment variables for port configuration.
  - `.gitignore`: Specifies files and directories to be ignored by Git.
  - `todo.md`: Initial to-do list for future development.
