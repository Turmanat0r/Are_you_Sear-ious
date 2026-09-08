import tailwindcss from '@tailwindcss/postcss';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

/**
 * Static build of the app, for hosts that serve plain files.
 *
 * The default `vite.config.ts` targets Cloudflare Workers through vinext and
 * emits a server. This config bypasses both: it mounts `app/page.tsx` from
 * `standalone/main.tsx` and produces a directory of static assets, so the same
 * source can be published anywhere without a runtime.
 */
export default defineConfig({
  root: 'standalone',
  publicDir: fileURLToPath(new URL('./public', import.meta.url)),
  css: { postcss: { plugins: [tailwindcss()] } },
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  build: {
    outDir: fileURLToPath(new URL('./dist-static', import.meta.url)),
    emptyOutDir: true,
    target: 'es2022',
    sourcemap: false,
  },
});
