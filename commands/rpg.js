var rpg = {};
const { Client, Attachment, Collection } = require('discord.js'),
	mongoose = require('mongoose');

//Combat Action
rpg.fight = (commandMessage, player) => {
	//Monster Array Objects
	var monsterArray = [
		{
			name: 'Derek',
			hitPoints: 15,
			damageMin: 1,
			damageMax: 4
		},
		{
			name: 'Glenn',
			hitPoints: 20,
			damageMin: 0,
			damageMax: 6
		},
		{
			name: 'Shawn',
			hitPoints: 25,
			damageMin: 1,
			damageMax: 7
		}
	];
	var iMonster = Math.floor(Math.random() * Math.floor(monsterArray.length));
	var monster = monsterArray[iMonster];
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
					commandMessage.channel.send('Combat has timed out. You forfeit.');
				});
		});
};
combat.attack = function(commandMessage, monster, player, turnCount) {
	player.damage =
		Math.floor(Math.random() * (Math.floor(player.weapon.damageMax) + Math.ceil(player.weapon.damageMin) + 1)) +
		player.weapon.damageMin;
	commandMessage.channel.send(
		'```diff\n- You swing with your ' + player.weapon.name + ' for ' + player.damage + ' damage.\n```'
	);
	monster.hitPoints -= player.damage;

	monster.damage =
		Math.floor(Math.random() * (Math.floor(monster.damageMax) + Math.ceil(monster.damageMin) + 1)) +
		monster.damageMin;
	//Player Damage Reduction Calculation
	if (monster.damage - player.armor.damageReduction >= 0) {
		monster.damage -= player.armor.damageReduction;
	} else {
		monster.damage = 0;
	}
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
	monster.damage =
		Math.floor(Math.random() * (Math.floor(monster.damageMax) + Math.ceil(monster.damageMin) + 1)) +
		monster.damageMin;
	commandMessage.channel.send('```diff\n- ' + monster.name + ' swings for ' + monster.damage + ' damage.\n```');
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
	player.healing =
		Math.floor(
			Math.random() * (Math.floor(player.medication.healingMax) + Math.ceil(player.medication.healingMin) + 1)
		) + player.medication.healingMin;
	commandMessage.channel.send(
		'```diff\n+ You use a ' + player.medication.name + ' and heal for ' + player.healing + ' damage.```'
	);
	player.hitPoints += player.damage;

	monster.damage =
		Math.floor(Math.random() * (Math.floor(monster.damageMax) + Math.ceil(monster.damageMin) + 1)) +
		monster.damageMin;
	//Player Damage Reduction Calculation
	if (monster.damage - player.armor.damageReduction >= 0) {
		monster.damage -= player.armor.damageReduction;
	} else {
		monster.damage = 0;
	}
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
	player.damage = player.specialMove.damageMax;
	commandMessage.channel.send(
		'```css\nYou use your ' + player.specialMove.name + ' for ' + player.damage + ' damage!!!\n```'
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
