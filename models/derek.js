var mongoose = require('mongoose');

var DerekSchema = new mongoose.Schema({
	name: String,
	resets: Number
});

module.exports = mongoose.model('Derek', DerekSchema);
