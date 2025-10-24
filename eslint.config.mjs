import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // ⛔ Add ignores FIRST
  {
    ignores: ["node_modules", "dist", "utils/database.ts"],
  },

  // ✅ Then extend Next.js / TS configs
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
