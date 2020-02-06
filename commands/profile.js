var profile = {};
const mongoose = require('mongoose'),
	User = require('../models/user');

profile.newUser = (message) => {
	var player = {
		id: message.author.id,
		username: message.author.username,
		discriminator: message.author.discriminator,
		weapon: {
			damageMin: 1,
			damageMax: 5
		},
		armor: {
			damageReduction: 2,
			runModifier: 2
		},
		medication: {
			healingMin: 1,
			healingMax: 5
		},
		specialMove: {
			damageMin: 1,
			damageMax: 5,
			healingMin: 1,
			healingMax: 5,
			counter: 4
		},
		credits: 0
	};
	User.find({ id: message.author.id }, (err, userFound) => {
		if (err) {
			console.log(err);
		} else if (!userFound) {
			User.create(player, (err, newPlayer) => {
				if (err) console.log(err);
			});
			message.channel.send('Profile Created');
			console.log(userFound);
			console.log(message.author.id);
		} else {
			message.channel.send('A profile with your id was already found.');
			console.log(userFound);
			console.log(message.author.id);
		}
	});
};
module.exports = profile;
