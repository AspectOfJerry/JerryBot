const fs = require("fs");
const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");
const Path = require("path");

const {getSubCommandFiles, log, sleep} = require("../../../modules/jerryUtils.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("math")
        .setDescription("Commands related to mathematics")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("average")
                .setDescription("Calculate the arithmetic mean of rational numbers."))
        .addSubcommand((subcommand) =>
            subcommand
                .setName("gcdlcm")
                .setDescription("Find the GCD and LCM (greatest common divider and the least common multiple) of two positive integers.")
                .addIntegerOption((options) =>
                    options
                        .setName("n1")
                        .setDescription("[REQUIRED] First positive |integer|.")
                        .setRequired(true))
                .addIntegerOption((options) =>
                    options
                        .setName("n2")
                        .setDescription("[REQUIRED] Second positive |integer|.")
                        .setRequired(true))),
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
