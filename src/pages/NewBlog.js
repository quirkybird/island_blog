import { useRef, useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_NEW_POST } from "../utils/queryData";
import { useParams } from "react-router-dom";
import UploadFile from "../components/common/UploadFile";
import Mkd from "../components/common/Mkd";
import request from "../http/index";
import { message } from "antd";
import { Empty } from "antd";
import { Select } from "antd";
import { DownOutlined } from "@ant-design/icons";
const NewBlog = () => {
  const newBlogFormRef = useRef(null);
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const [extraFromInfo, setExtraFromInfo] = useState({
    tags: [],
    categories: "",
  });
  const uploadRef = useRef(null);

  // 读取是否是编辑模式
  const { id } = useParams();
  const isEdit = !!id;

  // 使用apollo/client hooks
  const [createNewPost, { data, loading }] = useMutation(CREATE_NEW_POST);

  useEffect(() => {
    if (loading) message.success("文章上传成功👽️👽️");
  }, [loading]);

  useEffect(() => {
    request.get("/tag/getAllTags").then((data) => {
      setTags(data.detail);
    });
    if (isEdit) {
      request.get(`/post/detail/${id}`).then((data) => {
        setInitialValues(data[0]);
        setExtraFromInfo({
          tags: data[0]?.tags,
          categories: data[0]?.categories,
        });
        setContent(data[0]?.content);
      });
    }
  }, [id, isEdit]);
  const handleSubmit = async (e) => {
    // 阻止默认事件
    e.preventDefault();
    try {
      let { coverFileName, blogFileName } =
        await uploadRef.current.handleUpload();
      if (!coverFileName) coverFileName = initialValues.image;
      if (!blogFileName) blogFileName = initialValues.fileName;
      // 在上述文件传输完成过后继续继续执行代码，保证文件成功上传
      const newBlogForm = newBlogFormRef.current;
      const formdata = new FormData(newBlogForm).entries();
      const formObj = { ...extraFromInfo };
      for (const name of formdata) {
        formObj[name[0]] = name[1];
      }
      formObj.content = blogFileName;
      formObj.image = coverFileName;

      if (isEdit) {
        request
          .post(`/post/edit/${id}`, formObj, {
            headers: {
              "Content-Type": "application/json", // 设置请求头
            },
          })
          .then((data) => {
            message.info(data?.msg || data);
          });
      } else {
        // 使用graphql上传文件
        createNewPost({
          variables: {
            post: formObj,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
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
            onSubmit={handleSubmit}
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
                defaultValue={initialValues?.title}
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
                defaultValue={initialValues?.descr}
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
                defaultValue={initialValues?.author}
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

              <Select
                required
                style={{ width: "100%" }}
                value={extraFromInfo?.categories}
                id="categories"
                name="categories"
                onChange={(value) => {
                  setExtraFromInfo({ ...extraFromInfo, categories: value });
                }}
                placeholder="请选择类别"
                options={[
                  { label: "技术文章", value: "tech_blog" },
                  { label: "生活文章", value: "life_blog" },
                ]}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700"
              >
                标签
              </label>
              <Select
                required
                mode="multiple"
                maxCount={5}
                showSearch
                optionFilterProp="tag_name"
                allowClear
                style={{ width: "100%" }}
                suffixIcon={
                  <>
                    <span>{extraFromInfo?.tags?.length} / 5</span>
                    <DownOutlined />
                  </>
                }
                value={extraFromInfo?.tags}
                id="tags"
                name="tags"
                onChange={(value) => {
                  if (value.length > 5) return;
                  setExtraFromInfo({ ...extraFromInfo, tags: value });
                }}
                placeholder="请选择标签"
                fieldNames={{ label: "tag_name", value: "tag_id" }}
                options={tags}
              />
            </div>

            <div className="space-y-2">
              <UploadFile
                ref={uploadRef}
                isEdit={isEdit}
                data={initialValues}
                getMkdContent={getMkdContent}
              />
            </div>

            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out transform hover:-translate-y-0.5">
              {isEdit ? "确认修改文章" : "我要发布文章"}
            </button>
          </form>
        </div>

        {/* {loading && (
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
        )} */}
      </section>
      <section className="flex-[2_2_0%] overflow-x-auto">
        <div className="h-screen overflow-y-auto">
          {content ? (
            <Mkd markdown={content} />
          ) : (
            <div className="h-full flex justify-center items-center">
              <Empty description="暂无内容" />
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default NewBlog;
