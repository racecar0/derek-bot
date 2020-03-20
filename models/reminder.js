var mongoose = require('mongoose');

var ReminderSchema = new mongoose.Schema({
	userID: String,
	username: String,
	discriminator: String,
	reminderTime: Number,
	message: String,
	messageChannel: Object,
	messageID: String
});

module.exports = mongoose.model('Reminder', ReminderSchema);
