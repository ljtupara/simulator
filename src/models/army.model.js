// army-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const ATTACK_STRATEGIES = ['Random', 'Weakest', 'Strongest'];

module.exports = function model(app) {
	const mongooseClient = app.get('mongooseClient');
	const { Schema } = mongooseClient;
	const army = new Schema({
		name: { type: String, required: true, unique: true },
		units: { type: Number, required: true },
		attackStrategy: { type: String, enum: ATTACK_STRATEGIES, required: true },
		gameRef: { type: Schema.Types.ObjectId, ref: 'game', required: true },
	}, {
		timestamps: true,
	});

	// This is necessary to avoid model compilation errors in watch mode
	// see https://github.com/Automattic/mongoose/issues/1251
	let armyModel;
	try {
		armyModel = mongooseClient.model('army');
	} catch (e) {
		armyModel = mongooseClient.model('army', army);
	}
	app.set('armyModel', armyModel);

	return armyModel;
};
