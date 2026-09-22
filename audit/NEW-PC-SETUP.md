# Working on ScreenshotChecker from this PC

Your project is now at `D:\screenshotchecker`. The Git remote points to your GitHub repository. Dependencies are installed and the production build passed. No code changes were pushed and the live website was not deployed.

**Already available**

| Component | Observed state |
| --- | --- |
| Git | Installed at `C:\Program Files\Git\cmd\git.exe` |
| Node.js | Installed, v26.9.0 |
| npm | Installed, v11.19.1 |
| Python | Installed; only used for this audit, not needed to run the website |
| Project packages | Installed locally in node_modules; includes Astro, Tailwind, Tesseract.js, ExifReader, C2PA, sitemap, and Wrangler |

The package declares Node `>=22.12.0`. Your current version built successfully. For consistent development and deployment, choose a supported LTS version and pin the same major version locally and in Cloudflare; Node 24 LTS is a reasonable target. See [official Node releases](https://nodejs.org/en/about/previous-releases). No OS-level Node change was made.

**Daily commands in PowerShell**

```powershell
cd D:\screenshotchecker
npm.cmd run dev -- --background
npm.cmd run astro -- dev status
npm.cmd run astro -- dev logs
npm.cmd run astro -- dev stop
```

The repository's AGENTS.md asks for background development-server mode. The default local address is normally `http://localhost:4321`; use the actual address printed by the server. A dev server was not left running by this audit.

```powershell
# Build and inspect the production output
npm.cmd run build
node scripts/verify-seo.mjs
npm.cmd run preview
```

For a later clean install use `npm.cmd ci`. The audit installed with `--ignore-scripts` and successfully built; the tracked lockfile was restored unchanged after npm adjusted optional platform metadata. Using `npm.cmd` avoids PowerShell script execution-policy problems with npm.ps1.

**What you still need access to**

- GitHub authentication for pushing changes. Public cloning does not prove push permission.
- The Cloudflare account that owns the live site, its domain, and its Worker/static-assets project. Confirm existing automatic GitHub deployment settings before changing the production branch.
- Existing Search Console and Google Analytics properties; grant access or sign in rather than adding duplicate site tags.
- Any uncommitted files, ignored configuration, private datasets, or credentials that existed only on the old PC. A Git clone cannot restore those. Transfer secrets securely; do not commit or paste them into public files.

**Deployment, only when a reviewed change is ready**

```powershell
npx.cmd wrangler login
npx.cmd wrangler whoami
npm.cmd run deploy
```

`deploy` publishes to Cloudflare; it is not a local preview. First confirm which Cloudflare project and domain it will update. Current Wrangler configuration is static-assets-only. The unused Worker/API code needs the corrections described in the audit before it can be enabled safely.

**Install later as part of repair work**

- A project-local TypeScript test runner such as tsx, plus a unified test script. The audit used a temporary npm-provided tsx runner without adding a project dependency.
- `@astrojs/check` and `typescript` for static checking.
- A browser regression runner and accessibility checks once real image fixtures and expected behaviors are defined.
- A maintained Public Suffix List parser if repairing domain classification.

No need to globally install Astro, Tailwind, Wrangler, Tesseract, or ExifReader: the project already declares them. No need for PHP, MySQL, Docker, a Python virtual environment, or a paid AI service to run this code.

**Optional future API credentials**

Provider adapters mention `VT_API_KEY` / `VIRUSTOTAL_API_KEY`, `GOOGLE_WEB_RISK_API_KEY` and alternatives, and `URLHAUS_API_KEY` / `ABUSE_CH_API_KEY`. They are not required by the active static dataset workflow. Adding keys alone will not activate real-time reputation checks: the legacy service has a broken import and is not wired into the deployed Worker. Keep any future provider credentials server-side and document the privacy implications first.
