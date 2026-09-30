/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Local development only. No proxy to any backend is configured on purpose:
// the preview talks exclusively to the mock adapters in src/lib/assistant/mock.
export default defineConfig({
  plugins: [react()],
  server: { host: '127.0.0.1', port: 5173 },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
});
