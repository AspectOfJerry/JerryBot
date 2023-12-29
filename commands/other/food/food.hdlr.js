import {SlashCommandBuilder} from "@discordjs/builders";

import {logger, sleep} from "../../../utils/jerryUtils.js";


export default {
    data: new SlashCommandBuilder()
    .setName("food")
    .setDescription("Sends food emojis.")
    .addSubcommand(subcommand =>
        subcommand
        .setName("pizza")
        .setDescription("Pizza is good!"))
    .addSubcommand(subcommand =>
        subcommand
        .setName("sushi")
        .setDescription("Sushi is good!"))
    .addSubcommand(subcommand =>
        subcommand
        .setName("hamburger")
        .setDescription("Hamburger is good!")),
    async execute(client, interaction) {
        logger.append("debug", "HDLR", "Searching for subcommand file...");
        (await import(`./${interaction.commandName}_${interaction.options.getSubcommand()}.subcmd.js`)).default(client, interaction);
    }
};
