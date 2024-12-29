import { useRef, useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_NEW_POST } from "../utils/queryData";
import UploadFile from "../components/common/UploadFile";
import Mkd from "../components/common/Mkd";
import { message } from "antd";
const NewBlog = () => {
  const newBlogFormRef = useRef(null);
  const [content, setContent] = useState("");
  const [onFocus, setOnFous] = useState(false);

  // 使用apollo/client hooks
  const [createNewPost, { data, loading }] = useMutation(CREATE_NEW_POST);

  useEffect(() => {
    if (loading) message.success("文章上传成功👽️👽️");
  }, [loading]);
  // 定义函数来获得子组件传值
  //这是一个callback函数，子组件完成指定操作后执行
  const getFileName = ({ coverFileName, blogFileName }) => {
    // 在上述文件传输完成过后继续继续执行代码，保证文件成功上传
    const newBlogForm = newBlogFormRef.current;
    const formdata = new FormData(newBlogForm).entries();
    const formObj = {};
    for (const name of formdata) {
      formObj[name[0]] = name[1];
    }
    formObj.tags = String(formObj.tags.split(","));
    console.log("----tags", formObj.tags);
    formObj.content = blogFileName;
    formObj.image = coverFileName;

    // 使用graphql上传文件
    createNewPost({
      variables: {
        post: formObj,
      },
    });
  };

  //返回最新的content，用来预览内容
  const getMkdContent = (c) => {
    setContent(c);
  };

  return (
    <main className="min-h-[calc(100vh-80px)] flex">
      <section className="flex-1 flex-shrink-0 max-w-3xl mx-auto px-4">
        <div className="h-screen overflow-y-auto">
          <form
            ref={newBlogFormRef}
            className="space-y-6 bg-white p-8 rounded-lg shadow-md"
          >
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                标题
              </label>
              <input
                id="title"
                name="title"
                required
                type="text"
                placeholder="请输入标题"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="descr"
                className="block text-sm font-medium text-gray-700"
              >
                博客内容简介
              </label>
              <textarea
                id="descr"
                required
                name="descr"
                placeholder="粘贴文章简介..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="author"
                className="block text-sm font-medium text-gray-700"
              >
                作者
              </label>
              <input
                id="author"
                name="author"
                required
                type="text"
                placeholder="请输入作者"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="categories"
                className="block text-sm font-medium text-gray-700"
              >
                类别
              </label>
              <select
                required
                id="categories"
                name="categories"
                placeholder="请选择类别"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              >
                <option value="tech_blog">技术文章</option>
                <option value="life_blog">生活文章</option>
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700"
              >
                标签
              </label>
              <input
                id="tags"
                name="tags"
                required
                type="text"
                onFocus={() => {
                  setOnFous(true);
                }}
                onBlur={() => {
                  setOnFous(false);
                }}
                placeholder="请输入类别"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
              {onFocus && (
                <div className="font-mono text-sm text-orange-400">
                  每个标签不超过4个字，使用英文","隔开
                </div>
              )}
            </div>

            <div className="space-y-2">
              <UploadFile
                uploadRef={newBlogFormRef}
                getFileName={getFileName}
                getMkdContent={getMkdContent}
              />
            </div>

            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out transform hover:-translate-y-0.5">
              我要发布文章
            </button>
          </form>
        </div>

        {loading && (
          <div className="text-center mt-8">
            <div className="text-2xl font-semibold text-gray-700">
              正在上传文章...
            </div>
          </div>
        )}

        {data && (
          <div className="text-center mt-8">
            <div className="text-2xl font-semibold text-green-600">
              {data.createNewPost.message},文章发表成功
            </div>
          </div>
        )}
      </section>
      <section className="flex-[2_2_0%] overflow-x-auto">
        <div className="h-screen overflow-y-auto">
          <Mkd markdown={content} />
        </div>
      </section>
    </main>
  );
};

export default NewBlog;
