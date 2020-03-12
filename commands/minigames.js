const { Client, Attachment, Collection } = require('discord.js'),
	User = require('../models/user'),
	Yacht = require('../models/yachtleaderboard'),
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
minigames.yacht.sort = (message, player, args) => {
	if (args === undefined) {
		message.channel.send(
			'Please use one of the following options with the !yacht command:\nEx. !yacht (option)\n\nplay\nrules\nleaderboard\nmyhighscore'
		);
	} else if (args[0] === 'play') {
		minigames.yacht.init(message, player);
	} else if (args[0] === 'rules') {
		message.channel.send('Currently, the rules are the same as Yahtzee. Official Yacht rules coming soon.');
	} else if (args[0] === 'leaderboard') {
		minigames.yacht.displayLeaderboard(message);
	} else if (args[0] === 'myhighscore') {
		minigames.yacht.myHighScore(message, player);
	} else {
		message.channel.send(
			'Please use one of the following options with the !yacht command:\nEx. !yacht (option)\n\nplay\nrules\nleaderboard\nmyhighscore'
		);
	}
};
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
	scoreboard.onesDone = false;
	scoreboard.twosDone = false;
	scoreboard.threesDone = false;
	scoreboard.foursDone = false;
	scoreboard.fivesDone = false;
	scoreboard.sixesDone = false;
	scoreboard.threeKindDone = false;
	scoreboard.fourKindDone = false;
	scoreboard.fullHouseDone = false;
	scoreboard.smStraightDone = false;
	scoreboard.bigStraightDone = false;
	scoreboard.chanceDone = false;
	scoreboard.yachtDone = false;
	scoreboard.onesCheck = '-';
	scoreboard.twosCheck = '-';
	scoreboard.threesCheck = '-';
	scoreboard.foursCheck = '-';
	scoreboard.fivesCheck = '-';
	scoreboard.sixesCheck = '-';
	scoreboard.bonusCheck = '-';
	scoreboard.threeKindCheck = '-';
	scoreboard.fourKindCheck = '-';
	scoreboard.fullHouseCheck = '-';
	scoreboard.smStraightCheck = '-';
	scoreboard.bigStraightCheck = '-';
	scoreboard.chanceCheck = '-';
	scoreboard.yachtCheck = '-';
	var rollsLeft = 2;
	scoreboard.display =
		'```cs\nWelcome to Yacht, ' +
		player.username +
		'!\n|-|-------|---|-|---------------|---|\n|' +
		scoreboard.onesCheck +
		'|Ones   |' +
		' '.repeat(3 - scoreboard.onesScore.toString().length) +
		scoreboard.onesScore +
		'|' +
		scoreboard.threeKindCheck +
		'|Three of a Kind|' +
		' '.repeat(3 - scoreboard.threeKindScore.toString().length) +
		scoreboard.threeKindScore +
		'|\n' +
		'|' +
		scoreboard.twosCheck +
		'|Twos   |' +
		' '.repeat(3 - scoreboard.twosScore.toString().length) +
		scoreboard.twosScore +
		'|' +
		scoreboard.fourKindCheck +
		'|Four of a Kind |' +
		' '.repeat(3 - scoreboard.fourKindScore.toString().length) +
		scoreboard.fourKindScore +
		'|\n' +
		'|' +
		scoreboard.threesCheck +
		'|Threes |' +
		' '.repeat(3 - scoreboard.threesScore.toString().length) +
		scoreboard.threesScore +
		'|' +
		scoreboard.fullHouseCheck +
		'|Full House     |' +
		' '.repeat(3 - scoreboard.fullHouseScore.toString().length) +
		scoreboard.fullHouseScore +
		'|\n' +
		'|' +
		scoreboard.foursCheck +
		'|Fours  |' +
		' '.repeat(3 - scoreboard.foursScore.toString().length) +
		scoreboard.foursScore +
		'|' +
		scoreboard.smStraightCheck +
		'|Small Straight |' +
		' '.repeat(3 - scoreboard.smallStraightScore.toString().length) +
		scoreboard.smallStraightScore +
		'|\n' +
		'|' +
		scoreboard.fivesCheck +
		'|Fives  |' +
		' '.repeat(3 - scoreboard.fivesScore.toString().length) +
		scoreboard.fivesScore +
		'|' +
		scoreboard.bigStraightCheck +
		'|Big Straight   |' +
		' '.repeat(3 - scoreboard.bigStraightScore.toString().length) +
		scoreboard.bigStraightScore +
		'|\n' +
		'|' +
		scoreboard.sixesCheck +
		'|Sixes  |' +
		' '.repeat(3 - scoreboard.sixesScore.toString().length) +
		scoreboard.sixesScore +
		'|' +
		scoreboard.chanceCheck +
		'|Chance         |' +
		' '.repeat(3 - scoreboard.chanceScore.toString().length) +
		scoreboard.chanceScore +
		'|\n' +
		'|' +
		scoreboard.bonusCheck +
		'|Bonus* |' +
		' '.repeat(3 - scoreboard.bonusScore.toString().length) +
		scoreboard.bonusScore +
		'|' +
		scoreboard.yachtCheck +
		'|Yacht          |' +
		' '.repeat(3 - scoreboard.yachtScore.toString().length) +
		scoreboard.yachtScore +
		'|\n|-|-------|---|-|---------------|---|\n*35 Bonus Points when Left Score >= 63\n\n|-----------|---|\n' +
		'|Left Score |' +
		' '.repeat(3 - scoreboard.leftScore.toString().length) +
		scoreboard.leftScore +
		'|\n|Right Score|' +
		' '.repeat(3 - scoreboard.rightScore.toString().length) +
		scoreboard.rightScore +
		'|\n|-----------|---|\n|Grand Total|' +
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
		'```cs\nWelcome to Yacht, ' +
		player.username +
		'!\n|-|-------|---|-|---------------|---|\n|' +
		scoreboard.onesCheck +
		'|Ones   |' +
		' '.repeat(3 - scoreboard.onesScore.toString().length) +
		scoreboard.onesScore +
		'|' +
		scoreboard.threeKindCheck +
		'|Three of a Kind|' +
		' '.repeat(3 - scoreboard.threeKindScore.toString().length) +
		scoreboard.threeKindScore +
		'|\n' +
		'|' +
		scoreboard.twosCheck +
		'|Twos   |' +
		' '.repeat(3 - scoreboard.twosScore.toString().length) +
		scoreboard.twosScore +
		'|' +
		scoreboard.fourKindCheck +
		'|Four of a Kind |' +
		' '.repeat(3 - scoreboard.fourKindScore.toString().length) +
		scoreboard.fourKindScore +
		'|\n' +
		'|' +
		scoreboard.threesCheck +
		'|Threes |' +
		' '.repeat(3 - scoreboard.threesScore.toString().length) +
		scoreboard.threesScore +
		'|' +
		scoreboard.fullHouseCheck +
		'|Full House     |' +
		' '.repeat(3 - scoreboard.fullHouseScore.toString().length) +
		scoreboard.fullHouseScore +
		'|\n' +
		'|' +
		scoreboard.foursCheck +
		'|Fours  |' +
		' '.repeat(3 - scoreboard.foursScore.toString().length) +
		scoreboard.foursScore +
		'|' +
		scoreboard.smStraightCheck +
		'|Small Straight |' +
		' '.repeat(3 - scoreboard.smallStraightScore.toString().length) +
		scoreboard.smallStraightScore +
		'|\n' +
		'|' +
		scoreboard.fivesCheck +
		'|Fives  |' +
		' '.repeat(3 - scoreboard.fivesScore.toString().length) +
		scoreboard.fivesScore +
		'|' +
		scoreboard.bigStraightCheck +
		'|Big Straight   |' +
		' '.repeat(3 - scoreboard.bigStraightScore.toString().length) +
		scoreboard.bigStraightScore +
		'|\n' +
		'|' +
		scoreboard.sixesCheck +
		'|Sixes  |' +
		' '.repeat(3 - scoreboard.sixesScore.toString().length) +
		scoreboard.sixesScore +
		'|' +
		scoreboard.chanceCheck +
		'|Chance         |' +
		' '.repeat(3 - scoreboard.chanceScore.toString().length) +
		scoreboard.chanceScore +
		'|\n' +
		'|-|Bonus* |' +
		' '.repeat(3 - scoreboard.bonusScore.toString().length) +
		scoreboard.bonusScore +
		'|' +
		scoreboard.yachtCheck +
		'|Yacht          |' +
		' '.repeat(3 - scoreboard.yachtScore.toString().length) +
		scoreboard.yachtScore +
		'|\n|-|-------|---|-|---------------|---|\n*35 Bonus Points when Left Score >= 63\n\n|-----------|---|\n' +
		'|Left Score |' +
		' '.repeat(3 - scoreboard.leftScore.toString().length) +
		scoreboard.leftScore +
		'|\n|Right Score|' +
		' '.repeat(3 - scoreboard.rightScore.toString().length) +
		scoreboard.rightScore +
		'|\n|-----------|---|\n|Grand Total|' +
		' '.repeat(3 - scoreboard.grandTotalScore.toString().length) +
		scoreboard.grandTotalScore +
		'|\n|-----------|---|\nRolls left: ' +
		rollsLeft +
		'```';
	scoreboardSent.edit(scoreboard.display).then((scoreboardSent) => {
		if (rollsLeft > 0) {
			message.channel.send(player.username + "'s dice:\n" + diceObj.display).then((diceSent) => {
				diceSent
					.react('1️⃣')
					.then(() => diceSent.react('2️⃣'))
					.then(() => diceSent.react('3️⃣'))
					.then(() => diceSent.react('4️⃣'))
					.then(() => diceSent.react('5️⃣'))
					// .then(() => diceSent.react('🇦'))
					.then(() => diceSent.react('✏'));
				const filter = (reaction, user) => {
					return (
						[ '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '🇦', '✏' ].includes(reaction.emoji.name) &&
						user.id === message.author.id
					);
				};
				diceSent
					.awaitReactions(filter, { max: 5, time: 20000 })
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
								// } else if (reaction.emoji.name === '🇦') {
								// 	hold = [ false, false, false, false, false ];
							} else if (reaction.emoji.name === '✏') {
								diceSent.delete().catch(console.error);
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
							diceSent.delete().catch(console.error);
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
	message.channel.send('Now it is is time to score.').then((scoreSent) => {
		scoreSent
			.edit(
				"Here's the scoring key, " +
					player.username +
					':\n1️⃣=Ones, 2️⃣=Twos, 3️⃣=Threes,\n4️⃣=Fours, 5️⃣=Fives, 6️⃣=Sixes,\n☘=3 of a Kind, 🍀=4 of a Kind,\n🏠=Full House, ⏩=Small Straight, ⏭=Big Straight,\n🎰=Chance, 🚢=Yacht\n' +
					diceObj.display
			)
			.then(() => {
				if (scoreboard.onesDone === false) {
					scoreSent.react('1️⃣');
				}
			})
			.then(() => {
				if (scoreboard.twosDone === false) {
					scoreSent.react('2️⃣');
				}
			})
			.then(() => {
				if (scoreboard.threesDone === false) {
					scoreSent.react('3️⃣');
				}
			})
			.then(() => {
				if (scoreboard.foursDone === false) {
					scoreSent.react('4️⃣');
				}
			})
			.then(() => {
				if (scoreboard.fivesDone === false) {
					scoreSent.react('5️⃣');
				}
			})
			.then(() => {
				if (scoreboard.sixesDone === false) {
					scoreSent.react('6️⃣');
				}
			})
			.then(() => {
				if (scoreboard.threeKindDone === false) {
					scoreSent.react('☘');
				}
			})
			.then(() => {
				if (scoreboard.fourKindDone === false) {
					scoreSent.react('🍀');
				}
			})
			.then(() => {
				if (scoreboard.fullHouseDone === false) {
					scoreSent.react('🏠');
				}
			})
			.then(() => {
				if (scoreboard.smStraightDone === false) {
					scoreSent.react('⏩');
				}
			})
			.then(() => {
				if (scoreboard.bigStraightDone === false) {
					scoreSent.react('⏭');
				}
			})
			.then(() => {
				if (scoreboard.chanceDone === false) {
					scoreSent.react('🎰');
				}
			})
			.then(() => {
				if (scoreboard.yachtDone === false) {
					scoreSent.react('🚢');
				}
			});

		const filter = (reaction, user) => {
			return (
				[ '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '☘', '🍀', '🏠', '⏩', '⏭', '🎰', '🚢' ].includes(
					reaction.emoji.name
				) && user.id === message.author.id
			);
		};

		scoreSent
			.awaitReactions(filter, { max: 1, time: 60000, errors: [ 'time' ] })
			.then((collected) => {
				const reaction = collected.first();

				rollsLeft = 2;
				scoreboard.display =
					'```cs\nWelcome to Yacht, ' +
					player.username +
					'!\n|-|-------|---|-|---------------|---|\n|' +
					scoreboard.onesCheck +
					'|Ones   |' +
					' '.repeat(3 - scoreboard.onesScore.toString().length) +
					scoreboard.onesScore +
					'|' +
					scoreboard.threeKindCheck +
					'|Three of a Kind|' +
					' '.repeat(3 - scoreboard.threeKindScore.toString().length) +
					scoreboard.threeKindScore +
					'|\n' +
					'|' +
					scoreboard.twosCheck +
					'|Twos   |' +
					' '.repeat(3 - scoreboard.twosScore.toString().length) +
					scoreboard.twosScore +
					'|' +
					scoreboard.fourKindCheck +
					'|Four of a Kind |' +
					' '.repeat(3 - scoreboard.fourKindScore.toString().length) +
					scoreboard.fourKindScore +
					'|\n' +
					'|' +
					scoreboard.threesCheck +
					'|Threes |' +
					' '.repeat(3 - scoreboard.threesScore.toString().length) +
					scoreboard.threesScore +
					'|' +
					scoreboard.fullHouseCheck +
					'|Full House     |' +
					' '.repeat(3 - scoreboard.fullHouseScore.toString().length) +
					scoreboard.fullHouseScore +
					'|\n' +
					'|' +
					scoreboard.foursCheck +
					'|Fours  |' +
					' '.repeat(3 - scoreboard.foursScore.toString().length) +
					scoreboard.foursScore +
					'|' +
					scoreboard.smStraightCheck +
					'|Small Straight |' +
					' '.repeat(3 - scoreboard.smallStraightScore.toString().length) +
					scoreboard.smallStraightScore +
					'|\n' +
					'|' +
					scoreboard.fivesCheck +
					'|Fives  |' +
					' '.repeat(3 - scoreboard.fivesScore.toString().length) +
					scoreboard.fivesScore +
					'|' +
					scoreboard.bigStraightCheck +
					'|Big Straight   |' +
					' '.repeat(3 - scoreboard.bigStraightScore.toString().length) +
					scoreboard.bigStraightScore +
					'|\n' +
					'|' +
					scoreboard.sixesCheck +
					'|Sixes  |' +
					' '.repeat(3 - scoreboard.sixesScore.toString().length) +
					scoreboard.sixesScore +
					'|' +
					scoreboard.chanceCheck +
					'|Chance         |' +
					' '.repeat(3 - scoreboard.chanceScore.toString().length) +
					scoreboard.chanceScore +
					'|\n' +
					'|-|Bonus* |' +
					' '.repeat(3 - scoreboard.bonusScore.toString().length) +
					scoreboard.bonusScore +
					'|' +
					scoreboard.yachtCheck +
					'|Yacht          |' +
					' '.repeat(3 - scoreboard.yachtScore.toString().length) +
					scoreboard.yachtScore +
					'|\n|-|-------|---|-|---------------|---|\n*35 Bonus Points when Left Score >= 63\n\n|-----------|---|\n' +
					'|Left Score |' +
					' '.repeat(3 - scoreboard.leftScore.toString().length) +
					scoreboard.leftScore +
					'|\n|Right Score|' +
					' '.repeat(3 - scoreboard.rightScore.toString().length) +
					scoreboard.rightScore +
					'|\n|-----------|---|\n|Grand Total|' +
					' '.repeat(3 - scoreboard.grandTotalScore.toString().length) +
					scoreboard.grandTotalScore +
					'|\n|-----------|---|\nRolls left: ' +
					rollsLeft +
					'```';
				setTimeout(() => {
					if (reaction.emoji.name === '1️⃣') {
						if (scoreboard.onesDone === false) {
							diceObj.result = diceObj.result.split('');
							//Calculate button score
							for (i = 0; i < diceObj.result.length; i++) {
								if (diceObj.result[i] == 1) {
									scoreboard.onesScore += 1;
								}
							}
							var newTotal = minigames.yacht.calculateTotal(scoreboard);
							var rolledDiceObj = minigames.yacht.rollDice(hold, diceObj);
							scoreboard.onesDone = true;
							scoreboard.onesCheck = 'X';
							scoreSent.delete().catch(console.error);
							let gameOver = minigames.yacht.endCheck(scoreboard);
							if (gameOver) {
								minigames.yacht.endScreen(message, scoreboard, scoreboardSent, scoreSent);
							} else {
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
						} else if (scoreboard.onesDone === true) {
							scoreSent.edit("Please don't try to cheat.");
							setTimeout(() => {
								scoreSent.delete().catch(console.error);
								minigames.yacht.diceCheck(
									message,
									player,
									diceObj,
									hold,
									scoreboard,
									rollsLeft,
									scoreboardSent
								);
							}, 3000);
						}
					} else if (reaction.emoji.name === '2️⃣') {
						if (scoreboard.twosDone === false) {
							diceObj.result = diceObj.result.split('');
							//Calculate button score
							for (i = 0; i < diceObj.result.length; i++) {
								if (diceObj.result[i] == 2) {
									scoreboard.twosScore += 2;
								}
							}
							var newTotal = minigames.yacht.calculateTotal(scoreboard);
							var rolledDiceObj = minigames.yacht.rollDice(hold, diceObj);
							scoreboard.twosDone = true;
							scoreboard.twosCheck = 'X';
							scoreSent.delete().catch(console.error);
							let gameOver = minigames.yacht.endCheck(scoreboard);
							if (gameOver) {
								minigames.yacht.endScreen(message, scoreboard, scoreboardSent, scoreSent);
							} else {
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
						} else if (scoreboard.twosDone === true) {
							scoreSent.edit("Please don't try to cheat.");
							setTimeout(() => {
								scoreSent.delete().catch(console.error);
								minigames.yacht.diceCheck(
									message,
									player,
									diceObj,
									hold,
									scoreboard,
									rollsLeft,
									scoreboardSent
								);
							}, 3000);
						}
					} else if (reaction.emoji.name === '3️⃣') {
						if (scoreboard.threesDone === false) {
							diceObj.result = diceObj.result.split('');
							//Calculate button score
							for (i = 0; i < diceObj.result.length; i++) {
								if (diceObj.result[i] == 3) {
									scoreboard.threesScore += 3;
								}
							}
							var newTotal = minigames.yacht.calculateTotal(scoreboard);
							var rolledDiceObj = minigames.yacht.rollDice(hold, diceObj);
							scoreboard.threesDone = true;
							scoreboard.threesCheck = 'X';
							scoreSent.delete().catch(console.error);
							let gameOver = minigames.yacht.endCheck(scoreboard);
							if (gameOver) {
								minigames.yacht.endScreen(message, scoreboard, scoreboardSent, scoreSent);
							} else {
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
						} else if (scoreboard.threesDone === true) {
							scoreSent.edit("Please don't try to cheat.");
							setTimeout(() => {
								scoreSent.delete().catch(console.error);
								minigames.yacht.diceCheck(
									message,
									player,
									diceObj,
									hold,
									scoreboard,
									rollsLeft,
									scoreboardSent
								);
							}, 3000);
						}
					} else if (reaction.emoji.name === '4️⃣') {
						if (scoreboard.foursDone === false) {
							diceObj.result = diceObj.result.split('');
							//Calculate button score
							for (i = 0; i < diceObj.result.length; i++) {
								if (diceObj.result[i] == 4) {
									scoreboard.foursScore += 4;
								}
							}
							var newTotal = minigames.yacht.calculateTotal(scoreboard);
							var rolledDiceObj = minigames.yacht.rollDice(hold, diceObj);
							scoreboard.foursDone = true;
							scoreboard.foursCheck = 'X';
							scoreSent.delete().catch(console.error);
							let gameOver = minigames.yacht.endCheck(scoreboard);
							if (gameOver) {
								minigames.yacht.endScreen(message, scoreboard, scoreboardSent, scoreSent);
							} else {
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
						} else if (scoreboard.foursDone === true) {
							scoreSent.edit("Please don't try to cheat.");
							setTimeout(() => {
								scoreSent.delete().catch(console.error);
								minigames.yacht.diceCheck(
									message,
									player,
									diceObj,
									hold,
									scoreboard,
									rollsLeft,
									scoreboardSent
								);
							}, 3000);
						}
					} else if (reaction.emoji.name === '5️⃣') {
						if (scoreboard.fivesDone === false) {
							diceObj.result = diceObj.result.split('');
							//Calculate button score
							for (i = 0; i < diceObj.result.length; i++) {
								if (diceObj.result[i] == 5) {
									scoreboard.fivesScore += 5;
								}
							}
							var newTotal = minigames.yacht.calculateTotal(scoreboard);
							var rolledDiceObj = minigames.yacht.rollDice(hold, diceObj);
							scoreboard.fivesDone = true;
							scoreboard.fivesCheck = 'X';
							scoreSent.delete().catch(console.error);
							let gameOver = minigames.yacht.endCheck(scoreboard);
							if (gameOver) {
								minigames.yacht.endScreen(message, scoreboard, scoreboardSent, scoreSent);
							} else {
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
						} else if (scoreboard.fivesDone === true) {
							scoreSent.edit("Please don't try to cheat.");
							setTimeout(() => {
								scoreSent.delete().catch(console.error);
								minigames.yacht.diceCheck(
									message,
									player,
									diceObj,
									hold,
									scoreboard,
									rollsLeft,
									scoreboardSent
								);
							}, 3000);
						}
					} else if (reaction.emoji.name === '6️⃣') {
						if (scoreboard.sixesDone === false) {
							diceObj.result = diceObj.result.split('');
							//Calculate button score
							for (i = 0; i < diceObj.result.length; i++) {
								if (diceObj.result[i] == 6) {
									scoreboard.sixesScore += 6;
								}
							}
							var newTotal = minigames.yacht.calculateTotal(scoreboard);
							var rolledDiceObj = minigames.yacht.rollDice(hold, diceObj);
							scoreboard.sixesDone = true;
							scoreboard.sixesCheck = 'X';
							scoreSent.delete().catch(console.error);
							let gameOver = minigames.yacht.endCheck(scoreboard);
							if (gameOver) {
								minigames.yacht.endScreen(message, scoreboard, scoreboardSent, scoreSent);
							} else {
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
						} else if (scoreboard.sixesDone === true) {
							scoreSent.edit("Please don't try to cheat.");
							setTimeout(() => {
								scoreSent.delete().catch(console.error);
								minigames.yacht.diceCheck(
									message,
									player,
									diceObj,
									hold,
									scoreboard,
									rollsLeft,
									scoreboardSent
								);
							}, 3000);
						}
					} else if (reaction.emoji.name === '☘') {
						if (scoreboard.threeKindDone === false) {
							//Calculate button score
							let pattern = /111|222|333|444|555|666/g;
							let result = pattern.test(diceObj.result);
							diceObj.result = diceObj.result.split('');
							if (result === true) {
								diceObj.result.forEach((num) => {
									num = parseInt(num);
									scoreboard.threeKindScore += num;
								});
							} else {
								scoreboard.threeKindScore = 0;
							}
							var newTotal = minigames.yacht.calculateTotal(scoreboard);
							var rolledDiceObj = minigames.yacht.rollDice(hold, diceObj);
							scoreboard.threeKindDone = true;
							scoreboard.threeKindCheck = 'X';
							scoreSent.delete().catch(console.error);
							let gameOver = minigames.yacht.endCheck(scoreboard);
							if (gameOver) {
								minigames.yacht.endScreen(message, scoreboard, scoreboardSent, scoreSent);
							} else {
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
						} else if (scoreboard.threeKindDone === true) {
							scoreSent.edit("Please don't try to cheat.");
							setTimeout(() => {
								scoreSent.delete().catch(console.error);
								minigames.yacht.diceCheck(
									message,
									player,
									diceObj,
									hold,
									scoreboard,
									rollsLeft,
									scoreboardSent
								);
							}, 3000);
						}
					} else if (reaction.emoji.name === '🍀') {
						if (scoreboard.fourKindDone === false) {
							//Calculate button score
							let pattern = /1111|2222|3333|4444|5555|6666/g;
							let result = pattern.test(diceObj.result);
							diceObj.result = diceObj.result.split('');
							if (result === true) {
								diceObj.result.forEach((num) => {
									num = parseInt(num);
									scoreboard.fourKindScore += num;
								});
							} else {
								scoreboard.fourKindScore = 0;
							}
							var newTotal = minigames.yacht.calculateTotal(scoreboard);
							var rolledDiceObj = minigames.yacht.rollDice(hold, diceObj);
							scoreboard.fourKindDone = true;
							scoreboard.fourKindCheck = 'X';
							scoreSent.delete().catch(console.error);
							let gameOver = minigames.yacht.endCheck(scoreboard);
							if (gameOver) {
								minigames.yacht.endScreen(message, scoreboard, scoreboardSent, scoreSent);
							} else {
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
						} else if (scoreboard.fourKindDone === true) {
							scoreSent.edit("Please don't try to cheat.");
							setTimeout(() => {
								scoreSent.delete().catch(console.error);
								minigames.yacht.diceCheck(
									message,
									player,
									diceObj,
									hold,
									scoreboard,
									rollsLeft,
									scoreboardSent
								);
							}, 3000);
						}
					} else if (reaction.emoji.name === '🏠') {
						if (scoreboard.fullHouseDone === false) {
							//Calculate button score
							let pattern = /(.)\1{2}(.)\2|(.)\3(.)\4{2}/g;
							let result = pattern.test(diceObj.result);
							if (result === true) {
								scoreboard.fullHouseScore += 25;
							} else {
								scoreboard.fullHouseScore = 0;
							}
							var newTotal = minigames.yacht.calculateTotal(scoreboard);
							var rolledDiceObj = minigames.yacht.rollDice(hold, diceObj);
							scoreboard.fullHouseDone = true;
							scoreboard.fullHouseCheck = 'X';
							scoreSent.delete().catch(console.error);
							let gameOver = minigames.yacht.endCheck(scoreboard);
							if (gameOver) {
								minigames.yacht.endScreen(message, scoreboard, scoreboardSent, scoreSent);
							} else {
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
						} else if (scoreboard.fullHouseDone === true) {
							scoreSent.edit("Please don't try to cheat.");
							setTimeout(() => {
								scoreSent.delete().catch(console.error);
								minigames.yacht.diceCheck(
									message,
									player,
									diceObj,
									hold,
									scoreboard,
									rollsLeft,
									scoreboardSent
								);
							}, 3000);
						}
					} else if (reaction.emoji.name === '⏩') {
						if (scoreboard.smStraightDone === false) {
							//Calculate button score
							let pattern = /1234|2345|3456/g;
							let result = pattern.test(diceObj.result.replace(/(.)\1/, '$1'));
							if (result === true) {
								scoreboard.smallStraightScore += 30;
							} else {
								scoreboard.smallStraightScore = 0;
							}
							var newTotal = minigames.yacht.calculateTotal(scoreboard);
							var rolledDiceObj = minigames.yacht.rollDice(hold, diceObj);
							scoreboard.smStraightDone = true;
							scoreboard.smStraightCheck = 'X';
							scoreSent.delete().catch(console.error);
							let gameOver = minigames.yacht.endCheck(scoreboard);
							if (gameOver) {
								minigames.yacht.endScreen(message, scoreboard, scoreboardSent, scoreSent);
							} else {
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
						} else if (scoreboard.smStraightDone === true) {
							scoreSent.edit("Please don't try to cheat.");
							setTimeout(() => {
								scoreSent.delete().catch(console.error);
								minigames.yacht.diceCheck(
									message,
									player,
									diceObj,
									hold,
									scoreboard,
									rollsLeft,
									scoreboardSent
								);
							}, 3000);
						}
					} else if (reaction.emoji.name === '⏭') {
						if (scoreboard.bigStraightDone === false) {
							//Calculate button score
							let pattern = /12345|23456/g;
							let result = pattern.test(diceObj.result);
							if (result === true) {
								scoreboard.bigStraightScore += 40;
							} else {
								scoreboard.bigStraightScore = 0;
							}
							var newTotal = minigames.yacht.calculateTotal(scoreboard);
							var rolledDiceObj = minigames.yacht.rollDice(hold, diceObj);
							scoreboard.bigStraightDone = true;
							scoreboard.bigStraightCheck = 'X';
							scoreSent.delete().catch(console.error);
							let gameOver = minigames.yacht.endCheck(scoreboard);
							if (gameOver) {
								minigames.yacht.endScreen(message, scoreboard, scoreboardSent, scoreSent);
							} else {
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
						} else if (scoreboard.bigStraightDone === true) {
							scoreSent.edit("Please don't try to cheat.");
							setTimeout(() => {
								scoreSent.delete().catch(console.error);
								minigames.yacht.diceCheck(
									message,
									player,
									diceObj,
									hold,
									scoreboard,
									rollsLeft,
									scoreboardSent
								);
							}, 3000);
						}
					} else if (reaction.emoji.name === '🎰') {
						if (scoreboard.chanceDone === false) {
							diceObj.result = diceObj.result.split('');
							//Calculate button score
							diceObj.result.forEach((num) => {
								num = parseInt(num);
								scoreboard.chanceScore += num;
							});
							var newTotal = minigames.yacht.calculateTotal(scoreboard);
							var rolledDiceObj = minigames.yacht.rollDice(hold, diceObj);
							scoreboard.chanceDone = true;
							scoreboard.chanceCheck = 'X';
							scoreSent.delete().catch(console.error);
							let gameOver = minigames.yacht.endCheck(scoreboard);
							if (gameOver) {
								minigames.yacht.endScreen(message, scoreboard, scoreboardSent, scoreSent);
							} else {
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
						} else if (scoreboard.chanceDone === true) {
							scoreSent.edit("Please don't try to cheat.");
							setTimeout(() => {
								scoreSent.delete().catch(console.error);
								minigames.yacht.diceCheck(
									message,
									player,
									diceObj,
									hold,
									scoreboard,
									rollsLeft,
									scoreboardSent
								);
							}, 3000);
						}
					} else if (reaction.emoji.name === '🚢') {
						if (scoreboard.yachtDone === false) {
							let scratch = false;
							//Calculate button score
							let pattern = /11111|22222|33333|44444|55555|66666/g;
							// let pattern = /(.)\1{4}/g;
							let result = pattern.test(diceObj.result);
							if (result === true) {
								scoreboard.yachtScore += 50;
								scoreboard.yachtCheck = '*';
							} else if (result !== true && scoreboard.yachtScore >= 50) {
								scratch = true;
								scoreSent
									.edit('You cannot scratch into the bonus Yachts. Please pick another option.')
									.then((sent) => {
										setTimeout(() => {
											sent.delete().catch(console.error);
											minigames.yacht.diceCheck(
												message,
												player,
												diceObj,
												hold,
												scoreboard,
												rollsLeft,
												scoreboardSent
											);
										}, 3000);
									});
							} else {
								scoreboard.yachtDone = true;
								scoreboard.yachtCheck = 'X';
							}
							var newTotal = minigames.yacht.calculateTotal(scoreboard);
							var rolledDiceObj = minigames.yacht.rollDice(hold, diceObj);
							let gameOver = minigames.yacht.endCheck(scoreboard);
							if (gameOver) {
								scoreSent.delete().catch(console.error);
								minigames.yacht.endScreen(message, scoreboard, scoreboardSent, scoreSent);
							} else if (!scratch) {
								scoreSent.delete().catch(console.error);
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
						} else if (scoreboard.yachtDone === true) {
							scoreSent.edit("Please don't try to cheat.");
							setTimeout(() => {
								scoreSent.delete().catch(console.error);
								minigames.yacht.diceCheck(
									message,
									player,
									diceObj,
									hold,
									scoreboard,
									rollsLeft,
									scoreboardSent
								);
							}, 3000);
						}
					}
				}, 20000);
			})
			.catch((collected) => {
				message.channel.send(
					'The timer has run out, so we cancelled your game. Go ahead and start up a new game when you are ready.'
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
		scoreboard.bonusCheck = 'X';
	}
	scoreboard.leftScore += scoreboard.bonusScore;
	scoreboard.grandTotalScore = scoreboard.leftScore + scoreboard.rightScore;
	return scoreboard;
};

minigames.yacht.endCheck = (scoreboard) => {
	let doneArray = [
		scoreboard.onesDone,
		scoreboard.twosDone,
		scoreboard.threesDone,
		scoreboard.foursDone,
		scoreboard.fivesDone,
		scoreboard.sixesDone,
		scoreboard.threeKindDone,
		scoreboard.fourKindDone,
		scoreboard.fullHouseDone,
		scoreboard.smallStraightDone,
		scoreboard.bigStraightDone,
		scoreboard.chanceDone,
		scoreboard.yachtDone
	];
	let gameOverCount = 0;
	doneArray.forEach((item) => {
		if (item === false) {
			gameOverCount += 1;
		}
	});
	if (gameOverCount === 0) {
		return true;
	} else if (gameOverCount === 1 && scoreboard.yachtCheck !== 'X') {
		return true;
	} else {
		return false;
	}
};

minigames.yacht.endScreen = (message, scoreboard, scoreboardSent, scoreSent) => {
	//Display
	scoreboard.display =
		'```cs\nWelcome to Yacht, ' +
		player.username +
		'!\n|-|-------|---|-|---------------|---|\n|' +
		scoreboard.onesCheck +
		'|Ones   |' +
		' '.repeat(3 - scoreboard.onesScore.toString().length) +
		scoreboard.onesScore +
		'|' +
		scoreboard.threeKindCheck +
		'|Three of a Kind|' +
		' '.repeat(3 - scoreboard.threeKindScore.toString().length) +
		scoreboard.threeKindScore +
		'|\n' +
		'|' +
		scoreboard.twosCheck +
		'|Twos   |' +
		' '.repeat(3 - scoreboard.twosScore.toString().length) +
		scoreboard.twosScore +
		'|' +
		scoreboard.fourKindCheck +
		'|Four of a Kind |' +
		' '.repeat(3 - scoreboard.fourKindScore.toString().length) +
		scoreboard.fourKindScore +
		'|\n' +
		'|' +
		scoreboard.threesCheck +
		'|Threes |' +
		' '.repeat(3 - scoreboard.threesScore.toString().length) +
		scoreboard.threesScore +
		'|' +
		scoreboard.fullHouseCheck +
		'|Full House     |' +
		' '.repeat(3 - scoreboard.fullHouseScore.toString().length) +
		scoreboard.fullHouseScore +
		'|\n' +
		'|' +
		scoreboard.foursCheck +
		'|Fours  |' +
		' '.repeat(3 - scoreboard.foursScore.toString().length) +
		scoreboard.foursScore +
		'|' +
		scoreboard.smStraightCheck +
		'|Small Straight |' +
		' '.repeat(3 - scoreboard.smallStraightScore.toString().length) +
		scoreboard.smallStraightScore +
		'|\n' +
		'|' +
		scoreboard.fivesCheck +
		'|Fives  |' +
		' '.repeat(3 - scoreboard.fivesScore.toString().length) +
		scoreboard.fivesScore +
		'|' +
		scoreboard.bigStraightCheck +
		'|Big Straight   |' +
		' '.repeat(3 - scoreboard.bigStraightScore.toString().length) +
		scoreboard.bigStraightScore +
		'|\n' +
		'|' +
		scoreboard.sixesCheck +
		'|Sixes  |' +
		' '.repeat(3 - scoreboard.sixesScore.toString().length) +
		scoreboard.sixesScore +
		'|' +
		scoreboard.chanceCheck +
		'|Chance         |' +
		' '.repeat(3 - scoreboard.chanceScore.toString().length) +
		scoreboard.chanceScore +
		'|\n' +
		'|-|Bonus* |' +
		' '.repeat(3 - scoreboard.bonusScore.toString().length) +
		scoreboard.bonusScore +
		'|' +
		scoreboard.yachtCheck +
		'|Yacht          |' +
		' '.repeat(3 - scoreboard.yachtScore.toString().length) +
		scoreboard.yachtScore +
		'|\n|-|-------|---|-|---------------|---|\n*35 Bonus Points when Left Score >= 63\n\n|-----------|---|\n' +
		'|Left Score |' +
		' '.repeat(3 - scoreboard.leftScore.toString().length) +
		scoreboard.leftScore +
		'|\n|Right Score|' +
		' '.repeat(3 - scoreboard.rightScore.toString().length) +
		scoreboard.rightScore +
		'|\n|-----------|---|\n|Grand Total|' +
		' '.repeat(3 - scoreboard.grandTotalScore.toString().length) +
		scoreboard.grandTotalScore +
		'|\n|-----------|---|```';
	scoreboardSent.edit(scoreboard.display).then((sent) => {
		sent.react('🎉');
		const filter = (reaction, user) => {
			return [ '🎉' ].includes(reaction.emoji.name) && user.id === message.author.id;
		};
		sent
			.awaitReactions(filter, { max: 1, time: 1, errors: [ 'time' ] })
			.then((collected) => {
				const reaction = collected.first();
			})
			.catch((collected) => {
				// sent.delete().catch(console.error);
				//End the game.
				message.channel.send('The game is over! Your final score: ' + scoreboard.grandTotalScore);
				minigames.yacht.leaderboardCreate(message, player, scoreboard);
			});
	});
};

minigames.yacht.leaderboardCreate = (message, player, scoreboard) => {
	var date = new Date();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var year = date.getFullYear();
	if (month < 10) {
		month = '0' + month;
	}
	var fullDate = month + '/' + day + '/' + year;
	var newScore = {
		userID: player.userID,
		username: player.username,
		discriminator: player.discriminator,
		dateCreated: fullDate,
		score: scoreboard.grandTotalScore,
		scoreboard: scoreboard.display
	};
	Yacht.create(newScore, (err, newEntry) => {
		if (err) {
			console.log(err);
		} else {
			message.channel.send('Your score has been added.');
		}
	});
};
minigames.yacht.displayLeaderboard = (message) => {
	Yacht.find({ score: { $gte: 0 } }, (err, foundScores) => {
		// foundScores.sort({ field: 'desc', test: 1 });
		leaderboardArray = [];
		let placeholder = '|0000|     ----------     |00000|00/00/0000|\n';
		for (i = 0; i < 10; i++) {
			if (foundScores[i] !== undefined) {
				let rank = i + 1;
				leaderboardArray[i] =
					'|' +
					' '.repeat(4 - rank.toString().length) +
					rank +
					'|' +
					foundScores[i].username +
					' '.repeat(20 - foundScores[i].username.length) +
					'|' +
					foundScores[i].score +
					' '.repeat(5 - foundScores[i].score.toString().length) +
					'|' +
					foundScores[i].dateCreated +
					'|\n';
			} else {
				leaderboardArray[i] = placeholder;
			}
		}

		let arrayConcat = '';
		leaderboardArray.forEach((str) => {
			arrayConcat += str;
		});
		let leaderboardDisplay =
			'```cs\nYacht Leaderboard: ' +
			message.guild.name +
			'\n|----|--------------------|-----|----------|\n|Rank|        Name        |Score|   Date   |\n|----|--------------------|-----|----------|\n' +
			arrayConcat +
			'|----|--------------------|-----|----------|```';
		message.channel.send(leaderboardDisplay);
	});
};
minigames.yacht.myHighScore = (message, player) => {
	Yacht.find({ userID: player.userID }, (err, foundScores) => {
		// foundScores.sort({ field: 'desc', test: 1 });
		leaderboardArray = [];
		let placeholder = '|0000|     ----------     |00000|00/00/0000|\n';
		for (i = 0; i < 10; i++) {
			if (foundScores[i] !== undefined) {
				let rank = i + 1;
				leaderboardArray[i] =
					'|' +
					rank +
					' '.repeat(4 - rank.toString().length) +
					'|' +
					foundScores[i].username +
					' '.repeat(20 - foundScores[i].username.length) +
					'|' +
					foundScores[i].score +
					' '.repeat(5 - foundScores[i].score.toString().length) +
					'|' +
					foundScores[i].dateCreated +
					'|\n';
			} else {
				leaderboardArray[i] = placeholder;
			}
		}

		let arrayConcat = '';
		leaderboardArray.forEach((str) => {
			arrayConcat += str;
		});
		let leaderboardDisplay =
			'```cs\nYacht High Scores: ' +
			player.username +
			'\n|----|--------------------|-----|----------|\n|Rank|        Name        |Score|   Date   |\n|----|--------------------|-----|----------|\n' +
			arrayConcat +
			'|----|--------------------|-----|----------|```';
		message.channel.send(leaderboardDisplay);
	});
};
module.exports = minigames;
