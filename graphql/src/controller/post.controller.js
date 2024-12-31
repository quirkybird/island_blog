const PostService = require("../service/post.service");
const rootService = require("../service/root.service");

class PostController {
  async deletePost(ctx, next) {
    const id = ctx.request.params.id;
    const res = await PostService.deletePost(id);
    ctx.response.body = res;
  }

  async editPost(ctx) {
    const id = ctx.request.params.id;
    const postBody = ctx.request.body;
    const res = await PostService.editPost(id, postBody);
    ctx.response.body = res;
  }

  async detailPost(ctx) {
    const id = ctx.request.params.id;
    const res = await rootService.getPostById(id);
    ctx.response.body = res;
  }
}

module.exports = new PostController();
