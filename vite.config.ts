import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-hook-form': path.resolve(__dirname, 'src/vendor/react-hook-form.ts'),
      '@hookform/resolvers/zod': path.resolve(
        __dirname,
        'src/vendor/hookform-resolvers-zod.ts'
      ),
      '@tanstack/react-query': path.resolve(__dirname, 'src/vendor/tanstack-react-query.tsx'),
      'zod': path.resolve(__dirname, 'src/vendor/zod.ts'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
