# Lessons Learned

## Cloudflare CI Build Debugging

- Always capture and act on the first error line above webpack stack traces; wrapper traces from OpenNext are usually secondary.
- Keep build-critical tooling in `dependencies` for hosted CI environments that may omit `devDependencies`.
- Prefer deterministic PostCSS config (explicit plugin import) when CI module resolution is inconsistent.
- For native optional packages (e.g., `lightningcss-<platform>`), force optional dependency installation in `.npmrc` and prefer disabling optional native paths when a stable config flag exists.
