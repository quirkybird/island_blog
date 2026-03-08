---
title: "AltPatch 项目核心链路"
date: 2026-03-08
tags: ["工程化", "Vite", "AI", "开发工具"]
cover: "https://imgchr.com/i/peikIun"
categories: ["tech_blog"]
author: "quirkybird"
summary_text: "这篇文章从工程实现角度拆解 AltPatch 的核心链路：Vite/Webpack 插件如何注入定位能力，运行时面板如何通过 Alt+Click 建立页面元素与源码位置的映射，API 层如何编排 read/modify/write 流程，以及 server-core 如何通过 FsGuard、结构化 LLM 输出与语法修复机制保障改动可控落地，最终形成从需求到代码生效的快速闭环。"
---

# AltPatch 项目核心链路解析：从 Alt+Click 到代码落地的一次闭环

AltPatch 的价值不在于“又一个调试面板”，而在于它把前端改动流程压缩成了一条可执行链路：**定位元素 -> 读取上下文 -> 生成改动 -> 写回文件 -> 立即验证**。这条链路打通后，开发者从“我想改这里”到“代码已经生效”的路径被明显缩短。

从仓库结构看，项目是一个 monorepo，主线由四层组成：`vite/webpack 插件层`、`altpatch-ui-runtime 运行时层`、`altpatch-api 编排层`、`server-core 能力层`。每一层都尽量只做一件事，但它们拼起来形成完整闭环。

## 核心流程图

## 一、入口层：先把“页面可定位”和“服务可调用”准备好

以 Vite 主线为例，`@quirkybird/vite-plugin-altpatch` 在开发态做了两件核心工作。

第一，插件在 `transform` 阶段对 JSX/TSX 做 locator 插桩，给页面元素补充可追踪信息。这样用户在页面上点到一个按钮时，系统有机会反推出它来自哪个源码文件、哪一行、哪一列。

第二，插件在 `transformIndexHtml` 注入 runtime 入口脚本，并在 `configureServer` 阶段挂载 AltPatch API。也就是说，页面一打开，交互面板就有了；面板一发请求，本地 API 就能响应。

Webpack 插件走的是同一思路：补丁 `babel-loader` 插入 locator 能力、给 HTML 注入 runtime 脚本、向 dev server 注册同一套 API。架构上是“不同构建工具，同一业务链路”。

## 二、交互层：Alt+Click 把视觉元素映射到源码坐标

运行时面板挂载在 Shadow DOM 中，避免样式污染宿主页面。它监听全局 `Alt+Click`：当用户按住 Alt 点击页面元素时，前端执行一套位置解析策略。

- 优先使用 locator runtime 提供的位置数据。
- 如果 locator 不可用，则尝试 React debug source（通过 fiber 的调试信息反查文件）。
- 再不行，回退到 `data-locatorjs` 属性解析。

一旦拿到 `filePath/line/column`，面板会调用 `/api/read-file` 读取源码，并在本地生成片段上下文。到这一步，系统已经完成了最关键的“页面元素 -> 代码位置”映射，后续 AI 和 patch 才有可靠锚点。

## 三、改动生成层：快改与 AI 改动并行，默认局部、必要时扩域

面板提供两种改动模式。

### 1) Quick Text

Quick 模式是本地文本替换逻辑，目标是极低延迟。它基于当前定位附近做替换，再通过 `/api/diff` 生成统一 diff 预览。这条链路不依赖 LLM，适合“文案改字、简单文本替换”类需求。

### 2) AI Assist

AI 模式走 `/api/modify-stream`，通过 SSE 持续回传 delta 文本，面板可以实时显示模型输出。它的策略不是一上来改全文件，而是优先 `local-preferred`：以定位点为中心裁一段上下文窗口，先在局部求解。

如果后端判断“上下文不够”（返回 `SCOPE_ERROR`），前端会自动回退到 `full-file` 再试一次。这个机制兼顾了两点：

- 小改动时尽量稳定、便宜、快。
- 复杂改动时还能自动扩域，不把用户卡死。

此外，若用户指令明显是跨文件诉求（如“多文件/跨文件”），前端会切到 `/api/modify-multi`，由后端先做“改哪些文件”的计划，再逐个生成结果。

## 四、API 编排层：统一入口，统一错误语义

`altpatch-api` 的设计重点是“路由薄、编排清晰、错误可观测”。它暴露的核心路由包括：

- `read-file`
- `modify` / `modify-stream`
- `modify-multi`
- `diff`
- `write-file` / `write-files`
- `open-in-editor`

无论是在 Vite 内嵌模式，还是独立 Express 服务模式，业务语义保持一致。对前端来说，它只关心统一的请求协议，不需要在意底层跑在哪个 server 容器里。

## 五、能力层：真正保证“可落地”的是安全与校验

`server-core` 是整条链路最工程化的一层，核心价值有三点。

### 1) 文件安全边界（FsGuard）

所有读写路径都必须落在 `projectRoot` 内。路径先做规范化，再检测是否越界，防止路径逃逸和误写系统文件。这是最基本但必须坚硬的安全阀。

### 2) LLM 输出约束与兼容

LLM 调用采用 OpenAI Compatible 接口，并优先要求结构化输出（JSON schema）。如果上游模型不支持某种 `response_format`，代码会做降级尝试，尽量兼容不同供应商。

### 3) 语法守卫与修复

模型返回 `after` 后不会直接落盘，而是先做语法验证（TS/TSX/JS/JSON 分类型校验）。若失败，会触发一次“语法修复”请求，再次验证。两次都失败才报错。

这一步的意义非常实际：它把“模型可能生成坏代码”的风险从“写进文件后才发现”提前到了服务端拦截。

## 六、落地闭环：写入、回滚、继续编辑

当用户点击 Apply：

- 单文件走 `write-file`。
- 多文件走 `write-files`，且带事务式回滚语义（中途失败则恢复已写文件）。

前端面板同时维护历史快照，可 `Undo` 和 `Restore`。另外还支持 `open-in-editor`，把定位点直接交给 VS Code，形成“页面操作 + 本地 IDE 深改”的协同体验。

至此，AltPatch 完成一条闭环：**页面上点一下 -> 代码被改好 -> 本地即时验证 -> 不满意可回滚**。

## 结语

AltPatch 的核心链路，本质是把“UI 意图”转译为“受约束的代码变更流水线”。它并不追求让 AI 直接接管编码，而是通过明确锚点、结构化协议、语法校验和安全边界，把 AI 改动放进可控的工程系统里。

对于前端开发流程来说，这种设计比“单次生成一段代码”更重要，因为它解决的是持续开发中的稳定性、可追溯性和可回退性。也正因为如此，这个项目的真正价值不只是一个功能点，而是一条可扩展的改动基础设施。
