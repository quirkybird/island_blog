import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://blog.yamorz.top",
  srcDir: "./src",
  publicDir: "./public",
  outDir: "./dist",

  integrations: [
    tailwind({
      applyBaseStyles: false,
      configFile: "./tailwind.config.mjs",
    }),
    mdx(),
    react(),
  ],
  markdown: {
    headingIds: true,
    gfm: true,
    syntaxHighlight: "shiki",
  },
});
