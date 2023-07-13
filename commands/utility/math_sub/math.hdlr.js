const fs = require("fs");
import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
const Path = require("path");

const {getSubCommandFiles, log, sleep} = require("../../../modules/jerryUtils.js");


export default {
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
                .setDescription("Find the GCD and LCM of two positive integers.")
                .addIntegerOption((options) =>
                    options
                        .setName("n1")
                        .setDescription("[REQUIRED] First positive |integer|.")
                        .setRequired(true))
                .addIntegerOption((options) =>
                    options
                        .setName("n2")
                        .setDescription("[REQUIRED] Second positive |integer|.")
                        .setRequired(true)))
        .addSubcommand((subcommand) =>
            subcommand
                .setName("quadratic")
                .setDescription("Solve a quadratic equation.")
                .addNumberOption((options) =>
                    options
                        .setName("a")
                        .setDescription("[REQUIRED] The coefficient of x^2")
                        .setRequired(true))
                .addNumberOption((options) =>
                    options
                        .setName("b")
                        .setDescription("[REQUIRED] The coefficient of x")
                        .setRequired(true))
                .addNumberOption((options) =>
                    options
                        .setName("c")
                        .setDescription("[REQUIRED] The constant term")
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
