import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { configDefaults } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  test: {
    globals: true,
    environment: "jsdom", // Vitest needs this to simulate browser-like environments
    setupFiles: "./tests/setup.js", // Optional, for setting up test environments
    coverage: {
      exclude: [
        ...configDefaults.exclude,
        "src/main.jsx",
        "src/utils/*",
        "postcss.config.js",
        "tailwind.config.js",
        "tests/*"
      ],
    },
  },
});
