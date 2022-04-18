const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const Sleep = require('../../modules/sleep');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription("Restarts the bot.")
        .addStringOption((options) =>
            options
                .setName('type')
                .setDescription("The type of restart (soft or hard). Defaults to soft.")
                .addChoice("Soft", 'soft')
                .addChoice("Hard", 'hard')
                .setRequired(false))
        .addStringOption((options) =>
            options
                .setName('reason')
                .setDescription("The reason for the restart request.")
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("Whether you want the bot's messages to only be visible to yourself.")
                .setRequired(false)),
    async execute(client, interaction) {
        //Command information
        const REQUIRED_ROLE = "PL3";

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral');

        const restart_type = interaction.options.getString('type') || "soft";
        const reason = interaction.options.getString('reason');

        const destroying_client = new MessageEmbed()
            .setColor('FUCHSIA')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription("Destroying the client...");

        //Checks
        if(!interaction.member.roles.cache.find(role => role.name == REQUIRED_ROLE)) {
            const error_permissions = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: `You need at least the '${REQUIRED_ROLE}' role to use this command.`});

            interaction.reply({embeds: [error_permissions], ephemeral: is_ephemeral});
            return;
        }

        //Code
        interaction.reply({content: "This command is currently under development.", ephemeral: is_ephemeral});
        return;

        switch(restart_type) {
            case "soft":
                const soft_restart = new MessageEmbed()
                    .setColor('#ffff20')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription("Initiating a soft restart...");

                interaction.reply({embeds: [soft_restart], ephemeral: false})
                await interaction.channel.send({embeds: [destroying_client], ephemeral: false})
                const channel = client.channels.cache.get(interaction.channel.id);
                client.destroy();

                await Sleep(1000)
                await client.login(process.env.DISCORD_BOT_TOKEN_JERRY)
                const online = new MessageEmbed()
                    .setColor('GREEN')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription("The bot has restarted!");

                channel.send({embeds: [online], ephemeral: false});
                break;
            case "hard":
                const hard_restart = new MessageEmbed()
                    .setColor('#ffff20')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription("Initiating a hard restart...")

                interaction.reply({embeds: [hard_restart], ephemeral: false})
                await interaction.channel.send({embeds: [destroying_client], ephemeral: false})

                //STOP HERE

                break;
        }
    }
}
