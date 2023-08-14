const dayjs = require('dayjs');
const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
// 
const serve = require('koa-static');
const path = require('path');
// 
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const en = require('./locales/en.js'); // 导入中文翻译
const zh = require('./locales/zh.js'); // 导入中文翻译
const adapter = new FileSync('db.json'); // 创建名为db.json的JSON数据库文件
const db = low(adapter);

const app = new Koa();
const router = new Router();
// 提供静态文件(React前端)
app.use(serve(path.join(__dirname, '../client/build')));
app.use(cors());
app.use(bodyParser());

// 初始化数据库
db.defaults({ posts: [], tags: [] }).write();

let postIdCounter = 1; // 计数器用于生成自增的 ID

router.get('/', async (ctx) => {
  ctx.body = 'zzz';
});

// 数据管理接口开始
// 获取所有数据接口
router.get('/api/data', async (ctx) => {
  const result = db.get('posts').value();
  ctx.body = {
    code: 20000,
    data: result,
  };
});

// 新增数据接口
router.post('/api/data', async (ctx) => {
  const { name, des, addtime, tag } = ctx.request.body;
  // const id = postIdCounter++; // 使用计数器生成自增的数字 ID
  // 获取当前最大的标签id
  const maxDataId = db.get('posts').maxBy('id').value()?.id || 0;
  db.get('posts')
    .push({ id: maxDataId + 1, name, des, addtime, tag })
    .write();

  const fetchResult = db.get('posts').orderBy('id', 'desc').value();

  ctx.body = {
    code: 20000,
    data: fetchResult,
  };
});

// 数据删除接口
router.delete('/api/data/:id', async (ctx) => {
  const { id } = ctx.params;

  // 查询要删除的数据是否存在
  const existingData = db.get('posts').find({ id: parseInt(id) }).value();

  if (!existingData) {
    ctx.status = 404;
    ctx.body = {
      code: 404,
      message: 'Data not found',
    };
    return;
  }

  // 删除数据
  db.get('posts').remove({ id: parseInt(id) }).write();

  const result = db.get('posts').orderBy('id', 'desc').value();

  ctx.body = {
    code: 20000,
    data: result,
  };
});

// 数据编辑接口
router.put('/api/data/:id', async (ctx) => {
  const { id } = ctx.params;
  const { name, des, addtime, tag } = ctx.request.body;

  // 查询要编辑的数据是否存在
  const existingData = db.get('posts').find({ id: parseInt(id) }).value();

  if (!existingData) {
    ctx.status = 404;
    ctx.body = {
      code: 404,
      message: 'Data not found',
    };
    return;
  }

  // 更新数据信息
  db.get('posts')
    .find({ id: parseInt(id) })
    .assign({
      name: name || existingData.name,
      des: des || existingData.des,
      addtime: addtime || existingData.addtime,
      tag: tag || existingData.tag,
    })
    .write();

  const result = db.get('posts').orderBy('id', 'desc').value();

  ctx.body = {
    code: 20000,
    data: result,
  };
});
// 数据查询接口
router.get('/api/data/query', async (ctx) => {
  const { name, tag, addtime } = ctx.query;

  try {
    let result = db.get('posts');

    if (name) {
      result = result.filter(post => post.name.includes(name));
    }

    if (tag) {
      result = result.filter(post => post.tag === tag);
    }

    if (addtime) {
      const formattedAddtime = dayjs(addtime).format('YYYY-MM-DD HH:mm:ss');
      result = result.filter(post => post.addtime === formattedAddtime);
    }

    result = result.orderBy('id', 'desc').value();

    ctx.body = {
      code: 20000,
      data: result,
    };
  } catch (err) {
    console.error(err);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: "查询数据时发生错误",
    };
  }
});


// 标签管理开始
// 获取标签列表
// 获取标签列表
router.get('/api/tag', async (ctx) => {
  const result = db.get('tags').value();
  ctx.body = {
    code: 20000,
    data: result,
  };
});
// 添加标签接口
router.post('/api/tag', async (ctx) => {
  const { tag } = ctx.request.body;

  // 获取当前最大的标签id
  const maxTagId = db.get('tags').maxBy('id').value()?.id || 0;
  db.get('tags')
    .push({ id: maxTagId + 1, tag }) // 分配新的id
    .write();

  const fetchResult = db.get('tags').orderBy('id', 'desc').value();

  ctx.body = {
    code: 20000,
    data: fetchResult,
  };
});
// 标签编辑接口
// 标签编辑接口
router.put('/api/tag/:id', async (ctx) => {
  const { id } = ctx.params;
  const { tag: newTag } = ctx.request.body;

  // 查询是否存在指定ID的标签
  const existingTag = db.get('tags').find({ id: parseInt(id) }).value();

  if (!existingTag) {
    ctx.status = 404;
    ctx.body = {
      code: 404,
      message: 'Tag not found',
    };
    return;
  }

  // 更新标签信息
  db.get('tags')
    .find({ id: parseInt(id) })
    .assign({ tag: newTag }) // 更新标签名
    .write();

  const fetchResult = db.get('tags').orderBy('id', 'desc').value();

  ctx.body = {
    code: 20000,
    data: fetchResult,
  };
});


// 标签删除接口
// 标签删除接口
// 标签删除接口
router.delete('/api/tag/:tag', async (ctx) => {
  const { tag } = ctx.params;

  // 查询要删除的标签是否在 posts 表中
  const isTagUsed = db.get('posts').some(post => post.tag === tag).value();

  if (isTagUsed) {
    ctx.status = 400;
    ctx.body = {
      code: 400,
      message: '该标签已在数据管理中存在，无法删除。',
    };
    return;
  }

  // 删除标签
  db.get('tags').remove({ tag }).write();

  const result = db.get('tags').value();

  ctx.body = {
    code: 20000,
    data: result,
  };
});
// 查询标签接口
// 标签查询接口
router.get('/api/query', async (ctx) => {
  const { tag } = ctx.query;

  // 使用关键词查询标签数据
  const result = db.get('tags').filter(item => item.tag.includes(tag)).value();

  ctx.body = {
    code: 20000,
    data: result,
  };
});

// 语言切换接口
router.get('/api/translation', async (ctx) => {
  const lang = ctx.query.lang; // 获取查询参数 lang，值为 'en' 或 'zh'

  let translation = {};

  if (lang === 'en') {
    translation = en;
  } else if (lang === 'zh') {
    translation = zh;
  } else {
    ctx.status = 400;
    ctx.body = {
      code: 400,
      message: 'Invalid language',
    };
    return;
  }

  ctx.body = {
    code: 20000,
    data: translation,
  };
});
// 语言查询接口结束


app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3001, () => {
  console.log('http://localhost:3001/');
});
