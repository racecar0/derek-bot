var mongoose = require('mongoose');

var PlayerSchema = new mongoose.Schema({
	id: String,
	username: String,
	discriminator: String,
	weapon: {
		damageMin: Number,
		damageMax: Number
	},
	armor: {
		damageReduction: Number,
		runModifier: Number
	},
	medication: {
		healingMin: Number,
		healingMax: Number
	},
	specialMove: {
		damageMin: Number,
		damageMax: Number,
		healingMin: Number,
		healingMax: Number,
		counter: Number
	},
	credits: Number
});

module.exports = mongoose.model('Player', PlayerSchema);
