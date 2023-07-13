import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
const path = require("path");

const {getSubCommandFiles, log, sleep} = require("../../../modules/jerryUtils.js");


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
        // eslint-disable-next-line no-undef
        const subcommand_files = await getSubCommandFiles(path.resolve(__dirname, "./"), ".subcmd.js");

        for(const file of subcommand_files) {
            if(file.endsWith(interaction.options.getSubcommand() + ".subcmd.js")) {
                await log("append", "hdlr", "├─Handing controls to subcommand file...", "DEBUG");
                require(file)(client, interaction);
                break;
            }
        }
    }
};
