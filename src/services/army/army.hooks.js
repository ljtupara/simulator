const errors = require('@feathersjs/errors');

function validateCreateArmy(context) {
	if (!context.data) {
		throw new errors.BadRequest('There is no data for your army');
	}

	if (Array.isArray(context.data)) {
		context.data.forEach((d) => {
			if (!d.units || d.units < 80 || d.units > 100) {
				throw new errors.BadRequest('You have to provide units and it must be between 80-100');
			}
		});
	} else if (!context.data.units || context.data.units < 80 || context.data.units > 100) {
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
