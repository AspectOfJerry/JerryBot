const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');

const {GetCommandFiles, Log, Sleep, StartJobs, StartEventListeners, ToNormalized} = require('../modules/JerryUtils');
const {AddGuild, GetClientGuilds, GetGuildConfigMap, ParseGuild, RefreshDataset, RemoveGuild} = require('../database/config/dbms');
const {ChecklistBotReady, ChecklistJobs, StartTelemetry} = require('../modules/telemetry');
const {InitNukeNotifier} = require('../modules/nuking_notifier');
const {FetchHubs} = require('../modules/voice_channel_hub');


module.exports = {
    name: 'ready',
    once: true,
    async execute(client, commands) {
        await Log('append', 'DiscordBot', `[JerryBot] JerryBot is now online.`, 'DEBUG');
        console.log("JerryBot is now online.");

        await RefreshDataset(client);

        if(process.env.npm_lifecycle_event == 'test') {
            // Test content here
            return;
        }

        if(process.env.npm_lifecycle_event != 'dev') {
            // Telemetry
            await StartTelemetry(client);

            // Jobs
            await StartJobs(client);
            await ChecklistJobs();

            // Other
            await InitNukeNotifier(client);

            // Reresh Voice Channel Hubs
            await FetchHubs(client);
        }

        // Registering commands
        console.log("Registering the commands...");

        const client_id = client.user.id;

        const jerry_guild_id = process.env.DISCORD_JERRY_GUILD_ID;
        const goldfish_guild_id = process.env.DISCORD_GOLDFISH_GUILD_ID;
        const cra_guild_id = process.env.DISCORD_CRA_GUILD_ID;
        const group_311_guild_id = process.env.DISCORD_311_GUILD_ID;

        const rest = new REST({version: "9"}).setToken(process.env.DISCORD_BOT_TOKEN_JERRY); // REST

        const emptyArray = []; // Replace 'body: commands' by emptyArray below to remove all commands. 

        try {
            await rest.put(Routes.applicationGuildCommands(client_id, jerry_guild_id), {body: commands});
            console.log(`Successfully registered commands locally in ${jerry_guild_id}.`);
            await Sleep(1000);

            // await rest.put(Routes.applicationGuildCommands(client_id, goldfish_guild_id), {body: commands});
            // console.log(`Successfully registered commands locally in ${goldfish_guild_id}.`);
            // await Sleep(1000);

            // await rest.put(Routes.applicationGuildCommands(client_id, cra_guild_id), {body: commands});
            // console.log(`Successfully registered commands locally in ${cra_guild_id}.`);
            // await Sleep(1000);

            // await rest.put(Routes.applicationGuildCommands(client_id, group_311_guild_id), {body: commands});
            // console.log(`Successfully registered commands locally in ${group_311_guild_id}.`);
            // await Sleep(1000);

            console.log("Finished deploying the application (/) commands!");
        } catch(err) {
            if(err) {
                console.error(err);
            }
        }

        if(process.env.npm_lifecycle_event != 'dev') {
            await ChecklistBotReady();
        }
    }
};
