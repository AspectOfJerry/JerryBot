import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import path from "path";

import {getSubCommandFiles, log, sleep} from "../../../modules/jerryUtils.js";


export default {
    data: new SlashCommandBuilder()
        .setName("nasa")
        .setDescription("Executes a command related with the NASA Open APIs.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("api")
                .setDescription("Makes an API call to NASA's APOD API."))
        .addSubcommand(subcommand =>
            subcommand
                .setName("apod")
                .setDescription("Returns the Astronomy Picture of the Day (APOD) from NASA.")),
    async execute(client, interaction) {
        // Declaring variables

        // Checks

        // Main
        const __filename = new URL(import.meta.url).pathname;
        const __dirname = path.dirname(__filename);
        const subcommand_files = await getSubCommandFiles(path.resolve(__dirname, "./"), ".subcmd.js");

        for(const file of subcommand_files) {
            if(file.endsWith(interaction.options.getSubcommand() + ".subcmd.js")) {
                await log("append", "hdlr", "├─Handing controls to subcommand file...", "DEBUG");
                (await import(file)).default(client, interaction);
                break;
            }
        }
    }
};
