# Mission Control

Internal repo for Mission Control: docs, generators, and the Office-3D
dashboard/QA harness.

## Repo layout

- `docs/` — GitHub Pages static docs/dashboard entrypoint
- `dashboard/office/` — Office-3D front-end (Node/Vite build)
- `qa/` — Playwright visual/network/component checks (used in CI)
- `generators/` — small scripts that generate/update repo artifacts
- `registry/`, `crew-board/` — supporting data/assets

## Common workflows

### View docs locally

```bash
cd docs
python3 -m http.server 8080
# open http://127.0.0.1:8080/
```

### Build the Office-3D dashboard

```bash
cd dashboard/office
npm install --legacy-peer-deps
npm run build
```

### Run Playwright QA (from `qa/`)

```bash
cd qa
npx playwright test
```

## CI

- `.github/workflows/ci.yml` builds `dashboard/office` and runs Playwright QA.
- `.github/workflows/static.yml` publishes `docs/` to GitHub Pages.
