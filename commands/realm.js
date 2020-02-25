const { Client, Attachment, Collection } = require('discord.js'),
	User = require('../models/user'),
	Realm = require('../models/realm'),
	events = require('../data/realmevents.json'),
	mongoose = require('mongoose');

//Notes
//Seconds in a day: 86400
//Seconds in an hour: 3600
var realm = {};
realm.sort = function(message, player, args) {
	//sort between weapons, armor, medication, special
	if (args === undefined) {
		message.channel.send(
			'Please specify what you would like to buy. !buy (weapons, armor, medication, OR special)'
		);
	} else if (args[0] === 'start') {
		realm.start(message, player);
	} else if (args[0] === 'false') {
		realm.false(message, player);
	} else if (args[0] === 'check') {
		realm.check(message, player);
	} else {
		message.channel.send(
			'Please specify what you would like to buy. !buy (weapons, armor, medication, OR special)'
		);
	}
};

realm.start = function(message, player) {
	var newPlayer = {
		userID: message.author.id,
		username: message.author.username,
		discriminator: message.author.discriminator,
		date: {
			created: Date.now(),
			firstDailyLogin: Date.now()
		},
		takenTurn: false,
		realmCredits: 100
	};
	Realm.find({ userID: message.author.id }, (err, userFound) => {
		if (err) {
			console.log(err);
		} else if (userFound[0] == undefined) {
			Realm.create(newPlayer, (err, newUser) => {
				if (err) console.log(err);
			});
			message.channel.send('Realm Created');
		} else if (userFound[0].userID == message.author.id) {
			realm.events(message, userFound[0]);
		} else {
			console.log(userFound[0]);
			console.log(message.author.id);
			message.channel.send('Something weird happened. @Racecar0 Go check the console.');
		}
	});
};

realm.false = function(message, player) {
	Realm.findOneAndUpdate({ userID: player.userID }, { takenTurn: false }, function(err, foundUser) {
		if (err) {
			console.log(err);
		} else {
			message.channel.send('Turn taken set to "false."');
		}
	});
};

realm.check = function(message, player) {
	Realm.findOne({ userID: player.userID }, function(err, foundUser) {
		if (err) {
			console.log(err);
		} else {
			message.channel.send(
				'Variable takenTurn is currently set to ' +
					foundUser.takenTurn +
					'.\nAnd you have ' +
					foundUser.realmCredits +
					' credits.'
			);
		}
	});
};
module.exports = realm;

//ADDITIONAL FUNCTIONS
realm.events = function(message, player) {
	const randomEvent = Math.floor(Math.random() * 2),
		event = events[randomEvent];
	updateCredits = Math.round(player.realmCredits * event.credits);
	message.channel.send(event.eventText + '\nYou gained ' + (updateCredits - player.realmCredits) + ' credits.');
	Realm.findOneAndUpdate({ userID: player.userID }, { realmCredits: updateCredits }, function(err, foundUser) {
		if (err) {
			console.log(err);
		} else {
			return;
		}
	});
};
