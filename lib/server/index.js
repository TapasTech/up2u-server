const Koa = require('koa');
const Router = require('koa-router');
const BodyParser = require('koa-bodyparser');
const send = require('koa-send');
const compress = require('koa-compress');
const etag = require('koa-etag');
const conditional = require('koa-conditional-get');
const args = require('../args');

const staticOptions = {
  root: 'static',
};

const router = new Router({
  prefix: '/api',
});
router.use(require('./entry'));
router.use(require('./block'));
router.use(require('./options'));

const app = Koa()
.use(BodyParser())
.use(router.routes())
.use(conditional())
.use(etag())
.use(compress())
.use(function* (next) {
  (yield send(this, this.path, staticOptions)) || (yield send(this, '/index.html', staticOptions));
});

app.listen(args.port, args.host, err => {
  err ? console.error(err) : console.log(`Listening at ${args.host}:${args.port}`);
});
