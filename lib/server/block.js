const Router = require('koa-router');
const {Block, restful} = require('../models');

const router = new Router({
  prefix: '/blocks',
})
.post('/', restful.create(Block))
.get('/', restful.list(Block, {indexes: ['name']}))
.get('/:id', restful.retrieve(Block))
.put('/:id', restful.update(Block))
.del('/:id', restful.remove(Block));

module.exports = router.routes();
