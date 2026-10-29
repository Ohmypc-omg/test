import { defineConfig } from 'vite';

// GitHub Pages base path: set to '/<repo-name>/' for project pages
// For user/organization pages (username.github.io), use '/'
const configuredBase = process.env.GITHUB_PAGES_BASE || '/';
const base = configuredBase.startsWith('/')
  ? (configuredBase.endsWith('/') ? configuredBase : `${configuredBase}/`)
  : `/${configuredBase.replace(/^\/+|\/+$/g, '')}/`;

export default defineConfig({
  root: '.',
  publicDir: 'public',
  base,
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: 'index.html',
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  // Ensure proper path resolution on Windows
  resolve: {
    preserveSymlinks: true,
  },
});