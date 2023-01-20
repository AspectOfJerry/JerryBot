const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");
const Path = require('path');

const {GetSubCommandFiles, Log, Sleep} = require("../../../modules/JerryUtils");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('sudo')
        .setDescription("SuperUser commands.")
        .addSubcommand(subcommand =>
            subcommand
                .setName('blacklist')
                .setDescription("[SUDO] Adds a user to the bot's blacklist preventing them to interact with it.")
                .addUserOption((options) =>
                    options
                        .setName('user')
                        .setDescription("[REQUIRED] The user to blacklist. If you wish to use an ID, put anything here and use the id option.")
                        .setRequired(true))
                .addIntegerOption(options =>
                    options
                        .setName('id')
                        .setDescription("[OPTIONAL] The user id to blacklist. This option OVERWRITES the user option.").
                        setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('nuke')
                .setDescription("[SUDO] Nukes the current guild if not in the safe list, effectively deleting most of its content.")),
    async execute(client, interaction) {
        // Declaring variables

        // Checks

        // Main

        const subcommand_files = await GetSubCommandFiles();

        for(const file of subcommand_files) {
            if(file.contains(interaction.commandName)) {
                await Log('append', "hdlr", `├─Handing controls to subcommand file...`, 'DEBUG');
                require(file)(client, interaction);
            }
        }
    }
};
