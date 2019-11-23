const feathers = require('@feathersjs/feathers');
const rest = require('@feathersjs/rest-client');
const fetch = require('node-fetch');

const app = feathers();
const restClient = rest('http://localhost:3030');

app.configure(restClient.fetch(fetch));

const armyId = process.argv[2];

async function performBattle() {
	const army = await app.service('army').get(armyId, {});
	console.log(`army ${JSON.stringify(army)}`);
	const game = await app.service('game').get(army.gameRef, {});
	console.log(`game ${JSON.stringify(game)}`);
}

performBattle();
