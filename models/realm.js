var mongoose = require('mongoose');

var RealmSchema = new mongoose.Schema({
	userID: String,
	username: String,
	discriminator: String,
	date: {
		created: Number,
		firstDailyLogin: Number
	},
	takenTurn: Boolean,
	realmCredits: Number
});

module.exports = mongoose.model('Realm', RealmSchema);
