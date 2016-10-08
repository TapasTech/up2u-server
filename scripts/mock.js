const models = require('../lib/models');

const createNode = models.Node.objects.create;

models.sync({force: true})
.then(() => createNode({
  type: 'text',
  content: {
    data: 'Hi there!',
  },
}))
.then(node => createNode({
  type: 'link',
  content: {
    data: 'Welcome to China!',
    link: 'http://www.baidu.com',
  },
  parent: node.id,
}))
.then(node => createNode({
  type: 'text',
  content: {
    data: 'Do you like it?',
  },
  parent: node.id,
}))
.then(node => createNode({
  type: 'choices',
  parent: node.id,
}))
.then(node => {
  return createNode({
    type: 'choice',
    content: {
      title: 'Yes',
      data: 'Yes, I like it.',
    },
    parent: node.id,
  })
  .then(node => createNode({
    type: 'text',
    content: {
      data: 'OK, thank you.',
    },
    parent: node.id,
  }))
  .then(() => createNode({
    type: 'choice',
    content: {
      title: 'No',
      data: 'No, show me something else.',
    },
    parent: node.id,
  }))
  .then(node => createNode({
    type: 'text',
    content: {
      data: 'There is nothing else. You have to like it.',
    },
    parent: node.id,
  }));
});
