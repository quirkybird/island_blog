const Router = require("@koa/router");
const UserController = require("../controller/user.controller");

const userRouter = new Router({ prefix: "/user" });

const {
  vertifyUser,
  handlePassword,
} = require("../middleware/user.middleware");

const { vertifyAuth } = require("../middleware/auth.middleware");
// 注册
userRouter.post("/", vertifyUser, handlePassword, UserController.create);
// 删除用户
userRouter.delete("/", vertifyAuth, UserController.deleteUser);
// 修改用户信息
userRouter.post("/edit", vertifyAuth, UserController.modifyUserInfo);
// 获取个人信息
userRouter.get("/:userId", UserController.allInfo);
// 用户列表
userRouter.post("/list", vertifyAuth, UserController.userList);
// 获取用户头像
// userRouter.get("/:userId/avatar", UserController.avatarInfo);

module.exports = userRouter;
