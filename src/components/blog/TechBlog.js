import { memo } from "react";
import Mkd from "../common/Mkd";
import formatDate from "../../utils/formatDate";
import GiscusComment from "../common/GiscusComment";

const TechBlog = memo(({ blog }) => {
  return (
    <main className="min-h-[calc(100vh-76px)]">
      <article className="max-w-[900px] m-auto relative">
        <section className="text-center mt-20 px-5">
          <h1 className="text-2xl lg:text-3xl font-[800] mb-3">{blog.title}</h1>
          <span>{formatDate(blog.create_at)}</span>
          <span> | 字数检测：{blog.content.length}</span>
        </section>
        {/* markdown组件，传入数据可以直接按照markdow渲染 */}
        <Mkd markdown={blog.content} />
        <span className="px-5">更新时间：{formatDate(blog.update_at)}</span>
        <GiscusComment />
      </article>
    </main>
  );
});

TechBlog.displayName = "TechBlog";
export default TechBlog;
