var mongoose = require('mongoose');

var RealmSchema = new mongoose.Schema({
	userID: String,
	username: String,
	discriminator: String,
	date: {
		created: Number,
		lastLogin: Number
	},
	takenTurn: Boolean,
	population: Number,
	food: Number,
	housing: Number,
	naturalResources: Number,
	energyProduction: Number,
	education: Number,
	scientificResearch: Number,
	entertainment: Number,
	government: Number,
	realmCredits: Number,
	realmEnergy: Number,
	realmResources: Number,
	taxRate: Number
});

module.exports = mongoose.model('Realm', RealmSchema);
