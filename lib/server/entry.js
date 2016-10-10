const Router = require('koa-router');
const {Entry, restful} = require('../models');

const router = new Router({
  prefix: '/entries',
})
.get('/default', function* (next) {
  const entry = yield Entry.find({
    order: [
      ['id', 'DESC'],
    ],
  });
  if (!entry) return this.status = 404;
  this.body = entry;
})
.post('/', restful.create(Entry, {handle: Entry.objects.create}))
.get('/', restful.list(Entry, {indexes: ['name']}))
.get('/:id', restful.retrieve(Entry))
.put('/:id', restful.update(Entry, {handle: Entry.objects.update}))
.del('/:id', restful.remove(Entry))
.get('/:id/blocks', function* (next) {
  const id = this.params.id;
  const entry = yield Entry.findById(id);
  if (!entry) return this.status = 404;
  const blocks = yield entry.getBlocks({
    joinTableAttributes: [],
  });
  this.body = blocks;
});

module.exports = router.routes();
