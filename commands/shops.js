var shops = {};
const mongoose = require('mongoose'),
	weapons = require('../data/weapons.json'),
	armor = require('../data/armor.json'),
	medication = require('../data/medication.json'),
	special = require('../data/special.json'),
	User = require('../models/user');

shops.sort = function(message, player, args) {
	console.log(args);
	//sort between weapons, armor, medication, special
	if (args === undefined) {
		message.channel.send(
			'Please specify what you would like to buy. !buy (weapons, armor, medication, OR special)'
		);
	} else if (args[0] === 'weapons') {
		shops.weapons(message, player);
	} else if (args[0] === 'armor') {
		shops.armor(message, player);
	} else if (args[0] === 'medication') {
		shops.medication(message, player);
	} else if (args[0] === 'special') {
		message.channel.send("The special move shop isn't open yet.");
	} else {
		message.channel.send(
			'Please specify what you would like to buy. !buy (weapons, armor, medication, OR special)'
		);
	}
};

shops.weapons = function(message, player) {
	var items = shops.setup(weapons);
	message.channel.send(items).then((sent) => {
		// 'sent' is that message you just sent
		sent
			.react('0️⃣')
			.then(() => sent.react('1️⃣'))
			.then(() => sent.react('2️⃣'))
			.then(() => sent.react('3️⃣'))
			.then(() => sent.react('4️⃣'))
			.then(() => sent.react('5️⃣'))
			.then(() => sent.react('6️⃣'))
			.then(() => sent.react('7️⃣'))
			.then(() => sent.react('8️⃣'))
			.then(() => sent.react('9️⃣'));

		const filter = (reaction, user) => {
			return (
				[ '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣' ].includes(
					reaction.emoji.name
				) && user.id === message.author.id
			);
		};

		sent
			.awaitReactions(filter, { max: 1, time: 30000, errors: [ 'time' ] })
			.then((collected) => {
				const reaction = collected.first();

				if (reaction.emoji.name === '0️⃣') {
					var selection = 0;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '1️⃣') {
					var selection = 1;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '2️⃣') {
					var selection = 2;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '3️⃣') {
					var selection = 3;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '4️⃣') {
					var selection = 4;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '5️⃣') {
					var selection = 5;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '6️⃣') {
					var selection = 6;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '7️⃣') {
					var selection = 7;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '8️⃣') {
					var selection = 8;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '9️⃣') {
					var selection = 9;
					shops.purchase(message, sent, weapons, selection, player);
				}
			})
			.catch((collected) => {
				message.channel.send('The shopkeeper kicked you out because you were loitering.');
			});
	});
};
shops.armor = function(message, player) {
	var items = shops.setup(armor);
	message.channel.send(items).then((sent) => {
		// 'sent' is that message you just sent
		sent
			.react('0️⃣')
			.then(() => sent.react('1️⃣'))
			.then(() => sent.react('2️⃣'))
			.then(() => sent.react('3️⃣'))
			.then(() => sent.react('4️⃣'))
			.then(() => sent.react('5️⃣'))
			.then(() => sent.react('6️⃣'))
			.then(() => sent.react('7️⃣'))
			.then(() => sent.react('8️⃣'))
			.then(() => sent.react('9️⃣'));

		const filter = (reaction, user) => {
			return (
				[ '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣' ].includes(
					reaction.emoji.name
				) && user.id === message.author.id
			);
		};

		sent
			.awaitReactions(filter, { max: 1, time: 30000, errors: [ 'time' ] })
			.then((collected) => {
				const reaction = collected.first();

				if (reaction.emoji.name === '0️⃣') {
					var selection = 0;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '1️⃣') {
					var selection = 1;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '2️⃣') {
					var selection = 2;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '3️⃣') {
					var selection = 3;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '4️⃣') {
					var selection = 4;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '5️⃣') {
					var selection = 5;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '6️⃣') {
					var selection = 6;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '7️⃣') {
					var selection = 7;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '8️⃣') {
					var selection = 8;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '9️⃣') {
					var selection = 9;
					shops.purchase(message, sent, weapons, selection, player);
				}
			})
			.catch((collected) => {
				message.channel.send('The shopkeeper kicked you out because you were loitering.');
			});
	});
};
shops.medication = function(message, player) {
	var items = shops.setup(medication);
	message.channel.send(items).then((sent) => {
		// 'sent' is that message you just sent
		sent
			.react('0️⃣')
			.then(() => sent.react('1️⃣'))
			.then(() => sent.react('2️⃣'))
			.then(() => sent.react('3️⃣'))
			.then(() => sent.react('4️⃣'))
			.then(() => sent.react('5️⃣'))
			.then(() => sent.react('6️⃣'))
			.then(() => sent.react('7️⃣'))
			.then(() => sent.react('8️⃣'))
			.then(() => sent.react('9️⃣'));

		const filter = (reaction, user) => {
			return (
				[ '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣' ].includes(
					reaction.emoji.name
				) && user.id === message.author.id
			);
		};

		sent
			.awaitReactions(filter, { max: 1, time: 30000, errors: [ 'time' ] })
			.then((collected) => {
				const reaction = collected.first();

				if (reaction.emoji.name === '0️⃣') {
					var selection = 0;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '1️⃣') {
					var selection = 1;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '2️⃣') {
					var selection = 2;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '3️⃣') {
					var selection = 3;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '4️⃣') {
					var selection = 4;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '5️⃣') {
					var selection = 5;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '6️⃣') {
					var selection = 6;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '7️⃣') {
					var selection = 7;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '8️⃣') {
					var selection = 8;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '9️⃣') {
					var selection = 9;
					shops.purchase(message, sent, weapons, selection, player);
				}
			})
			.catch((collected) => {
				message.channel.send('The shopkeeper kicked you out because you were loitering.');
			});
	});
};
shops.special = function(message, player) {
	var items = shops.setup(special);
	message.channel.send(items).then((sent) => {
		// 'sent' is that message you just sent
		sent
			.react('0️⃣')
			.then(() => sent.react('1️⃣'))
			.then(() => sent.react('2️⃣'))
			.then(() => sent.react('3️⃣'))
			.then(() => sent.react('4️⃣'))
			.then(() => sent.react('5️⃣'))
			.then(() => sent.react('6️⃣'))
			.then(() => sent.react('7️⃣'))
			.then(() => sent.react('8️⃣'))
			.then(() => sent.react('9️⃣'));

		const filter = (reaction, user) => {
			return (
				[ '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣' ].includes(
					reaction.emoji.name
				) && user.id === message.author.id
			);
		};

		sent
			.awaitReactions(filter, { max: 1, time: 30000, errors: [ 'time' ] })
			.then((collected) => {
				const reaction = collected.first();

				if (reaction.emoji.name === '0️⃣') {
					var selection = 0;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '1️⃣') {
					var selection = 1;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '2️⃣') {
					var selection = 2;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '3️⃣') {
					var selection = 3;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '4️⃣') {
					var selection = 4;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '5️⃣') {
					var selection = 5;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '6️⃣') {
					var selection = 6;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '7️⃣') {
					var selection = 7;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '8️⃣') {
					var selection = 8;
					shops.purchase(message, sent, weapons, selection, player);
				} else if (reaction.emoji.name === '9️⃣') {
					var selection = 9;
					shops.purchase(message, sent, weapons, selection, player);
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

shops.purchase = function(message, sent, items, selection, player) {
	//Checks credit balance. Returns in the correct item in the array for assignment.
	if (player.credits >= items[selection].price) {
		var updateCredits = player.credits - items[selection].price;
		//Assign Item to player
		User.findOneAndUpdate(
			{ userID: player.userID },
			{
				credits: updateCredits,
				weapon: {
					name: items[selection].name,
					damageMin: items[selection].minimum,
					damageMax: items[selection].maximum
				}
			},
			function(err, foundUser) {
				if (err) {
					console.log(err);
				} else {
					sent.edit('You purchased ' + items[selection].name + '.');
				}
			}
		);
	} else {
		sent.edit('You do not have enough credits for that item. Please try to purchase something else.');
	}
};

shops.response = function() {
	//Deletes and replaces the emojis for purchases. Waits for responses and such.
};

shops.setup = function(items) {
	var shopString =
		'```| # |Item Name                     |Price     |Min |Max |\n|---|------------------------------|----------|----|----|\n';
	for (i = 0; i < items.length; i++) {
		shopString +=
			'|' +
			items[i].number +
			' '.repeat(3 - items[i].number.toString().length) +
			'|' +
			items[i].name +
			' '.repeat(30 - items[i].name.length) +
			'|' +
			items[i].price +
			' '.repeat(10 - items[i].price.toString().length) +
			'|' +
			items[i].minimum +
			' '.repeat(4 - items[i].minimum.toString().length) +
			'|' +
			items[i].maximum +
			' '.repeat(4 - items[i].maximum.toString().length) +
			'|\n';
	}
	shopString += '|---|------------------------------|----------|----|----|```';
	return shopString;
};
