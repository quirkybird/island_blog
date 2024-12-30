const rootRouter = require("./root.router");
const userRouter = require("./user.router");
const authRouter = require("./auth.router");
const postRouter = require("./post.router");

function useRoutes(app) {
  app.use(rootRouter.routes());
  app.use(userRouter.routes());
  app.use(authRouter.routes());
  app.use(postRouter.routes());
}
module.exports = useRoutes;
