const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");

const {GetSubCommandFiles, Log, Sleep} = require("../../../modules/JerryUtils");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('logs')
        .setDescription("Perform an action with the bot's log files.")
        .addSubcommand(subcommand =>
            subcommand
                .setName('append')
                .setDescription("Appends a string to the active log file.")
                .addStringOption((options) =>
                    options
                        .setName('body')
                        .setDescription("[REQUIRED] The string to append to the log file.")
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('read')
                .setDescription("Read a line from a log file starting with the latest line.")
                .addIntegerOption((options) =>
                    options
                        .setName('offset')
                        .setDescription("[OPTIONAL] Number of the line to read starting with the latest line. Defaults to 0 (latest line).")
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('get')
                .setDescription("Sends the latest log file.")
                .addIntegerOption((options) =>
                    options
                        .setName('offset')
                        .setDescription("[OPTIONAL] Number of days to skip starting with the current day going back. Defaults to 0 (today).")
                        .setRequired(false))),
    async execute(client, interaction) {
        // Declaring variables

        // Checks

        // Main
        const subcommand_files = await GetSubCommandFiles(Path.resolve(__dirname, './'), '.subcmd.js');

        for(const file of subcommand_files) {
            if(file.includes(interaction.options.getSubcommand())) {
                await Log('append', "hdlr", `├─Handing controls to subcommand file...`, 'DEBUG');
                require(file)(client, interaction);
            }
        }
    }
};
