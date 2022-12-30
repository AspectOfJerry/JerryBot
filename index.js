require('dotenv').config();
const fs = require('fs');
const {Client, Intents, Collection, MessageEmbed} = require('discord.js');

const {GetFiles, Log, Sleep, StartJobs, StartEventListeners, ToNormalized} = require('./modules/JerryUtils');


console.log(`The bot was started (npm run ${process.env.npm_lifecycle_event})!`);
Log('append', 'index.js', `The bot was started (npm run ${process.env.npm_lifecycle_event})!`, 'DEBUG'); // Logs

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

// Main
(async () => {
    // Getting commands
    console.log("Getting command files...");
    Log('append', 'index.js', 'Getting command files...', 'DEBUG'); // Logs

    const file_suffix = '.js';
    const command_files = await GetFiles('./commands', file_suffix);

    console.log(`Queued ${command_files.length} files:`);
    console.log(command_files);
    const commands = [];

    client.commands = new Collection();

    for(const file of command_files) {
        const command = require(file);
        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
    }

    // Getting events
    await StartEventListeners(client, commands);
})();


client.login(process.env.DISCORD_BOT_TOKEN_JERRY);
