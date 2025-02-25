const connection = require("../../database");
class TagsService {
  async getAllTags() {
    const statement = `SELECT tag_name, tag_id FROM blog_tag;`;
    let result = {};
    const [tags] = await connection.execute(statement, []);
    result.msg = "查询成功";
    result.success = true;
    result.detail = tags;

    return result;
  }
  async addTags(tagName) {
    const statement = `INSERT INTO blog_tag SET 
    tag_name = ?;`;
    let result = {};
    try {
      const tags = await (
        await this.getAllTags()
      ).detail.map((tag) => tag.tag_name);
      if (tags.indexOf(tagName) !== -1) {
        result.msg = "已经有这个标签了，直接使用吧";
        result.success = false;
        return result;
      }
      const [res] = await connection.execute(statement, [tagName]);
      result.msg = "添加成功";
      result.success = true;
      result.detail = res;
    } catch (error) {
      console.log(error);
      result.msg = "插入标签失败";
      result.success = false;
    }

    return result;
  }
  async deleteTag(tagId) {
    const statement = `DELETE FROM blog_tag WHERE tag_id = ?;`;
    const { tag_name } = await this.getTagById(tagId);
    let result = {};
    const [res] = await connection.execute(statement, [tagId]);
    result.msg = "删除成功";
    result.success = true;
    result.detail = res;
    result.logs = { tag_name };

    return result;
  }
  // 删除关系表中的tag联系
  async deleteTagRelation(blogId) {
    const statement = `DELETE FROM blog_tag_relation WHERE blog_id = ?;`;
    let result = {};
    const [res] = await connection.execute(statement, [blogId]);
    result.msg = "删除成功";
    result.success = true;
    result.detail = res;

    return result;
  }
  // 插入关系表，tag和post
  async InsertTagRelation(params) {
    const sql1 = `insert into blog_tag_relation(blog_id, tag_id) values ?`; //批量操作传入二位数组
    await connection.query(sql1, [params]);
  }
  // tag_id查询数据(对内,详细查询出文章内容)
  async getTagById(tagId) {
    const statement = `SELECT tag_name, tag_id FROM blog_tag WHERE tag_id = ?;`;
    const [res] = await connection.query(statement, [tagId]);
    return res[0];
  }
}

module.exports = new TagsService();
