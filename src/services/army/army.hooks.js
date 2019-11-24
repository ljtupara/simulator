const errors = require('@feathersjs/errors');

function validateCreateArmy(context) {
	if (!context.data) {
		throw new errors.BadRequest('There is no data for your army');
	}

	if (Array.isArray(context.data)) {
		context.data.forEach((d) => {
			if (!d.startingUnits || d.startingUnits < 80 || d.startingUnits > 100) {
				throw new errors.BadRequest('You have to provide startingUnits and it must be between 80-100');
			}
			d.units = d.startingUnits;
		});
	} else if (!context.data.startingUnits || context.data.startingUnits < 80 || context.data.startingUnits > 100) {
		throw new errors.BadRequest('You have to provide startingUnits and it must be between 80-100');
	} else {
		context.data.units = context.data.startingUnits;
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
