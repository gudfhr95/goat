import { resolve } from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

import baseConfig from "@goat/vitest-config/base";

export default defineConfig({
  ...baseConfig,
  plugins: [react()],
  test: {
    ...baseConfig.test,
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "./src"),
      "@": resolve(__dirname, "./src"),
    },
  },
});
