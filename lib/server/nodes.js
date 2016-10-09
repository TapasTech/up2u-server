const Router = require('koa-router');
const {Node, Option} = require('../models');

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
.get('/root', function* (next) {
  const rootOption = yield Option.find({
    where: {
      name: 'root',
    },
  });
  let root;
  try {
    const rootId = JSON.parse(rootOption.data).id;
    root = yield Node.findById(rootId);
  } catch (e) {
    root = yield Node.find({
      order: [
        ['id', 'DESC'],
      ],
      where: {
        parent: null,
      },
    });
  }
  if (root) {
    this.body = root;
  } else {
    this.status = 404;
  }
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
  if (this.query.self) {
    const self = yield Node.findById(this.params.id);
    self && children.unshift(self);
  }
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
    const items = yield Node.findAll({
      where: {
        left: {
          $gt: root.left,
        },
        right: {
          $lt: root.right,
        },
      },
    });
    if (this.query.self) {
      items.unshift(root);
    }
    this.body = items;
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
