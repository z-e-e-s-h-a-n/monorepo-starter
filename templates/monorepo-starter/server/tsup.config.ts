import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/main.ts"],
  outDir: "dist",
  target: "es2024",
  format: ["esm"],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: false,
  minify: false,
  onSuccess: "node dist/main.js",
  external: [
    "@workspace/shared",
    "@workspace/contracts",
    "@workspace/templates",
  ],
});
