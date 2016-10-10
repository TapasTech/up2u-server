exports.list = function list(Model, options={}) {
  const defaults = Object.assign({
    per: 25,
    page: 1,
    indexes: [],
  }, options);
  return function* () {
    const {per=defaults.per, page=defaults.page} = this.query;
    const options = {
      offset: per * (page - 1),
      limit: per,
    };
    const where = defaults.indexes.reduce((res, key) => {
      const val = this.query[key];
      if (val) {
        res = res || {};
        res[key] = {
          $like: `%${val}%`,
        };
      }
      return res;
    }, null);
    if (where) options.where = where;
    this.body = yield Model.findAndCountAll(options);
  };
};

function createModel(Model, data) {
  return Model.create(data);
}

exports.create = function create(Model, options={}) {
  const {handle=createModel} = options;
  return function* () {
    const data = this.request.body;
    if (!data) return this.status = 400;
    const model = yield handle(Model, data);
    this.body = model;
  };
};

exports.retrieve = function retrieve(Model, options={}) {
  const {key='id'} = options;
  return function* () {
    const id = this.params[key];
    const model = yield Model.findById(id);
    if (!model) return this.status = 404;
    this.body = model;
  };
};

function updateModel(model, data) {
  return model.update(data);
}

exports.update = function update(Model, options={}) {
  const {key='id', handle=updateModel} = options;
  return function* () {
    const id = this.params[key];
    const data = this.request.body;
    if (!data) return this.status = 400;
    const model = yield Model.findById(id);
    if (!model) return this.status = 404;
    this.body = yield handle(model, data);
  };
};

function removeModel(model) {
  return model.destroy();
}

exports.remove = function remove(Model, options={}) {
  const {key='id', handle=removeModel} = options;
  return function* () {
    const id = this.params[key];
    const model = yield Model.findById(id);
    if (!model) return this.status = 404;
    yield handle(model);
    this.body = null;
  };
};