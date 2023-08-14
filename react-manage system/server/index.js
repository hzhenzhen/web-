const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const path = require('path');

const app = new Koa();
const router = new Router();

// 提供静态文件(React前端)
app.use(serve(path.join(__dirname, '../client/build')));

// 解析请求体
app.use(bodyParser());

// POST路由处理加法
router.post('/api/add', (ctx) => {
  const { x, y } = ctx.request.body;
  const result = Number(x) + Number(y);
  ctx.body = { result };
});

// 使用路由器中间件
app.use(router.routes());
app.use(router.allowedMethods());

// 设置服务器监听端口
const port = 3001;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
