const connection = require("../../database");
const spanner = require("../utils/spanner");
class PostService {
  async deletePost(postId) {
    const statement = "DELETE FROM blog_posts WHERE id = ?";
    const [res] = await connection.execute(statement, [postId]);
    res.msg = "数据删除成功！";
    return res;
  }

  async editPost(id, body) {
    const change = spanner.findChangedProperties(
      await this.getPostItem(id),
      body
    );
    const keyOfChange = Object.keys(change);
    if (keyOfChange.length === 0) return { msg: "数据没有变化" };

    const stateStr = keyOfChange.join(` = ?, `) + ` = ? `;
    const statement = `UPDATE blog_posts SET ${stateStr} WHERE id = ?`;
    const valueOfChange = [];
    for (const key of keyOfChange) {
      valueOfChange.push(body[key]);
    }
    const multipleValues = [...valueOfChange, id];
    const [res] = await connection.execute(statement, multipleValues);
    res.msg = "数据修改成功！";
    return res;
  }

  async getPostItem(postid) {
    const statement =
      "SELECT title, author, categories, content, tags, descr, image FROM blog_posts WHERE id = ?";
    const [post] = await connection.execute(statement, [postid]);
    return post[0];
  }
}

module.exports = new PostService();
