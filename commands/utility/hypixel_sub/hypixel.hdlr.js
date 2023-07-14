import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import path from "path";

import {getSubCommandFiles, log, sleep} from "../../../modules/jerryUtils.js";


export default {
    data: new SlashCommandBuilder()
        .setName("hypixel")
        .setDescription("Hypixel related commands")
        .addSubcommand(subcommand =>
            subcommand
                .setName("api")
                .setDescription("Makes an API request to Hypixel"))
    // .addSubcommand(subcommand =>
    // subcommand
    // .setName("SUBCMD_NAME")
    // .setDescription("SUBCMD_DESCRIPTION")
    // .addStringOption((options) =>
    //     options
    //         .setName("SUBCMD_OPTION_NAME")
    //         .setDescription("[REQUIRED/OPTIONAL] SUBCMD_OPTION_DESCRIPTION")
    //         .setRequired(true / false))
    // )
    ,
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
