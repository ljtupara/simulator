const errors = require('@feathersjs/errors');
const { fastJoin } = require('feathers-hooks-common');

const armiesViewResolver = {
	joins: {
		armies: () => async (game, context) => {
			const { app } = context;
			const armyModel = app.get('armyModel');
			// eslint-disable-next-line no-underscore-dangle
			game.armies = await armyModel.find({ gameRef: game._id });
		},
	},
};

function methodNotAllowed(context) {
	throw new errors.MethodNotAllowed(`Not allowed to perform ${context.method}`);
}

module.exports = {
	before: {
		all: [],
		find: [],
		get: [],
		create: [],
		update: [methodNotAllowed],
		patch: [],
		remove: [],
	},

	after: {
		all: [fastJoin(armiesViewResolver)],
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
