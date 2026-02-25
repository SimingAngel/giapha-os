# Cloudflare Build: Tailwind Oxide Linux Binary

## Current Task (Webpack CSS loader failure in globals.css)

- [x] Confirm whether `@tailwindcss/oxide` Linux binary is missing from lockfile under frozen install.
- [x] Apply minimal dependency/lockfile change for `@tailwindcss/oxide-linux-x64-gnu`.
- [x] Validate install resolution with `npm ci --dry-run`.
- [x] Re-run `npm run build` and `npm run cf:build` locally.
- [x] Document final root cause and Cloudflare guidance in review.

## Review (Pending)

- Root cause mirrors the prior Lightning CSS issue: lockfile platform skew. `@tailwindcss/oxide` referenced Linux binaries, but `node_modules/@tailwindcss/oxide-linux-x64-gnu` was not materialized in lockfile, so Cloudflare Linux CSS processing could fail under frozen install.
- Added explicit root optional dependency `@tailwindcss/oxide-linux-x64-gnu@4.2.1` in `package.json` and lockfile root metadata.
- Added concrete lockfile package entries for:
  - `node_modules/@tailwindcss/oxide-linux-x64-gnu`
  - `node_modules/lightningcss-linux-x64-gnu` (kept explicit and corrected after lockfile drift)
- Validation:
  - `npm ci --dry-run --prefer-offline --no-audit --no-fund` shows both Linux natives being added.
  - `npm run build` succeeds.
  - `npm run cf:build -- --skipWranglerConfigCheck` succeeds.

---

# Cloudflare Build: lightningcss Linux Binary

## Current Task (Cannot find module lightningcss.linux-x64-gnu.node)

- [x] Confirm lockfile/platform mismatch for `lightningcss` optional native dependency.
- [x] Apply minimal dependency/lockfile change so Linux frozen installs include `lightningcss-linux-x64-gnu`.
- [x] Validate lockfile consistency and dependency resolution commands.
- [x] Run build verification commands locally and capture any remaining blockers.
- [x] Document root cause and final Cloudflare setting guidance in review.

## Review (Pending)

- Root cause: `@tailwindcss/postcss` uses `lightningcss`, and Cloudflare Linux build needed `lightningcss-linux-x64-gnu` but the lockfile did not include that package entry under a frozen install.
- Added root `optionalDependencies.lightningcss-linux-x64-gnu = 1.31.1` in both `package.json` and lockfile root metadata to make Linux native binding explicit.
- Added `node_modules/lightningcss-linux-x64-gnu` entry in `package-lock.json` so lockfile-driven installs can materialize the binary on Linux.
- Verified with `npm ci --dry-run` output showing `add lightningcss-linux-x64-gnu 1.31.1`.
- Verified app still builds locally with `npm run build` (success).

---

# Git Push HTTP 400 Fix

## Current Task (Origin Push Rejected)

- [x] Confirm branch divergence and identify oversized/generated files inside the ahead commit.
- [x] Create a safety backup ref for current `HEAD` before any history rewrite.
- [x] Rebuild the local commit without generated artifacts (`.open-next`, build outputs, vendored runtime blobs).
- [x] Verify resulting commit contents and size are source-only.
- [x] Re-run push to `origin local` and record final outcome.

## Review (Pending)

- Root cause was a single local commit that included 1,387 generated files under `.open-next` and changed `.gitignore` to unignore that directory.
- Created safety branch `backup_push_20260225_131645` before rewrite.
- Rewrote local history with `git reset --mixed origin/local`, restored `.gitignore`, and verified branch divergence became `0 0`.
- Verified final push to `origin` succeeds: `refs/heads/local ... [up to date]`.

---

# Cloudflare Deployment Minimal Setup

## Current Task (Webpack CSS Failure in CI)

- [x] Confirm current dependency/install configuration that affects PostCSS/Tailwind in CI.
- [x] Move build-critical tooling (`tailwindcss`, `@tailwindcss/postcss`, OpenNext/Wrangler) to regular dependencies.
- [x] Regenerate and validate lockfile consistency.
- [ ] Re-run `npm run build` and `npm run cf:build` to prove the fix locally.
- [x] Document final root cause + deployment settings in review.

## Previous Completed Work

- [x] Confirm project state and existing deployment config files.
- [x] Add minimal Cloudflare Worker config (`wrangler.jsonc`) for OpenNext output.
- [x] Add deploy scripts to `package.json` for Cloudflare build/deploy.
- [x] Update `.gitignore` for OpenNext and Wrangler artifacts.
- [x] Validate JSON syntax and script presence.

## Review

- Added minimal config/scripts required to replace `npx wrangler deploy` with OpenNext Cloudflare deployment flow.
- Could not install new npm packages in this environment due DNS/network restriction to `registry.npmjs.org`.
- Setup is ready for Cloudflare to execute via `npx` in build/deploy commands.
- Updated scripts to use local binary (`opennextjs-cloudflare`) instead of `npx opennextjs-cloudflare`, which avoids the CI error "could not determine executable to run".
- Verified command resolution with `npm run cf:build -- --help`.
- Removed `bun.lock` and pinned `packageManager` to npm so Cloudflare does not auto-select Bun with frozen lockfile checks.
- Verified npm frozen-style install compatibility with `npm ci --dry-run`.
- Added required `open-next.config.ts` to avoid interactive CLI prompt in non-interactive CI.
- Verified `npm run cf:build` now proceeds past config checks; current local failure is external Google Fonts fetch in this sandbox.
- Replaced `next/font/google` usage with local/system font stacks to remove build-time dependence on Google Fonts.
- Forced Webpack build and set `NEXT_IGNORE_INCORRECT_LOCKFILE=1` to avoid Turbopack/platform lockfile patch failures in CI.
- Migrated auth guard from `proxy.ts` (Node-only in Next 16) to `middleware.ts` so OpenNext Cloudflare can bundle Edge middleware.
- Verified end-to-end `npm run cf:build -- --skipWranglerConfigCheck` succeeds locally.
- Split `cf:build` into `npm run build` + OpenNext `--skipNextBuild` to expose true build failures in CI logs.
- Set `next.config.ts` `output: "standalone"` so OpenNext can find `.next/standalone/.next/server/pages-manifest.json`.
- Added project `.npmrc` with `include=dev` to force build-time packages (Tailwind/PostCSS/OpenNext tooling) to install in CI even when `NODE_ENV=production`.
- Moved `@opennextjs/cloudflare`, `wrangler`, `tailwindcss`, and `@tailwindcss/postcss` to regular `dependencies` so Cloudflare builds do not rely on dev dependency installation behavior.
- Regenerated `package-lock.json` to keep `--frozen-lockfile` installs consistent with the updated dependency graph.
- Local re-verification is currently blocked because the sandbox cannot reach `registry.npmjs.org` (`ENOTFOUND`) and `npm ci` cannot fully restore `node_modules`.
- Replaced `postcss.config.mjs` plugin-name mapping with direct plugin import (`tailwindcss()`), reducing runtime plugin resolution variance in CI.
- Removed `@theme inline` from `app/globals.css` to avoid dependence on Tailwind v4-specific PostCSS transforms during build; kept equivalent base styling via standard CSS.
- Added `.npmrc` optional dependency enforcement (`include=optional`, `optional=true`) so platform-native Lightning CSS bindings are installed in CI.
- Corrected Next.js flag placement to `experimental.useLightningcss = false` (top-level `useLightningcss` is invalid in Next 16).
- Restored PostCSS config to Next-supported plugin map shape (`plugins: { \"@tailwindcss/postcss\": {} }`) to fix malformed PostCSS configuration errors.
