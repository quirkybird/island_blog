import { useEffect, useRef, useState } from "react";
import CONFIG from "../../constants/config";
import { message } from "antd";
import mkdIcon from "../../assets/icon/mkd.svg";

const UploadFile = ({
  uploadRef,
  getFileName,
  getMkdContent,
  isEdit,
  data,
}) => {
  const imgFileInput = useRef(null);
  const mdFileInput = useRef(null);

  const [coverUrl, setCoverUrl] = useState(null);
  const [postName, setPostName] = useState("");

  const [query, setQuery] = useState("");

  useEffect(() => {
    if (isEdit) {
      setPostName(data.title);
      setCoverUrl(CONFIG.SERVER_URL + "/image/" + data.image);
      setQuery(`?id=${data.id}`);
    }
  }, [data, isEdit]);

  // 文件发生变化进行文件读取展示
  const onPostChange = () => {
    const mdInputRef = mdFileInput.current;
    const mdfile = mdInputRef.files[0];
    if (mdfile) {
      const fileExtension = mdfile.name.split(".").pop();
      if (fileExtension !== "md" && fileExtension !== "markdown") {
        message.info("抱歉，目前只支持扩展名为md或markdown文件哦🥰🥰");
        return;
      }
      // 设置名称
      setPostName(mdfile.name);

      // 新建 FileReader 对象
      const reader = new FileReader();
      reader.onload = function (e) {
        const content = e.target.result;
        // 调用回调函数，传回文章内容
        getMkdContent(content);
      };
      // 读取为文本文件
      reader.readAsText(mdfile);
    }
  };

  // 封面文件发生变化后预览
  const coverFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverUrl(url);
    }
  };

  useEffect(() => {
    const imgInputRef = imgFileInput.current;
    const mdInputRef = mdFileInput.current;
    const upload = uploadRef.current;
    // submit事件后上传封面文件和文章内容文件（markdown）
    const handleUploadFile = async (e) => {
      // 阻止默认事件
      e.preventDefault();
      const imgfile = imgInputRef.files[0];
      const mdfile = mdInputRef.files[0];

      // 设置mimeType类型值
      // img浏览器会自动识别
      // mdfile.type = "text/markdown"
      const formData = new FormData();

      console.log(mdfile, "--md");

      // 新建 FileReader 对象
      const reader = new FileReader();

      reader.onload = async function (e) {
        let index = 0;
        const content = e.target.result;
        // 正则表达式，用于匹配Markdown中的图片URL
        const regex = /!\[.*?\]\((.*?)\)/g;

        // 使用 matchAll 获取所有匹配结果
        const matches = [...content.matchAll(regex)];

        // 提取URL部分并存储在数组中
        const urls = matches.map((match) => match[1]);
        console.log(urls, "--urls");

        //把url交给服务器处理，返回替换url后的链接
        const replacedUrls = await fetch(CONFIG.SERVER_URL + "/replace", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            urls,
          }),
        }).then((res) => res.json());

        console.log(replacedUrls, "---res");

        // if(!replacedUrls)

        const newContent = content.replace(regex, (match, p1) => {
          return match.replace(p1, replacedUrls[index++]);
        });

        const modifiedBlob = new Blob([newContent]);
        const modifiedFile = new File([modifiedBlob], mdfile.name);

        formData.append("image", imgfile);
        formData.append("markdown", modifiedFile);
        const upload_url = isEdit
          ? "/upload-image-again"
          : "/upload-image-first";
        const res = await fetch(CONFIG.SERVER_URL + upload_url + query, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        // 将使用回调函数，传回响应值
        getFileName(data);
      };

      // 读取为文本文件
      reader.readAsText(mdfile);

      // await new Promise((resolve, reject) => {
      //   setTimeout(() => resolve(), 100000000);
      // });
    };

    upload.addEventListener("submit", handleUploadFile);
    return () => {
      upload.removeEventListener("submit", handleUploadFile);
    };
  });
  return (
    <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          上传文章内容
        </label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-all">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {postName ? (
                <div className="flex justify-center gap-3">
                  <img src={mkdIcon} alt="markdown_icon" className="h-6 w-6" />
                  <span>{postName}</span>
                </div>
              ) : (
                <>
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">点击上传</span>{" "}
                    或拖拽文件至此处
                  </p>
                  <p className="text-xs text-gray-500">支持 Markdown 文件</p>
                </>
              )}
            </div>

            <input
              type="file"
              ref={mdFileInput}
              onChange={onPostChange}
              required
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          上传文章封面
        </label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col w-full min  -h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-all">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {coverUrl ? (
                <img
                  src={coverUrl}
                  className="object-cover"
                  alt="cover_image"
                />
              ) : (
                <>
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">点击上传</span>{" "}
                    或拖拽图片至此处
                  </p>
                  <p className="text-xs text-gray-500">
                    支持 JPG, PNG 格式图片
                  </p>
                </>
              )}
            </div>
            <input
              type="file"
              ref={imgFileInput}
              onChange={coverFileChange}
              required
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
