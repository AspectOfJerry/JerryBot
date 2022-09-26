const fs = require('fs');
const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
require('dotenv').config();
const process = require('process');

const Sleep = require('./modules/sleep'); // delayInMilliseconds
const Log = require('./modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─
const GetFiles = require('./modules/get_files');


Log('append', 'DiscordBot', 'The bot was started!', 'INFO'); // Logs

const client = new Client({
    intents: [
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_BANS,
    ]
});

// Getting commands
console.log("Getting command files...");
Log('append', 'DiscordBot', 'Getting command files...', 'INFO'); // Logs

const file_suffix = '.js';
const command_files = GetFiles('./commands', file_suffix);

console.log(`Queued ${command_files.length} files:`);
console.log(command_files)
const commands = [];

client.commands = new Collection();

for(const file of command_files) {
    const command = require(file);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

// Getting events
console.log("Getting event files...");
Log('append', 'DiscordBot', 'Getting event files...', 'INFO'); // Logs

const event_files = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

console.log(`Event files (${event_files.length}):`);
console.log(event_files);

for(const event_file of event_files) {
    const event = require(`./events/${event_file}`);

    if(event.once) {
        client.once(event.name, (...args) => event.execute(...args, commands));
    } else {
        client.on(event.name, (...args) => event.execute(...args, commands));
    }
}

client.login(process.env.DISCORD_BOT_TOKEN_JERRY);
