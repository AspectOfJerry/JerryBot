import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
const Path = require("path");

const {getSubCommandFiles, log, sleep} = require("../../../modules/jerryUtils.js");


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
        // eslint-disable-next-line no-undef
        const subcommand_files = await getSubCommandFiles(Path.resolve(__dirname, "./"), ".subcmd.js");

        for(const file of subcommand_files) {
            if(file.endsWith(interaction.options.getSubcommand() + ".subcmd.js")) {
                await log("append", "hdlr", "├─Handing controls to subcommand file...", "DEBUG");
                require(file)(client, interaction);
                break;
            }
        }
    }
};
