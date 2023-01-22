const fs = require("fs");
const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");

const {GetSubCommandFiles, Log, Sleep} = require("../../../modules/JerryUtils");


const quiz_1_name = "esp_translate"

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quiz')
        .setDescription("Custom quiz commands")
        .addSubcommand(subcommand =>
            subcommand
                .setName(`${quiz_1_name}`)
                .setDescription("Quiz on word translation"))
    // .addSubcommand(subcommand =>
    //     subcommand
    //         .setName('SUBCMD_NAME')
    //         .setDescription("SUBCMD_DESCRIPTION")
    //         .addStringOption((options) =>
    //             options
    //                 .setName('SUBCMD_OPTION_NAME')
    //                 .setDescription("[REQUIRED/OPTIONAL] SUBCMD_OPTION_DESCRIPTION")
    //                 .setRequired(true / false)))
    ,
    async execute(client, interaction) {
        // Declaring variables

        // Checks
        await interaction.reply('This feature is currently under development and will be available soon.');
        return;

        // Main
        const subcommand_files = await GetSubCommandFiles(Path.resolve(__dirname, './'), '.subcmd.js');

        for(const file of subcommand_files) {
            if(file.includes(interaction.options.getSubcommand())) {
                await Log("append", "hdlr", `├─Handing controls to subcommand file...`, 'DEBUG');
                require(file)(client, interaction);
            }
        }
    }
};
