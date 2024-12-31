const fs = require("fs");
const { getRecentPosts } = require("../service/root.service");
const path = require("path");
const fetch = require("node-fetch");
const FormData = require("form-data");

const rootController = {
  getRecentPosts: async (ctx, next) => {
    const recentPosts = await getRecentPosts();
    ctx.body = recentPosts;
    await next();
  },

  uploadImage: async (ctx, next) => {
    if (ctx.request.files) {
      const files = ctx.request.files;
      const coverImage = files["image"][0];
      const blogFile = files["markdown"][0];

      //如果没有新的封面，就保存新的值
      if (!ctx.coverFileName) {
        const fileName =
          Date.now() +
          Buffer.from(coverImage.originalname, "binary").toString();
        await fs.promises.writeFile(
          path.join(process.cwd(), "uploads/image", fileName),
          coverImage.buffer,
          { encoding: "utf-8" }
        );
        console.log("保存了新图片");
        ctx.coverFileName = fileName;
      }

      // 如果博客内容没有更新，就储存新的值
      if (!ctx.blogFileName) {
        const fileName =
          Date.now() + Buffer.from(blogFile.originalname, "binary").toString();
        await fs.promises.writeFile(
          path.join(process.cwd(), "uploads/blog", fileName),
          blogFile.buffer,
          { encoding: "utf-8" }
        );
        ctx.blogFileName = fileName;
      }

      ctx.set("Content-Type", "application/json");
      ctx.body = {
        coverFileName: ctx.coverFileName,
        blogFileName: ctx.blogFileName,
      };
    }
  },

  uploadSMMS: async (ctx, next) => {
    const { urls } = ctx.request.body;
    if (urls.length == 0) {
      ctx.body = { msg: "文章没有图片" };
      return;
    }
    const fetchImgSrc = (urls) => {
      return urls.map(
        (url) =>
          new Promise((resolve, reject) => {
            fetch(url)
              .then((res) => res.buffer())
              .then((data) => {
                const imgFormData = new FormData();
                imgFormData.append("smfile", data, `${new Date().getTime()}`);
                fetch("https://sm.ms/api/v2/upload", {
                  method: "POST",
                  headers: {
                    Authorization: "UdKmYqnlvx5YfBtfwD44vdyYZBTLGEgv",
                  },
                  body: imgFormData,
                })
                  .then((res) => res.json())
                  .then((data) => {
                    if (data.success === true) {
                      resolve(data.data.url);
                    } else {
                      resolve(data.images);
                    }
                  });
              });
          })
      );
    };
    const allImgDataPromise = fetchImgSrc(urls);
    await Promise.all(allImgDataPromise)
      .then((data) => {
        ctx.body = data;
      })
      .catch((err) => {
        ctx.body = err;
      });

    await next();
  },
};

module.exports = rootController;
