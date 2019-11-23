// Initializes the `army` service on path `/army`
const { Army } = require('./army.class');
const createModel = require('../../models/army.model');
const hooks = require('./army.hooks');

module.exports = function army(app) {
	const options = {
		Model: createModel(app),
		paginate: app.get('paginate'),
		multi: true,
	};

	// Initialize our service with any options it requires
	app.use('/army', new Army(options, app));

	// Get our initialized service so that we can register hooks
	const service = app.service('army');

	service.hooks(hooks);
};
