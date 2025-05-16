const connection = require("../../database");
class UserService {
  async create(user) {
    const { username, real_name, password, email, about, avatar } = user;
    console.log(user);
    // 数据库操作
    const statement =
      "INSERT INTO USER (NAME, real_name, password, email, about, avatar) VALUES(?, ?, ?, ?, ?, ?)";
    const res = await connection.execute(statement, [
      username,
      real_name,
      password,
      email,
      about,
      avatar,
    ]);
    return res[0];
  }

  async getUserById(userId) {
    const statement = "SELECT * FROM USER WHERE id = ?";
    const [rows] = await connection.execute(statement, [userId]);
    return rows;
  }

  async getUserName(name) {
    const statement = "SELECT * FROM USER WHERE name = ?";
    const [rows] = await connection.execute(statement, [name]);
    return rows;
  }

  async getUserList(config) {
    let { offset, size } = config;
    let queryInfo = "WHERE ";
    for (const key in config) {
      if (config[key] && key !== "offset" && key !== "size") {
        queryInfo += `${key} LIKE "%${config[key]}%" AND `;
      }
    }
    queryInfo = queryInfo.slice(0, queryInfo.length - 4);
    if (queryInfo == "WH") queryInfo = "";
    offset = (offset - 1) * size;
    const statement1 = `SELECT * FROM USER ${queryInfo} LIMIT ${size} OFFSET ${offset}`;
    const statement2 = `SELECT CEIL(COUNT(*) / 10) total_page_number FROM USER ${queryInfo} `;
    const [list_data] = await connection.execute(statement1);
    const [total_page_number] = await connection.execute(statement2);
    return {
      data: list_data,
      pageTotal: Number(total_page_number[0].total_page_number),
    };
  }

  async deleteUser(userId) {
    // 简单限制，防止删除管理员账号
    if (userId === 1) return;
    const statement = "DELETE FROM USER WHERE id = ?";
    const [res] = await connection.execute(statement, [userId]);
    res.msg = "数据删除成功！";
    return res;
  }

  async modifyUserInfo(userId, modifyArg) {
    let modifyArgStr = "";
    // 不允许操作id为1的用户
    if (userId === 1) return;
    for (const key in modifyArg) {
      modifyArgStr += `${key} = "${modifyArg[key]}", `;
    }
    modifyArgStr = modifyArgStr.replace("username", "NAME");
    modifyArgStr = modifyArgStr.slice(0, modifyArgStr.length - 2);
    const statement = `UPDATE USER SET ${modifyArgStr}  WHERE id = ${userId}`;
    const [res] = await connection.execute(statement);
    res.msg = "数据修改成功！";
    return res;
  }
}

module.exports = new UserService();
