import react from "@vitejs/plugin-react";
import { mergeConfig } from "vitest/config";

import base from "./base.js";

export default mergeConfig(base, {
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
  },
});
