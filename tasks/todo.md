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
- Set `useLightningcss: false` in `next.config.ts` to bypass Lightning CSS native binary loading during Next.js webpack build.
