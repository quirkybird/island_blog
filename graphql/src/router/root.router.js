const Router = require("@koa/router");
const {
  uploadSMMS,
  getAllLogs,
  getRecentPosts,
} = require("../controller/root.controller");
const { uploadImage } = require("../controller/root.controller");
const { uploadPostFile, checkFile } = require("../middleware/file.middleware");
const router = new Router();

// 最近文章
router.get("/recentposts", getRecentPosts);

// 第一次文章内容和封面
router.post("/upload-image-first", uploadPostFile(), uploadImage);

// 修改文章内容和封面（不用检查）
router.post("/upload-image-again", uploadPostFile(), checkFile, uploadImage);

// 替换文章中所有图片链接到smms
router.post("/replace", uploadSMMS);

// 操作日志记录（除开查询）
router.get("/logs/record", getAllLogs);

module.exports = router;
