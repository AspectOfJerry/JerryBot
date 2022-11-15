const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');

const Sleep = require('../modules/sleep.js'); // delayInMilliseconds
const Log = require('../modules/logger.js'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─
const {ChecklistBotReady, IniSystemMonitor} = require('../modules/system_monitor');
const StartJobs = require('../modules/start_jobs');

require('dotenv').config();

module.exports = {
    name: 'ready',
    once: true,
    async execute(client, commands) {
        await Log('append', 'DiscordBot', `[JerryBot] JerryBot is now online.`, 'DEBUG'); // Logs
        console.log("JerryBot is now online.");

        // System Monitor
        await IniSystemMonitor(client);

        // Jobs
        await Log('append', 'start_jobs', `[StartJobs] Starting jobs...`, 'DEBUG'); // Logs
        await StartJobs(client);

        // Registering commands
        console.log("Registering the commands...");

        const client_id = client.user.id;

        const jerry_guild_id = process.env.DISCORD_JERRY_GUILD_ID;
        const goldfish_guild_id = process.env.DISCORD_GOLDFISH_GUILD_ID;
        const cra_guild_id = process.env.DISCORD_CRA_GUILD_ID;
        const group_311_guild_id = process.env.DISCORD_311_GUILD_ID;

        const rest = new REST({version: "9"}).setToken(process.env.DISCORD_BOT_TOKEN_JERRY); // REST

        try {
            await rest.put(Routes.applicationGuildCommands(client_id, jerry_guild_id), {body: commands});
            console.log(`Successfully registered commands locally in ${jerry_guild_id}.`);
            await Sleep(1000);

            await rest.put(Routes.applicationGuildCommands(client_id, goldfish_guild_id), {body: commands});
            console.log(`Successfully registered commands locally in ${goldfish_guild_id}.`);
            await Sleep(1000);

            await rest.put(Routes.applicationGuildCommands(client_id, cra_guild_id), {body: commands});
            console.log(`Successfully registered commands locally in ${cra_guild_id}.`);
            await Sleep(1000);

            await rest.put(Routes.applicationGuildCommands(client_id, group_311_guild_id), {body: commands});
            console.log(`Successfully registered commands locally in ${group_311_guild_id}.`);
            await Sleep(1000);
        } catch(err) {
            if(err) {
                console.error(err);
            }
        }

        await ChecklistBotReady();
    }
};
