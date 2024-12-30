const PostService = require("../service/post.service");

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
}

module.exports = new PostController();
