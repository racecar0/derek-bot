const { Client, Attachment, Collection } = require('discord.js'),
	monsters = require('../data/monsters.json'),
	levels = require('../data/experience.json'),
	User = require('../models/user'),
	mongoose = require('mongoose');

var rpg = {};
//Combat Action
rpg.fight = (commandMessage, player) => {
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

module.exports = rpg;

//Function Declarations
//COMBAT
var combat = {};
combat.setup = function(commandMessage, monster, player, turnCount) {
	commandMessage.channel
		.send(
			'Foe: ' +
				monster.name +
				'\nCurrent HP: ' +
				monster.tempHP +
				'\n\nPlayer: ' +
				player.username +
				'\nYour HP: ' +
				player.hitPoints
		)
		.then((sent) => {
			// 'sent' is that message you just sent
			sent
				.react('⚔')
				.then(() => sent.react('🛡'))
				.then(() => sent.react('🩹'))
				.then(() => sent.react('❔'))
				.then(() => {
					if (turnCount >= player.specialMove.counter) {
						sent.react('✨');
					}
				});

			const filter = (reaction, user) => {
				return (
					[ '⚔', '🛡', '🩹', '❔', '✨' ].includes(reaction.emoji.name) && user.id === commandMessage.author.id
				);
			};

			sent
				.awaitReactions(filter, { max: 1, time: 20000, errors: [ 'time' ] })
				.then((collected) => {
					const reaction = collected.first();

					if (reaction.emoji.name === '⚔') {
						combat.attack(commandMessage, monster, player, turnCount);
					} else if (reaction.emoji.name === '🛡') {
						combat.defend(commandMessage, monster, player, turnCount);
					} else if (reaction.emoji.name === '🩹') {
						combat.heal(commandMessage, monster, player, turnCount);
					} else if (reaction.emoji.name === '❔') {
						combat.status(commandMessage, monster, player, turnCount);
					} else if (reaction.emoji.name === '✨') {
						combat.special(commandMessage, monster, player, turnCount);
					}
				})
				.catch((collected) => {
					commandMessage.channel.send('Combat has timed out. You died to indecision.');
					credits.onDeath(commandMessage, player);
				});
		});
};
combat.attack = function(commandMessage, monster, player, turnCount) {
	player.damage =
		Math.floor(Math.random() * (player.weapon.damageMax - player.weapon.damageMin + 1)) + player.weapon.damageMin;
	commandMessage.channel.send(
		'```diff\n- You swing with your ' + player.weapon.name + ' for ' + player.damage + ' damage.\n```'
	);
	monster.tempHP -= player.damage;

	monster.damage = Math.floor(Math.random() * (monster.damageMax - monster.damageMin + 1)) + monster.damageMin;
	//Player Damage Reduction Calculation
	if (monster.damage - player.armor.damageReduction >= 0) {
		monster.damage -= player.armor.damageReduction;
	} else {
		monster.damage = 0;
	}
	commandMessage.channel.send('```diff\n- ' + monster.name + ' swings for ' + monster.damage + ' damage.\n```');
	player.hitPoints -= monster.damage;

	if (monster.tempHP > 0 && player.hitPoints > 0) {
		turnCount++;
		combat.setup(commandMessage, monster, player, turnCount);
	} else if (player.hitPoints <= 0) {
		commandMessage.channel.send('You are dead.');
		credits.onDeath(commandMessage, player);
	} else {
		commandMessage.channel.send('Victory!');
		credits.onVictory(commandMessage, monster, player);
		experience.onVictory(commandMessage, monster, player);
	}
};
combat.defend = function(commandMessage, monster, player, turnCount) {
	monster.damage = Math.floor(Math.random() * (monster.damageMax - monster.damageMin + 1)) + monster.damageMin;
	commandMessage.channel.send('```diff\n- ' + monster.name + ' swings for ' + monster.damage + ' damage.\n```');
	setTimeout(() => {
		commandMessage.channel.send('```yaml\nYou deflect it with your shield.\n```');
	}, 250);
	setTimeout(() => {
		if (monster.tempHP > 0 && player.hitPoints > 0) {
			turnCount++;
			combat.setup(commandMessage, monster, player, turnCount);
		} else if (player.hitPoints <= 0) {
			commandMessage.channel.send('You are dead.');
			credits.onDeath(commandMessage, player);
		} else {
			commandMessage.channel.send('Victory!');
			credits.onVictory(commandMessage, monster, player);
			experience.onVictory(commandMessage, monster, player);
		}
	}, 250);
};
combat.heal = function(commandMessage, monster, player, turnCount) {
	player.healing =
		Math.floor(Math.random() * (player.medication.healingMax - player.medication.healingMin + 1)) +
		player.medication.healingMin;
	commandMessage.channel.send(
		'```diff\n+ You use a ' + player.medication.name + ' and heal for ' + player.healing + ' damage.```'
	);
	player.hitPoints += player.healing;

	monster.damage = Math.floor(Math.random() * (monster.damageMax - monster.damageMin + 1)) + monster.damageMin;
	//Player Damage Reduction Calculation
	if (monster.damage - player.armor.damageReduction >= 0) {
		monster.damage -= player.armor.damageReduction;
	} else {
		monster.damage = 0;
	}
	commandMessage.channel.send('```diff\n- ' + monster.name + ' swings for ' + monster.damage + ' damage.\n```');
	player.hitPoints -= monster.damage;

	if (monster.tempHP > 0 && player.hitPoints > 0) {
		turnCount++;
		combat.setup(commandMessage, monster, player, turnCount);
	} else if (player.hitPoints <= 0) {
		commandMessage.channel.send('You are dead.');
		credits.onDeath(commandMessage, player);
	} else {
		commandMessage.channel.send('Victory!');
		credits.onVictory(commandMessage, monster, player);
		experience.onVictory(commandMessage, monster, player);
	}
};
combat.status = function(commandMessage, monster, player, turnCount) {
	commandMessage.channel.send(
		'Attack Damage: ' +
			player.weapon.damageMin +
			'-' +
			player.weapon.damageMax +
			' damage' +
			'\nArmor Rating: ' +
			player.armor.damageReduction +
			'\nTurns until Special: ' +
			(player.specialMove.counter - turnCount)
	);

	combat.setup(commandMessage, monster, player, turnCount);
};
combat.special = function(commandMessage, monster, player, turnCount) {
	commandMessage.channel.send('```http\n' + monster.name + ' can only stand in awe of your special attack!\n```');
	//Needs a better calculation. Might need total revision to system.
	player.damage =
		Math.floor(Math.random() * (player.specialMove.damageMax - player.specialMove.damageMin + 1)) +
		player.weapon.damageMin;
	player.healing =
		Math.floor(Math.random() * (player.specialMove.healingMax - player.specialMove.healingMin + 1)) +
		player.specialMove.healingMin;
	commandMessage.channel.send(
		'```css\nYou use your ' +
			player.specialMove.name +
			' and deal ' +
			player.damage +
			'damage and heal for ' +
			player.healing +
			' health!!!\n```'
	);
	monster.tempHP -= player.damage;
	player.hitPoints += player.healing;
	turnCount = 0;

	if (monster.tempHP > 0 && player.hitPoints > 0) {
		combat.setup(commandMessage, monster, player, turnCount);
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
	var updateCredits = Math.floor(player.credits / 2);
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
			levelIndex = player.level;
			if (player.experience >= levels[levelIndex].experience && player.level < 10) {
				experience.levelUp(commandMessage, player, levelIndex);
			}
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
