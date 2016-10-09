const Router = require('koa-router');
const {Option} = require('../models');

const router = new Router({
  prefix: '/options',
})
.get('/:name', function* (next) {
  const option = yield Option.find({
    where: {
      name: this.params.name,
    },
  });
  if (option) {
    this.body = option;
  } else {
    this.status = 404;
  }
})
.put('/:name', function* (next) {
  const data = this.request.body;
  yield Option.upsert({
    name: this.params.name,
    data,
  });
  this.body = null;
});

module.exports = router.routes();
