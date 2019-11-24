/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
const feathers = require('@feathersjs/feathers');
const rest = require('@feathersjs/rest-client');
const fetch = require('node-fetch');

const app = feathers();
const restClient = rest('http://localhost:3030');

app.configure(restClient.fetch(fetch));

const armyId = process.argv[2];

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function getWeakest(army) {
	const enemyResp = await app.service('army').find({
		query: {
			_id: { $ne: army._id },
			units: { $gt: 0 },
			$sort: { units: 1 },
			$limit: 1,
		},
	});
	return enemyResp.data[0];
}

async function getStrongest(army) {
	const enemyResp = await app.service('army').find({
		query: {
			_id: { $ne: army._id },
			units: { $gt: 0 },
			$sort: { units: -1 },
			$limit: 1,
		},
	});
	return enemyResp.data[0];
}

async function getRandom(army) {
	const enemyResp = await app.service('army').find({
		query: {
			_id: { $ne: army._id },
			units: { $gt: 0 },
		},
	});
	const randomPosition = Math.floor(Math.random() * enemyResp.total);
	return enemyResp.data[randomPosition];
}

async function attack() {
	const army = await app.service('army').get(armyId, {});
	if (army.units <= 0) {
		console.log(`Army ${armyId} has been destroyed`);
		process.exit(0); // army is destroyed
	}
	let enemy;
	switch (army.attackStrategy) {
	case 'Random':
		enemy = await getRandom(army);
		break;
	case 'Weakest':
		enemy = await getWeakest(army);
		break;
	case 'Strongest':
		enemy = await getStrongest(army);
		break;
	default:
		console.log('Wierd situation nonexisting attackStrategy');
		process.exit(0);
	}

	console.log(`Enemy ${enemy ? enemy._id : ''} for army ${army._id}`);
	if (!enemy) {
		// This army is winner. Set game to done
		await app.service('game').patch(army.gameRef, { status: 'Done' }, {});
		console.log(`Army ${armyId} wins the battle`);
		process.exit(0);
	} else {
		const attackChance = Math.floor(Math.random() * 100);
		if (attackChance <= army.units) {
			const damage = Math.floor(army.units * 0.5);
			const newUnitsStatus = enemy.units - damage;
			await app.service('army').patch(enemy._id, { units: newUnitsStatus }, {});
			await app.service('battlelog').create({
				actionType: 'Attack',
				gameRef: army.gameRef,
				armyRef: army._id,
				enemyRef: enemy._id,
				damageDone: damage,
			});
			console.log(`Army ${army._id} did ${damage} damage to enemy ${enemy._id}`);
		} else {
			await app.service('battlelog').create({
				actionType: 'Attack',
				gameRef: army.gameRef,
				armyRef: army._id,
				enemyRef: enemy._id,
				damageDone: 0,
			});
			console.log(`Army ${army._id} missed enemy ${enemy._id}`);
		}
	}
}

async function reload() {
	const army = await app.service('army').get(armyId, {});
	if (army.units <= 0) {
		console.log(`Army ${armyId} has been destroyed`);
		process.exit(0); // army is destroyed
	}
	const enemyResp = await app.service('army').find({
		query: {
			_id: { $ne: army._id },
			units: { $gt: 0 },
		},
	});

	if (enemyResp.total === 0) {
		// This army is winner. Set game to done
		await app.service('game').patch(army.gameRef, { status: 'Done' }, {});
		console.log(`Army ${armyId} wins the battle`);
		process.exit(0);
	}

	const reloadTime = army.units * 10; // time in ms
	await delay(reloadTime);
	console.log(`Army ${army._id} reloaded for ${reloadTime} ms`);
	await app.service('battlelog').create({
		actionType: 'Reload',
		gameRef: army.gameRef,
		armyRef: army._id,
		reloadTime,
	});
}

async function performBattle() {
	try {
		const army = await app.service('army').get(armyId, {});
		const game = await app.service('game').get(army.gameRef, {});

		if (game.status === 'Done') {
			process.exit(0); // game already done
		}

		const runFlag = true;
		while (runFlag) {
			const battleLogs = await app.service('battlelog').find({
				query: {
					gameRef: game._id,
					armyRef: army._id,
					$sort: {
						createdAt: -1,
					},
					$limit: 1,
				},
			});

			// Actions are performed in following order attack, reload, attack, reload
			// Next action is determined by the type of previous one. In this way we can
			// continue progress after reboot of the system.
			const { data } = battleLogs;
			if (battleLogs.total === 0) {
				await attack();
			} else if (data[0].actionType === 'Reload') {
				await attack();
			} else if (data[0].actionType === 'Attack') {
				await reload();
			}
		}
	} catch (error) {
		console.log(`Error occurred ${error}`);
		process.exit(1);
	}
}

performBattle();
