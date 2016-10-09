const Koa = require('koa');
const Router = require('koa-router');
const BodyParser = require('koa-bodyparser');
const args = require('../args');

const app = Koa();
app.use(BodyParser());

const router = new Router({
  prefix: '/api',
});
router.use(require('./nodes'));
router.use(require('./options'));

app.use(router.routes());

app.listen(args.port, args.host, err => {
  err ? console.error(err) : console.log(`Listening at ${args.host}:${args.port}`);
});
