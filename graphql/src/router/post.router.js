const Router = require("@koa/router");
const { vertifyAuth } = require("../middleware/auth.middleware");
const PostController = require("../controller/post.controller");

const postRouter = new Router({ prefix: "/post" });

// 部分接口在graphql服务里

// 删除文章
postRouter.get("/delete/:id", vertifyAuth, PostController.deletePost);

// 编辑文章
postRouter.post("/edit/:id", PostController.editPost);

// 获取一篇文章数据
postRouter.get("/detail/:id", PostController.detailPost);

// 获取全部文章
postRouter.get("/all", PostController.getAllPosts);

module.exports = postRouter;
