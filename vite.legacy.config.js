import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'public/cookbook',
    assetsDir: 'assets',
  },
});
