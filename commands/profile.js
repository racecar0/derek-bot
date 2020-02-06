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
		console.log(userFound[0].id);
		console.log(message.author.id);
		if (err) {
			console.log(err);
		} else if (typeof userFound != undefined) {
			User.create(player, (err, newPlayer) => {
				if (err) console.log(err);
			});
			message.channel.send('Profile Created');
		} else if (userFound[0].id == message.author.id) {
			message.channel.send('A profile with your id was already found.');
		}
	});
};
module.exports = profile;
