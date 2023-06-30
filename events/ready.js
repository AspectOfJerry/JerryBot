const process = require("process");
const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v9");

const {connect, refreshBirthdayCollection, refreshGuildCollection} = require("../database/mongodb.js");
const {log, sleep, StartJobs} = require("../modules/JerryUtils.js");
const {configOpenAI} = require("../modules/gpt.js");
const {checklistBotReady, checklistJobs, startTelemetry} = require("../modules/telemetry");
const {refreshHubs} = require("../modules/voiceChannelHubManager.js");
// const {InitNukeNotifier} = require('../modules/nuking_notifier');


module.exports = {
    name: "ready",
    once: true,
    async execute(client, commands) {
        console.log("JerryBot is now online.");
        await log("append", "", "[0x524459] \"@JerryBot#9090\" is now online.", "DEBUG");

        const rest = new REST({version: "9"}).setToken(process.env.DISCORD_BOT_TOKEN_JERRY); // REST

        const client_id = client.user.id;

        if(process.env.npm_lifecycle_event == "clearcommands") {
            await log("append", "JerryBot", "[JerryBot/clearcommands] Clearing the application (/) commands...", "DEBUG");
            console.log("Clearing global commands...");

            await client.user.setPresence({activities: [{name: "clearing commands...", type: "PLAYING"}], status: "dnd"});

            await rest.put(Routes.applicationCommands(client_id), {body: []});

            await sleep(2500);
            console.log("Clearing local commands...");

            const local_guilds = ["1014278986135781438", "1113966154143244349"];

            for(const guild of local_guilds) {
                await rest.put(Routes.applicationGuildCommands(client_id, guild), {body: []});
                console.log(`Successfully cleared local commands in ${guild}.`);
                await sleep(500);
            }

            console.log("Sucessfully cleared all registered application (/) commands!");
            await log("append", "JerryBot", "[JerryBot/clearcommands] Successfully cleared the application (/) commands!", "DEBUG");
            await client.destroy();
            process.exit(0);
        }

        if(process.env.npm_lifecycle_event === "deploy") {
            // Register commands globally
            console.log("Registering the application (/) commands...");
            await log("append", "JerryBot", "[Deploy] Registering global application (/) commands...", "DEBUG");
            console.log("Deploying commands globally...");

            await rest.put(Routes.applicationCommands(client_id), {body: commands.commands});

            console.log("Finished refreshing the application (/) commands globally!");

            log("append", "JerryBot", "[Deploy] Successfully refreshed the application (/) commands globally!", "DEBUG");

            // Local commands
            await log("append", "JerryBot", "[Deploy] Registering exclusive application (/) commands locally...", "DEBUG");
            console.log("Deploying commands globally...");

            await rest.put(Routes.applicationGuildCommands(client_id, "1014278986135781438"), {body: [commands.exclusive.find((e) => e.name === "311")]});
            console.log("Successfully deployed commands locally in \"1014278986135781438\".");

            await log("append", "JerryBot", "[Deploy] Exiting process...", "FATAL");
            await client.destroy();
            process.exit(0);
        }

        console.log("Connecting to the database...");
        log("append", "", "[DB] Connecting to the database...", "DEBUG");
        await connect();

        console.log("Refreshing the guild collection...");
        log("append", "", "[DB] Refreshing the guild collection...", "DEBUG");
        await refreshGuildCollection(client);

        console.log("Refreshing the birthday collection...");
        log("append", "", "[DB] Refreshing the birthday collection...", "DEBUG");
        await refreshBirthdayCollection(client);

        // Reresh Voice Channel Hubs
        console.log("Refreshing the voice channel hubs...");
        log("append", "", "[DB] Refreshing the voice channel hubs...", "DEBUG");
        await refreshHubs(client);

        // configure openAI
        console.log("Configuring OpenAI...");
        log("append", "", "[OpenAI] Configuring OpenAI...", "DEBUG");
        configOpenAI();

        if(process.env.npm_lifecycle_event === "test") {
            // Test content here
            console.log(commands.commands);
            console.log(commands.exclusive);
            return;
        }

        // main
        if(process.env.npm_lifecycle_event !== "dev") {
            // Telemetry
            console.log("Starting telemetry...");
            await startTelemetry(client);

            // Jobs
            console.log("Starting jobs...");
            await StartJobs(client);
            checklistJobs();

            // Other
            // await InitNukeNotifier(client);
        }

        // Registering commands
        if(process.env.npm_lifecycle_event === "dev") {
            try {
                console.log("Registering the application (/) commands...");
                log("append", "JerryBot", "[0x524459] Registering local application (/) commands...", "DEBUG");
                await rest.put(Routes.applicationGuildCommands(client_id, "631939549332897842"), {body: commands.commands});
                console.log("Successfully deployed commands locally in \"631939549332897842\"."); // dev
                // await sleep(750);

                // await rest.put(Routes.applicationGuildCommands(client_id, "1014278986135781438"), {body: [...commands.commands, commands.exclusive.find((e) => e.name === "311")]});
                // console.log("Successfully deployed commands locally in \"1014278986135781438\"."); // cra
                // await sleep(750);

                await rest.put(Routes.applicationGuildCommands(client_id, "864928262971326476"), {body: commands.commands});
                console.log("Successfully deployed commands locally in \"864928262971326476\"."); // bap

                console.log("Successfully refreshed the application (/) commands locally!");
                log("append", "", "[JerryBot/dev] Successfully refreshed the application (/) commands locally!", "DEBUG");
            } catch(err) {
                if(err) {
                    console.error(err);
                }
            }
        }

        if(process.env.npm_lifecycle_event !== "dev") {
            checklistBotReady();
        }
    }
};
