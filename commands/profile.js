var profile = {};
const mongoose = require('mongoose'),
	User = require('../models/user');

profile.newUser = (message) => {
	var player = {
		id: message.author.id,
		username: message.author.username,
		discriminator: message.author.discriminator,
		weapon: {
			name: 'Lefty and Mr. Right',
			damageMin: 1,
			damageMax: 5
		},
		armor: {
			name: 'Street Clothes',
			damageReduction: 1,
			runModifier: 1
		},
		medication: {
			name: 'Stimpack',
			healingMin: 1,
			healingMax: 5
		},
		specialMove: {
			name: 'Flying Fists',
			damageMin: 1,
			damageMax: 5,
			healingMin: 1,
			healingMax: 5,
			counter: 4
		},
		experience: 0,
		level: 1,
		credits: 0
	};
	User.find({ id: message.author.id }, (err, userFound) => {
		console.log(userFound);
		if (err) {
			console.log(err);
		} else if (userFound[0] == undefined) {
			//This really should be using the id numbers of both userFound[0] and message.author.id, but that's taking longer to work
			User.create(player, (err, newPlayer) => {
				if (err) console.log(err);
			});
			message.channel.send('Profile Created');
		} else if (userFound[0].id == message.author.id) {
			message.channel.send('A profile with your id was already found.');
		} else {
			console.log(userFound[0]);
			console.log(message.author.id);
			message.channel.send('Something weird happened. @Racecar0#8015 Go check the console.');
		}
		// if (err) {
		// 	console.log(err);
		// } else if (userFound.length < 1) {
		// 	//This really should be using the id numbers of both userFound[0] and message.author.id, but that's taking longer to work
		// 	User.create(player, (err, newPlayer) => {
		// 		if (err) console.log(err);
		// 	});
		// 	message.channel.send('Profile Created');
		// } else {
		// 	message.channel.send('A profile with your id was already found.');
		// }
	});
};

profile.status = (message) => {
	var player = User.find({ id: message.author.id }, (err, userFound) => {
		console.log(userFound[0]);
		var player = userFound[0];
		message.channel.send(
			'**Username:** ' +
				player.username +
				'\n**Weapon (damage range):** ' +
				player.weapon.name +
				' (' +
				player.weapon.damageMin +
				'-' +
				player.weapon.damageMax +
				')' +
				'\n**Armor (defense, run modifier):** ' +
				player.armor.name +
				' (' +
				player.armor.damageReduction +
				', ' +
				player.armor.runModifier +
				')' +
				'\n**Medication (healing range):** ' +
				player.medication.name +
				' (' +
				player.medication.healingMin +
				'-' +
				player.medication.healingMax +
				')' +
				'\n**Special (ability description):** \n' +
				player.specialMove.name +
				' deal ' +
				player.specialMove.damageMin +
				'-' +
				player.specialMove.damageMax +
				' damage and might heal for ' +
				player.specialMove.healingMin +
				'-' +
				player.specialMove.healingMax +
				' health' +
				'\n**Experience (needed for next level):** ' +
				player.experience +
				' (n/a)' +
				'\n**Current Level:** ' +
				player.level +
				'\n**Credits:** ' +
				player.credits
		);
	});
};
module.exports = profile;
