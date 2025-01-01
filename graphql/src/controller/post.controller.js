const { LOGS_TYPE } = require("../constant/logs");
const PostService = require("../service/post.service");
const rootService = require("../service/root.service");

class PostController {
  async deletePost(ctx, next) {
    const id = ctx.request.params.id;
    const res = await PostService.deletePost(id);
    await rootService.addNewLogs(
      LOGS_TYPE.DELETE,
      "文章" + res.logs,
      ctx.user.NAME
    );
    ctx.response.body = res;
  }

  async editPost(ctx) {
    const id = ctx.request.params.id;
    const postBody = ctx.request.body;
    const res = await PostService.editPost(id, postBody);
    rootService.addNewLogs(LOGS_TYPE.EDIT, res.logs, "此夜曲中闻折柳");
    ctx.response.body = res;
  }

  async detailPost(ctx) {
    const id = ctx.request.params.id;
    const res = await rootService.getPostById(id);
    ctx.response.body = res;
  }

  async getAllPosts(ctx, next) {
    const allPosts = await rootService.getAllPosts();
    ctx.body = allPosts;
    await next();
  }
}

module.exports = new PostController();
