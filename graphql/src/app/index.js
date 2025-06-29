const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const koaStatic = require("koa-static");

const useRoutes = require("../router/index");

const handle_error = require("./handle_error");

// 创建koa实例
const app = new Koa();
// 中间件：记录用户IP
app.use(async (ctx, next) => {
  console.log(`User IP: ${ctx.request.ip}`);
  await next();
});

//添加一个cors处理中间件
app.use(cors());
// 静态资源访问
app.use(koaStatic("uploads/"));
// 添加body解析器
app.use(bodyParser());
// 添加路由
// 这不是一个react-hooks
// eslint-disable-next-line react-hooks/rules-of-hooks
useRoutes(app);
// 增加错误处理
app.on("error", handle_error);

module.exports = app;
