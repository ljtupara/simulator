/* eslint-disable no-underscore-dangle */
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

/**
 * When reset action is performed, current battle logs are deleted, units reset
 * to initial values and game set to InProgress state
 * @param {*} context
 */
async function handleResetGame(context) {
	if (context.data && context.data.action === 'reset') {
		const battlelogModel = context.app.get('battlelogModel');
		const armyModel = context.app.get('armyModel');

		await battlelogModel.deleteMany({ gameRef: context.id });

		const armies = await armyModel.find({ gameRef: context.id }).exec();

		for (let i = 0; i < armies.length; i += 1) {
			// eslint-disable-next-line no-await-in-loop
			await armyModel.updateOne({ _id: armies[i]._id }, { units: armies[i].startingUnits });
		}
		context.data.status = 'InProgress';
	}
}

async function checkAvailableArmies(context) {
	const armyModel = context.app.get('armyModel');
	const armiesCount = await armyModel.countDocuments({ gameRef: context.id }).exec();

	if (armiesCount < 10) {
		throw new errors.Forbidden(`Not enought armies for battle. Available armies ${armiesCount}`);
	}
}

async function assignAvailableArmies(context) {
	const armyModel = context.app.get('armyModel');
	await armyModel.updateMany({ assigned: false }, { assigned: true, gameRef: context.result._id });
}

module.exports = {
	before: {
		all: [],
		find: [],
		get: [],
		create: [checkAvailableArmies],
		update: [methodNotAllowed],
		patch: [handleResetGame],
		remove: [],
	},

	after: {
		all: [fastJoin(armiesViewResolver)],
		find: [],
		get: [],
		create: [assignAvailableArmies],
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
