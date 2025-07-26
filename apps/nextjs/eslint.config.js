import baseConfig, { restrictEnvAccess } from "@goat/eslint-config/base";
import nextjsConfig from "@goat/eslint-config/nextjs";
import reactConfig from "@goat/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
