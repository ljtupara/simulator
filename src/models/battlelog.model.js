// battlelog-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const ACTION_TYPE = ['Attack', 'Reload'];
module.exports = function model(app) {
	const mongooseClient = app.get('mongooseClient');
	const { Schema } = mongooseClient;
	const battlelog = new Schema({
		actionType: { type: String, enum: ACTION_TYPE, required: true },
		gameRef: { type: Schema.Types.ObjectId, ref: 'game', required: true },
		armyRef: { type: Schema.Types.ObjectId, ref: 'army' },
		damageDone: { type: Number },
		reloadTime: { type: Number },
	}, {
		timestamps: true,
	});

	// This is necessary to avoid model compilation errors in watch mode
	// see https://github.com/Automattic/mongoose/issues/1251
	let battlelogModel;
	try {
		battlelogModel = mongooseClient.model('battlelog');
	} catch (e) {
		battlelogModel = mongooseClient.model('battlelog', battlelog);
	}
	app.set('battlelogModel', battlelogModel);

	return battlelogModel;
};
