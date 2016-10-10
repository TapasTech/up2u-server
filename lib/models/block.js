const Sequelize = require('sequelize');
const db = require('./db');

const Block = db.define('block', {
  name: Sequelize.STRING,
  desc: Sequelize.TEXT,
  content: Sequelize.JSON,
}, {
  indexes: [{
    fields: ['name'],
  }],
});

module.exports = Block;
