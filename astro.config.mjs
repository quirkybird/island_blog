import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://blog.yamorz.top",
  srcDir: "./src",
  publicDir: "./public",
  outDir: "./dist",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [mdx(), react()],
  markdown: {
    headingIds: true,
    gfm: true,
    syntaxHighlight: "shiki",
  },
});
