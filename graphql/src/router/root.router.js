const Router = require("@koa/router");
const multer = require("@koa/multer");
const { getRecentPosts, uploadSMMS } = require("../controller/root.controller");
const { uploadImage } = require("../controller/root.controller");
const router = new Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "image") {
      cb(null, "uploads/image");
    }
    if (file.fieldname === "markdown") {
      cb(null, "uploads/blog");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + Buffer.from(file.originalname, "binary").toString());
  },
});
const upload = multer({ storage: storage });

const postUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "markdown", maxCount: 1 },
]);

// 最近文章
router.get("/recentposts", getRecentPosts);

// 上传文章
router.post("/upload-image", postUpload, uploadImage);

// 替换文章中所有图片链接到smms
router.post("/replace", uploadSMMS);

module.exports = router;
