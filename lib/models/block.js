const Sequelize = require('sequelize');
const db = require('./db');

const Block = db.define('block', {
  name: Sequelize.STRING,
  desc: Sequelize.TEXT,
  content: Sequelize.JSON,
  snippet: Sequelize.BOOLEAN,
}, {
  indexes: [{
    fields: ['name'],
  }],
});

module.exports = Block;
