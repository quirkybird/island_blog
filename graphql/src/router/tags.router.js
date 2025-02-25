const Router = require("@koa/router");
const { vertifyAuth } = require("../middleware/auth.middleware");
const {
  addTags,
  getAllTags,
  deleteTag,
} = require("../controller/tags.controller");

const tagsRouter = new Router({ prefix: "/tag" });

// 增加tag
tagsRouter.post("/add", vertifyAuth, addTags);
tagsRouter.get("/getAllTags", getAllTags);
tagsRouter.delete("/delete", vertifyAuth, deleteTag);

module.exports = tagsRouter;
