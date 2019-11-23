// Initializes the `battlelog` service on path `/battlelog`
const { Battlelog } = require('./battlelog.class');
const createModel = require('../../models/battlelog.model');
const hooks = require('./battlelog.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/battlelog', new Battlelog(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('battlelog');

  service.hooks(hooks);
};
