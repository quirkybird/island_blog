const Router = require("@koa/router");
const { vertifyAuth } = require("../middleware/auth.middleware");
const PostController = require("../controller/post.controller");

const postRouter = new Router({ prefix: "/post" });

// 部分接口在graphql服务里

// 删除文章
postRouter.get("/delete/:id", vertifyAuth, PostController.deletePost);

// 编辑文章
postRouter.post("/edit/:id", vertifyAuth, PostController.editPost);

module.exports = postRouter;
