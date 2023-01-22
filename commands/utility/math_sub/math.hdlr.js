const fs = require("fs");
const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");

const {GetSubCommandFiles, Log, Sleep} = require("../../../modules/JerryUtils");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('math')
        .setDescription("Commands related to mathematics")
        .addSubcommand(subcommand =>
            subcommand
                .setName('average')
                .setDescription("Calculate the average of rational numbers.")
            // .addStringOption((options) =>
            //     options
            //         .setName('SUBCMD_OPTION_NAME')
            //         .setDescription("[REQUIRED/OPTIONAL] SUBCMD_OPTION_DESCRIPTION")
            //         .setRequired(true / false))
        )
    // .addSubcommand(subcommand =>
    //     subcommand
    //         .setName('SUBCMD_NAME')
    //         .setDescription("SUBCMD_DESCRIPTION")
    //     .addStringOption((options) =>
    //         options
    //             .setName('SUBCMD_OPTION_NAME')
    //             .setDescription("[REQUIRED/OPTIONAL] SUBCMD_OPTION_DESCRIPTION")
    //             .setRequired(true / false)))
    ,
    async execute(client, interaction) {
        // Declaring variables

        // Checks

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