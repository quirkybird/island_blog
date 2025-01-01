const jwt = require("jsonwebtoken");
const { PRIVATE_KEY } = require("../app/config");
const { addNewLogs } = require("../service/root.service");
const { LOGS_TYPE } = require("../constant/logs");

class authController {
  login = async (ctx, next) => {
    const { id, NAME } = ctx.user;
    const token = jwt.sign({ id, NAME }, PRIVATE_KEY, {
      expiresIn: 60 * 60 * 24,
      algorithm: "RS256",
    });
    await addNewLogs(LOGS_TYPE.LOGIN, " ", NAME);
    ctx.response.body = {
      id,
      NAME,
      token,
    };
  };
  // 测试成功
  success = async (ctx, next) => {
    ctx.response.body = "授权成功！";
  };
}

module.exports = new authController();
