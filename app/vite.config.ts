import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

const currentDate = new Date()
  .toLocaleDateString("en-UK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
  .replace(/ /g, "-");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  define: {
    BUILD_VERSION: JSON.stringify(process.env.npm_package_version),
    BUILD_DATE: JSON.stringify(currentDate),
  },
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "./src/components"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@state": path.resolve(__dirname, "./src/state"),
      // Add more aliases as needed
    },
  },
});
