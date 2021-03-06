/* eslint-disable no-underscore-dangle */
const { fork } = require('child_process');

const feathers = require('@feathersjs/feathers');
const rest = require('@feathersjs/rest-client');
const fetch = require('node-fetch');

const ATTACK_STRATEGIES = ['Random', 'Weakest', 'Strongest'];
const app = feathers();
const restClient = rest('http://localhost:3030');


app.configure(restClient.fetch(fetch));

const armyProcesses = [];

function createArmyInSystem() {
	const random = Math.floor(Math.random() * 10000000);
	const startingUnits = Math.floor(Math.random() * 20) + 80; // random number 80-100
	const attackStrategy = Math.floor(Math.random() * 3);
	const date = new Date();
	const name = `Army-${date.getTime()}-${random}`;

	const army = {
		name,
		attackStrategy: ATTACK_STRATEGIES[attackStrategy],
		startingUnits,
	};

	return army;
}


async function createNewGame() {
	const numberOfArmies = await app.service('army').find({ query: { status: 'InProgress', $limit: 0 } });
	if (numberOfArmies.total < 10) {
		console.log(`number of existing armies ${numberOfArmies.total}`);

		const armiesNumToCreate = Math.floor(Math.random() * 5) + 10; // we will create 10-15 new armies
		const armies = [];
		for (let i = 0; i < armiesNumToCreate; i += 1) {
			armies.push(createArmyInSystem());
		}

		await app.service('army').create(armies);
		console.log(`We have created ${armies.length} new armies`);
	}

	const date = new Date();
	const game = await app.service('game').create({ status: 'InProgress', name: `Game-${date.getTime()}` });
	return game;
}

async function simulator() {
	try {
		const results = await app.service('game').find({ query: { status: 'InProgress' } });
		let game = null;
		console.log(`Game in progress ${results.total}`);

		if (results.data && results.data.length > 0) {
		// eslint-disable-next-line prefer-destructuring
			game = results.data[0];
			console.log(`We are continuing ${game.name}`);
		} else {
			game = await createNewGame();
		}
		const armies = await app.service('army').find({ gameRef: game._id });
		const armiesIds = armies.data.map((a) => a._id);

		for (let i = 0; i < armiesIds.length; i += 1) {
			const forked = fork('./src/armyExecutor.js', [armiesIds[i]]);
			armyProcesses.push(forked);
		}
		console.log('Simulator started');
	} catch (error) {
		console.log(`Error occurred ${error}`);
		process.exit(1);
	}
}

simulator();
