import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Avoid using require.resolve; use a direct path or relative import
      'react-icons': 'react-icons',
    },
  },
});
