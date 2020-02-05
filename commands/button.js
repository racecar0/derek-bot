var button = {};
const { Client, Attachment, Collection } = require('discord.js'),
	{ prefix } = require('../config.json'),
	mongoose = require('mongoose'),
	Derek = require('../models/derek');

//hello action
button.hello = (message, command) => {
	message.react('👍');
	message.channel.send('Hello there ' + message.author.username + ", I'm Derek!");
};

//Button Action
button.button = (message, command) => {
	//DEREK DATABASE START CODE
	// var newDerek = {
	// 	name: 'Derek Hofstetler',
	// 	resets: 0
	// };
	// Derek.create(newDerek, (err, createdDerek) => {
	// 	if (err) console.log(err);
	// });

	message.react('🔴').then(() => message.react('❌'));

	const filter = (reaction, user) => {
		return [ '🔴', '❌' ].includes(reaction.emoji.name) && user.id === message.author.id;
	};

	message
		.awaitReactions(filter, { max: 1, time: 15000, errors: [ 'time' ] })
		.then((collected) => {
			const reaction = collected.first();

			if (reaction.emoji.name === '🔴') {
				Derek.find({ name: 'Derek Hofstetler' }, (err, foundDerek) => {
					if (err) {
						console.log(err);
					} else {
						var returnDerek = foundDerek[0];
						returnDerek.resets++;
						var reset = new Attachment(
							'https://media.discordapp.net/attachments/669255645559652366/674012017933418516/derekreset.gif'
						);
						message.channel.send(reset);
						setTimeout(() => {
							message.channel.send('Derek has been reset ' + returnDerek.resets + ' times.');
						}, 5000);
						Derek.findOneAndUpdate(returnDerek.name, returnDerek, (err, updatedDerek) => {
							if (err) {
								console.log(err);
							}
						});
					}
				});
			} else {
				message.channel.send("I knew you didn't have the Dereks to do it, " + message.author.username + '.');
			}
		})
		.catch((collected) => {
			message.channel.send("I knew you didn't have the Dereks to do it, " + message.author.username + '.');
		});
};

module.exports = button;
