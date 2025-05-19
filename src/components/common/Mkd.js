import { useEffect, useRef, useMemo } from "react";
import { memo } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import emoji from "remark-emoji";
import hljs from "highlight.js/lib/common";
import "highlight.js/styles/atom-one-dark.css";

const Mkd = memo(({ markdown }) => {
  const lang = useRef();
  const langList = useRef([]);

  // 使用 useMemo 缓存这些回调函数
  const preEle = useMemo(() => {
    return ({ children }) => <pre data-after-content=" ">{children}</pre>;
  }, []);

  const codeBlock = useMemo(() => {
    return ({ className, children }) => {
      if (className) {
        lang.current = className.split("-")[1].toUpperCase();
        langList.current.push(lang.current);
      }
      return <code className="!bg-transparent">{children}</code>;
    };
  }, []);

  useEffect(() => {
    // 只在组件首次加载时执行一次滚动
    window.scrollTo({ top: 0, left: 0 });

    const initHighlight = () => {
      langList.current = [];
      // 配置highlight.js
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
        ], // 指定要支持的语言
      });

      const blocks = document.querySelectorAll("pre code");
      blocks.forEach((block) => {
        // 强制刷新高亮
        block.className = block.className.replace("hljs", "");
        hljs.highlightElement(block);
      });

      const pres = document.querySelectorAll("pre");
      pres.forEach((pre, index) => {
        pre.dataset.afterContent = langList.current[index] || "";
      });
    };

    // 每次markdown内容更新时都需要重新高亮
    requestAnimationFrame(initHighlight);
  }, [markdown]); // 添加markdown作为依赖

  const memoizedMarkdown = useMemo(
    () => (
      <Markdown
        remarkPlugins={[remarkGfm, emoji]}
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
    prose-pre:!p-0 prose-code:!p-4" // 添加padding控制
    >
      {memoizedMarkdown}
    </section>
  );
});

// 添加显示名称以便调试
Mkd.displayName = "Mkd";

export default Mkd;
