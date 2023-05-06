const process = require("process");
const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v9");

const {connect, refreshDatabase, updateConfig} = require("../database/mongodb.js");
const {Log, Sleep, StartJobs} = require("../modules/JerryUtils.js");
const {configOpenAI} = require("../modules/gpt.js");
const {ChecklistBotReady, ChecklistJobs, StartTelemetry} = require("../modules/telemetry");
const {refreshHubs} = require("../modules/voiceChannelHubManager.js");
// const {InitNukeNotifier} = require('../modules/nuking_notifier');


module.exports = {
    name: "ready",
    once: true,
    async execute(client, commands) {
        console.log("JerryBot is now online.");
        await log("append", "JerryBot", "[JerryBot] \"@JerryBot#9090\" is now online.", "DEBUG");

        const rest = new REST({version: "9"}).setToken(process.env.DISCORD_BOT_TOKEN_JERRY); // REST

        const client_id = client.user.id;

        const jerry_guild_id = "631939549332897842";
        const goldfish_guild_id = "890063136193925170";
        const group_311_guild_id = "1014278986135781438";
        const bap_guild_id = "864928262971326476";

        if(process.env.npm_lifecycle_event == "clearcommands") {
            await log("append", "JerryBot", "[JerryBot/clearcommands] Clearing the application (/) commands...", "DEBUG");
            console.log("Clearing global commands...");

            await rest.put(Routes.applicationCommands(client_id), {body: []});

            await sleep(2500);
            console.log("Clearing local commands...");

            for(const [key, guild] of client.guilds.cache) {
                await rest.put(Routes.applicationGuildCommands(client_id, guild.id), {body: []});
                console.log(`Successfully cleared local commands in ${guild.name} (${guild.id}).`);
                await sleep(500);
            }

            console.log("Sucessfully cleared all registered application (/) commands!");
            await log("append", "JerryBot", "[JerryBot/clearcommands] Successfully cleared the application (/) commands!", "DEBUG");
            process.exit(0);
        }

        console.log("Connecting to the database...");
        log("append", "Database", "Connecting to the database...", "DEBUG");
        await connect();

        console.log("Refreshing the database...");
        log("append", "Database", "Refreshing the database...", "DEBUG");
        await refreshDatabase(client);

        // Reresh Voice Channel Hubs
        console.log("Refreshing the voice channel hubs...");
        log("append", "Database", "Refreshing the voice channel hubs...", "DEBUG");
        await refreshHubs(client);

        // configure openAI
        configOpenAI();

        if(process.env.npm_lifecycle_event === "test") {
            // Test content here
            return;
        }

        // main
        if(process.env.npm_lifecycle_event !== "dev") {
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
        await log("append", "JerryBot", "[JerryBot] Registering the application (/) commands...", "DEBUG");

        if(process.env.npm_lifecycle_event === "prod") {
            // Register commands globally
            console.log("Deploying commands globally...");

            await rest.put(Routes.applicationCommands(client_id), {body: commands});

            console.log("Finished refreshing the application (/) commands globally!");
            log("append", "JerryBot", "[JerryBot/prod] Successfully refreshed the application (/) commands globally!", "DEBUG");
        } else if(process.env.npm_lifecycle_event === "dev") {
            try {
                await rest.put(Routes.applicationGuildCommands(client_id, jerry_guild_id), {body: commands});
                console.log(`Successfully deployed commands locally in ${jerry_guild_id}.`);
                await sleep(750);

                await rest.put(Routes.applicationGuildCommands(client_id, group_311_guild_id), {body: commands});
                console.log(`Successfully deployed commands locally in ${group_311_guild_id}.`);
                await sleep(750);

                await rest.put(Routes.applicationGuildCommands(client_id, bap_guild_id), {body: commands});
                console.log(`Successfully deployed commands locally in ${bap_guild_id}.`);

                console.log("Successfully refreshed the application (/) commands locally!");
                log("append", "JerryBot", "[JerryBot/dev] Successfully refreshed the application (/) commands locally!", "DEBUG");
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
                await sleep(1000);

                await rest.put(Routes.applicationGuildCommands(client_id, group_311_guild_id), {body: commands});
                console.log(`Successfully deployed commands locally in ${group_311_guild_id}.`);
                await sleep(1000);

                await rest.put(Routes.applicationGuildCommands(client_id, bap_guild_id), {body: commands});
                console.log(`Successfully deployed commands locally in ${bap_guild_id}.`);

                console.log(`Successfully deployed commands locally in ${goldfish_guild_id}.`);
                await rest.put(Routes.applicationGuildCommands(client_id, goldfish_guild_id), {body: commands});
                await sleep(1000);

                console.log("Successfully refreshed the application (/) commands locally!");
                log("append", "JerryBot", "[JerryBot] Successfully refreshed the application (/) commands locally!", "DEBUG");
            } catch(err) {
                if(err) {
                    console.error(err);
                }
            }
        }

        if(process.env.npm_lifecycle_event !== "dev") {
            ChecklistBotReady();
        }
    }
};
