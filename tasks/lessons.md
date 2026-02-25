# Lessons Learned

## Cloudflare CI Build Debugging

- Always capture and act on the first error line above webpack stack traces; wrapper traces from OpenNext are usually secondary.
- Keep build-critical tooling in `dependencies` for hosted CI environments that may omit `devDependencies`.
- Prefer deterministic PostCSS config (explicit plugin import) when CI module resolution is inconsistent.
- For native optional packages (e.g., `lightningcss-<platform>`), force optional dependency installation in `.npmrc` and prefer disabling optional native paths when a stable config flag exists.
- Validate config key placement against current Next major version (e.g., `experimental.useLightningcss` vs top-level) before applying CI hotfixes.
- Keep PostCSS config in the exact schema Next expects; plugin function arrays can fail with "Malformed PostCSS Configuration" in Next webpack integration.

## Workflow Discipline

- At the start of each non-trivial task, read `instruction.md` first and immediately write a checkable execution plan to `tasks/todo.md` before code or git changes.

## Platform-Specific Native Dependencies

- For Linux CI/CD with frozen lockfiles, ensure platform-native optional packages required at build time are explicitly represented in both `package.json` and `package-lock.json` (example: `lightningcss-linux-x64-gnu`), even when developing on macOS.
- Extend the same rule to Tailwind v4 native runtime (`@tailwindcss/oxide-linux-x64-gnu`); missing oxide binaries surface as webpack/PostCSS failures against `app/globals.css`.
