const Router = require('koa-router');
const {Block, restful} = require('../models');

const router = new Router({
  prefix: '/blocks',
})
.post('/', restful.create(Block))
.get('/', restful.list(Block, {
  where(query) {
    const res = {};
    if (query.name) res.name = {
      $like: `%${query.name}%`,
    };
    if (!('all' in query)) res.snippet = true;
    return res;
  },
}))
.get('/:id', restful.retrieve(Block))
.put('/:id', restful.update(Block))
.del('/:id', restful.remove(Block));

module.exports = router.routes();
