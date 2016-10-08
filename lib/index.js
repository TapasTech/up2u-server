const models = require('./models');

models.sync().then(() => require('./server'));
