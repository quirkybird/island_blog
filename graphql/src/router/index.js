const rootRouter = require("./root.router");
const userRouter = require("./user.router");
const authRouter = require("./auth.router");
const postRouter = require("./post.router");
const tagsRouter = require("./tags.router");
const friendLinkRouter = require("./friendlink.router");

function useRoutes(app) {
  app.use(rootRouter.routes());
  app.use(userRouter.routes());
  app.use(authRouter.routes());
  app.use(postRouter.routes());
  app.use(tagsRouter.routes());
  app.use(friendLinkRouter.routes());
}
module.exports = useRoutes;
