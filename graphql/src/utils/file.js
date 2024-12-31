const fs = require("fs");
const path = require("path");

const { createHash } = require("crypto");

// 检查两个文件是否相等
function equalFile(oldFile, newFile) {
  return hashWithSHA256(oldFile) === hashWithSHA256(newFile);
}

function hashWithSHA256(data) {
  return createHash("sha256").update(data).digest("hex");
}

// 读取文件

async function readFile(type, fileName) {
  const filePath = path.join(process.cwd(), "uploads", type, fileName); // 获取完整路径
  const fileContent = await fs.promises.readFile(filePath, "binary", (err) => {
    if (err) {
      throw new Error(404);
    }
  });
  return fileContent;
}

module.exports = { equalFile, readFile };
