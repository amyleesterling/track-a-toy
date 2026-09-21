import { defineConfig } from "vitest/config";
export default defineConfig({
  // Relative asset paths, so the build works from a project subpath on
  // GitHub Pages as well as from a domain root.
  base: "./",
  test: { include: ["tests/unit/**/*.test.ts"], environment: "node" },
  build: { chunkSizeWarningLimit: 700 },
});
