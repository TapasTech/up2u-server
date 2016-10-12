const models = require('../lib/models');

models.sync({force: true})
.then(() => Promise.all([
  models.Block.create({
    name: 'hi',
    content: [{"type":"text","data":"Hi there!","_name":"__1","_index":0,"_touched":true,"_goto":"__2"},{"type":"link","data":"Welcome to China!","link":"https://www.baidu.com/","_name":"__2","_index":1,"_touched":true,"_goto":"__3"},{"type":"text","data":"Do you like it?","_name":"__3","_index":2,"_touched":true,"_goto":"__4"},{"type":"choices","children":["yes","no"],"_name":"__4","_index":3,"_touched":true},{"type":"choice","name":"yes","title":"Yes","data":"Yes, I like it.","goto":"goyes","_name":"yes","_index":4,"_touched":true,"_goto":"goyes"},{"type":"choice","name":"no","title":"No","data":"No, show me something else.","goto":"gono","_name":"no","_index":5,"_touched":true,"_goto":"gono"},{"type":"text","name":"goyes","data":"OK, you are so cute.","goto":"end","_name":"goyes","_index":6,"_touched":true,"_goto":"end"},{"type":"text","name":"gono","data":"Oh, you suck.","goto":"end","_name":"gono","_index":7,"_touched":true,"_goto":"end"},{"type":"text","name":"end","data":"Auf wiedersehen.","_name":"end","_index":8,"_touched":true}]
  }),
  models.Block.create({
    name: 'hello',
    content: [{
      type: 'text',
      data: 'hello, world',
    }],
    snippet: true,
  }),
]))
.then(blocks => {
  blocks = blocks.slice(0, 1);
  return models.Entry.create({
    name: 'root',
    data: [],
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
