import { defineConfig } from 'vite'

// Using esbuild's built-in JSX (automatic runtime) instead of the Babel-based
// React plugin keeps the dependency tree light — no browserslist / electron-to-chromium.
export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  server: {
    port: 5173,
    host: true,
  },
})
