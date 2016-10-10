const models = require('../lib/models');

models.sync({force: true})
.then(() => Promise.all([
  models.Block.create({
    name: 'hi',
    content: {
      data: 'Hi there!',
    },
  }),
  models.Block.create({
    name: 'fuck',
    content: {
      data: 'What the fuck!',
    },
  }),
]))
.then(blocks => {
  return models.Entry.create({
    name: 'root',
    data: blocks.map(block => block.id),
  })
  .then(entry => ({entry, blocks}));
})
.then(({entry, blocks}) => entry.setBlocks(blocks).then(() => entry))
.then(entry => models.Entry.findById(entry.id))
.then(entry => {
  console.log(JSON.parse(JSON.stringify(entry)));
  return entry.getBlocks();
})
.then(items => console.log(JSON.parse(JSON.stringify(items))));
