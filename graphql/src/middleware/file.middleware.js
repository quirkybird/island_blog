const multer = require("@koa/multer");
const { equalFile, readFile } = require("../utils/file");
const { getPostItem } = require("../service/post.service");

// 检查相同文件是否已经存在服务器中
const checkFile = async (ctx, next) => {
  try {
    if (ctx.request.files) {
      const files = ctx.request.files;
      const coverImage = files["image"][0].buffer;
      const blogFile = files["markdown"][0].buffer;
      const query = ctx.request.url.split("?")[1].split("=")[1];

      const post = await getPostItem(query);

      const oldCoverImage = await readFile("image", post.image);
      const oldBlogFile = await readFile("blog", post.content);

      if (equalFile(coverImage, Buffer.from(oldCoverImage, "binary"))) {
        ctx.coverFileName = post.image;
        console.log("图片没有变化");
      }
      if (equalFile(blogFile, Buffer.from(oldBlogFile, "binary"))) {
        ctx.blogFileName = post.content;
        console.log("博文没有变化");
      }

      await next();
    }
  } catch (err) {
    console.log("文件上传出现问题", err);
  }
};

/**
 * 上传文件
 * @returns
 */
const uploadPostFile = () => {
  const mstorage = multer.memoryStorage();
  //   const storage = multer.diskStorage({
  //     destination: (req, file, cb) => {
  //       if (file.fieldname === "image") {
  //         cb(null, "uploads/image");
  //       }
  //       if (file.fieldname === "markdown") {
  //         cb(null, "uploads/blog");
  //       }
  //     },
  //     filename: (req, file, cb) => {
  //       cb(
  //         null,
  //         Date.now() + Buffer.from(file.originalname, "binary").toString()
  //       );
  //     },
  //   });
  const upload = multer({ storage: mstorage });

  const postUpload = upload.fields([
    { name: "image", maxCount: 1 },
    { name: "markdown", maxCount: 1 },
  ]);
  return postUpload;
};

module.exports = { checkFile, uploadPostFile };
