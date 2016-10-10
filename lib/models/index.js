const {sync} = require('./utils');
const restful = require('./restful');

const Block = require('./block');
const Entry = require('./entry');
const Option = require('./option');

module.exports = {
  sync,
  restful,
  Block,
  Entry,
  Option,
};
