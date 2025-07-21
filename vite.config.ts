// made by Divyansh
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// Vite config for React + TypeScript project made by divyansh

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // componentTagger(), // Removed Lovable-specific plugin
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
