const errors = require('@feathersjs/errors');

function validateCreateArmy(context) {
	if (!context.data.units || context.data.units < 80 || context.data.units > 100) {
		throw new errors.BadRequest('You have to provide units and it must be between 80-100');
	}
	return context;
}


module.exports = {
	before: {
		all: [],
		find: [],
		get: [],
		create: [validateCreateArmy],
		update: [],
		patch: [],
		remove: [],
	},

	after: {
		all: [],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: [],
	},

	error: {
		all: [],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: [],
	},
};
