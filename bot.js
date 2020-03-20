const { Client, Attachment, Collection, Guild } = require('discord.js'),
	client = new Client(),
	commands = new Collection(),
	express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	fs = require('fs'),
	prefix = '!',
	User = require('./models/user'),
	Realm = require('./models/realm'),
	Reminder = require('./models/reminder'),
	port = process.env.PORT || 3000;

//FOR LOCAL DEVELOPMENT
const { token } = require('./config.json'),
	botToken = token,
	url = 'mongodb://localhost:27017/derek_bot';

// //FOR PRODUCTION ENVIRONMENT
// const botToken = process.env.BOTTOKEN,
// 	url = process.env.DATABASEURL;

mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

//DISCORD.JS COMMAND ROUTE
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.set(command.name, command);
}

//MY COMMAND ROUTES
const button = require('./commands/button'),
	rpg = require('./commands/rpg'),
	fight = require('./commands/fight'),
	minigames = require('./commands/minigames'),
	shops = require('./commands/shops'),
	realm = require('./commands/realm'),
	profile = require('./commands/profile');

//BOT RESPONSES
client.on('message', (message) => {
	// Prevent bot from responding to its own messages and doing anything without prefix
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	//Remove prefix
	const args = message.content.slice(prefix.length).split(/ +/);
	//Take first element from args (the command itself) and store it
	const commandName = args.shift().toLowerCase();
	if (commandName === 'hi') {
		//This is my way to set up commands, with multiple functions available in a single file.
		button.hello(message);
	} else if (commandName === 'button') {
		button.button(message);
	} else if (commandName === 'register') {
		profile.newUser(message);
	} else if (commandName === 'status') {
		profile.status(message);
	}
	//Generalized way to set up commands according to Discord.js
	if (!commands.has(commandName)) return;
	const command = commands.get(commandName);
	if (command.args && !args.length) {
		return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
	}
	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command!');
	}
});

//REMINDME
client.on('message', (message) => {
	// Prevent bot from responding to its own messages and doing anything without prefix
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	//Remove prefix
	var args = message.content.slice(prefix.length);
	args = args.split(/ +/);
	var commandName = args[0];
	var remindTime = args[1];
	remindTime = parseInt(remindTime);
	args = args.slice(2);
	var remindMessage = args.join(' ');

	//Take first element from args (the command itself) and store it
	commandName = commandName.toLowerCase();
	if (commandName === 'remindme') {
		button.remindme(message, remindTime, remindMessage);
	}
});

client.on('message', (message) => {
	// Prevent bot from responding to its own messages and doing anything without prefix
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	//Remove prefix
	const args = message.content.slice(prefix.length).split(/ +/);
	//Take first element from args (the command itself) and store it
	const commandName = args.shift().toLowerCase();
	if (commandName === 'rpg' || commandName === 'fight') {
		User.find({ userID: message.author.id }, function(err, foundPlayer) {
			player = foundPlayer[0];
			if (err) {
				console.log(err);
			} else if (player == undefined) {
				message.channel.send('Please use !register to create a profile first.');
			} else if (player.userID == message.author.id) {
				fight.start(message, player);
			} else {
				console.log(player);
				console.log(message.author.id);
				message.channel.send('Something weird happened. Pinging Racecar0.');
				client.fetchUser('201336725958557706', false).then((user) => {
					user.send('Something asplode.');
				});
			}
		});
	} else if (commandName === 'flip') {
		User.find({ userID: message.author.id }, function(err, foundPlayer) {
			player = foundPlayer[0];
			if (err) {
				console.log(err);
			} else if (player == undefined) {
				message.channel.send('Please use !register to create a profile first.');
			} else if (player.userID == message.author.id) {
				minigames.flip(message, player, args);
			} else {
				console.log(player);
				console.log(message.author.id);
				message.channel.send('Something weird happened. Pinging Racecar0.');
				client.fetchUser('201336725958557706', false).then((user) => {
					user.send('Something asplode.');
				});
			}
		});
	} else if (commandName === 'yacht') {
		User.find({ userID: message.author.id }, function(err, foundPlayer) {
			player = foundPlayer[0];
			if (err) {
				console.log(err);
			} else if (player == undefined) {
				message.channel.send('Please use !register to create a profile first.');
			} else if (player.userID == message.author.id) {
				minigames.yacht.sort(message, player, args);
			} else {
				console.log(player);
				console.log(message.author.id);
				message.channel.send('Something weird happened. Pinging Racecar0.');
				client.fetchUser('201336725958557706', false).then((user) => {
					user.send('Something asplode.');
				});
			}
		});
	} else if (commandName === 'realm') {
		User.find({ userID: message.author.id }, function(err, foundPlayer) {
			player = foundPlayer[0];
			if (err) {
				console.log(err);
			} else if (player == undefined) {
				message.channel.send('Please use !register to create a profile first.');
			} else if (player.userID == message.author.id) {
				realm.sort(message, player, args);
			} else {
				console.log(player);
				console.log(message.author.id);
				message.channel.send('Something weird happened. Pinging Racecar0.');
				client.fetchUser('201336725958557706', false).then((user) => {
					user.send('Something asplode.');
				});
			}
		});
	} else if (commandName === 'buy') {
		User.find({ userID: message.author.id }, function(err, foundPlayer) {
			player = foundPlayer[0];
			if (err) {
				console.log(err);
			} else if (player == undefined) {
				message.channel.send('Please use !register to create a profile first.');
			} else if (player.userID == message.author.id) {
				shops.sort(message, player, args);
			} else {
				console.log(player);
				console.log(message.author.id);
				message.channel.send('Something weird happened. Pinging Racecar0.');
				client.fetchUser('201336725958557706', false).then((user) => {
					user.send('Something asplode.');
				});
			}
		});
	}
});

//DISCORD LISTEN
client.once('ready', () => {
	console.log('Connected as ' + client.user.tag);
	// Set bot status
	client.user.setActivity('with Mindy St. Claire');
	// List servers the bot is connected to
	console.log('Servers:');
	let cache = client.guilds.cache.array();
	let guilds = cache.flatMap((guild) => {
		console.log(guild.name + ' - ' + guild.id);
	});
	//SetInterval for Reminder
	var realmTimer = setInterval(function() {
		Reminder.find({}, (err, foundReminders) => {
			foundReminders.forEach((reminder) => {
				reminder.reminderTime -= 1000;
				Reminder.updateOne(
					{ messageID: reminder.messageID },
					{ reminderTime: reminder.reminderTime },
					(err, updateReminder) => {
						if (err) {
							console.log(err);
						} else {
							if (reminder.reminderTime <= 0) {
								const channel = client.channels.cache.get(reminder.messageChannel);
								channel.send('<@' + reminder.userID + '>: ' + reminder.message);
								Reminder.findOneAndDelete({ messageID: reminder.messageID }, (err, doc) => {
									if (err) console.log;
								});
							}
						}
					}
				);
			});
		});
	}, 1000);
	//Set Interval for Realm
	// var realmTimer = setInterval(function() {
	// 	Realm.updateMany({}, { takenTurn: true }, function(err, res) {
	// 		if (err) {
	// 			console.log(err);
	// 		} else {
	// 			console.log(Date.now());
	// 		}
	// 	});
	// }, 120000);
});

client.login(botToken);

//WEBSITE LISTEN
// app.listen(port, function() {
// 	console.log('Derek Bot Server Has Started!');
// });

//WEBSITE ROUTES
// app.get('/', function(req, res) {
// 	res.render('index');
// });
