import process from "process";
import {config} from "dotenv"; config();
import winston from "winston";
import moment from "moment";
import {Client, Intents, Collection} from "discord.js";

import {getCommandFiles, logger, custom_logger_levels, startEventListeners} from "./modules/jerryUtils.js";

if(process.env.npm_lifecycle_event !== "main") {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            // colorizzing the level breaks the message when using level.toUpperCase(). See: https://github.com/winstonjs/winston/issues/1345
            winston.format.colorize({message: true, colors: custom_logger_levels.colors}),
            winston.format.printf(({level, message}) => {
                return `[${moment().format("HH:mm:ss.SSS")}] [${level.toUpperCase()}/${message}`;
            })
        )
    }));
}


console.log(`The bot was started (npm run ${process.env.npm_lifecycle_event})!`);
logger.append("info", "index.js", `[Startup] The bot was started (npm run ${process.env.npm_lifecycle_event})!`);

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
    logger.append("debug", "index.js", "[Startup] Getting command files...");

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
        const module = await import(file);
        const command = module.default;

        commands.commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
    }

    for(const file of command_files.exclusive) {
        const module = await import(file);
        const command = module.default;

        commands.exclusive.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
    }


    // Getting events
    await startEventListeners(client, commands);
})();


client.login(process.env.DISCORD_BOT_TOKEN_JERRY);
