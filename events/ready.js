import process from "process";
import fs from "fs";
import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v9";

import {connect, refreshGuildCollection} from "../database/mongodb.js";
import {logger, sleep, StartJobs} from "../utils/jerryUtils.js";
import {checklistBotReady, checklistJobs, startTelemetry} from "../utils/telemetry.js";
import {refreshHubs} from "../utils/voiceChannelHubManager.js";


export default {
    name: "ready",
    once: true,
    async execute(client, commands) {
        console.log("JerryBot is now online.");
        logger.append("info", "RDY", "\"@JerryBot#9090\" is now online.");

        const rest = new REST({version: "9"}).setToken(process.env.DISCORD_BOT_TOKEN_JERRY); // REST

        const client_id = client.user.id;

        if (process.env.npm_lifecycle_event === "clean") {
            return;
        }

        if (process.env.npm_lifecycle_event === "clearcommands") {
            console.log("Clearing global commands...");
            logger.append("info", "RDY", "[Clearcommands] Clearing the application (/) commands...");

            await client.user.setPresence({activities: [{name: "clearing commands...", type: "PLAYING"}], status: "dnd"});

            await rest.put(Routes.applicationCommands(client_id), {body: []});

            await sleep(2500);
            console.log("Clearing local commands...");

            const local_guilds = ["1014278986135781438", "1113966154143244349"];

            for (const guild of local_guilds) {
                await rest.put(Routes.applicationGuildCommands(client_id, guild), {body: []});
                console.log(`Successfully cleared local commands in ${guild}.`);
                await sleep(500);
            }

            console.log("Sucessfully cleared all registered application (/) commands!");
            logger.append("info", "RDY", "[Clearcommands] Successfully cleared the application (/) commands!");
            await client.destroy();
            process.exit(0);
        }

        if (process.env.npm_lifecycle_event === "deploy") {
            // Register commands globally
            console.log("Registering the application (/) commands...");
            logger.append("info", "RDY", "[Deploy] Registering global application (/) commands...");

            await rest.put(Routes.applicationCommands(client_id), {body: commands.commands});

            console.log("Finished refreshing the application (/) commands globally!");
            logger.append("info", "RDY", "[Deploy] Successfully refreshed the application (/) commands globally!");

            // Local commands
            logger.append("info", "RDY", "[Deploy] Registering exclusive application (/) commands locally...");
            console.log("Deploying commands globally...");

            await rest.put(Routes.applicationGuildCommands(client_id, "1014278986135781438"), {body: [commands.exclusive.find((e) => e.name === "cra")]});
            console.log("Successfully deployed commands locally in \"1014278986135781438\".");

            logger.append("fatal", "RDY", "[Deploy] Exiting process...");
            logger.end();
            await client.destroy();
            process.exit(0);
        }

        console.log("Connecting to the database...");
        logger.append("info", "RDY", "[Database] Connecting to the database...");
        await connect();

        console.log("Refreshing the guild collection...");
        logger.append("info", "RDY", "[Database] Refreshing the guild collection...");
        await refreshGuildCollection(client);

        // Reresh Voice Channel Hubs
        console.log("Refreshing the voice channel hubs...");
        logger.append("info", "RDY", "[Database] Refreshing the voice channel hubs...");
        await refreshHubs(client);

        if (process.env.npm_lifecycle_event === "test") {
            console.log("Running a test...");
            const args = process.argv.slice(2);

            (await import(`../tests/${args[0] || "main"}.test.js`)).default(client);
            return;
        }

        // main
        if (process.env.npm_lifecycle_event !== "dev") {
            // Telemetry
            console.log("Starting telemetry...");
            await startTelemetry(client);

            // Jobs
            console.log("Starting jobs...");
            await StartJobs(client);
            checklistJobs();
        }

        // Registering commands
        if (process.env.npm_lifecycle_event === "dev") {
            try {
                console.log("Registering the application (/) commands...");
                logger.append("info", "[RDY/dev] Registering local application (/) commands...");
                await rest.put(Routes.applicationGuildCommands(client_id, "631939549332897842"), {body: commands.commands});
                console.log("Successfully deployed commands locally in \"631939549332897842\"."); // dev
                await sleep(750);

                await rest.put(Routes.applicationGuildCommands(client_id, "1014278986135781438"), {body: [...commands.commands, commands.exclusive.find((e) => e.name === "cra")]});
                console.log("Successfully deployed commands locally in \"1014278986135781438\"."); // cra
                await sleep(750);

                console.log("Successfully refreshed the application (/) commands locally!");
                logger.append("info", "[RDY/dev] Successfully refreshed the application (/) commands locally!");
            } catch (err) {
                if (err) {
                    console.error(err);
                }
            }
        }

        if (process.env.npm_lifecycle_event !== "dev") {
            checklistBotReady();
        }
    }
};

async function getTests(dir, suffix) {
    const files = await fs.readdir(dir, {withFileTypes: true});

    const returnFiles = [];

    for (const file of files) {
        const filepath = `${dir}/${file.name}`;

        if (file.isDirectory()) {
            const subFiles = await getTests(filepath, suffix);
            returnFiles.push(...subFiles);
        } else if (file.name.endsWith(suffix)) {
            returnFiles.push(filepath);
        }
    }

    return returnFiles;
}
