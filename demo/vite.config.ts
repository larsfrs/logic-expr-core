import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    port: 5173
  },
  build: {
    outDir: '../docs',
    emptyOutDir: true
  },
  base: '/logic-expr-core'
});