var profile = {};
const mongoose = require('mongoose'),
	User = require('../models/user');

profile.newUser = (message) => {
	var player = {
		userID: message.author.id,
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
		hitPoints: 15,
		experience: 0,
		level: 1,
		credits: 10000
	};
	User.find({ userID: message.author.id }, (err, userFound) => {
		if (err) {
			console.log(err);
		} else if (userFound[0] == undefined) {
			User.create(player, (err, newPlayer) => {
				if (err) console.log(err);
			});
			message.channel.send('Profile Created');
		} else if (userFound[0].userID == message.author.id) {
			message.channel.send('A profile with your id was already found.');
		} else {
			console.log(userFound[0]);
			console.log(message.author.id);
			message.channel.send('Something weird happened. @Racecar0 Go check the console.');
		}
	});
};

profile.status = (message) => {
	User.find({ userID: message.author.id }, function(err, foundPlayer) {
		player = foundPlayer[0];
		if (err) {
			console.log(err);
			return;
		} else if (player == undefined) {
			message.channel.send('Please use !register to create a profile first.');
		} else if (player.userID == message.author.id) {
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
					'\n**Experience Total (XP needed for next level):** ' +
					player.experience +
					' (n/a)' +
					'\n**Current Level:** ' +
					player.level +
					'\n**Credits:** ' +
					player.credits
			);
		} else {
			console.log(player);
			console.log(message.author.id);
			message.channel.send('Something weird happened. Pinging Racecar0.');
			client.fetchUser('201336725958557706', false).then((user) => {
				user.send('Something asplode.');
			});
		}
	});
};

module.exports = profile;
