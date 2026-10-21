import { defineConfig } from 'vite';

export default defineConfig({
  base: '/calculator/',
  root: '.',
  server: {
    port: 5173,
    open: true,
  },
});
