//const Discord = require('discord.js')
const fs = require('fs');
const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const GetFiles = require('./modules/get_files');

require('dotenv').config();
const process = require('process');

const client = new Client({
    intents: [
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ]
})

const file_suffix = '.js'
const command_files = GetFiles('./commands', file_suffix)

console.log(command_files)
const commands = [];

client.commands = new Collection();

for(const file of command_files) {
    const command = require(file);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

const event_files = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for(const event_file of event_files) {
    const event = require(`./events/${event_file}`);

    if(event.once) {
        client.once(event.name, (...args) => event.execute(...args, commands));
    } else {
        client.on(event.name, (...args) => event.execute(...args, commands));
    }
}

client.login(process.env.DISCORD_BOT_TOKEN_JERRY);
