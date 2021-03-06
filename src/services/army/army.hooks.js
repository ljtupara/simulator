const errors = require('@feathersjs/errors');

async function validateCreateArmy(context) {
	if (!context.data) {
		throw new errors.BadRequest('There is no data for your army');
	}

	const gameModel = context.app.get('gameModel');
	const gameCount = await gameModel.countDocuments({ status: 'InProgress' }).exec();

	if (gameCount > 0) {
		throw new errors.Forbidden('You cannot create army, there is battle in progress');
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
