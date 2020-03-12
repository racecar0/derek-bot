var mongoose = require('mongoose');

var YachtSchema = new mongoose.Schema({
	userID: String,
	username: String,
	discriminator: String,
	dateCreated: String,
	score: Number,
	scoreboard: String
});

module.exports = mongoose.model('Yacht', YachtSchema);
