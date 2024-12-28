import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_URL': JSON.stringify(process.env.API_URL),
  },
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  build: {
    rollupOptions: {
      output: {
        // Define manual chunking rules
        manualChunks(id) {
          // If it's a node_modules module, bundle it into the 'vendor' chunk
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
});