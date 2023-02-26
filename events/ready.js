const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');

const {GetCommandFiles, Log, Sleep, StartJobs, StartEventListeners, ToNormalized} = require("../modules/JerryUtils.js");
const {AddGuild, GetGuildConfigMap, ParseGuild, RefreshDataset, RemoveGuild} = require('../database/config/dbms');
const {ChecklistBotReady, ChecklistJobs, StartTelemetry} = require('../modules/telemetry');
const {InitNukeNotifier} = require('../modules/nuking_notifier');
const {RefreshHubs} = require('../modules/voiceChannelHubManager.js');


module.exports = {
    name: 'ready',
    once: true,
    async execute(client, commands) {
        console.log("JerryBot is now online.");
        await Log("append", "JerryBot", `[JerryBot] "@JerryBot#9090" is now online.`, "DEBUG");

        const rest = new REST({version: "9"}).setToken(process.env.DISCORD_BOT_TOKEN_JERRY); // REST

        const client_id = client.user.id;

        const jerry_guild_id = process.env.DISCORD_JERRY_GUILD_ID;
        const goldfish_guild_id = process.env.DISCORD_GOLDFISH_GUILD_ID;
        const cra_guild_id = process.env.DISCORD_CRA_GUILD_ID;
        const group_311_guild_id = process.env.DISCORD_311_GUILD_ID;

        if(process.env.npm_lifecycle_event == "clearcommands") {
            await Log("append", "JerryBot", `[JerryBot/clearcommands] Clearing the application (/) commands...`, "DEBUG");
            console.log("Clearing global commands...");

            await rest.put(Routes.applicationCommands(client_id), {body: []});

            await Sleep(2500);
            console.log("Clearing local commands...");

            for(const [key, guild] of client.guilds.cache) {
                await rest.put(Routes.applicationGuildCommands(client_id, guild.id), {body: []});
                console.log(`Successfully cleared local commands in ${guild.name} (${guild.id}).`);
                await Sleep(500);
            }

            console.log("Sucessfully cleared all registered application (/) commands!");
            await Log("append", "JerryBot", `[JerryBot/clearcommands] Successfully cleared the application (/) commands!`, "DEBUG");
            process.exit(0);
        }

        console.log("Refreshing the database...");
        Log("append", "Database", "Refreshing the database...", "DEBUG");
        await RefreshDataset(client);

        // Reresh Voice Channel Hubs
        console.log("Refreshing the voice channel hubs...");
        await RefreshHubs(client);

        if(process.env.npm_lifecycle_event == 'test') {
            // Test content here
            return;
        }

        if(process.env.npm_lifecycle_event != 'dev') {
            // Telemetry
            console.log("Starting telemetry...");
            await StartTelemetry(client);

            // Jobs
            console.log("Starting jobs...");
            await StartJobs(client);
            ChecklistJobs();

            // Other
            // await InitNukeNotifier(client);
        }

        // Registering commands
        console.log("Registering the application (/) commands...");
        await Log("append", "JerryBot", `[JerryBot] Registering the application (/) commands...`, "DEBUG");


        if(process.env.npm_lifecycle_event == "prod") {
            // Register commands globally
            console.log("Deploying commands globally...");

            await rest.put(Routes.applicationCommands(client_id), {body: commands});

            console.log("Finished refreshing the application (/) commands globally!");
            Log("append", "JerryBot", `[JerryBot/prod] Successfully refreshed the application (/) commands globally!`, "DEBUG");
        } else if(process.env.npm_lifecycle_event == "dev") {
            try {
                await rest.put(Routes.applicationGuildCommands(client_id, jerry_guild_id), {body: commands});
                console.log(`Successfully deployed commands locally in ${jerry_guild_id}.`);
                await Sleep(750);

                await rest.put(Routes.applicationGuildCommands(client_id, group_311_guild_id), {body: commands});
                console.log(`Successfully deployed commands locally in ${group_311_guild_id}.`);

                console.log("Successfully refreshed the application (/) commands locally!");
                Log("append", "JerryBot", `[JerryBot/dev] Successfully refreshed the application (/) commands locally!`, "DEBUG");
            } catch(err) {
                if(err) {
                    console.error(err);
                }
            }
        } else {
            try {
                // Register commands locally to all guilds
                await rest.put(Routes.applicationGuildCommands(client_id, jerry_guild_id), {body: commands});
                console.log(`Successfully deployed commands locally in ${jerry_guild_id}.`);
                await Sleep(1000);

                await rest.put(Routes.applicationGuildCommands(client_id, group_311_guild_id), {body: commands});
                console.log(`Successfully deployed commands locally in ${group_311_guild_id}.`);
                await Sleep(1000);

                console.log(`Successfully deployed commands locally in ${goldfish_guild_id}.`);
                await rest.put(Routes.applicationGuildCommands(client_id, goldfish_guild_id), {body: commands});
                await Sleep(1000);

                await rest.put(Routes.applicationGuildCommands(client_id, cra_guild_id), {body: commands});
                console.log(`Successfully deployed commands locally in ${cra_guild_id}.`);

                console.log("Successfully refreshed the application (/) commands locally!");
                Log("append", "JerryBot", `[JerryBot] Successfully refreshed the application (/) commands locally!`, "DEBUG");
            } catch(err) {
                if(err) {
                    console.error(err);
                }
            }
        }

        if(process.env.npm_lifecycle_event != 'dev') {
            ChecklistBotReady();
        }
    }
};
