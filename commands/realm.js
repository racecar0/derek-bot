const { Client, Attachment, Collection } = require('discord.js'),
	User = require('../models/user'),
	Realm = require('../models/realm'),
	events = require('../data/realmevents.json'),
	shop = require('../data/realmshop.json'),
	populationlevels = require('../data/populationrate.json'),
	mongoose = require('mongoose');

//Notes
//Seconds in a day: 86400
//Seconds in an hour: 3600
var realm = {};
realm.sort = function(message, player, args) {
	//sort between weapons, armor, medication, special
	if (args === undefined) {
		message.channel.send('Please specify what you would like to do. Use "!realm help" for options.');
	} else if (args[0] === 'status') {
		realm.status(message, player);
	} else if (args[0] === 'false') {
		realm.false(message, player);
	} else if (args[0] === 'check') {
		realm.check(message, player);
	} else if (args[0] === 'buy') {
		realm.shop(message, player, args);
	} else if (args[0] === 'help') {
		realm.help(message, player);
	} else {
		message.channel.send('Please specify what you would like to do. Use "!realm help" for options.');
	}
};

realm.status = function(message, player) {
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
				population: 1000000,
				food: 2000000,
				housing: 750000,
				naturalResources: 500000,
				energyProduction: 900000,
				education: 100000,
				scientificResearch: 100,
				entertainment: 0,
				government: 1000,
				realmCredits: 1000000,
				realmEnergy: 1000000,
				realmResources: 1000000,
				taxRate: 10
			};
			Realm.create(newPlayer, (err, newUser) => {
				if (err) console.log(err);
			});
			message.channel.send(
				'So you have chosen the life of a politician, eh?\nWelcome to Realm!\n\nYou have purchased a discount planet that could use some good guidance.\nUse "!realm help" to see the commands.'
			);
		} else if (userFound[0].userID == message.author.id) {
			var time = realm.time(message, userFound[0]);
			realm.income(message, userFound[0], time);
		} else {
			console.log(userFound[0]);
			console.log(message.author.id);
			message.channel.send('Something weird happened. @Racecar0 Go check the console.');
		}
	});
};

realm.help = function(message, player) {
	message.channel.send(
		'I... uhh... have not fully built the help file yet. Current list of !realm arguments:\ncheck (look at your stuff)\nbuy (can take additional arguments for purchases)\nstatus (how you will take a turn)\nhelp (you are looking at it)'
	);
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
				'```css\nRealm Owner: ' +
				foundUser.username +
				'\n|Current Assets      |Quantity            |\n|--------------------|--------------------|\n|' +
				shop[0].name +
				' '.repeat(20 - shop[0].name.length) +
				'|' +
				foundUser.food +
				' '.repeat(20 - foundUser.food.toString().length) +
				'|\n|' +
				shop[1].name +
				' '.repeat(20 - shop[1].name.length) +
				'|' +
				foundUser.housing +
				' '.repeat(20 - foundUser.housing.toString().length) +
				'|\n|' +
				shop[2].name +
				' '.repeat(20 - shop[2].name.length) +
				'|' +
				foundUser.naturalResources +
				' '.repeat(20 - foundUser.naturalResources.toString().length) +
				'|\n|' +
				shop[3].name +
				' '.repeat(20 - shop[3].name.length) +
				'|' +
				foundUser.energyProduction +
				' '.repeat(20 - foundUser.energyProduction.toString().length) +
				'|\n|' +
				shop[4].name +
				' '.repeat(20 - shop[4].name.length) +
				'|' +
				foundUser.education +
				' '.repeat(20 - foundUser.education.toString().length) +
				'|\n|' +
				shop[5].name +
				' '.repeat(20 - shop[5].name.length) +
				'|' +
				foundUser.scientificResearch +
				' '.repeat(20 - foundUser.scientificResearch.toString().length) +
				'|\n|' +
				shop[6].name +
				' '.repeat(20 - shop[6].name.length) +
				'|' +
				foundUser.entertainment +
				' '.repeat(20 - foundUser.entertainment.toString().length) +
				'|\n|' +
				shop[7].name +
				' '.repeat(20 - shop[7].name.length) +
				'|' +
				foundUser.government +
				' '.repeat(20 - foundUser.government.toString().length) +
				'|\n';

			checkString +=
				'|--------------------|--------------------|\nCurrent Tax Rate: ' +
				foundUser.taxRate +
				'%\nAvailable Credits: ' +
				foundUser.realmCredits +
				'\nAvailable Energy: ' +
				foundUser.realmEnergy +
				'\nAvailable Resources: ' +
				foundUser.realmResources +
				'```';
			message.channel.send(checkString);
			//Add estimated upkeep costs based on current assets.
		}
	});
};

realm.shop = function(message, player, args) {
	Realm.findOne({ userID: player.userID }, function(err, foundUser) {
		if (args[1] == undefined) {
			var shopString = '```css\n|#|Buy Assets          |Price     |\n|-|--------------------|----------|\n';
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
							var updateAsset = foundUser.food + parseInt(args[2]);
							Realm.findOneAndUpdate(
								{ userID: foundUser.userID },
								{ food: updateAsset, realmCredits: updateCredits },
								function(err, foundUser) {
									if (err) {
										console.log(err);
									} else {
										message.channel.send('You purchased ' + args[2] + ' of ' + asset.name + '.');
									}
								}
							);
						} else if (asset.number == 2) {
							var updateCredits = foundUser.realmCredits - asset.price * args[2];
							var updateAsset = foundUser.housing + parseInt(args[2]);
							Realm.findOneAndUpdate(
								{ userID: foundUser.userID },
								{ housing: updateAsset, realmCredits: updateCredits },
								function(err, foundUser) {
									if (err) {
										console.log(err);
									} else {
										message.channel.send('You purchased ' + args[2] + ' of ' + asset.name + '.');
									}
								}
							);
						} else if (asset.number == 3) {
							var updateCredits = foundUser.realmCredits - asset.price * args[2];
							var updateAsset = foundUser.naturalResources + parseInt(args[2]);
							Realm.findOneAndUpdate(
								{ userID: foundUser.userID },
								{ naturalResources: updateAsset, realmCredits: updateCredits },
								function(err, foundUser) {
									if (err) {
										console.log(err);
									} else {
										message.channel.send('You purchased ' + args[2] + ' of ' + asset.name + '.');
									}
								}
							);
						} else if (asset.number == 4) {
							var updateCredits = foundUser.realmCredits - asset.price * args[2];
							var updateAsset = foundUser.energyProduction + parseInt(args[2]);
							Realm.findOneAndUpdate(
								{ userID: foundUser.userID },
								{ energyProduction: updateAsset, realmCredits: updateCredits },
								function(err, foundUser) {
									if (err) {
										console.log(err);
									} else {
										message.channel.send('You purchased ' + args[2] + ' of ' + asset.name + '.');
									}
								}
							);
						} else if (asset.number == 5) {
							var updateCredits = foundUser.realmCredits - asset.price * args[2];
							var updateAsset = foundUser.education + parseInt(args[2]);
							Realm.findOneAndUpdate(
								{ userID: foundUser.userID },
								{ education: updateAsset, realmCredits: updateCredits },
								function(err, foundUser) {
									if (err) {
										console.log(err);
									} else {
										message.channel.send('You purchased ' + args[2] + ' of ' + asset.name + '.');
									}
								}
							);
						} else if (asset.number == 6) {
							var updateCredits = foundUser.realmCredits - asset.price * args[2];
							var updateAsset = foundUser.scientificResearch + parseInt(args[2]);
							Realm.findOneAndUpdate(
								{ userID: foundUser.userID },
								{ scientificResearch: updateAsset, realmCredits: updateCredits },
								function(err, foundUser) {
									if (err) {
										console.log(err);
									} else {
										message.channel.send('You purchased ' + args[2] + ' of ' + asset.name + '.');
									}
								}
							);
						} else if (asset.number == 7) {
							var updateCredits = foundUser.realmCredits - asset.price * args[2];
							var updateAsset = foundUser.entertainment + parseInt(args[2]);
							Realm.findOneAndUpdate(
								{ userID: foundUser.userID },
								{ entertainment: updateAsset, realmCredits: updateCredits },
								function(err, foundUser) {
									if (err) {
										console.log(err);
									} else {
										message.channel.send('You purchased ' + args[2] + ' of ' + asset.name + '.');
									}
								}
							);
						} else if (asset.number == 8) {
							var updateCredits = foundUser.realmCredits - asset.price * args[2];
							var updateAsset = foundUser.government + parseInt(args[2]);
							Realm.findOneAndUpdate(
								{ userID: foundUser.userID },
								{ government: updateAsset, realmCredits: updateCredits },
								function(err, foundUser) {
									if (err) {
										console.log(err);
									} else {
										message.channel.send('You purchased ' + args[2] + ' of ' + asset.name + '.');
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
	Realm.findOne({ userID: player.userID }, function(err, foundUser) {
		if (err) {
			console.log(err);
		} else {
			const randomEvent = Math.floor(Math.random() * 2),
				event = events[randomEvent];
			updateCredits = Math.round(foundUser.realmCredits * event.credits);
			message.channel.send(
				event.eventText + '\nYou gained ' + (updateCredits - foundUser.realmCredits) + ' credits.'
			);
			Realm.findOneAndUpdate({ userID: foundUser.userID }, { realmCredits: updateCredits }, function(
				err,
				foundUser
			) {
				if (err) {
					console.log(err);
				}
			});
		}
	});
};

realm.time = function(message, player) {
	var lastLogin = Date.now();
	var timeDifference = lastLogin - player.date.lastLogin;
	timeDifference = Math.round(timeDifference / 60000);
	if (timeDifference <= 0) {
		message.channel.send('Please wait a little longer to check on your progress.');
		return 0;
	}
	message.channel.send('It has been roughly ' + timeDifference + ' minute(s) since you last checked your progress.');
	Realm.findOneAndUpdate({ userID: player.userID }, { date: { lastLogin: lastLogin } }, function(err, foundUser) {
		if (err) {
			console.log(err);
		}
	});
	return timeDifference;
};

realm.income = function(message, player, time) {
	Realm.findOne({ userID: player.userID }, function(err, foundUser) {
		if (err) {
			console.log(err);
		} else {
			//Calculate production value of all assets.
			//Food
			var updateCredits = Math.round(shop[0].incomeCredits * foundUser.food * (time / 1440));
			var updateEnergy = Math.round(shop[0].incomeEnergy * foundUser.food * (time / 1440));
			var updateResources = Math.round(shop[0].incomeResources * foundUser.food * (time / 1440));
			//Housing
			updateCredits += Math.round(shop[1].incomeCredits * foundUser.housing * (time / 1440));
			updateEnergy += Math.round(shop[1].incomeEnergy * foundUser.housing * (time / 1440));
			updateResources += Math.round(shop[1].incomeResources * foundUser.housing * (time / 1440));
			//Natural Resources
			updateCredits += Math.round(shop[2].incomeCredits * foundUser.naturalResources * (time / 1440));
			updateEnergy += Math.round(shop[2].incomeEnergy * foundUser.naturalResources * (time / 1440));
			updateResources += Math.round(shop[2].incomeResources * foundUser.naturalResources * (time / 1440));
			//Energy Production
			updateCredits += Math.round(shop[3].incomeCredits * foundUser.energyProduction * (time / 1440));
			updateEnergy += Math.round(shop[3].incomeEnergy * foundUser.energyProduction * (time / 1440));
			updateResources += Math.round(shop[3].incomeResources * foundUser.energyProduction * (time / 1440));
			//Education
			updateCredits += Math.round(shop[4].incomeCredits * foundUser.education * (time / 1440));
			updateEnergy += Math.round(shop[4].incomeEnergy * foundUser.education * (time / 1440));
			updateResources += Math.round(shop[4].incomeResources * foundUser.education * (time / 1440));
			//Scientific Research
			updateCredits += Math.round(shop[5].incomeCredits * foundUser.scientificResearch * (time / 1440));
			updateEnergy += Math.round(shop[5].incomeEnergy * foundUser.scientificResearch * (time / 1440));
			updateResources += Math.round(shop[5].incomeResources * foundUser.scientificResearch * (time / 1440));
			//Entertainment
			updateCredits += Math.round(shop[6].incomeCredits * foundUser.entertainment * (time / 1440));
			updateEnergy += Math.round(shop[6].incomeEnergy * foundUser.entertainment * (time / 1440));
			updateResources += Math.round(shop[6].incomeResources * foundUser.entertainment * (time / 1440));
			//Government
			updateCredits += Math.round(shop[7].incomeCredits * foundUser.government * (time / 1440));
			updateEnergy += Math.round(shop[7].incomeEnergy * foundUser.government * (time / 1440));
			updateResources += Math.round(shop[7].incomeResources * foundUser.government * (time / 1440));
			//Taxes
			updateCredits += Math.round(foundUser.population * (foundUser.taxRate / 100) * (time / 1440));
			//Calculations
			message.channel.send(
				'You gained ' +
					updateCredits +
					' credits, ' +
					updateEnergy +
					' energy, and ' +
					updateResources +
					' resources.'
			);
			updateCredits += foundUser.realmCredits;
			updateEnergy += foundUser.realmEnergy;
			updateResources += foundUser.realmResources;
			Realm.findOneAndUpdate(
				{ userID: foundUser.userID },
				{ realmCredits: updateCredits, realmEnergy: updateEnergy, realmResources: updateResources },
				function(err, foundUser) {
					if (err) {
						console.log(err);
					} else {
						realm.upkeep(message, foundUser);
					}
				}
			);
		}
	});
};

realm.upkeep = function(message, player, time) {
	message.channel.send('Would you like to perform Realm upkeep automatically?').then((sent) => {
		// 'sent' is that message you just sent
		sent.react('👍').then(() => sent.react('👎'));

		const filter = (reaction, user) => {
			return [ '👍', '👎' ].includes(reaction.emoji.name) && user.id === message.author.id;
		};

		sent
			.awaitReactions(filter, { max: 1, time: 60000, errors: [ 'time' ] })
			.then((collected) => {
				const reaction = collected.first();
				setTimeout(() => {
					if (reaction.emoji.name === '👍') {
						sent.clearReactions();
						realm.autoUpkeep(message, player, time);
					} else if (reaction.emoji.name === '👎') {
						sent.clearReactions();
						realm.manualUpkeep(message, player, time);
					}
				}, 2500);
			})
			.catch((collected) => {
				message.channel.send(
					'Either something went wrong, or you did not pick an option. Either way, we will run it automatically for you.'
				);
				sent.clearReactions();
				realm.autoUpkeep(message, player, time);
			});
	});
};

//Calculate costs of each individual set of assets
//Calculate populationRate based on successfully meeting necessary ratios of each asset.
//Adjust population change based on populationRate
realm.autoUpkeep = function(message, player, time) {
	message.channel.send('You have chosen to automatically perform upkeep. Good luck.');
	var upkeepAssets = [
		'food',
		'housing',
		'naturalResources',
		'energyProduction',
		'education',
		'scientificResearch',
		'entertainment',
		'government'
	];
	upkeepAssets.forEach(function(asset, time) {
		Realm.findOne({ userID: player.userID }, function(err, foundUser) {
			if (err) {
				console.log(err);
			} else {
				var updateCredits = Math.round(shop[0].upkeepCredits * foundUser[asset] * (time / 1440));
				var updateEnergy = Math.round(shop[0].upkeepEnergy * foundUser[asset] * (time / 1440));
				var updateResources = Math.round(shop[0].upkeepResources * foundUser[asset] * (time / 1440));
				if (
					foundUser.realmCredits >= updateCredits &&
					foundUser.realmEnergy >= updateEnergy &&
					foundUser.realmResources >= updateResources
				) {
					updateCredits = foundUser.realmCredits - updateCredits;
					updateEnergy = foundUser.realmEnergy - updateEnergy;
					updateResources = foundUser.realmResources - updateResources;
					Realm.findOneAndUpdate(
						{ userID: foundUser.userID },
						{ realmCredits: updateCredits, realmEnergy: updateEnergy, realmResources: updateResources },
						function(err, foundUser) {
							if (err) {
								console.log(err);
							} else {
								message.channel.send('You were able to pay for your ' + asset + '.');
							}
						}
					);
				} else {
					updateCredits = foundUser.realmCredits - updateCredits;
					updateEnergy = foundUser.realmEnergy - updateEnergy;
					updateResources = foundUser.realmResources - updateResources;
					var updateAsset = Math.round(foundUser[asset] * 0.9);
					if (updateCredits <= 0) {
						updateCredits = 0;
					}
					if (updateEnergy <= 0) {
						updateEnergy = 0;
					}
					if (updateResources <= 0) {
						updateResources = 0;
					}
					Realm.findOneAndUpdate(
						{ userID: foundUser.userID },
						{
							realmCredits: updateCredits,
							realmEnergy: updateEnergy,
							realmResources: updateResources,
							[`${asset}`]: updateAsset
						},
						function(err, foundUser) {
							if (err) {
								console.log(err);
							} else {
								message.channel.send(
									'You lost 10% of your ' +
										asset +
										', because you could not fully pay for it. You may want to increase your taxes.'
								);
							}
						}
					);
				}
			}
		});
	});
	setTimeout(() => {
		realm.populationRate(message, player);
	}, 10000);
};

realm.manualUpkeep = function(message, player, time) {
	message.channel.send(
		'You have chosen to manually perform upkeep. But that is not supported yet, so we will just do it automatically anyway.'
	);
	var upkeepAssets = [
		'food',
		'housing',
		'naturalResources',
		'energyProduction',
		'education',
		'scientificResearch',
		'entertainment',
		'government'
	];
	upkeepAssets.forEach(function(asset, time) {
		Realm.findOne({ userID: player.userID }, function(err, foundUser) {
			if (err) {
				console.log(err);
			} else {
				var updateCredits = Math.round(shop[0].upkeepCredits * foundUser[asset] * (time / 1440));
				var updateEnergy = Math.round(shop[0].upkeepEnergy * foundUser[asset] * (time / 1440));
				var updateResources = Math.round(shop[0].upkeepResources * foundUser[asset] * (time / 1440));
				if (
					foundUser.realmCredits >= updateCredits &&
					foundUser.realmEnergy >= updateEnergy &&
					foundUser.realmResources >= updateResources
				) {
					updateCredits = foundUser.realmCredits - updateCredits;
					updateEnergy = foundUser.realmEnergy - updateEnergy;
					updateResources = foundUser.realmResources - updateResources;
					Realm.findOneAndUpdate(
						{ userID: foundUser.userID },
						{ realmCredits: updateCredits, realmEnergy: updateEnergy, realmResources: updateResources },
						function(err, foundUser) {
							if (err) {
								console.log(err);
							} else {
								message.channel.send('You were able to pay for your ' + asset + '.');
							}
						}
					);
				} else {
					updateCredits = foundUser.realmCredits - updateCredits;
					updateEnergy = foundUser.realmEnergy - updateEnergy;
					updateResources = foundUser.realmResources - updateResources;
					var updateAsset = Math.round(foundUser[asset] * 0.9);
					if (updateCredits <= 0) {
						updateCredits = 0;
					}
					if (updateEnergy <= 0) {
						updateEnergy = 0;
					}
					if (updateResources <= 0) {
						updateResources = 0;
					}
					Realm.findOneAndUpdate(
						{ userID: foundUser.userID },
						{
							realmCredits: updateCredits,
							realmEnergy: updateEnergy,
							realmResources: updateResources,
							[`${asset}`]: updateAsset
						},
						function(err, foundUser) {
							if (err) {
								console.log(err);
							} else {
								message.channel.send(
									'You lost 10% of your ' +
										asset +
										', because you could not fully pay for it. You may want to increase your taxes.'
								);
							}
						}
					);
				}
			}
		});
	});
	setTimeout(() => {
		realm.populationRate(message, player);
	}, 10000);
};

realm.populationRate = function(message, player) {
	Realm.findOne({ userID: player.userID }, function(err, foundUser) {
		if (err) {
			console.log(err);
		} else {
			var foodCheck = foundUser.food / foundUser.population * 1000;
			var housingCheck = foundUser.housing / foundUser.population * 1000;
			var energyProductionCheck = foundUser.energyProduction / foundUser.population * 1000;
			var naturalResourcesCheck = foundUser.naturalResources / foundUser.population * 1000;
			var educationCheck = foundUser.education / foundUser.population * 1000;
			var scientificResearchCheck = foundUser.scientificResearch / foundUser.population * 1000;
			var entertainmentCheck = foundUser.entertainment / foundUser.population * 1000;
			var governmentCheck = foundUser.government / foundUser.population * 1000;
			var populationRate = 0;
			if (foodCheck >= 1000) {
				populationRate++;
			}
			if (housingCheck >= 750) {
				populationRate++;
			}
			if (energyProductionCheck >= 900) {
				populationRate++;
			}
			if (naturalResourcesCheck >= 500) {
				populationRate++;
			}
			if (educationCheck >= 750) {
				populationRate++;
			}
			if (scientificResearchCheck >= 250) {
				populationRate++;
			}
			if (entertainmentCheck >= 200) {
				populationRate++;
			}
			if (governmentCheck >= 1) {
				populationRate++;
			}
			var populationChange = foundUser.population * populationlevels[populationRate].minPopulationRate;
			message.channel.send(
				'Your planet is in a state of ' +
					populationlevels[populationRate].name +
					'.\nYour population has been adjusted to ' +
					populationChange +
					'.'
			);
			Realm.findOneAndUpdate(
				{ userID: foundUser.userID },
				{
					population: populationChange
				},
				function(err, foundUser) {
					if (err) {
						console.log(err);
					} else {
						realm.events(message, player);
					}
				}
			);
		}
	});
};
