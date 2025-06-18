const fs = require("fs");
const path = require("path");

/**
 * 根据标题找文章内容
 * @param {string} fileName
 */
function outputPostContent(fileName) {
  return fs.readFileSync(
    path.join(process.cwd(), "uploads/blog", `${fileName}`),
    "utf-8"
  );
}

module.exports = {
  outputPostContent,
};
