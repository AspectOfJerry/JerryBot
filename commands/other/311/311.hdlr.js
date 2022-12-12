const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const {Log, Sleep} = require('../../../modules/JerryUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('311')
        .setDescription("Commands for 311.")
        .addSubcommand(subcommand =>
            subcommand
                .setName('schedule')
                .setDescription("Get the schedule for 311.")
                .addStringOption(options =>
                    options
                        .setName('day')
                        .setDescription("Get the schedule for today or next Jour. Defaults to automatic.")))
        .addSubcommand(subcommand =>
            subcommand
                .setName('weather')
                .setDescription("Get today's weather.")),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/311 [...]'.`, 'INFO'); // Logs

        // Declaring variables
        const subcommand = interaction.options.getSubcommand();

        // Checks
        if(interaction.guild.id != '1014278986135781438') {
            const cmd_not_avail_in_guild = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription("This command is not available in this guild!");

            await interaction.editReply({embeds: [cmd_not_avail_in_guild]});
            return;
        }

        // Main
        switch(subcommand) {
            case 'schedule': {
                await Log('append', "hdlr", `├─'${interaction.user.tag}' executed '/311 schedule'.`, 'INFO'); // Logs

                // Prep

                // Calling the subcommand file
                await Log('append', "hdlr", `├─Handing controls to subcommand file...`, 'DEBUG'); // Logs
                require('./311_schedule.subcmd')(client, interaction);
            }
                break;
            case 'weather': {
                await Log('append', "hdlr", `├─'${interaction.user.tag}' executed '/311 weather'.`, 'INFO'); // Logs

                // Prep

                // Calling the subcommand file
                await Log('append', "hdlr", `├─Handing controls to subcommand file...`, 'DEBUG'); // Logs
                require('./311_weather.subcmd')(client, interaction);
            }
                break;
            default:
                throw "Invalid subcommand.";
        }
    }
};
