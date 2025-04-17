import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  envDir: "./src", // Tell Vite to look for .env files in the src directory
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  server: {
    port: 5173,
    proxy: {
      "/recipe": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  base: "/", // This ensures assets are loaded from the root path
});
