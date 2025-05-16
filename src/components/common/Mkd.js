import { useEffect, useRef, useContext, useMemo } from "react";
import { memo } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import emoji from "remark-emoji";
import hljs from "highlight.js/lib/common";
import { ThemeContext } from "../../App";
import "highlight.js/styles/atom-one-dark.min.css";

const Mkd = memo(({ markdown }) => {
  const theme = useContext(ThemeContext);
  const lang = useRef();
  const langList = useRef([]);

  // 使用 useMemo 缓存这些回调函数
  const preEle = useMemo(() => {
    return ({ children }) => (
      <pre className="!bg-transparent" data-after-content=" ">
        {children}
      </pre>
    );
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
      hljs.configure({ ignoreUnescapedHTML: true });

      const blocks = document.querySelectorAll("pre code");
      blocks.forEach((block) => {
        hljs.highlightElement(block);
      });

      const pres = document.querySelectorAll("pre");
      pres.forEach((pre, index) => {
        pre.dataset.afterContent = langList.current[index] || "";
      });
    };

    // 使用 RAF 确保在下一帧执行高亮
    requestAnimationFrame(initHighlight);
  }, []); // 只在首次渲染时执行

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
    prose-a:text-[#3bb0f0] dark:prose-invert prose-pre:!bg-transparent [&_pre]:!bg-transparent
    [&_code]:!bg-transparent dark:prose-pre:!bg-[#282c34] prose-pre:!bg-[#fafafa]"
    >
      {memoizedMarkdown}
    </section>
  );
});

// 添加显示名称以便调试
Mkd.displayName = "Mkd";

export default Mkd;
