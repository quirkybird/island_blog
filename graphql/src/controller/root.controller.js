const { getRecentPosts } = require('../service/root.service');
const path = require('path');
const fetch = require('node-fetch');
const FormData = require('form-data');

const rootController = {
  getRecentPosts: async (ctx, next) => {
    const recentPosts = await getRecentPosts();
    ctx.body = recentPosts;
    await next();
  },

  uploadImage: async (ctx, next) => {
    if (ctx.request.files) {
      const files = ctx.request.files;
      ctx.set('Content-Type', 'application/json');
      ctx.body = {
        coverFileName: files['image'][0].filename,
        blogFileName: path.parse(files['markdown'][0].filename).name,
      };
    }
  },

  uploadSMMS: async (ctx, next) => {
    const { urls } = ctx.request.body;
    if (urls.length == 0) {
      ctx.body = { msg: '文章没有图片' };
      return;
    }
    const fetchImgSrc = (urls) => {
      return urls.map(
        (url) =>
          new Promise((resolve, reject) => {
            fetch(url)
              .then((res) => res.buffer())
              .then((data) => {
                console.log(data);
                const imgFormData = new FormData();
                imgFormData.append('smfile', data, `${new Date().getTime()}`);
                fetch('https://sm.ms/api/v2/upload', {
                  method: 'POST',
                  headers: {
                    Authorization: 'UdKmYqnlvx5YfBtfwD44vdyYZBTLGEgv',
                  },
                  body: imgFormData,
                })
                  .then((res) => res.json())
                  .then((data) => {
                    if (data.success === true) {
                      resolve(data.data.url);
                    } else {
                      reject('图片解析出错');
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
