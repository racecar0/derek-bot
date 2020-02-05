var rpg = {};
const { Client, Attachment, Collection } = require('discord.js'),
	mongoose = require('mongoose');

//Combat Action
rpg.fight = (commandMessage) => {
	//Monster and Player Objects
	var monster = {
		name: 'Derek',
		hitPoints: 15,
		damageMin: 1,
		damageMax: 5
	};
	var player = {
		name: commandMessage.author.username,
		hitPoints: 15,
		damageMin: 1,
		damageMax: 5,
		shield: 2,
		specialCount: 4
	};
	var turnCount = 0;
	combat.setup(commandMessage, monster, player, turnCount);
};

module.exports = rpg;

//Function Declarations
var combat = {};
combat.setup = function(commandMessage, monster, player, turnCount) {
	commandMessage.channel
		.send(
			'Foe: ' +
				monster.name +
				'\nCurrent HP: ' +
				monster.hitPoints +
				'\n\nPlayer: ' +
				player.name +
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
					if (player.specialCount >= turnCount) {
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
					commandMessage.channel.send('Combat has timed out. You forfeit.');
				});
		});
};
combat.attack = function(commandMessage, monster, player, turnCount) {
	player.damage = Math.floor(Math.random() * player.damageMax + player.damageMin);
	commandMessage.channel.send(
		'```diff\n- ' + commandMessage.author.username + ' swings for ' + player.damage + ' damage.\n```'
	);
	monster.hitPoints -= player.damage;

	monster.damage = Math.floor(Math.random() * monster.damageMax + monster.damageMin);
	commandMessage.channel.send('```diff\n- ' + monster.name + ' swings for ' + monster.damage + ' damage.\n```');
	player.hitPoints -= monster.damage;

	if (monster.hitPoints > 0 && player.hitPoints > 0) {
		turnCount++;
		combat.setup(commandMessage, monster, player, turnCount);
	} else if (player.hitPoints <= 0) {
		commandMessage.channel.send('You are dead.');
	} else {
		commandMessage.channel.send('Victory!');
	}
};
combat.defend = function(commandMessage, monster, player, turnCount) {
	monster.damage = Math.floor(Math.random() * (monster.damageMax - monster.damageMin) + monster.damageMin);
	commandMessage.channel.send('```diff\n- ' + monster.name + ' swings for ' + monster.damage + ' damage.```');
	setTimeout(() => {
		commandMessage.channel.send('```yaml\nYou deflect it with your shield.\n```');
	}, 250);
	setTimeout(() => {
		if (monster.hitPoints > 0 && player.hitPoints > 0) {
			turnCount++;
			combat.setup(commandMessage, monster, player, turnCount);
		} else if (player.hitPoints <= 0) {
			commandMessage.channel.send('You are dead.');
		} else {
			commandMessage.channel.send('Victory!');
		}
	}, 250);
};
combat.heal = function(commandMessage, monster, player, turnCount) {
	player.damage = Math.floor(Math.random() * (player.damageMax - player.damageMin) + player.damageMin);
	commandMessage.channel.send(
		'```diff\n+ ' + commandMessage.author.username + ' heals for ' + player.damage + ' damage.```'
	);
	player.hitPoints += player.damage;

	monster.damage = Math.floor(Math.random() * (monster.damageMax - monster.damageMin) + monster.damageMin);
	commandMessage.channel.send('```diff\n- ' + monster.name + ' swings for ' + monster.damage + ' damage.```');
	player.hitPoints -= monster.damage;

	if (monster.hitPoints > 0 && player.hitPoints > 0) {
		turnCount++;
		combat.setup(commandMessage, monster, player, turnCount);
	} else if (player.hitPoints <= 0) {
		commandMessage.channel.send('You are dead.');
	} else {
		commandMessage.channel.send('Victory!');
	}
};
combat.status = function(commandMessage, monster, player, turnCount) {
	commandMessage.channel.send(
		'Attack Damage: ' +
			player.damageMin +
			'-' +
			player.damageMax +
			' damage' +
			'\nShield Rating: ' +
			player.shield +
			'\nTurns until Special: ' +
			(player.specialCount - turnCount)
	);

	combat.setup(commandMessage, monster, player, turnCount);
};
combat.special = function(commandMessage, monster, player, turnCount) {
	commandMessage.channel.send('```http\n' + monster.name + ' can only stand in awe of your special attack!\n```');

	player.damage = Math.floor(Math.random() * player.damageMax + player.damageMin);
	commandMessage.channel.send(
		'```css\n' +
			commandMessage.author.username +
			' pretends like they know what they are doing for ' +
			player.damageMax +
			' damage!!!\n```'
	);
	monster.hitPoints -= player.damage;
	turnCount = 0;

	if (monster.hitPoints > 0 && player.hitPoints > 0) {
		combat.setup(commandMessage, monster, player, turnCount);
	} else if (player.hitPoints <= 0) {
		commandMessage.channel.send('You are dead.');
	} else {
		commandMessage.channel.send('Victory!');
	}
};
