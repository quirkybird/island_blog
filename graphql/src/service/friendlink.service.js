const connection = require("../../database");

class FriendLinkService {
  async create(data) {
    const {
      nickname,
      email,
      theme_color,
      website_title,
      website_link,
      website_cover,
      website_desr,
    } = data;

    const [result] = await connection.execute(
      `INSERT INTO blog_friendlinks 
       (nickname, email, theme_color, website_title, website_link, website_cover, website_desr) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        nickname,
        email,
        theme_color,
        website_title,
        website_link,
        website_cover,
        website_desr,
      ]
    );
    return result;
  }

  async findAll() {
    const [rows] = await connection.execute(
      "SELECT * FROM blog_friendlinks ORDER BY create_at DESC"
    );
    return rows;
  }

  async findOne(id) {
    const [rows] = await connection.execute(
      "SELECT * FROM blog_friendlinks WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  async update(id, data) {
    const {
      nickname,
      email,
      theme_color,
      website_title,
      website_link,
      website_cover,
      website_desr,
    } = data;

    const [result] = await connection.execute(
      `UPDATE blog_friendlinks 
       SET nickname = ?, 
           email = ?, 
           theme_color = ?, 
           website_title = ?, 
           website_link = ?, 
           website_cover = ?, 
           website_desr = ? 
       WHERE id = ?`,
      [
        nickname,
        email,
        theme_color,
        website_title,
        website_link,
        website_cover,
        website_desr,
        id,
      ]
    );
    return result;
  }

  async delete(id) {
    const [result] = await connection.execute(
      "DELETE FROM blog_friendlinks WHERE id = ?",
      [id]
    );
    return result;
  }
}

module.exports = FriendLinkService;
