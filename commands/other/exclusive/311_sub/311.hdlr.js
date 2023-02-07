const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");
const Path = require("path");

const {GetSubCommandFiles, Log, Sleep} = require("../../../../modules/JerryUtils");


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
                .setDescription("Get today's weather."))
        .addSubcommand(subcommand =>
            subcommand
                .setName('roles')
                .setDescription("Self add/remove some roles."))
        .addSubcommand(subcommand =>
            subcommand
                .setName('verify')
                .setDescription("Identify yourself")),
    async execute(client, interaction) {
        // Declaring variables

        // Checks
        // Whitelist
        if(interaction.guild.id != '1014278986135781438') {
            const cmd_not_avail_in_guild = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription("This command is not available in this guild!");

            await interaction.reply({embeds: [cmd_not_avail_in_guild]});
            return;
        }

        // Main
        const subcommand_files = await GetSubCommandFiles(Path.resolve(__dirname, "./"), ".subcmd.js");

        for(const file of subcommand_files) {
            if(file.endsWith(interaction.options.getSubcommand() + ".subcmd.js")) {
                await Log("append", "hdlr", `├─Handing controls to subcommand file...`, "DEBUG");
                require(file)(client, interaction);
                break;
            }
        }
    }
};
