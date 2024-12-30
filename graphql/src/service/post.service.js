const connection = require("../../database");
class PostService {
  async deletePost(postId) {
    const statement = "DELETE FROM blog_posts WHERE id = ?";
    const [res] = await connection.execute(statement, [postId]);
    res.msg = "数据删除成功！";
    return res;
  }

  async editPost(id, body) {
    const { title, author, categories, content, tags, descr, image } = body;
    const statement =
      "UPDATE blog_posts SET title = ?, author = ?, categories = ?, content = ?, tags = ?, descr = ?, image = ? WHERE id = ?";
    const multipleValues = [
      title,
      author,
      categories,
      content,
      tags,
      descr,
      image,
      id,
    ];
    const [res] = await connection.execute(statement, multipleValues);
    res.msg = "数据修改成功！";
    return res;
  }
}

module.exports = new PostService();
