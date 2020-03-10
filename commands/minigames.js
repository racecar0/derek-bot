const { Client, Attachment, Collection } = require('discord.js'),
	User = require('../models/user'),
	mongoose = require('mongoose'),
	client = new Client();

var minigames = {};
minigames.yacht = {};

/////////////////
//FLIP MINIGAME//
/////////////////
minigames.flip = function(message, player, args) {
	if (args[0] > player.credits) {
		message.channel.send("You don't have enough credits.");
	} else if (parseInt(args[0]) === NaN) {
		message.channel.send('Please use the correct format: !flip (credits) (choice)');
	} else if (args[1].toLowerCase() !== 'heads' && args[1].toLowerCase() !== 'tails') {
		message.channel.send('Please use the correct format: !flip (credits) (choice)');
	} else {
		var bet = parseInt(args[0]);
		var answer = Math.floor(Math.random() * 2) + 1;
		if (answer === 1 && args[1] === 'heads') {
			var updateCredits = player.credits + bet;
			User.findOneAndUpdate({ userID: player.userID }, { credits: updateCredits }, function(err, foundUser) {
				if (err) {
					console.log(err);
				} else {
					message.channel.send('You flipped heads!\nYou won ' + bet + ' credits!');
				}
			});
		} else if (answer === 2 && args[1] === 'tails') {
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

//////////////////
//YACHT MINIGAME//
//////////////////
minigames.yacht.init = (message, player) => {
	//Setup
	var scoreboard = {};
	scoreboard.onesScore = 0;
	scoreboard.twosScore = 0;
	scoreboard.threesScore = 0;
	scoreboard.foursScore = 0;
	scoreboard.fivesScore = 0;
	scoreboard.sixesScore = 0;
	scoreboard.bonusScore = 0;
	scoreboard.threeKindScore = 0;
	scoreboard.fourKindScore = 0;
	scoreboard.fullHouseScore = 0;
	scoreboard.smallStraightScore = 0;
	scoreboard.bigStraightScore = 0;
	scoreboard.chanceScore = 0;
	scoreboard.yachtScore = 0;
	scoreboard.leftScore = 0;
	scoreboard.rightScore = 0;
	scoreboard.grandTotalScore = 0;
	var rollsLeft = 3;
	scoreboard.display =
		'```cs\nWelcome to Yacht!\n|-------|---|---------------|---|\n|Ones   |' +
		' '.repeat(3 - scoreboard.onesScore.toString().length) +
		scoreboard.onesScore +
		'|Three of a Kind|' +
		' '.repeat(3 - scoreboard.threeKindScore.toString().length) +
		scoreboard.threeKindScore +
		'|\n' +
		'|Twos   |' +
		' '.repeat(3 - scoreboard.twosScore.toString().length) +
		scoreboard.twosScore +
		'|Four of a Kind |' +
		' '.repeat(3 - scoreboard.fourKindScore.toString().length) +
		scoreboard.fourKindScore +
		'|\n' +
		'|Threes |' +
		' '.repeat(3 - scoreboard.threesScore.toString().length) +
		scoreboard.threesScore +
		'|Full House     |' +
		' '.repeat(3 - scoreboard.fullHouseScore.toString().length) +
		scoreboard.fullHouseScore +
		'|\n' +
		'|Fours  |' +
		' '.repeat(3 - scoreboard.foursScore.toString().length) +
		scoreboard.foursScore +
		'|Small Straight |' +
		' '.repeat(3 - scoreboard.smallStraightScore.toString().length) +
		scoreboard.smallStraightScore +
		'|\n' +
		'|Fives  |' +
		' '.repeat(3 - scoreboard.fivesScore.toString().length) +
		scoreboard.fivesScore +
		'|Big Straight   |' +
		' '.repeat(3 - scoreboard.bigStraightScore.toString().length) +
		scoreboard.bigStraightScore +
		'|\n' +
		'|Sixes  |' +
		' '.repeat(3 - scoreboard.sixesScore.toString().length) +
		scoreboard.sixesScore +
		'|Chance         |' +
		' '.repeat(3 - scoreboard.chanceScore.toString().length) +
		scoreboard.chanceScore +
		'|\n' +
		'|Bonus* |' +
		' '.repeat(3 - scoreboard.bonusScore.toString().length) +
		scoreboard.bonusScore +
		'|Yacht          |' +
		' '.repeat(3 - scoreboard.yachtScore.toString().length) +
		scoreboard.yachtScore +
		'|\n|-------|---|---------------|---|\n*35 Bonus Points when Left Score >= 63\n\n|-----------|---|\n' +
		'|Left Score |' +
		' '.repeat(3 - scoreboard.leftScore.toString().length) +
		scoreboard.leftScore +
		'|\n|Right Score|' +
		' '.repeat(3 - scoreboard.rightScore.toString().length) +
		scoreboard.rightScore +
		'|\n|Grand Total|' +
		' '.repeat(3 - scoreboard.grandTotalScore.toString().length) +
		scoreboard.grandTotalScore +
		'|\n|-----------|---|\nRolls left: ' +
		rollsLeft +
		'```';

	//Dice Emojis
	const emojiDiceOne = '<:diceone:685534612083966061>',
		emojiDiceTwo = '<:dicetwo:685534641070931991>',
		emojiDiceThree = '<:dicethree:685534669923811328>',
		emojiDiceFour = '<:dicefour:685534688785334308>',
		emojiDiceFive = '<:dicefive:685534715448524815>',
		emojiDiceSix = '<:dicesix:685534733802930212>';
	const reactDiceOne = '685534612083966061',
		reactDiceTwo = '685534641070931991',
		reactDiceThree = '685534669923811328',
		reactDiceFour = '685534688785334308',
		reactDiceFive = '685534715448524815',
		reactDiceSix = '685534733802930212';
	//Take a Bet (NYI)
	//Roll Dice
	var hold = [ false, false, false, false, false ];
	var diceObj = {};
	diceObj.result = [ 0, 0, 0, 0, 0 ];
	diceObj.images = [ emojiDiceOne, emojiDiceTwo, emojiDiceThree, emojiDiceFour, emojiDiceFive, emojiDiceSix ];
	diceObj.display = [ emojiDiceOne, emojiDiceTwo, emojiDiceThree, emojiDiceFour, emojiDiceFive ];

	var rolledDiceObj = minigames.yacht.rollDice(hold, diceObj);
	//Display
	message.channel.send('Welcome to Yacht!').then((scoreboardSent) => {
		minigames.yacht.display(message, player, rolledDiceObj, hold, scoreboard, rollsLeft, scoreboardSent);
	});

	//End
};

//Functions
minigames.yacht.display = (message, player, diceObj, hold, scoreboard, rollsLeft, scoreboardSent) => {
	//Display
	scoreboard.display =
		'```cs\nWelcome to Yacht!\n|-------|---|---------------|---|\n|Ones   |' +
		' '.repeat(3 - scoreboard.onesScore.toString().length) +
		scoreboard.onesScore +
		'|Three of a Kind|' +
		' '.repeat(3 - scoreboard.threeKindScore.toString().length) +
		scoreboard.threeKindScore +
		'|\n' +
		'|Twos   |' +
		' '.repeat(3 - scoreboard.twosScore.toString().length) +
		scoreboard.twosScore +
		'|Four of a Kind |' +
		' '.repeat(3 - scoreboard.fourKindScore.toString().length) +
		scoreboard.fourKindScore +
		'|\n' +
		'|Threes |' +
		' '.repeat(3 - scoreboard.threesScore.toString().length) +
		scoreboard.threesScore +
		'|Full House     |' +
		' '.repeat(3 - scoreboard.fullHouseScore.toString().length) +
		scoreboard.fullHouseScore +
		'|\n' +
		'|Fours  |' +
		' '.repeat(3 - scoreboard.foursScore.toString().length) +
		scoreboard.foursScore +
		'|Small Straight |' +
		' '.repeat(3 - scoreboard.smallStraightScore.toString().length) +
		scoreboard.smallStraightScore +
		'|\n' +
		'|Fives  |' +
		' '.repeat(3 - scoreboard.fivesScore.toString().length) +
		scoreboard.fivesScore +
		'|Big Straight   |' +
		' '.repeat(3 - scoreboard.bigStraightScore.toString().length) +
		scoreboard.bigStraightScore +
		'|\n' +
		'|Sixes  |' +
		' '.repeat(3 - scoreboard.sixesScore.toString().length) +
		scoreboard.sixesScore +
		'|Chance         |' +
		' '.repeat(3 - scoreboard.chanceScore.toString().length) +
		scoreboard.chanceScore +
		'|\n' +
		'|Bonus* |' +
		' '.repeat(3 - scoreboard.bonusScore.toString().length) +
		scoreboard.bonusScore +
		'|Yacht          |' +
		' '.repeat(3 - scoreboard.yachtScore.toString().length) +
		scoreboard.yachtScore +
		'|\n|-------|---|---------------|---|\n*35 Bonus Points when Left Score >= 63\n\n|-----------|---|\n' +
		'|Left Score |' +
		' '.repeat(3 - scoreboard.leftScore.toString().length) +
		scoreboard.leftScore +
		'|\n|Right Score|' +
		' '.repeat(3 - scoreboard.rightScore.toString().length) +
		scoreboard.rightScore +
		'|\n|Grand Total|' +
		' '.repeat(3 - scoreboard.grandTotalScore.toString().length) +
		scoreboard.grandTotalScore +
		'|\n|-----------|---|\nRolls left: ' +
		rollsLeft +
		'```';
	scoreboardSent.edit(scoreboard.display).then((scoreboardSent) => {
		if (rollsLeft > 0) {
			message.channel.send(diceObj.display).then((diceSent) => {
				diceSent
					.react('1️⃣')
					.then(() => diceSent.react('2️⃣'))
					.then(() => diceSent.react('3️⃣'))
					.then(() => diceSent.react('4️⃣'))
					.then(() => diceSent.react('5️⃣'))
					.then(() => diceSent.react('🇦'))
					.then(() => diceSent.react('✏'));
				const filter = (reaction, user) => {
					return (
						[ '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '🇦', '✏' ].includes(reaction.emoji.name) &&
						user.id === message.author.id
					);
				};
				diceSent
					.awaitReactions(filter, { max: 5, time: 30000 })
					.then((collected) => {
						let skipRolls = false;
						var reactions = collected.array();
						reactions.forEach((reaction) => {
							if (reaction.emoji.name === '1️⃣') {
								hold[0] = true;
							} else if (reaction.emoji.name === '2️⃣') {
								hold[1] = true;
							} else if (reaction.emoji.name === '3️⃣') {
								hold[2] = true;
							} else if (reaction.emoji.name === '4️⃣') {
								hold[3] = true;
							} else if (reaction.emoji.name === '5️⃣') {
								hold[4] = true;
							} else if (reaction.emoji.name === '🇦') {
								hold = [ false, false, false, false, false ];
							} else if (reaction.emoji.name === '✏') {
								diceSent.delete();
								hold = [ false, false, false, false, false ];
								skipRolls = true;
								minigames.yacht.diceCheck(
									message,
									player,
									diceObj,
									hold,
									scoreboard,
									rollsLeft,
									scoreboardSent
								);
							}
						});
						if (skipRolls === false) {
							var rolledDiceObj = minigames.yacht.rollDice(hold, diceObj);
							rollsLeft -= 1;
							hold = [ false, false, false, false, false ];
							diceSent.delete();
							minigames.yacht.display(
								message,
								player,
								rolledDiceObj,
								hold,
								scoreboard,
								rollsLeft,
								scoreboardSent
							);
						}
					})
					.catch((collected) => {
						message.channel.send('Something went horribly, horribly wrong here.');
					});
			});
		} else {
			minigames.yacht.diceCheck(message, player, diceObj, hold, scoreboard, rollsLeft, scoreboardSent);
		}
	});
};

minigames.yacht.diceCheck = (message, player, diceObj, hold, scoreboard, rollsLeft, scoreboardSent) => {
	message.channel.send('Now it is is time to score.\n' + diceObj.display).then((scoreSent) => {
		scoreSent
			.react('1️⃣')
			.then(() => scoreSent.react('2️⃣'))
			.then(() => scoreSent.react('3️⃣'))
			.then(() => scoreSent.react('4️⃣'))
			.then(() => scoreSent.react('5️⃣'))
			.then(() => scoreSent.react('6️⃣'))
			.then(() => scoreSent.react('🇹'))
			.then(() => scoreSent.react('🇫'))
			.then(() => scoreSent.react('🏠'))
			.then(() => scoreSent.react('⏩'))
			.then(() => scoreSent.react('⏭'))
			.then(() => scoreSent.react('🎰'))
			.then(() => scoreSent.react('🎲'));

		const filter = (reaction, user) => {
			return (
				[ '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '🇹', '🇫', '🏠', '⏩', '⏭', '🎰', '🎲' ].includes(
					reaction.emoji.name
				) && user.id === message.author.id
			);
		};

		scoreSent
			.awaitReactions(filter, { max: 1, time: 30000, errors: [ 'time' ] })
			.then((collected) => {
				const reaction = collected.first();

				rollsLeft = 3;
				scoreboard.display =
					'```cs\nWelcome to Yacht!\n|-------|---|---------------|---|\n|Ones   |' +
					' '.repeat(3 - scoreboard.onesScore.toString().length) +
					scoreboard.onesScore +
					'|Three of a Kind|' +
					' '.repeat(3 - scoreboard.threeKindScore.toString().length) +
					scoreboard.threeKindScore +
					'|\n' +
					'|Twos   |' +
					' '.repeat(3 - scoreboard.twosScore.toString().length) +
					scoreboard.twosScore +
					'|Four of a Kind |' +
					' '.repeat(3 - scoreboard.fourKindScore.toString().length) +
					scoreboard.fourKindScore +
					'|\n' +
					'|Threes |' +
					' '.repeat(3 - scoreboard.threesScore.toString().length) +
					scoreboard.threesScore +
					'|Full House     |' +
					' '.repeat(3 - scoreboard.fullHouseScore.toString().length) +
					scoreboard.fullHouseScore +
					'|\n' +
					'|Fours  |' +
					' '.repeat(3 - scoreboard.foursScore.toString().length) +
					scoreboard.foursScore +
					'|Small Straight |' +
					' '.repeat(3 - scoreboard.smallStraightScore.toString().length) +
					scoreboard.smallStraightScore +
					'|\n' +
					'|Fives  |' +
					' '.repeat(3 - scoreboard.fivesScore.toString().length) +
					scoreboard.fivesScore +
					'|Big Straight   |' +
					' '.repeat(3 - scoreboard.bigStraightScore.toString().length) +
					scoreboard.bigStraightScore +
					'|\n' +
					'|Sixes  |' +
					' '.repeat(3 - scoreboard.sixesScore.toString().length) +
					scoreboard.sixesScore +
					'|Chance         |' +
					' '.repeat(3 - scoreboard.chanceScore.toString().length) +
					scoreboard.chanceScore +
					'|\n' +
					'|Bonus* |' +
					' '.repeat(3 - scoreboard.bonusScore.toString().length) +
					scoreboard.bonusScore +
					'|Yacht          |' +
					' '.repeat(3 - scoreboard.yachtScore.toString().length) +
					scoreboard.yachtScore +
					'|\n|-------|---|---------------|---|\n*35 Bonus Points when Left Score >= 63\n\n|-----------|---|\n' +
					'|Left Score |' +
					' '.repeat(3 - scoreboard.leftScore.toString().length) +
					scoreboard.leftScore +
					'|\n|Right Score|' +
					' '.repeat(3 - scoreboard.rightScore.toString().length) +
					scoreboard.rightScore +
					'|\n|Grand Total|' +
					' '.repeat(3 - scoreboard.grandTotalScore.toString().length) +
					scoreboard.grandTotalScore +
					'|\n|-----------|---|\nRolls left: ' +
					rollsLeft +
					'```';

				if (reaction.emoji.name === '1️⃣') {
					if (scoreboard.onesScore === 0) {
						diceObj.result = diceObj.result.split('');
						//Calculate button score
						for (i = 0; i < diceObj.result.length; i++) {
							if (diceObj.result[i] == 1) {
								scoreboard.onesScore += 1;
							}
						}
						var newTotal = minigames.yacht.calculateTotal(scoreboard);
						var rolledDiceObj = minigames.yacht.rollDice(hold, diceObj);
						scoreSent.delete();
						minigames.yacht.display(
							message,
							player,
							rolledDiceObj,
							hold,
							newTotal,
							rollsLeft,
							scoreboardSent
						);
					}
				} else if (reaction.emoji.name === '2️⃣') {
					if (scoreboard.twosScore === 0) {
						diceObj.result = diceObj.result.split('');
						//Calculate button score
						for (i = 0; i < diceObj.result.length; i++) {
							if (diceObj.result[i] == 2) {
								scoreboard.twosScore += 2;
							}
						}
						var newTotal = minigames.yacht.calculateTotal(scoreboard);
						var rolledDiceObj = minigames.yacht.rollDice(hold, diceObj);
						scoreSent.delete();
						minigames.yacht.display(
							message,
							player,
							rolledDiceObj,
							hold,
							newTotal,
							rollsLeft,
							scoreboardSent
						);
					}
				}
			})
			.catch((collected) => {
				message.channel.send(
					'You must not be paying attention anymore. Go ahead and start up a new game when you are ready.'
				);
			});
	});
};

minigames.yacht.rollDice = (hold, diceObj) => {
	if (typeof diceObj.result === 'string') {
		diceObj.result = diceObj.result.split('');
		for (i = 0; i < diceObj.result.length; i++) {
			diceObj.result[i] = parseInt(diceObj.result[i]);
		}
	}
	if (typeof diceObj.display === 'string') {
		diceObj.display = [];
	}
	for (let i = 0; i < hold.length; i++) {
		if (hold[i] === false) {
			diceObj.result[i] = Math.floor(Math.random() * 6 + 1);
		}
	}
	diceObj.result.sort();
	diceObj.result = diceObj.result.join('');

	for (let i = 0; i < diceObj.result.length; i++) {
		if (diceObj.result[i] == 1) {
			diceObj.display[i] = diceObj.images[0];
		} else if (diceObj.result[i] == 2) {
			diceObj.display[i] = diceObj.images[1];
		} else if (diceObj.result[i] == 3) {
			diceObj.display[i] = diceObj.images[2];
		} else if (diceObj.result[i] == 4) {
			diceObj.display[i] = diceObj.images[3];
		} else if (diceObj.result[i] == 5) {
			diceObj.display[i] = diceObj.images[4];
		} else if (diceObj.result[i] == 6) {
			diceObj.display[i] = diceObj.images[5];
		}
	}
	diceObj.display = diceObj.display.join('');
	return diceObj;
};
minigames.yacht.calculateTotal = (scoreboard) => {
	//Calculate totals
	scoreboard.leftScore = 0;
	scoreboard.rightScore = 0;
	scoreboard.leftScore =
		scoreboard.onesScore +
		scoreboard.twosScore +
		scoreboard.threesScore +
		scoreboard.foursScore +
		scoreboard.fivesScore +
		scoreboard.sixesScore;
	scoreboard.rightScore =
		scoreboard.threeKindScore +
		scoreboard.fourKindScore +
		scoreboard.fullHouseScore +
		scoreboard.smallStraightScore +
		scoreboard.bigStraightScore +
		scoreboard.chanceScore +
		scoreboard.yachtScore;
	if (scoreboard.leftScore > 62) {
		scoreboard.bonusScore = 35;
	}
	scoreboard.leftScore += scoreboard.bonusScore;
	scoreboard.grandTotalScore = scoreboard.leftScore + scoreboard.rightScore;
	return scoreboard;
};

module.exports = minigames;
