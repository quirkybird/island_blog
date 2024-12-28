const rootRouter = require("./root.router")
const userRouter = require('./user.router')
const authRouter = require('./auth.router')


function useRoutes(app) {
  app.use(rootRouter.routes())
  app.use(userRouter.routes())
  app.use(authRouter.routes())

}
module.exports = useRoutes
