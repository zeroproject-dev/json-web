import path from "path";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@icons": path.resolve(__dirname, "./src/shared/icons"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@pages": path.resolve(__dirname, "./src/pages"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./test/setup.ts",
    css: true,
  },
});
