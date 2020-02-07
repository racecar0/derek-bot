var mongoose = require('mongoose');

var PlayerSchema = new mongoose.Schema({
	id: String,
	username: String,
	discriminator: String,
	weapon: {
		name: String,
		damageMin: Number,
		damageMax: Number
	},
	armor: {
		name: String,
		damageReduction: Number,
		runModifier: Number
	},
	medication: {
		name: String,
		healingMin: Number,
		healingMax: Number
	},
	specialMove: {
		name: String,
		damageMin: Number,
		damageMax: Number,
		healingMin: Number,
		healingMax: Number,
		counter: Number
	},
	experience: Number,
	level: Number,
	credits: Number
});

module.exports = mongoose.model('Player', PlayerSchema);
