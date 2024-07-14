/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

import { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve("./src"),
      "@icons": resolve("./src/shared/icons"),
      "@shared": resolve("./src/shared"),
      "@lib": resolve("./src/lib"),
      "@pages": resolve("./src/pages"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./test/setup.ts",
    css: true,
  },
});
