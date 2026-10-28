# 博客 MDX 组件

这个目录是文章内嵌组件的统一管理位置。文章只从 `src/components/blog`
（即本目录的 `index.ts`）导入，不直接引用具体文件。

## 目录约定

```text
src/components/blog/
├── index.ts        # 唯一入口 + 组件目录（blogComponentCatalog）
├── Callout.tsx
├── StatGrid.tsx
├── BarChart.tsx
├── RatioBar.tsx
├── DataTable.tsx
├── FlowDiagram.tsx
└── README.md
```

所有组件都自带 `not-prose`，因此可以放在 Markdown 正文里，而不继承
`prose` 的排版。颜色使用 Tailwind 的 `dark:` 变体，跟随站点主题。

## 在文章里使用

文章文件放在 `src/content/blog/*.mdx`，顶部统一从入口导入：

```mdx
import { StatGrid, BarChart, DataTable } from "../../components/blog";

<StatGrid
  items={[
    { value: "100", label: "样本推文", note: "去重后" },
    { value: "19", label: "推广内容", note: "占 19%" },
  ]}
/>

<FlowDiagram
  nodes={[
    { title: "Desktop", detail: "只负责界面与进程生命周期", tag: "UI" },
    { title: "tuttid", detail: "拥有会话、Turn 与工具进程", tag: "daemon" },
  ]}
/>
```

`.md` 文章仍然由 `Mkd` 渲染，不支持这些组件；需要组件时把文章改名为
`.mdx`，文章页会自动改用 Astro 的 MDX 渲染器。

## 新增组件

1. 在本目录创建 `Xxx.tsx`，默认导出组件。
2. 在 `index.ts` 中导出，并加入 `blogMdxComponents`。
3. 在 `blogComponentCatalog` 登记名称、用途和 props。
4. 更新本 README 的目录树。
5. 运行 `pnpm build` 验证。

## 设计约束

- 接收数据作为 props，不在组件内部写死某篇文章的内容。
- 用 Tailwind 类表达颜色，必须同时提供 `dark:` 变体。
- 图表用纯 SVG / CSS 实现，不引入新的图表库。
- 表格外层必须有 `overflow-x-auto`，避免窄屏撑破页面。
- 不使用 `window`、`document` 等浏览器 API，保证静态构建可用。
