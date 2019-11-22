// game-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const GAME_STATUS = ['Pending', 'InProgress', 'Done'];
module.exports = function model(app) {
	const mongooseClient = app.get('mongooseClient');
	const { Schema } = mongooseClient;
	const game = new Schema({
		status: { type: String, enum: GAME_STATUS, required: true },
		name: { type: String, required: true },
	}, {
		timestamps: true,
	});

	// This is necessary to avoid model compilation errors in watch mode
	// see https://github.com/Automattic/mongoose/issues/1251
	try {
		return mongooseClient.model('game');
	} catch (e) {
		return mongooseClient.model('game', game);
	}
};
