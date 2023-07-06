const process = require("process");
const winston = require("winston");
const fs = require("fs");
const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v9");
const path = require("path");

const {connect, refreshBirthdayCollection, refreshGuildCollection} = require("../database/mongodb.js");
const {getDirFiles, logger, sleep, StartJobs} = require("../modules/jerryUtils.js");
const {configOpenAI} = require("../modules/gpt.js");
const {checklistBotReady, checklistJobs, startTelemetry} = require("../modules/telemetry");
const {refreshHubs} = require("../modules/voiceChannelHubManager.js");
// const {InitNukeNotifier} = require('../modules/nuking_notifier');


module.exports = {
    name: "ready",
    once: true,
    async execute(client, commands) {
        console.log("JerryBot is now online.");
        logger.append("info", "0x524459", "\"@JerryBot#9090\" is now online.");

        const rest = new REST({version: "9"}).setToken(process.env.DISCORD_BOT_TOKEN_JERRY); // REST

        const client_id = client.user.id;

        if(process.env.npm_lifecycle_event == "clearcommands") {
            logger.append("info", "0x524459", "[RDY/Clearcommands] Clearing the application (/) commands...");
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
            logger.append("info", "0x524459", "[RDY/Clearcommands] Successfully cleared the application (/) commands!");
            await client.destroy();
            process.exit(0);
        }

        if(process.env.npm_lifecycle_event === "deploy") {
            // Register commands globally
            console.log("Registering the application (/) commands...");
            logger.append("info", "0x524459", "[RDY/Deploy] Registering global application (/) commands...");
            console.log("Deploying commands globally...");

            await rest.put(Routes.applicationCommands(client_id), {body: commands.commands});

            console.log("Finished refreshing the application (/) commands globally!");

            logger.append("info", "0x524459", "[RDY/Deploy] Successfully refreshed the application (/) commands globally!");

            // Local commands
            logger.append("info", "0x524459", "[RDY/Deploy] Registering exclusive application (/) commands locally...");
            console.log("Deploying commands globally...");

            await rest.put(Routes.applicationGuildCommands(client_id, "1014278986135781438"), {body: [commands.exclusive.find((e) => e.name === "311")]});
            console.log("Successfully deployed commands locally in \"1014278986135781438\".");

            logger.append("fatal", "0x524459", "[RDY/Deploy] Exiting process...");
            logger.end();
            await client.destroy();
            process.exit(0);
        }

        console.log("Connecting to the database...");
        logger.append("info", "0x524459", "[RDY/Database] Connecting to the database...");
        await connect();

        console.log("Refreshing the guild collection...");
        logger.append("info", "0x524459", "[RDY/Database] Refreshing the guild collection...");
        await refreshGuildCollection(client);

        console.log("Refreshing the birthday collection...");
        logger.append("info", "0x524459", "[RDY/Database] Refreshing the birthday collection...");
        await refreshBirthdayCollection(client);

        // Reresh Voice Channel Hubs
        console.log("Refreshing the voice channel hubs...");
        logger.append("info", "0x524459", "[RDY/Database] Refreshing the voice channel hubs...");
        await refreshHubs(client);

        // configure openAI
        console.log("Configuring OpenAI...");
        logger.append("info", "0x524459", "[RDY/OpenAI] Configuring OpenAI...");
        configOpenAI();

        if(process.env.npm_lifecycle_event === "test") {
            const args = process.argv.slice(2);
            await require(`../tests/${args[0]}.test.js`);
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
                // logger.append("info", "0x524459", "[RDY/dev] Registering local application (/) commands...");
                // await rest.put(Routes.applicationGuildCommands(client_id, "631939549332897842"), {body: commands.commands});
                // console.log("Successfully deployed commands locally in \"631939549332897842\"."); // dev
                // // await sleep(750);

                await rest.put(Routes.applicationGuildCommands(client_id, "1014278986135781438"), {body: [...commands.commands, commands.exclusive.find((e) => e.name === "311")]});
                console.log("Successfully deployed commands locally in \"1014278986135781438\"."); // cra
                await sleep(750);

                // await rest.put(Routes.applicationGuildCommands(client_id, "864928262971326476"), {body: commands.commands});
                // console.log("Successfully deployed commands locally in \"864928262971326476\"."); // bap

                console.log("Successfully refreshed the application (/) commands locally!");
                logger.append("info", "0x524459", "[RDY/dev] Successfully refreshed the application (/) commands locally!");
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

async function getTests(dir, suffix) {
    const files = await fs.readdir(dir, {withFileTypes: true});

    let returnFiles = [];

    for(const file of files) {
        const filePath = `${dir}/${file.name}`;

        if(file.isDirectory()) {
            const subFiles = await getTests(filePath, suffix);
            returnFiles.push(...subFiles);
        } else if(file.name.endsWith(suffix)) {
            returnFiles.push(filePath);
        }
    }

    return returnFiles;
}