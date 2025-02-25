const TagsService = require("../service/tags.service");
const RootService = require("../service/root.service");
const { LOGS_TYPE } = require("../constant/logs");

const tagsController = {
  addTags: async (ctx, next) => {
    const { tagName } = ctx.request.body;
    const res = await TagsService.addTags(tagName);
    RootService.addNewLogs(LOGS_TYPE.ADD, "标签" + tagName, "此夜曲中闻折柳");
    ctx.body = res;
    await next();
  },
  getAllTags: async (ctx, next) => {
    const res = await TagsService.getAllTags();
    ctx.body = res;
    await next();
  },
  deleteTag: async (ctx, next) => {
    const { tagId } = ctx.request.query;
    const res = await TagsService.deleteTag(tagId);
    RootService.addNewLogs(
      LOGS_TYPE.DELETE,
      "标签" + res.logs.tag_name,
      "此夜曲中闻折柳"
    );
    ctx.body = res;
    await next();
  },
};

module.exports = tagsController;
