const { Client, Attachment, Collection } = require('discord.js'),
	monsters = require('../data/monsters.json'),
	levels = require('../data/experience.json'),
	User = require('../models/user'),
	mongoose = require('mongoose');

var fight = {};
//Combat Action
fight.start = (commandMessage, player) => {
	var monstersArray = [];
	for (i = 0; i < monsters.length; i++) {
		if (monsters[i].level <= player.level) {
			monstersArray.push(monsters[i]);
		}
	}
	var iMonster = Math.floor(Math.random() * Math.floor(monstersArray.length));
	var monster = monstersArray[iMonster];
	var turnCount = 0;
	monster.tempHP = monster.hitPoints;
	combat.setup(commandMessage, monster, player, turnCount);
};

module.exports = fight;

//Function Declarations
//COMBAT
var combat = {};
combat.setup = function(commandMessage, monster, player, turnCount) {
	commandMessage.channel
		.send(
			'```http\nFoe: ' +
				monster.name +
				'\nHP: ' +
				monster.tempHP +
				'\n\nPlayer: ' +
				player.username +
				'\nHP: ' +
				player.hitPoints +
				'```'
		)
		.then((sent) => {
			// 'sent' is that message you just sent
			sent
				.react('⚔')
				.then(() => sent.react('👟'))
				.then(() => sent.react('🩹'))
				.then(() => sent.react('❔'))
				.then(() => {
					if (turnCount >= player.specialMove.counter) {
						sent.react('✨');
					}
				});

			const filter = (reaction, user) => {
				return (
					[ '⚔', '👟', '🩹', '❔', '✨' ].includes(reaction.emoji.name) && user.id === commandMessage.author.id
				);
			};

			sent
				.awaitReactions(filter, { max: 1, time: 60000, errors: [ 'time' ] })
				.then((collected) => {
					const reaction = collected.first();

					if (reaction.emoji.name === '⚔') {
						sent.clearReactions();
						combat.attack(commandMessage, monster, player, turnCount, sent);
					} else if (reaction.emoji.name === '👟') {
						sent.clearReactions();
						combat.run(commandMessage, monster, player, turnCount, sent);
					} else if (reaction.emoji.name === '🩹') {
						sent.clearReactions();
						combat.heal(commandMessage, monster, player, turnCount, sent);
					} else if (reaction.emoji.name === '❔') {
						sent.clearReactions();
						combat.status(commandMessage, monster, player, turnCount, sent);
					} else if (reaction.emoji.name === '✨' && turnCount >= player.specialMove.counter) {
						sent.clearReactions();
						combat.special(commandMessage, monster, player, turnCount, sent);
					} else if (reaction.emoji.name === '✨' && turnCount < player.specialMove.counter) {
						commandMessage.channel.send(
							'Either something went wrong or you tried to cheat. Either way, you died.'
						);
						credits.onDeath(commandMessage, player);
					}
				})
				.catch((collected) => {
					commandMessage.channel.send('Combat has timed out. You died to indecision.');
					credits.onDeath(commandMessage, player);
				});
		});
};
combat.edit = function(commandMessage, monster, player, turnCount, sent) {
	sent
		.edit(
			'```http\n' +
				player.combatMessage +
				'\n\nFoe: ' +
				monster.name +
				'\nHP: ' +
				monster.tempHP +
				'\n\nPlayer: ' +
				player.username +
				'\nHP: ' +
				player.hitPoints +
				'```'
		)
		.then((sent) => {
			// 'sent' is that message you just sent
			sent
				.react('⚔')
				.then(() => sent.react('👟'))
				.then(() => sent.react('🩹'))
				.then(() => sent.react('❔'))
				.then(() => {
					if (turnCount >= player.specialMove.counter) {
						sent.react('✨');
					}
				});

			const filter = (reaction, user) => {
				return (
					[ '⚔', '👟', '🩹', '❔', '✨' ].includes(reaction.emoji.name) && user.id === commandMessage.author.id
				);
			};

			sent
				.awaitReactions(filter, { max: 1, time: 60000, errors: [ 'time' ] })
				.then((collected) => {
					const reaction = collected.first();

					if (reaction.emoji.name === '⚔') {
						sent.clearReactions();
						combat.attack(commandMessage, monster, player, turnCount, sent);
					} else if (reaction.emoji.name === '👟') {
						sent.clearReactions();
						combat.run(commandMessage, monster, player, turnCount, sent);
					} else if (reaction.emoji.name === '🩹') {
						sent.clearReactions();
						combat.heal(commandMessage, monster, player, turnCount, sent);
					} else if (reaction.emoji.name === '❔') {
						sent.clearReactions();
						combat.status(commandMessage, monster, player, turnCount, sent);
					} else if (reaction.emoji.name === '✨' && turnCount >= player.specialMove.counter) {
						sent.clearReactions();
						combat.special(commandMessage, monster, player, turnCount, sent);
					} else if (reaction.emoji.name === '✨' && turnCount < player.specialMove.counter) {
						commandMessage.channel.send(
							'Either something went wrong or you tried to cheat. Either way, you died.'
						);
						credits.onDeath(commandMessage, player);
					}
				})
				.catch((collected) => {
					commandMessage.channel.send('Combat has timed out. You died to indecision.');
					credits.onDeath(commandMessage, player);
				});
		});
};

combat.attack = function(commandMessage, monster, player, turnCount, sent) {
	player.damage =
		Math.floor(Math.random() * (player.weapon.damageMax - player.weapon.damageMin + 1)) + player.weapon.damageMin;

	monster.tempHP -= player.damage;

	monster.damage = Math.floor(Math.random() * (monster.damageMax - monster.damageMin + 1)) + monster.damageMin;
	//Player Damage Reduction Calculation
	if (monster.damage - player.armor.damageReduction >= 0) {
		monster.damage -= player.armor.damageReduction;
	} else {
		monster.damage = 0;
	}
	player.hitPoints -= monster.damage;

	player.combatMessage =
		'You swing with your ' +
		player.weapon.name +
		' for ' +
		player.damage +
		' damage.\n' +
		monster.name +
		' swings for ' +
		monster.damage +
		' damage.';

	if (monster.tempHP > 0 && player.hitPoints > 0) {
		turnCount++;
		combat.edit(commandMessage, monster, player, turnCount, sent);
	} else if (player.hitPoints <= 0) {
		commandMessage.channel.send('You are dead.');
		credits.onDeath(commandMessage, player);
	} else {
		commandMessage.channel.send('Victory!');
		credits.onVictory(commandMessage, monster, player);
		experience.onVictory(commandMessage, monster, player);
	}
};

combat.run = function(commandMessage, monster, player, turnCount, sent) {
	const playerRunRate = 100 + player.armor.runModifier;
	const successRate = playerRunRate - monster.runDifficulty;
	var runSuccess = Math.floor(Math.random() * successRate) + 1;
	if (runSuccess >= 40) {
		//success
		sent.edit('```http\nYou have successfully run away from ' + monster.name + '.```');
		sent.clearReactions();
	} else {
		//failure
		monster.damage = Math.floor(Math.random() * (monster.damageMax - monster.damageMin + 1)) + monster.damageMin;
		//Player Damage Reduction Calculation
		if (monster.damage - player.armor.damageReduction >= 0) {
			monster.damage -= player.armor.damageReduction;
		} else {
			monster.damage = 0;
		}
		player.hitPoints -= monster.damage;

		player.combatMessage =
			'You failed to run away!\n' + monster.name + ' swings for ' + monster.damage + ' damage.';

		if (monster.tempHP > 0 && player.hitPoints > 0) {
			turnCount++;
			combat.edit(commandMessage, monster, player, turnCount, sent);
		} else if (player.hitPoints <= 0) {
			commandMessage.channel.send('You are dead.');
			credits.onDeath(commandMessage, player);
		} else {
			commandMessage.channel.send('Victory!');
			credits.onVictory(commandMessage, monster, player);
			experience.onVictory(commandMessage, monster, player);
		}
	}
};

combat.heal = function(commandMessage, monster, player, turnCount, sent) {
	player.healing =
		Math.floor(Math.random() * (player.medication.healingMax - player.medication.healingMin + 1)) +
		player.medication.healingMin;
	player.hitPoints += player.healing;

	monster.damage = Math.floor(Math.random() * (monster.damageMax - monster.damageMin + 1)) + monster.damageMin;
	//Player Damage Reduction Calculation
	if (monster.damage - player.armor.damageReduction >= 0) {
		monster.damage -= player.armor.damageReduction;
	} else {
		monster.damage = 0;
	}
	player.hitPoints -= monster.damage;

	player.combatMessage =
		'You use ' +
		player.medication.name +
		' and heal for ' +
		player.healing +
		' damage.\n' +
		monster.name +
		' swings for ' +
		monster.damage +
		' damage.';

	if (monster.tempHP > 0 && player.hitPoints > 0) {
		turnCount++;
		combat.edit(commandMessage, monster, player, turnCount, sent);
	} else if (player.hitPoints <= 0) {
		commandMessage.channel.send('You are dead.');
		credits.onDeath(commandMessage, player);
	} else {
		commandMessage.channel.send('Victory!');
		credits.onVictory(commandMessage, monster, player);
		experience.onVictory(commandMessage, monster, player);
	}
};

combat.status = function(commandMessage, monster, player, turnCount, sent) {
	player.combatMessage =
		'Attack Damage: ' +
		player.weapon.damageMin +
		'-' +
		player.weapon.damageMax +
		' damage' +
		'\nArmor Rating: ' +
		player.armor.damageReduction +
		'\nRun% Bonus: ' +
		player.armor.runModifier +
		'\nTurns until Special: ' +
		(player.specialMove.counter - turnCount);

	combat.edit(commandMessage, monster, player, turnCount, sent);
};
combat.special = function(commandMessage, monster, player, turnCount, sent) {
	//Needs a better calculation. Might need total revision to system.
	player.damage =
		Math.floor(Math.random() * (player.specialMove.damageMax - player.specialMove.damageMin + 1)) +
		player.specialMove.damageMin;
	player.healing =
		Math.floor(Math.random() * (player.specialMove.healingMax - player.specialMove.healingMin + 1)) +
		player.specialMove.healingMin;
	monster.tempHP -= player.damage;
	player.hitPoints += player.healing;
	turnCount = 0;

	player.combatMessage =
		monster.name +
		' can only stand in awe of your special attack!\n' +
		'You use your ' +
		player.specialMove.name +
		' and deal ' +
		player.damage +
		' damage and heal for ' +
		player.healing +
		' health!!!\n';

	if (monster.tempHP > 0 && player.hitPoints > 0) {
		combat.edit(commandMessage, monster, player, turnCount, sent);
	} else if (player.hitPoints <= 0) {
		commandMessage.channel.send('You are dead.');
		credits.onDeath(commandMessage, player);
	} else {
		commandMessage.channel.send('Victory!');
		credits.onVictory(commandMessage, monster, player);
		experience.onVictory(commandMessage, monster, player);
	}
};

//CREDITS
var credits = {};

credits.onVictory = function(commandMessage, monster, player) {
	var updateCredits = player.credits + monster.credits;
	User.findOneAndUpdate({ userID: player.userID }, { credits: updateCredits }, function(err, foundUser) {
		if (err) {
			console.log(err);
		} else {
			commandMessage.channel.send('You gained ' + monster.credits + ' credits!');
		}
	});
};

credits.onDeath = function(commandMessage, player) {
	var updateCredits = player.credits - Math.floor(player.credits * 0.1);
	User.findOneAndUpdate({ userID: player.userID }, { credits: updateCredits }, function(err, foundUser) {
		if (err) {
			console.log(err);
		} else {
			commandMessage.channel.send('You lost ' + (player.credits - updateCredits) + ' credits when you died!');
		}
	});
};

//EXPERIENCE
var experience = {};
experience.onVictory = function(commandMessage, monster, player) {
	var updateExp = player.experience + monster.experience;
	User.findOneAndUpdate({ userID: player.userID }, { experience: updateExp }, function(err, foundUser) {
		if (err) {
			console.log(err);
		} else {
			commandMessage.channel.send('You gained ' + monster.experience + ' experience.');
			//If the player's experience is greater than the next level's experience requirement AND they are below the level cap
			User.findOne({ userID: player.userID }, function(err, foundUser) {
				if (err) {
					console.log(err);
				} else {
					levelIndex = foundUser.level;
					if (player.experience >= levels[levelIndex].experience && player.level < 10) {
						experience.levelUp(commandMessage, foundUser, levelIndex);
					}
				}
			});
		}
	});
};

experience.levelUp = function(commandMessage, player, levelIndex) {
	newLevel = player.level + 1;
	newHP = levels[levelIndex].hitPoints;
	User.findOneAndUpdate({ userID: player.userID }, { level: newLevel, hitPoints: newHP }, function(err, foundUser) {
		if (err) {
			console.log(err);
		} else {
			commandMessage.channel.send('You leveled up!');
		}
	});
};
