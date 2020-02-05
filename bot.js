const { Client, Attachment, Collection } = require('discord.js'),
	client = new Client(),
	commands = new Collection(),
	express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	// { token } = require('./config.json'),
	fs = require('fs'),
	prefix = '!',
	port = process.env.PORT || 3000,
	botToken = process.env.BOTTOKEN || token,
	url = process.env.DATABASEURL || 'mongodb://localhost:27017/derek_bot';

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
const button = require('./commands/button');
const rpg = require('./commands/rpg');

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
		button.hello(message, commandName);
	} else if (commandName === 'button') {
		button.button(message, commandName);
	} else if (commandName === 'rpg') {
		rpg.fight(message);
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

//WEBSITE ROUTES
app.get('/', function(req, res) {
	res.render('index');
});

//DISCORD LISTEN
client.once('ready', () => {
	console.log('Connected as ' + client.user.tag);
	// Set bot status
	client.user.setActivity('with Mindy St. Claire');
	// List servers the bot is connected to
	console.log('Servers:');
	client.guilds.forEach((guild) => {
		console.log(' - ' + guild.name);
		// List all channels
		// guild.channels.forEach((channel) => {
		// 	console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`);
		// });
	});
});

client.login(botToken);

//WEBSITE LISTEN
app.listen(port, function() {
	console.log('Derek Bot Server Has Started!');
});
