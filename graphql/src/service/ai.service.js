const connection = require("../../database");

class AiService {
  // 根据ID查询AI文章总结函数
  async getSummaryById(postId) {
    const statement = "SELECT * FROM blog_ai_summaries WHERE blog_post_id = ?";
    const [rows] = await connection.execute(statement, [postId]);
    return rows[0];
  }
}
module.exports = new AiService();
