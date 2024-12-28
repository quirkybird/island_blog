const fs = require("fs");
const UserService = require("../service/user.service");
// const FileService = require("../service/file.service");
// const { AVATAR_PATH } = require("../constant/file_path");

class UserController {
  async create(ctx, next) {
    // 获取到传入参数
    const user = ctx.request.body;
    // 对数据库进行操作
    const res = await UserService.create(user);
    // 返回数据
    ctx.response.body = res;
  }
  // async avatarInfo(ctx, next) {
  //   const userId = ctx.request.params.userId;
  //   const res = await FileService.getAvatarByUserId(userId);
  //   ctx.response.set("Content-Type", res.mimetype);
  //   ctx.response.body = fs.createReadStream(`${AVATAR_PATH}/${res.filename}`);
  // }
  async allInfo(ctx, next) {
    const userId = ctx.request.params.userId;
    const res = await UserService.getUserById(userId);
    ctx.response.body = res;
  }

  async userList(ctx, next) {
    const config = ctx.request.body;
    const res = await UserService.getUserList(config);
    ctx.response.body = res;
  }

  async deleteUser(ctx, next) {
    const userId = ctx.request.body.userId;
    const res = await UserService.deleteUser(userId);
    ctx.response.body = res;
  }

  async modifyUserInfo(ctx, next) {
    const { userId, modifyArg } = ctx.request.body;
    const res = await UserService.modifyUserInfo(userId, modifyArg);
    ctx.response.body = res;
  }
}

module.exports = new UserController();
