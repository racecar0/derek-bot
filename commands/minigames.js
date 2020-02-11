const { Client, Attachment, Collection } = require('discord.js'),
	User = require('../models/user'),
	mongoose = require('mongoose');

var minigames = {};
//FLIP MINIGAME
minigames.flip = function(message, player, args) {
	if (args[0] > player.credits) {
		message.channel.send("You don't have enough credits.");
	} else if (parseInt(args[0]) === NaN) {
		console.log('toInteger: ' + args);
		message.channel.send('Please use the correct format: !flip (credits) (choice)');
	} else if (args[1].toLowerCase() !== ('heads' || 'tails')) {
		console.log('heads/tails: ' + args);
		message.channel.send('Please use the correct format: !flip (credits) (choice)');
	} else {
		var bet = parseInt(args[0]);
		var answer = Math.floor(Math.random() * 2) + 1;
		if (answer === 1 && args[1] === 'heads') {
			bet = bet * 2;
			var updateCredits = player.credits + bet;
			User.findOneAndUpdate({ userID: player.userID }, { credits: updateCredits }, function(err, foundUser) {
				if (err) {
					console.log(err);
				} else {
					message.channel.send('You flipped heads!\nYou won ' + bet + ' credits!');
				}
			});
		} else if (answer === 2 && args[1] === 'tails') {
			bet = bet * 2;
			var updateCredits = player.credits + bet;
			User.findOneAndUpdate({ userID: player.userID }, { credits: updateCredits }, function(err, foundUser) {
				if (err) {
					console.log(err);
				} else {
					message.channel.send('You flipped tails!\nYou won ' + bet + ' credits!');
				}
			});
		} else if (answer === 1 && args[1] === 'tails') {
			var updateCredits = player.credits - bet;
			User.findOneAndUpdate({ userID: player.userID }, { credits: updateCredits }, function(err, foundUser) {
				if (err) {
					console.log(err);
				} else {
					message.channel.send('You flipped heads!\nYou lost ' + bet + ' credits.');
				}
			});
		} else if (answer === 2 && args[1] === 'heads') {
			var updateCredits = player.credits - bet;
			User.findOneAndUpdate({ userID: player.userID }, { credits: updateCredits }, function(err, foundUser) {
				if (err) {
					console.log(err);
				} else {
					message.channel.send('You flipped tails!\nYou lost ' + bet + ' credits.');
				}
			});
		}
	}
};

module.exports = minigames;
