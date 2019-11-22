// Initializes the `game` service on path `/game`
const { Game } = require('./game.class');
const createModel = require('../../models/game.model');
const hooks = require('./game.hooks');

module.exports = function game(app) {
	const options = {
		Model: createModel(app),
		paginate: app.get('paginate'),
	};

	// Initialize our service with any options it requires
	app.use('/game', new Game(options, app));

	// Get our initialized service so that we can register hooks
	const service = app.service('game');

	service.hooks(hooks);
};
