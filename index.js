const process = require("process");
require("dotenv").config();
const {Client, Intents, Collection} = require("discord.js");

const {getCommandFiles, log, startEventListeners} = require("./modules/jerryUtils.js");


console.log(`The bot was started (npm run ${process.env.npm_lifecycle_event})!`);
log("append", "index.js", `The bot was started (npm run ${process.env.npm_lifecycle_event})!`, "DEBUG");

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
    await log("append", "index.js", "Getting command files...", "DEBUG");

    const suffix = ".js";
    const command_files = await getCommandFiles("./commands", suffix);

    console.log(`Queued ${command_files.commands.length} + ${command_files.exclusive.length} (${command_files.commands.length + command_files.exclusive.length}) files, ignored ${command_files.ignored.length} files, skipped ${command_files.skipped.length} files:`);
    console.log(command_files);

    const commands = {
        commands: [],
        exclusive: []
    };

    client.commands = new Collection();

    for(const file of command_files.commands) {
        const command = require(file);
        commands.commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
    }

    for(const file of command_files.exclusive) {
        const command = require(file);
        commands.exclusive.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
    }

    // Getting events
    await startEventListeners(client, commands);
})();


client.login(process.env.DISCORD_BOT_TOKEN_JERRY);
