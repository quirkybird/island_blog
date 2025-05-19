const connection = require("../../database");
const spanner = require("../utils/spanner");
const TagsService = require("../service/tags.service");
const rootService = require("./root.service");
const { LOGS_TYPE } = require("../constant/logs");

class PostService {
  async deletePost(postId) {
    const statement = "DELETE FROM blog_posts WHERE id = ?";
    const { title } = await this.getPostItem(postId);
    const [res] = await connection.execute(statement, [postId]);
    res.msg = "数据删除成功！";
    res.logs = title;
    return res;
  }

  async editPost(id, body) {
    const old = await this.getPostItem(id);
    console.log(body);
    const change = spanner.findChangedProperties(old, body);
    let keyOfChange = Object.keys(change);

    // 更新关系表
    if (keyOfChange.indexOf("tags") !== -1) {
      const newTags = [];
      const tagsParams = body.tags.map((tag) => {
        return [id, tag];
      });
      for (let i = 0; i < body.tags.length; i++) {
        const res = await TagsService.getTagById(body.tags[i]);
        newTags.push(res.tag_name);
      }
      // 删除tag和post之间的联系
      await TagsService.deleteTagRelation(id);
      // 重建联系
      await TagsService.InsertTagRelation(tagsParams);
      // 删除tags，因为表里面没有这一列
      keyOfChange = keyOfChange.filter(
        (item) => item !== "tags" && item !== "tagNames"
      );
      // 存入操作日志
      rootService.addNewLogs(
        LOGS_TYPE.EDIT,
        JSON.stringify({
          title: body.title,
          keyOfChange: ["tags"],
          originData: [`${old.tagNames.join(",")}`],
          changeData: [`${newTags.join(",")}`],
        }),
        "此夜曲中闻折柳"
      );
    }
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

    // 写入日志数据
    const originData = [];
    for (const key of keyOfChange) {
      originData.push(old[key]);
    }
    const changeData = valueOfChange;
    res.logs = JSON.stringify({
      title: body.title,
      keyOfChange,
      originData,
      changeData,
    });
    return res;
  }

  async getPostItem(postid) {
    const statement = `SELECT p.title, p.author, p.categories, p.content, p.descr, p.image, 
    IF(ISNULL(btr.blog_id), JSON_ARRAY(), JSON_ARRAYAGG(bt.tag_id)) AS tags, 
    IF(ISNULL(btr.blog_id), JSON_ARRAY(), JSON_ARRAYAGG(bt.tag_name)) AS tagNames
FROM blog_posts p
         LEFT JOIN blog.blog_tag_relation btr on p.id = btr.blog_id
         LEFT JOIN blog.blog_tag bt on btr.tag_id = bt.tag_id
         WHERE p.id = ?
GROUP BY p.create_at, p.id, btr.blog_id
ORDER BY p.create_at DESC;`;
    const [post] = await connection.execute(statement, [postid]);
    return post[0];
  }
}

module.exports = new PostService();
