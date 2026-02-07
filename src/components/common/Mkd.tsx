import React, { useEffect, useRef, useMemo, memo } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkEmoji from "remark-emoji";
import hljs from "highlight.js/lib/common";
import "highlight.js/styles/atom-one-light.css";

interface Props {
  markdown: string;
}

/** 从 react-markdown 的 children 中安全取出纯文本 */
function getCodeText(node: React.ReactNode): string {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getCodeText).join("");
  const el = node as React.ReactElement<{ children?: React.ReactNode }>;
  if (typeof node === "object" && node !== null && "props" in node && el.props?.children !== undefined) {
    return getCodeText(el.props.children);
  }
  return String(node);
}

const Mkd = memo(function Mkd({ markdown }: Props) {
  const langList = useRef<string[]>([]);
  langList.current = []; /* 每次渲染重新收集语言标签 */

  const preEle = useMemo(
    () =>
      function PreEle({ children }: { children?: React.ReactNode }) {
        return <pre data-after-content=" ">{children}</pre>;
      },
    []
  );

  const codeBlock = useMemo(
    () =>
      function CodeBlock({
        className,
        children,
        inline,
      }: {
        className?: string;
        children?: React.ReactNode;
        inline?: boolean;
      }) {
        const codeString = getCodeText(children);
        if (className) {
          const lang = className.split("-")[1]?.toUpperCase() ?? "";
          langList.current.push(lang);
        }
        return <code className="!bg-transparent">{codeString}</code>;
      },
    []
  );

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });

    const initHighlight = () => {
      hljs.configure({
        ignoreUnescapedHTML: true,
        languages: [
          "javascript",
          "java",
          "python",
          "cpp",
          "css",
          "xml",
          "typescript",
          "bash",
        ],
      });

      const blocks = document.querySelectorAll(".prose pre code");
      blocks.forEach((block) => {
        (block as HTMLElement).className = (block as HTMLElement).className.replace("hljs", "");
        hljs.highlightElement(block as HTMLElement);
      });

      const list = langList.current.slice();
      langList.current = [];
      const pres = document.querySelectorAll(".prose pre");
      pres.forEach((pre, index) => {
        (pre as HTMLElement).dataset.afterContent = list[index] ?? "";
      });
    };

    requestAnimationFrame(initHighlight);
  }, [markdown]);

  const memoizedMarkdown = useMemo(
    () => (
      <Markdown
        remarkPlugins={[remarkGfm, remarkEmoji] as React.ComponentProps<typeof Markdown>["remarkPlugins"]}
        rehypePlugins={[rehypeRaw]}
        components={{ pre: preEle, code: codeBlock }}
      >
        {markdown}
      </Markdown>
    ),
    [markdown, preEle, codeBlock]
  );

  return (
    <section
      className="prose max-w-none p-8 prose-img:block prose-p:text-[14px] lg:prose-p:text-[15px]
    prose-img:m-auto prose-img:shadow prose-img:rounded-md prose-pre:text-[14px] prose-blockquote:break-all
    prose-a:text-[#3bb0f0] dark:prose-invert dark:text-gray-300 dark:prose-pre:bg-[#1e293b] prose-pre:bg-[#F2F5F7]
    prose-pre:!p-0 prose-code:!p-4"
    >
      {memoizedMarkdown}
    </section>
  );
});

export default Mkd;
