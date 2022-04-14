const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription("Restarts the bot.")
        .addStringOption((options) =>
            options
                .setName('reason')
                .setDescription("The reason for the restart request.")
                .setRequired(false))
        .addStringOption((options) =>
            options
                .setName('type')
                .setDescription("The type of restart (soft or hard). Defaults to soft.")
                .addChoice("Soft", 'soft')
                .addChoice("Hard", 'hard')
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

        const restart_type = interaction.options.getString('restart_type') || "soft";

        const destroying_client = new MessageEmbed()
            .setColor('#ff20ff')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription("Destroying the client...");

        //Checks
        if(!interaction.member.roles.cache.find(role => role.name == REQUIRED_ROLE)) {
            const error_permissions = new MessageEmbed()
                .setColor('#ff2020')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("PermissionError")
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: `You need at least the '${REQUIRED_ROLE}' role to use this command.`});

            interaction.reply({embeds: [error_permissions], ephemeral: is_ephemeral});
            return;
        }

        //Code
        switch(restart_type) {
            case "soft":
                const soft_restart = new MessageEmbed()
                    .setColor('#ffff20')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription("Initiating a soft restart...");

                interaction.reply({embeds: [soft_restart], ephemeral: false})
                await interaction.channel.send({embeds: [destroying_client], ephemeral: false})
                    .then(messageResult => {
                        const channel = client.channels.cache.get(interaction.channel.id);
                        client.destroy();
                        setTimeout(async () => {
                            await client.login(process.env.DISCORD_BOT_TOKEN_JERRY)
                            const online = new MessageEmbed()
                                .setColor('#20ff20')
                                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                                .setDescription("The bot has restarted!");

                            channel.send({embeds: [online], ephemeral: false});
                        }, 2000);
                    })
                break;
            case "hard":
                const hard_restart = new MessageEmbed()
                    .setColor('#ffff20')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription("Initiating a hard restart...")

                interaction.reply({embeds: [hard_restart], ephemeral: false})
                await interaction.channel.send({embeds: [destroying_client], ephemeral: false})
                    .then(messageResult => {
                        //STOP HERE
                    })
                break;
        }
    }
}
