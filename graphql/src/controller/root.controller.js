const fs = require("fs");
const { getRecentPosts, getAllLogs } = require("../service/root.service");
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

    // 添加fetch配置
    const fetchConfig = {
      timeout: 10000, // 10秒超时
      retries: 3, // 重试3次
      retryDelay: 1000, // 重试间隔1秒
    };

    // 重试函数
    const fetchWithRetry = async (url, retries = fetchConfig.retries) => {
      try {
        const response = await fetch(url, {
          timeout: fetchConfig.timeout,
        });
        return await response.buffer();
      } catch (error) {
        if (retries > 0) {
          await new Promise((resolve) =>
            setTimeout(resolve, fetchConfig.retryDelay)
          );
          return fetchWithRetry(url, retries - 1);
        }
        throw error;
      }
    };

    const fetchImgSrc = (urls) => {
      return urls.map(
        (url) =>
          new Promise(async (resolve, reject) => {
            try {
              // 使用新的fetch函数
              const data = await fetchWithRetry(url);
              const imgFormData = new FormData();
              imgFormData.append("smfile", data, `${new Date().getTime()}`);

              const smResponse = await fetch("https://sm.ms/api/v2/upload", {
                method: "POST",
                headers: {
                  Authorization: "UdKmYqnlvx5YfBtfwD44vdyYZBTLGEgv",
                },
                body: imgFormData,
                timeout: fetchConfig.timeout,
              });

              const result = await smResponse.json();

              if (result.success === true) {
                resolve(result.data.url);
              } else if (
                result.message &&
                result.message.includes("repeated")
              ) {
                resolve(result.images);
              } else {
                reject(new Error(result.message));
              }
            } catch (err) {
              console.error(`Failed to process image ${url}:`, err);
              // 如果图片处理失败，返回原始URL
              resolve(url);
            }
          })
      );
    };

    try {
      const allImgDataPromise = fetchImgSrc(urls);
      const results = await Promise.all(allImgDataPromise);
      ctx.body = results;
    } catch (err) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: "图片上传处理失败",
        error: err.message,
      };
    }

    await next();
  },

  getAllLogs: async (ctx) => {
    const allLogs = await getAllLogs();
    ctx.body = allLogs;
  },
};

module.exports = rootController;
