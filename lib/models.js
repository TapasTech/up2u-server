const Sequelize = require('sequelize');

const db = require('./db');

const Node = db.define('node', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: Sequelize.ENUM('text', 'link', 'choices', 'choice'),
  content: Sequelize.JSON,
  parent: Sequelize.INTEGER,
  disabled: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },

  // MPTT
  left: Sequelize.INTEGER,
  right: Sequelize.INTEGER,
});

Node.objects = {};

Node.objects.create = function createNode(details) {
  return Node.find({
    where: {
      parent: details.parent,
    },
    order: [
      ['right', 'DESC'],
    ],
  })
  .then(last => {
    if (last) {
      details.left = last.right + 1;
      details.right = last.right + 2;
    } else {
      return Promise.resolve(details.parent && Node.findById(details.parent))
      .then(parent => parent || Node.find({
        order: [
          ['right', 'DESC'],
        ],
      }))
      .then(parent => parent || {left: 0, right: 0})
      .then(parent => {
        details.left = parent.left + 1;
        details.right = parent.left + 2;
      });
    }
  })
  .then(() => Node.update({
    left: Sequelize.literal('left+2'),
  }, {
    where: {
      left: {
        $gte: details.left,
      },
    },
  }))
  .then(() => Node.update({
    right: Sequelize.literal('right+2'),
  }, {
    where: {
      right: {
        $gte: details.left,
      },
    },
  }))
  .then(() => Node.create(details));
};

Node.objects.remove = function removeNode(id) {
  return Node.findById(id)
  .then(node => {
    if (!node) return false;
    const delta = node.right - node.left + 1;
    return Node.destroy({
      where: {
        left: {
          $gte: node.left,
        },
        right: {
          $lte: node.right,
        },
      },
    })
    .then(() => Node.update({
      left: Sequelize.literal(`left-${delta}`),
    }, {
      where: {
        left: {
          $gt: node.left,
        },
      },
    }))
    .then(() => Node.update({
      right: Sequelize.literal(`right-${delta}`),
    }, {
      where: {
        right: {
          $gt: node.right,
        },
      },
    }))
    .then(() => true);
  });
};

module.exports = {
  sync: db.sync.bind(db),
  Node,
};
