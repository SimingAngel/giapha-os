# Cloudflare Deployment Minimal Setup

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
