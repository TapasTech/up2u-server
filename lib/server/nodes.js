const Router = require('koa-router');
const {Node} = require('../models');

const router = new Router({
  prefix: '/nodes',
})
.post('/', function* (next) {
  const data = this.request.body;
  const node = yield Node.objects.create(data);
  this.body = node;
})
.get('/', function* (next) {
  const per = this.query.per || 25;
  const page = this.query.page || 1;
  this.body = yield Node.findAndCountAll({
    offset: per * (page - 1),
    limit: per,
  });
})
.get('/:id', function* (next) {
  const id = this.params.id;
  const node = yield Node.findById(id);
  if (node) {
    this.body = node;
  } else {
    this.status = 404;
  }
})
.get('/:id/children', function* (next) {
  const children = yield Node.findAll({
    where: {
      parent: this.params.id,
    },
  });
  if (children.length) {
    this.body = children;
  } else {
    this.status = 404;
  }
})
.get('/:id/tree', function* (next) {
  const id = this.params.id;
  const root = yield Node.findById(id);
  if (root) {
    this.body = yield Node.findAll({
      where: {
        left: {
          $gte: root.left,
        },
        right: {
          $lte: root.right,
        },
      },
    });
  } else {
    this.status = 404;
  }
})
.del('/:id', function* (next) {
  try {
    yield Node.objects.remove(this.params.id);
    this.body = null;
  } catch (e) {
    this.status = 404;
  }
});

module.exports = router.routes();
