import React, { memo } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkEmoji from "remark-emoji";
import hljs from "highlight.js/lib/common";
import "highlight.js/styles/atom-one-light.css";

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
    <section
      data-mkd-content
      className="prose max-w-none p-8 prose-img:block prose-p:text-[14px] lg:prose-p:text-[15px]
    prose-img:m-auto prose-img:shadow prose-img:rounded-md prose-pre:text-[14px] prose-blockquote:break-all
    prose-a:text-[#3bb0f0] dark:prose-invert dark:text-gray-300 dark:prose-pre:bg-[#1e293b] prose-pre:bg-[#F2F5F7]
    prose-pre:!p-0 prose-pre:my-4"
    >
      <Markdown
        remarkPlugins={
          [remarkGfm, remarkEmoji] as React.ComponentProps<
            typeof Markdown
          >["remarkPlugins"]
        }
        rehypePlugins={[rehypeRaw]}
        components={{ pre: PreEle, code: CodeBlock }}
      >
        {markdown}
      </Markdown>
    </section>
  );
});

export default Mkd;
