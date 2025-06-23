import { useEffect, useRef, useMemo, useContext } from "react";
import { memo } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import emoji from "remark-emoji";
import hljs from "highlight.js/lib/common";
import { ThemeContext } from "../../App";

// 定义一个常量ID，用于唯一标识我们的主题 <link> 标签
const THEME_LINK_ID = "app-theme-switcher-link";

/**
 * 负责创建或更新主题 <link> 标签的函数。
 * 它会在 DOM 中查找指定 ID 的 <link> 标签，如果存在则更新其 href，否则创建新的。
 * @param {string} themeName - 要加载的主题名称 ('light' 或 'dark')
 */
const applyThemeCss = (themeName) => {
  // 根据主题名称构建 CSS 文件的公共路径
  // 注意：这里的路径是相对于 public 目录的根路径
  const themeHref = `/css/atom-one-${themeName}.css`;

  // 尝试通过 ID 获取现有的主题 <link> 标签
  let themeLink = document.getElementById(THEME_LINK_ID);

  if (!themeLink) {
    // 如果没有找到主题 <link> 标签，则创建一个新的
    themeLink = document.createElement("link");
    themeLink.rel = "stylesheet"; // 样式表
    themeLink.type = "text/css"; // CSS 类型
    themeLink.id = THEME_LINK_ID; // 设置唯一 ID
    document.head.appendChild(themeLink); // 将 <link> 标签添加到 <head> 中
  }

  // 更新 <link> 标签的 href 属性。
  // 这将触发浏览器下载并应用新的 CSS 文件。
  themeLink.href = themeHref;
};

const Mkd = memo(({ markdown }) => {
  const themeMode = useContext(ThemeContext); // 获取主题模式
  const lang = useRef();
  const langList = useRef([]);

  // 使用 useMemo 缓存这些回调函数
  const preEle = useMemo(() => {
    return ({ children }) => <pre data-after-content=" ">{children}</pre>;
  }, []);

  useEffect(() => {
    // 只在组件首次加载时执行一次滚动
    window.scrollTo({ top: 0, left: 0 });

    const initHighlight = () => {
      applyThemeCss(themeMode);
      // 配置highlight.js
      hljs.configure({
        ignoreUnescapedHTML: true,
      });
      hljs.highlightAll();

      const pres = document.querySelectorAll("pre");
      const preCodes = document.querySelectorAll("pre code");

      pres.forEach((pre, index) => {
        const codeClassName = preCodes[index]?.className || "";
        if (codeClassName) {
          const langClass =
            codeClassName
              .split(" ")
              .find((className) => className.startsWith("language-")) || "";

          if (!langClass.startsWith("language"))
            lang.current = null; // 如果不是语言类名，则设置为null
          else {
            const language = langClass.split("-")[1].toLowerCase(); // 提取语言名称
            lang.current = language === "undefined" ? null : language; // 处理 undefined 的情况
          }

          langList.current.push(lang.current);
        }
        pre.dataset.afterContent = langList.current[index] || "";
      });
    };

    // 每次markdown内容更新时都需要重新高亮
    requestAnimationFrame(initHighlight);
  }, [markdown, themeMode]); // 添加markdown作为依赖

  const memoizedMarkdown = useMemo(
    () => (
      <Markdown
        remarkPlugins={[remarkGfm, emoji]}
        rehypePlugins={[rehypeRaw]}
        components={{ pre: preEle }}
      >
        {markdown}
      </Markdown>
    ),
    [markdown, preEle]
  );

  return (
    <section
      className="prose max-w-none p-[32px_20px] prose-code:whitespace-break-spaces prose-img:block prose-p:text-[16px] lg:prose-p:text-[15px]
    prose-img:m-auto prose-img:shadow prose-img:rounded-md prose-pre:text-[14px] prose-blockquote:break-all
    prose-a:text-[#3bb0f0] dark:prose-invert dark:text-gray-300 dark:prose-pre:bg-[#1e293b] prose-pre:bg-[#F2F5F7]
    prose-pre:!p-0"
    >
      {memoizedMarkdown}
    </section>
  );
});

// 添加显示名称以便调试
Mkd.displayName = "Mkd";

export default Mkd;
