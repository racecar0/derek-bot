const { Client, Attachment, Collection } = require('discord.js'),
	User = require('../models/user'),
	Realm = require('../models/realm'),
	events = require('../data/realmevents.json'),
	shop = require('../data/realmshop.json'),
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
	} else if (args[0] === 'buy') {
		realm.shop(message, player, args);
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
			lastLogin: Date.now()
		},
		takenTurn: false,
		population: 100,
		food: 200,
		housing: 75,
		naturalResources: 50,
		energy: 90,
		education: 0,
		science: 0,
		entertainment: 0,
		government: 1,
		realmCredits: 1000,
		realmEnergy: 1000,
		realmResources: 1000
	};
	Realm.find({ userID: message.author.id }, (err, userFound) => {
		if (err) {
			console.log(err);
		} else if (userFound[0] == undefined) {
			var newPlayer = {
				userID: message.author.id,
				username: message.author.username,
				discriminator: message.author.discriminator,
				date: {
					created: Date.now(),
					lastLogin: Date.now()
				},
				takenTurn: false,
				population: 100,
				food: 200,
				housing: 75,
				naturalResources: 50,
				energyProduction: 90,
				education: 0,
				scientificResearch: 0,
				entertainment: 0,
				government: 1,
				realmCredits: 1000,
				realmEnergy: 1000,
				realmResources: 1000,
				taxRate: 10
			};
			Realm.create(newPlayer, (err, newUser) => {
				if (err) console.log(err);
			});
			message.channel.send('Welcome to Realm! Use "!realm help" to see the commands.');
		} else if (userFound[0].userID == message.author.id) {
			realm.time(message, userFound[0]);
			//realm.taxes(message, userFound[0]);
			//realm.populationRate(message, userFound[0]);
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
			var checkString =
				'```css\nRealm: ' +
				foundUser.username +
				'\n|Buy Assets          |Price     |\n|--------------------|----------|\n|' +
				shop[0].name +
				' '.repeat(20 - shop[0].name.length) +
				'|' +
				foundUser.food +
				' '.repeat(10 - foundUser.food.toString().length) +
				'|\n|' +
				shop[1].name +
				' '.repeat(20 - shop[1].name.length) +
				'|' +
				foundUser.housing +
				' '.repeat(10 - foundUser.housing.toString().length) +
				'|\n|' +
				shop[2].name +
				' '.repeat(20 - shop[2].name.length) +
				'|' +
				foundUser.naturalResources +
				' '.repeat(10 - foundUser.naturalResources.toString().length) +
				'|\n|' +
				shop[3].name +
				' '.repeat(20 - shop[3].name.length) +
				'|' +
				foundUser.energyProduction +
				' '.repeat(10 - foundUser.energyProduction.toString().length) +
				'|\n|' +
				shop[4].name +
				' '.repeat(20 - shop[4].name.length) +
				'|' +
				foundUser.education +
				' '.repeat(10 - foundUser.education.toString().length) +
				'|\n|' +
				shop[5].name +
				' '.repeat(20 - shop[5].name.length) +
				'|' +
				foundUser.scientificResearch +
				' '.repeat(10 - foundUser.scientificResearch.toString().length) +
				'|\n|' +
				shop[6].name +
				' '.repeat(20 - shop[6].name.length) +
				'|' +
				foundUser.entertainment +
				' '.repeat(10 - foundUser.entertainment.toString().length) +
				'|\n|' +
				shop[7].name +
				' '.repeat(20 - shop[7].name.length) +
				'|' +
				foundUser.government +
				' '.repeat(10 - foundUser.government.toString().length) +
				'|\n';

			checkString += '|--------------------|----------|\nCurrent Tax Rate: ' + foundUser.taxRate + '%```';
			message.channel.send(checkString);
		}
	});
};

realm.shop = function(message, player, args) {
	Realm.findOne({ userID: player.userID }, function(err, foundUser) {
		if (args[1] == undefined) {
			var shopString = '```|#|Buy Assets          |Price     |\n|-|--------------------|----------|\n';
			for (i = 0; i < shop.length; i++) {
				shopString +=
					'|' +
					shop[i].number +
					'|' +
					shop[i].name +
					' '.repeat(20 - shop[i].name.length) +
					'|' +
					shop[i].price +
					' '.repeat(10 - shop[i].price.toString().length) +
					'|\n';
			}
			shopString += '|-|--------------------|----------|\nAvailable credits: ' + foundUser.realmCredits + '```';
			message.channel.send(shopString);
		} else if (args[1] > shop.length || args[1] < 1) {
			message.channel.send('That item does not exist! Please try again.');
		} else if (args[1] !== undefined && args[2] == undefined) {
			message.channel.send('Please use the correct arguments to purchase. "!realm buy (item) (quantity)"');
		} else {
			shop.forEach((asset) => {
				if (asset.number == args[1]) {
					if (asset.price * args[2] > foundUser.realmCredits) {
						message.channel.send('You do not have enough credits for that.');
					} else {
						if (asset.number == 1) {
							var updateCredits = foundUser.realmCredits - asset.price * args[2];
							var updateAsset = foundUser.food + args[2];
							Realm.findOneAndUpdate(
								{ userID: foundUser.userID },
								{ food: updateAsset, realmCredits: updateCredits },
								function(err, foundUser) {
									if (err) {
										console.log(err);
									} else {
										message.channel.send('You purchased ' + args[2] + ' of ' + args[1] + '.');
									}
								}
							);
						} else if (asset.number == 2) {
							var updateCredits = foundUser.realmCredits - asset.price * args[2];
							var updateAsset = foundUser.housing + args[2];
							Realm.findOneAndUpdate(
								{ userID: foundUser.userID },
								{ housing: updateAsset, realmCredits: updateCredits },
								function(err, foundUser) {
									if (err) {
										console.log(err);
									} else {
										message.channel.send('You purchased ' + args[2] + ' of ' + args[1] + '.');
									}
								}
							);
						} else if (asset.number == 3) {
							var updateCredits = foundUser.realmCredits - asset.price * args[2];
							var updateAsset = foundUser.naturalResources + args[2];
							Realm.findOneAndUpdate(
								{ userID: foundUser.userID },
								{ naturalResources: updateAsset, realmCredits: updateCredits },
								function(err, foundUser) {
									if (err) {
										console.log(err);
									} else {
										message.channel.send('You purchased ' + args[2] + ' of ' + args[1] + '.');
									}
								}
							);
						} else if (asset.number == 4) {
							var updateCredits = foundUser.realmCredits - asset.price * args[2];
							var updateAsset = foundUser.energyProduction + args[2];
							Realm.findOneAndUpdate(
								{ userID: foundUser.userID },
								{ energyProduction: updateAsset, realmCredits: updateCredits },
								function(err, foundUser) {
									if (err) {
										console.log(err);
									} else {
										message.channel.send('You purchased ' + args[2] + ' of ' + args[1] + '.');
									}
								}
							);
						} else if (asset.number == 5) {
							var updateCredits = foundUser.realmCredits - asset.price * args[2];
							var updateAsset = foundUser.education + args[2];
							Realm.findOneAndUpdate(
								{ userID: foundUser.userID },
								{ education: updateAsset, realmCredits: updateCredits },
								function(err, foundUser) {
									if (err) {
										console.log(err);
									} else {
										message.channel.send('You purchased ' + args[2] + ' of ' + args[1] + '.');
									}
								}
							);
						} else if (asset.number == 6) {
							var updateCredits = foundUser.realmCredits - asset.price * args[2];
							var updateAsset = foundUser.scientificResearch + args[2];
							Realm.findOneAndUpdate(
								{ userID: foundUser.userID },
								{ scientificResearch: updateAsset, realmCredits: updateCredits },
								function(err, foundUser) {
									if (err) {
										console.log(err);
									} else {
										message.channel.send('You purchased ' + args[2] + ' of ' + args[1] + '.');
									}
								}
							);
						} else if (asset.number == 7) {
							var updateCredits = foundUser.realmCredits - asset.price * args[2];
							var updateAsset = foundUser.entertainment + args[2];
							Realm.findOneAndUpdate(
								{ userID: foundUser.userID },
								{ entertainment: updateAsset, realmCredits: updateCredits },
								function(err, foundUser) {
									if (err) {
										console.log(err);
									} else {
										message.channel.send('You purchased ' + args[2] + ' of ' + args[1] + '.');
									}
								}
							);
						} else if (asset.number == 8) {
							var updateCredits = foundUser.realmCredits - asset.price * args[2];
							var updateAsset = foundUser.government + args[2];
							Realm.findOneAndUpdate(
								{ userID: foundUser.userID },
								{ government: updateAsset, realmCredits: updateCredits },
								function(err, foundUser) {
									if (err) {
										console.log(err);
									} else {
										message.channel.send('You purchased ' + args[2] + ' of ' + args[1] + '.');
									}
								}
							);
						}
					}
				}
			});
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
		}
	});
};

realm.time = function(message, player) {
	var lastLogin = Date.now();
	var timeDifference = lastLogin - player.date.lastLogin;
	timeDifference = Math.round(timeDifference / 60000);
	if (timeDifference <= 0) {
		message.channel.send('Please wait a little longer to check on your progress.');
		return;
	}
	message.channel.send('It has been roughly ' + timeDifference + ' minute(s) since you last checked your progress.');
	Realm.findOneAndUpdate({ userID: player.userID }, { date: { lastLogin: lastLogin } }, function(err, foundUser) {
		if (err) {
			console.log(err);
		}
	});
};
