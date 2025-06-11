import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { GET_POST_DETAIL } from "../utils/queryData";
import TechBlog from "../components/blog/TechBlog";
import InformalBlog from "../components/blog/InformalBlog";
import Loading from "../components/common/Loading";
import { useState } from "react";
import ShareCard from "../components/common/ShareCard";


const BlogDetail = () => {
  // 获取参数
  let { id } = useParams();
  id = parseInt(id);
  const { data, loading } = useQuery(GET_POST_DETAIL, {
    variables: { id },
  });
  const [showShare, setShowShare] = useState(false);
  if (loading) return <Loading />;
  const post = data.post[0];
  // 设置网站标题 title
  document.title = post.title;
  return (
    <>
      {/* 添加分享按钮 */}
      <button
        onClick={() => setShowShare(true)}
        className="fixed left-4 bottom-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 z-40"
      >
        分享
      </button>

      {/* 分享弹窗 */}
      {showShare && (
        <ShareCard blog={post} onClose={() => setShowShare(false)} />
      )}

      {post.categories === "tech_blog" && <TechBlog blog={post} />}
      {post.categories === "life_blog" && <InformalBlog blog={post} />}
    </>
  );
};

export default BlogDetail;
