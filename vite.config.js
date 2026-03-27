import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        kliniker: resolve(__dirname, 'kliniker.html'),
        skador: resolve(__dirname, 'skador.html'),
        omNaprapat: resolve(__dirname, 'om-naprapat.html')
      }
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setupTests.js',
    pool: 'threads',
    maxWorkers: 1,
    minWorkers: 1
  }
});
