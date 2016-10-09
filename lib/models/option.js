const Sequelize = require('sequelize');
const db = require('./db');

const Option = db.define('option', {
  name: {
    type: Sequelize.STRING,
    unique: true,
  },
  data: Sequelize.JSON,
});

module.exports = Option;
