import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";

/**
 * 自定义 Shiki 主题：与 global.css 里 highlight.js 的配色共用同一组色值，
 * 保证 .md（Mkd/hljs）与 .mdx（Shiki）两条渲染路径颜色一致。
 */
const paperLightTheme = {
  name: "island-paper-light",
  type: "light",
  colors: {
    "editor.background": "#f5f4ef",
    "editor.foreground": "#1c1b19",
  },
  tokenColors: [
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#8b8579", fontStyle: "italic" } },
    { scope: ["keyword", "storage", "storage.type", "storage.modifier", "keyword.control", "keyword.operator.new", "keyword.operator.expression"], settings: { foreground: "#1e50b5" } },
    { scope: ["string", "string.quoted", "string.template", "constant.character", "regexp", "entity.name.tag", "support.type"], settings: { foreground: "#0d6b5f" } },
    { scope: ["constant.numeric", "constant.language", "constant.language.boolean", "variable.other.constant"], settings: { foreground: "#a8324c" } },
    { scope: ["entity.name.function", "support.function", "meta.function-call"], settings: { foreground: "#7a3fb8" } },
    { scope: ["entity.name.type", "entity.name.class", "support.class"], settings: { foreground: "#8a5a00" } },
    { scope: ["entity.other.attribute-name"], settings: { foreground: "#8a5a00" } },
    { scope: ["variable", "variable.other", "variable.parameter", "variable.language.this"], settings: { foreground: "#3f3d38" } },
    { scope: ["punctuation", "meta.brace", "keyword.operator"], settings: { foreground: "#6e6a63" } },
    { scope: ["punctuation.definition.string", "punctuation.definition.template-expression"], settings: { foreground: "#0d6b5f" } },
  ],
};

const paperDarkTheme = {
  name: "island-paper-dark",
  type: "dark",
  colors: {
    "editor.background": "#1a1916",
    "editor.foreground": "#e8e5dd",
  },
  tokenColors: [
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#8a8478", fontStyle: "italic" } },
    { scope: ["keyword", "storage", "storage.type", "storage.modifier", "keyword.control", "keyword.operator.new", "keyword.operator.expression"], settings: { foreground: "#8fb2ff" } },
    { scope: ["string", "string.quoted", "string.template", "constant.character", "regexp", "entity.name.tag", "support.type"], settings: { foreground: "#6fd3bd" } },
    { scope: ["constant.numeric", "constant.language", "constant.language.boolean", "variable.other.constant"], settings: { foreground: "#f2a1b3" } },
    { scope: ["entity.name.function", "support.function", "meta.function-call"], settings: { foreground: "#c2a5ff" } },
    { scope: ["entity.name.type", "entity.name.class", "support.class"], settings: { foreground: "#e3c07a" } },
    { scope: ["entity.other.attribute-name"], settings: { foreground: "#e3c07a" } },
    { scope: ["variable", "variable.other", "variable.parameter", "variable.language.this"], settings: { foreground: "#d3cfc5" } },
    { scope: ["punctuation", "meta.brace", "keyword.operator"], settings: { foreground: "#a39e93" } },
    { scope: ["punctuation.definition.string", "punctuation.definition.template-expression"], settings: { foreground: "#6fd3bd" } },
  ],
};

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
    shikiConfig: {
      themes: {
        light: paperLightTheme,
        dark: paperDarkTheme,
      },
      // 不输出内联颜色，改为 --shiki-light / --shiki-dark 变量，
      // 由 global.css 依据 .dark 类切换，代码块底色也用我们的纸面 token。
      defaultColor: false,
      wrap: false,
    },
  },
});
