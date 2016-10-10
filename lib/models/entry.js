const Sequelize = require('sequelize');
const db = require('./db');
const Block = require('./block');

const Entry = db.define('entry', {
  name: Sequelize.STRING,
  desc: Sequelize.TEXT,
  data: Sequelize.JSON,
}, {
  indexes: [{
    fields: ['name'],
  }],
});
const EntryBlock = db.define('entryBlocks', {});

Entry.belongsToMany(Block, {through: EntryBlock});

Entry.objects = {};

function updateBlockIds(entry, data) {
  const {blockIds} = data;
  return blockIds ? Entry.objects.setBlockIds(entry, blockIds) : Promise.resolve(entry);
}

Entry.objects.create = function (data) {
  return Entry.create(data, {fields: ['name', 'desc']})
  .then(entry => updateBlockIds(entry, data));
};

Entry.objects.update = function (entry, data) {
  return entry.update(data, {fields: ['name', 'desc']})
  .then(() => updateBlockIds(entry, data));
};

Entry.objects.setBlocks = function (entry, blocks) {
  blocks = blocks || [];
  return Entry.objects.setBlocksIds(entry, blocks.map(item => item.id));
};

Entry.objects.setBlockIds = function (entry, blockIds) {
  return entry.update({data: blockIds})
  .then(() => EntryBlock.destroy({
    where: {
      entryId: entry.id,
    },
  }))
  .then(() => EntryBlock.bulkCreate(blockIds.map(blockId => ({entryId: entry.id, blockId}))))
  .then(() => entry);
};

module.exports = Entry;
