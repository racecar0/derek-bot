var shops = {};
const mongoose = require('mongoose'),
	User = require('../models/user');

shops.weapons = function(message, player) {
	message.channel.send('Starting shop image.').then((sent) => {
		// 'sent' is that message you just sent
		sent
			.react('⬅')
			.then(() => sent.react('1️⃣'))
			.then(() => sent.react('2️⃣'))
			.then(() => sent.react('3️⃣'))
			.then(() => sent.react('4️⃣'))
			.then(() => sent.react('5️⃣'))
			.then(() => sent.react('➡'));

		const filter = (reaction, user) => {
			return (
				[ '⬅', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '➡' ].includes(reaction.emoji.name) &&
				user.id === message.author.id
			);
		};

		sent
			.awaitReactions(filter, { max: 1, time: 20000, errors: [ 'time' ] })
			.then((collected) => {
				const reaction = collected.first();

				if (reaction.emoji.name === '⬅') {
					sent.edit('You pressed the left button.');
				} else if (reaction.emoji.name === '1️⃣') {
					sent.edit('You pressed the 1 button.');
				} else if (reaction.emoji.name === '2️⃣') {
					sent.edit('You pressed the 2 button.');
				} else if (reaction.emoji.name === '3️⃣') {
					sent.edit('You pressed the 3 button.');
				} else if (reaction.emoji.name === '4️⃣') {
					sent.edit('You pressed the 4 button.');
				} else if (reaction.emoji.name === '5️⃣') {
					sent.edit('You pressed the 5 button.');
				} else if (reaction.emoji.name === '➡') {
					sent.edit('You pressed the right button.');
				}
			})
			.catch((collected) => {
				message.channel.send('The shopkeeper kicked you out because you were loitering.');
			});
	});
};

module.exports = shops;

//FUNCTION DECLARATIONS

shops.index = function() {
	//Moves the index forward and backward and edits/redraws the response emojis.
};

shops.purchase = function() {
	//Purchases the item at the given number. Knows at what point the index is to correctly purchase. Checks credit balance. Assigns the item's stats to the user.
};

shops.response = function() {
	//Deletes and replaces the emojis for purchases. Waits for responses and such.
};
