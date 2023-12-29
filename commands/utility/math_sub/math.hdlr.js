import fs from "fs";
import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import path from "path";
import url from "url";

import {logger, sleep} from "../../../utils/jerryUtils.js";


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
        logger.append("debug", "HDLR", "Searching for subcommand file...");
        (await import(`./${interaction.commandName}_${interaction.options.getSubcommand()}.subcmd.js`)).default(client, interaction);
    }
};
