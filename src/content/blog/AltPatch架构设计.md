---
title: "AltPatch构想"
date: 2026-02-25
tags: []
cover: "博客封面_鼠标点击.png"
categories: ["tech_blog"]
author: "quirkybird"
summary_text:
  "文档完整定义了 AltPatch 的可落地技术架构：在开发环境中通过 Alt+点击定位组件、用 AI 对话生成代码补丁
  并经 Diff 确认后由本地服务安全写入源码，同时提供基于 monorepo 的工程结构、配置、通信、接入模式与风险方
  案。"
---

# AltPatch（基于 LocatorJS）的前端开发工具：Monorepo 技术架构与初始代码结构

## 1. 整体 Monorepo 目录结构

```text
altpatch/
├── apps/
│   ├── extension/
│   │   ├── src/
│   │   │   ├── background/
│   │   │   │   └── index.ts
│   │   │   ├── content/
│   │   │   │   ├── index.ts
│   │   │   │   ├── alt-click-listener.ts
│   │   │   │   ├── tooltip-host.ts
│   │   │   │   └── ws-client.ts
│   │   │   └── shared/
│   │   │       └── protocol.ts
│   │   ├── public/
│   │   │   └── manifest.json
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   └── server/
│       ├── src/
│       │   ├── index.ts
│       │   ├── app.ts
│       │   ├── routes/
│       │   │   ├── read-file.ts
│       │   │   ├── write-file.ts
│       │   │   ├── diff.ts
│       │   │   └── modify.ts
│       │   ├── services/
│       │   │   ├── fs-guard.ts
│       │   │   ├── code-mod-engine.ts
│       │   │   ├── diff-service.ts
│       │   │   └── hmr-bus.ts
│       │   ├── ws/
│       │   │   └── socket-server.ts
│       │   └── types/
│       │       └── api.ts
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   ├── core/
│   │   ├── src/
│   │   │   ├── locator/
│   │   │   │   ├── react.ts
│   │   │   │   ├── vue.ts
│   │   │   │   ├── svelte.ts
│   │   │   │   └── index.ts
│   │   │   ├── ast/
│   │   │   │   ├── parse.ts
│   │   │   │   └── transforms/
│   │   │   │       ├── style-transform.ts
│   │   │   │       └── class-transform.ts
│   │   │   ├── diff/
│   │   │   │   └── unified-diff.ts
│   │   │   ├── protocol/
│   │   │   │   └── messages.ts
│   │   │   ├── env/
│   │   │   │   └── dev-guard.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── ui/
│       ├── src/
│       │   ├── tooltip-shell.tsx
│       │   ├── diff-panel.tsx
│       │   ├── chat-input.tsx
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── .gitignore
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
├── tsconfig.base.json
└── README.md
```

## 2. 关键配置文件内容

### `pnpm-workspace.yaml`

```yaml
packages:
  - apps/*
  - packages/*
```

### `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"],
      "outputs": []
    },
    "typecheck": {
      "dependsOn": ["^typecheck"],
      "outputs": []
    },
    "test": {
      "dependsOn": ["^test"],
      "outputs": ["coverage/**"]
    }
  }
}
```

### Root `package.json`

```json
{
  "name": "altpatch-monorepo",
  "private": true,
  "packageManager": "pnpm@10.0.0",
  "scripts": {
    "dev": "turbo run dev --parallel",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test",
    "clean": "turbo run clean && rimraf node_modules"
  },
  "devDependencies": {
    "@types/node": "^22.10.0",
    "eslint": "^9.0.0",
    "prettier": "^3.4.0",
    "rimraf": "^6.0.1",
    "turbo": "^2.3.0",
    "typescript": "^5.7.0"
  }
}
```

### `apps/extension/public/manifest.json`（Manifest V3）

```json
{
  "manifest_version": 3,
  "name": "AltPatch",
  "version": "0.1.0",
  "description": "Alt+Click 定位组件并在页面内完成代码修改",
  "permissions": ["storage", "scripting", "activeTab"],
  "host_permissions": [
    "http://localhost/*",
    "http://127.0.0.1/*",
    "http://localhost:7331/*",
    "http://127.0.0.1:7331/*"
  ],
  "background": {
    "service_worker": "src/background/index.js",
    "type": "module"
  },
  "content_scripts": [
    {
      "matches": ["http://localhost/*", "http://127.0.0.1/*"],
      "js": ["src/content/index.js"],
      "run_at": "document_start"
    }
  ],
  "web_accessible_resources": [
    {
      "resources": ["assets/*"],
      "matches": ["http://localhost/*", "http://127.0.0.1/*"]
    }
  ],
  "action": {
    "default_title": "AltPatch"
  }
}
```

### `apps/server/package.json`

```json
{
  "name": "@apps/server",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/index.js",
    "lint": "eslint src --ext .ts",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "diff": "^5.2.0",
    "express": "^4.21.2",
    "ws": "^8.18.0",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "tsx": "^4.19.2",
    "typescript": "^5.7.0"
  }
}
```

## 3. 各包详细职责与主要模块

### `packages/core`

- 组件定位逻辑
- 基于 LocatorJS 的框架适配层（React/Vue/Svelte）抽象统一输出 `filePath:line:column`。
- 在 `locator/index.ts` 中提供 `resolveSourceLocation(target: Element): SourceLocation | null`。

```ts
export type SourceLocation = {
  filePath: string;
  line: number;
  column: number;
  framework: "react" | "vue" | "svelte" | "unknown";
};
```

- 代码读取/写入接口
- 核心包不直接操作文件系统，只暴露协议客户端：`readFile() / modify() / writeFile()`，请求 `apps/server`。

- Diff 生成
- 提供统一 diff 数据结构（hunk、line type、lineNo）供 UI 渲染。

- 自然语言代码修改
- 以大模型为主引擎：根据「定位元素 + 邻近代码 + 用户指令」生成结构化补丁提案。
- AST 守护作为强约束层：校验补丁语法、作用域和可写文件范围，不通过则拒绝写入。
- 保留规则引擎作为降级路径（模型不可用或超时场景）。

### `apps/extension`

- content script
- 监听 `Alt/Option + Click`，并阻止默认点击冒泡。
- 调用 `core` 定位 API 拿到组件源位置信息。
- 将 Tooltip 挂载到 Shadow DOM 根节点，避免污染宿主页面样式。

- 与 server 通信
- `fetch` 调 REST API：读取文件、生成补丁、提交写入。
- `WebSocket` 订阅写入完成与热更新事件。

- Tooltip UI
- 聊天输入区：自然语言指令。
- 代码预览区：变更前后片段。
- Diff 面板：可视化 +/- 行。
- 操作区：`Apply`、`Discard`、`Rollback`。
- 核心交互：用户只需 Alt+Click 元素后输入“怎么改”，剩余由 AI 完成补丁生成与解释。

### `apps/server`

- Express API
- `POST /api/read-file`：返回文件文本与元信息。
- `POST /api/modify`：根据自然语言 + 源代码生成补丁与预览。
- `POST /api/diff`：返回统一 diff 结果。
- `POST /api/write-file`：落盘并广播热更新事件。

- WebSocket
- 向扩展推送 `file-written`、`reload-hint`、`error`。

- 文件系统操作安全
- 仅允许访问配置的 projectRoot。
- 路径规范化与越权校验：`path.resolve` + `startsWith(projectRoot)`。
- 可选 token 校验，避免任意本机页面调用。

- 代码修改引擎
- LLM Orchestrator + AST：`@babel/parser` + `@babel/traverse` + `magic-string`。
- 流程：构建上下文 -> 调用模型 -> 返回结构化补丁 -> AST 校验 -> 生成 diff。
- 输出 `patch`, `before`, `after`, `diff`, `diagnostics`, `modelTraceId`。

## 4. 包间依赖与通信方式

- `apps/extension -> apps/server`
- HTTP：`http://127.0.0.1:7331/api/*`
- WS：`ws://127.0.0.1:7331/ws`
- 请求体统一走 `protocol` 类型，避免字段漂移。

- `apps/extension -> packages/core`
- 直接 ESM import：`@packages/core`。
- extension 构建阶段打包 core（避免运行时 UMD 注入复杂度）。

- `apps/server -> packages/core`
- 复用 AST、Diff、协议类型，避免逻辑分叉。

```ts
// packages/core/protocol/messages.ts
export type ModifyRequest = {
  filePath: string;
  instruction: string;
  selection?: { start: number; end: number };
  location?: { line: number; column: number; framework?: string };
  contextWindow?: { beforeLines: number; afterLines: number };
};

export type ModifyResponse = {
  patch: string;
  before: string;
  after: string;
  diff: Array<{ type: "add" | "del" | "ctx"; content: string }>;
  explanation?: string;
  confidence?: number;
  modelTraceId?: string;
};
```

## 5. 开发工作流

1. 安装依赖

```bash
pnpm install
```

2. 启动开发

```bash
pnpm run dev
```

- `turbo` 并行启动：
- `apps/server` 在 `7331` 端口。
- `apps/extension` 通过 Vite/Plasmo/自定义打包 watch 输出。

3. 加载未发布扩展到 Chrome

- 打开 `chrome://extensions`
- 启用「开发者模式」
- 点击「加载已解压的扩展程序」
- 选择 `apps/extension/dist`

4. 热重载机制

- server 写入文件后通过 WS 广播 `reload-hint`。
- content script 收到事件后：
- 优先调用页面开发服务器 HMR（如 Vite websocket 已自动处理文件变化）。
- 回退策略：`window.location.reload()`（仅开发环境）。

## 6. 项目使用方式（扩展之外的落地形态）

### 使用方式 A：浏览器扩展（默认形态）

- 目标用户：本地前端开发者，直接在浏览器中 Alt+Click 修改代码。
- 运行方式：加载 `apps/extension/dist`，连接本地 `apps/server`。
- 优点：无侵入、开箱可用、对 React/Vue/Svelte 页面统一体验。

### 使用方式 B：无插件模式（项目内注入，推荐低心智负担）

- 目标用户：不希望安装浏览器扩展的团队，直接在项目开发环境启用 AltPatch。
- 运行方式：在项目中接入 `@altpatch/client`（或 Vite/Next 插件）+ 本地 `altpatch-agent`。
- 生效条件：仅 `NODE_ENV=development` 且 `localhost/127.0.0.1`。
- 交互不变：`Alt+Click -> 对话 -> Diff -> Confirm`。

```ts
// app entry (dev only) 注入 AltPatch
if (
  import.meta.env.DEV &&
  /localhost|127\\.0\\.0\\.1/.test(window.location.host)
) {
  import("@altpatch/client").then(({ mountAltPatch }) => {
    mountAltPatch({
      serverUrl: "http://127.0.0.1:7331",
      mode: "overlay",
    });
  });
}
```

- 优点：
- 无需扩展安装，跨浏览器一致。
- 与项目 HMR 链路天然一致，调试成本低。
- 更适合团队模板化推广（脚手架一键注入）。

### 使用方式 C：SDK 包接入（嵌入开发平台/内部工具）

- 发布包建议：
- `@altpatch/core`：定位、协议类型、diff 数据结构。
- `@altpatch/ui`：Tooltip + Diff + Chat 组件（可选）。
- `@altpatch/client`：封装 `fetch/ws` 的 server 客户端。
- `@altpatch/ai`：模型路由与提示词模板（可接 OpenAI/本地模型）。

```ts
// host app 中直接嵌入 AltPatch 能力（非浏览器扩展）
import { createAltPatchClient } from "@altpatch/client";
import { mountAltPatchTooltip } from "@altpatch/ui";

const client = createAltPatchClient({
  httpBaseURL: "http://127.0.0.1:7331",
  wsURL: "ws://127.0.0.1:7331/ws",
  token: process.env.ALTPATCH_TOKEN,
});

mountAltPatchTooltip({
  client,
  enableWhen: () =>
    process.env.NODE_ENV === "development" &&
    /localhost|127\\.0\\.0\\.1/.test(window.location.host),
});
```

- 适用场景：
- 内部低代码平台中的页面编辑器。
- 组件库文档站（Storybook/自研 playground）中的“在线修复”能力。
- 自定义 DevTools 面板，不依赖 Chrome 扩展发布流程。

### 使用方式 D：本地 CLI + Server（团队统一入口）

- 提供 `altpatch` 命令，统一启动 server 与配置。
- 推荐命令：

```bash
pnpm dlx altpatch init
pnpm altpatch dev --root . --port 7331
pnpm altpatch doctor
```

- `init`：写入 `.altpatchrc.json`、生成 token、注入安全配置模板。
- `dev`：启动本地服务，输出扩展连接状态。
- `doctor`：检查端口、权限、path 白名单、HMR 连通性。

### 使用方式 E：CI 校验模式（只读）

- 在 CI 中运行规则引擎，不落盘，只输出建议 diff。
- 命令示例：

```bash
pnpm altpatch audit --rules style,accessibility --format markdown
```

- 价值：将“自然语言改动规则”沉淀为可审计规范，支持 PR 注释自动化。

## 7. 核心技术选型建议（含理由）

- AI 引擎：`LLM 优先（OpenAI 兼容接口） + AST Guard`
- 理由：自然语言改动复杂度高，规则难覆盖；LLM 负责意图理解与补丁生成，AST 负责安全与确定性。

- UI：`Preact + Shadow DOM`
- 理由：体积小、生态成熟、JSX 开发效率高；在内容脚本中比 React 更轻量，且不依赖宿主框架。

- Diff：`diff + 自定义轻量渲染`
- 理由：比 `monaco diff` 轻很多；`diff2html` 可作为第二阶段增强，首版先保证性能与可控性。

- 代码解析：`@babel/parser + @babel/traverse + magic-string`
- 理由：适配 JS/TS/JSX 成熟；`magic-string` 便于保留格式和 sourcemap；便于对 LLM 补丁做结构化校验与回写。

- 通信：`fetch + WebSocket`
- 理由：命令类操作走 HTTP 简单明确；状态推送和实时通知走 WS，职责清晰。

- 安全：`CSP + 路径白名单 + token`
- 理由：
- 扩展端仅允许 `localhost/127.0.0.1`。
- server 仅写 projectRoot 内文件。
- 每次写入必须携带会话 token，减少本地端口被滥用风险。

## 8. 潜在挑战与解决方案

### 大模型幻觉与误改风险

- 挑战：模型可能修改超出用户意图的代码区域。
- 方案：
- 只给模型传递定位片段 + 受控上下文窗口，不传全仓库。
- 强制返回结构化补丁（JSON patch/hunk），禁止自由文本直写。
- AST 二次校验 + 变更范围白名单（同文件、同组件优先）。
- 必须人工确认后落盘，默认不开启自动 apply。

### 跨框架兼容性

- 挑战：React/Vue/Svelte 源映射和组件层级信息来源不同。
- 方案：以 LocatorJS 解析逻辑为内核，做 `FrameworkAdapter` 插件化：

```ts
interface FrameworkAdapter {
  name: "react" | "vue" | "svelte";
  match(el: Element): boolean;
  locate(el: Element): SourceLocation | null;
}
```

### Shadow DOM 样式隔离

- 挑战：宿主页面全局样式污染 Tooltip。
- 方案：`attachShadow({ mode: 'open' })` + CSS Reset + 所有 UI 样式局部化变量前缀。

### 大文件性能

- 挑战：完整 AST parse 与 full diff 在大文件下延迟高。
- 方案：
- 优先按定位行号截取窗口（如上下 200 行）进行指令处理。
- 异步任务队列 + 超时取消。
- Diff 按需展开（折叠未改动区块）。

### 安全性（防止任意文件读写）

- 挑战：本地服务易成为攻击面。
- 方案：
- 强制 projectRoot 白名单。
- 禁止绝对路径直写与 `..` 逃逸。
- 限制仅监听 `127.0.0.1`。
- 引入一次性 token（扩展启动时握手获取）。

### Manifest V3 Service Worker 限制

- 挑战：SW 非常驻，长连接和状态易丢失。
- 方案：
- 将核心 UI/WS 保持在 content script。
- SW 只负责转发消息、权限桥接和轻量状态。
- 对关键请求实现重试与幂等 ID。

## 9. 附：最小 API 与数据流示例

```ts
// Alt+Click -> 定位 -> 读文件 -> 生成补丁 -> 用户确认 -> 写入
const location = await core.locateFromElement(target);
const source = await api.readFile({ filePath: location.filePath });
const proposal = await api.modify({
  filePath: location.filePath,
  instruction: "把按钮背景改成红色，加个 hover 阴影",
  selection: locationToSelection(location),
  location: {
    line: location.line,
    column: location.column,
    framework: location.framework,
  },
  contextWindow: { beforeLines: 120, afterLines: 120 },
});
renderDiff(proposal.diff);
renderAIExplanation(proposal.explanation);
// on confirm
await api.writeFile({ filePath: location.filePath, content: proposal.after });
```

```ts
// server 侧：AI 编排（简化）
const prompt = buildPrompt({ instruction, fileSnippet, framework, location });
const llmResult = await llm.generatePatch(prompt);
const guarded = await astGuard.validateAndApply(llmResult.patch, sourceCode);
return toModifyResponse(guarded, llmResult);
```

## 10. 建议的首期里程碑

1. M1：Alt+Click 定位 + Tooltip 基础 UI + read-file。
2. M2：接入 LLM 补丁生成 + diff 展示 + 人工确认写入。
3. M3：模型上下文优化（组件级窗口）+ WS 通知 + 与主应用 HMR 对接。
4. M4：多模型路由/降级策略 + 安全策略加固 + 回滚功能。
