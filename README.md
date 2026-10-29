# Dashboard App

A static TypeScript + Vite dashboard demo. Data is stored in the browser with `localStorage`; there is no backend or real authentication.

## Run locally

```bash
npm ci
npm run dev
```

## Deploy to GitHub Pages

1. Push this project to the repository's `main` branch (or `master`).
2. In GitHub, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**. This is a one-time repository setting.
3. Every later push to `main`/`master` automatically checks types, builds the site, and deploys it. You can also run the workflow manually from **Actions → Deploy to GitHub Pages → Run workflow**.

The workflow selects the correct Vite base path for project pages (`owner.github.io/repository/`) and user/organization pages (`owner.github.io/`). Do not commit `node_modules` or `dist`; both are generated/ignored.

> Note: Admin and seller dashboards are demo views. Their role selection and mock data run entirely in the browser and are not an authentication or data-security mechanism for a real store.
