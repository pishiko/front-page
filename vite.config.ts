/// <reference types="vitest/config" />
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'rewrite-lab-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/lab') {
            res.writeHead(301, { Location: '/lab/' });
            res.end();
            return;
          }
          next();
        });
      },
    },
  ],
  base: '/',
  build: {
    outDir: 'build',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(rootDir, 'index.html'),
        lab: resolve(rootDir, 'lab/index.html'),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});
