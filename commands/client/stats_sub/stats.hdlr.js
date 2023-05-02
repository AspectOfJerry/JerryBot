const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");
const Path = require("path");

const {GetSubCommandFiles, Log, Sleep} = require("../../../modules/JerryUtils.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription("Shows statistics about the bot.")
        .addSubcommand(subcommand =>
            subcommand
                .setName('bot')
                .setDescription("Shows statistics about the bot.")),
    async execute(client, interaction) {
        // Declaring variables

        // Checks

        // Main
        const subcommand_files = await GetSubCommandFiles(Path.resolve(__dirname, "./"), ".subcmd.js");

        for(const file of subcommand_files) {
            if(file.endsWith(interaction.options.getSubcommand() + ".subcmd.js")) {
                await Log("append", "hdlr", "├─Handing controls to subcommand file...", "DEBUG");
                require(file)(client, interaction);
                break;
            }
        }
    }
};
