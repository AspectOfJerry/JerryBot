const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");
const Path = require("path");

const {GetSubCommandFiles, Log, Sleep} = require("../../../modules/JerryUtils.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('random')
        .setDescription("Commands related to pseudorandom number generators.")
        .addSubcommand(subcommand =>
            subcommand
                .setName('number')
                .setDescription("Generates a random number")
                .addIntegerOption((options) =>
                    options
                        .setName('min')
                        .setDescription("The minimum number. Defaults to 0")
                        .setRequired(false))
                .addIntegerOption((options) =>
                    options
                        .setName('max')
                        .setDescription("The maximum number. Defaults to 100")
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('coinflip')
                .setDescription("Coinflip!")
        ),
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
