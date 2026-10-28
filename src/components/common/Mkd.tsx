import React, { memo } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkEmoji from "remark-emoji";
import hljs from "highlight.js/lib/common";
import GithubSlugger from "github-slugger";

interface Props {
  markdown: string;
}

hljs.configure({ ignoreUnescapedHTML: true });

/** 从 react-markdown 的 children 中安全取出纯文本 */
function getCodeText(node: React.ReactNode): string {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getCodeText).join("");
  const el = node as React.ReactElement<{ children?: React.ReactNode }>;
  if (
    typeof node === "object" &&
    node !== null &&
    "props" in node &&
    el.props?.children !== undefined
  ) {
    return getCodeText(el.props.children);
  }
  return String(node);
}

const Mkd = memo(function Mkd({ markdown }: Props) {
  // 与 Astro 内置的标题锚点保持同一套 slug 规则，目录才能跳转
  const slugger = new GithubSlugger();

  function heading(Tag: "h1" | "h2" | "h3" | "h4") {
    return function Heading({ children }: { children?: React.ReactNode }) {
      const text = getCodeText(children).trim();
      const id = text ? slugger.slug(text) : undefined;
      return <Tag id={id}>{children}</Tag>;
    };
  }

  function PreEle({ children }: { children?: React.ReactNode }) {
    let label = "";
    if (React.isValidElement(children)) {
      const className = String(children.props?.className ?? "");
      const match = className.match(/language-([^\s]+)/);
      label = (match?.[1] ?? "").toUpperCase();
    }
    return <pre data-after-content={label}>{children}</pre>;
  }

  function CodeBlock({
    className,
    children,
    inline,
  }: {
    className?: string;
    children?: React.ReactNode;
    inline?: boolean;
  }) {
    const codeString = getCodeText(children).replace(/\n$/, "");
    if (inline) {
      return <code className={className}>{codeString}</code>;
    }

    const match = String(className ?? "").match(/language-([^\s]+)/);
    const lang = match?.[1] ?? "";
    const highlighted =
      lang && hljs.getLanguage(lang)
        ? hljs.highlight(codeString, { language: lang }).value
        : hljs.highlightAuto(codeString).value;

    const mergedClassName = ["hljs", className].filter(Boolean).join(" ");
    return (
      <code
        className={mergedClassName}
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    );
  }

  return (
    <div data-mkd-content>
      <Markdown
        remarkPlugins={
          [remarkGfm, remarkEmoji] as React.ComponentProps<
            typeof Markdown
          >["remarkPlugins"]
        }
        rehypePlugins={[rehypeRaw]}
        components={{
          pre: PreEle,
          code: CodeBlock,
          h1: heading("h1"),
          h2: heading("h2"),
          h3: heading("h3"),
          h4: heading("h4"),
        }}
      >
        {markdown}
      </Markdown>
    </div>
  );
});

export default Mkd;
