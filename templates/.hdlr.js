import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import path from "path";

import {getSubCommandFiles, logger, sleep} from "../../../modules/jerryUtils.js";


export default {
    data: new SlashCommandBuilder()
        .setName("STRING")
        .setDescription("STRING")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("STRING")
                .setDescription("STRING")
            // .addStringOption((options) =>
            //     options
            //         .setName("STRING")
            //         .setDescription("[REQUIRED/OPTIONAL] SUBCMD_OPTION_DESCRIPTION")
            //         .setRequired(BOOL))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("STRING")
                .setDescription("STRING")
            // .addStringOption((options) =>
            //     options
            //         .setName("SUBCMD_OPTION_NAME")
            //         .setDescription("[REQUIRED/OPTIONAL] SUBCMD_OPTION_DESCRIPTION")
            //         .setRequired(BOOL))
        ),
    async execute(client, interaction) {
        // Declaring variables

        // Checks

        // Main
        const __filename = new URL(import.meta.url).pathname;
        const __dirname = path.dirname(__filename);
        const subcommand_files = await getSubCommandFiles(path.resolve(__dirname, "./"), ".subcmd.js");

        for(const file of subcommand_files) {
            if(file.endsWith(interaction.options.getSubcommand() + ".subcmd.js")) {
                logger.append("debug", "STDOUT", "Handing controls to subcommand file...");
                (await import(file)).default(client, interaction);
                break;
            }
        }
    }
};
