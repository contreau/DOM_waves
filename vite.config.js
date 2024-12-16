import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

export default defineConfig(({ mode }) => {
  const isVanilla = mode === "vanilla";
  const isSvelte = mode === "svelte";

  return {
    root: isVanilla ? "src/vanilla" : "src/svelte",
    plugins: isSvelte ? [svelte()] : [],
    build: {
      outDir: "../dist",
      emptyOutDir: true,
    },
    server: {
      open: true,
    },
  };
});
