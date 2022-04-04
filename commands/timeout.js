const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const ms = require('ms')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Times out a member for a specified amount of time.")
        .addUserOption((options) =>
            options
                .setName("user")
                .setDescription("The user to timeout.")
                .setRequired(true)
        )
        .addStringOption((options) =>
            options
                .setName("duration")
                .setDescription("The amount of time to timeout the member for.")
                .setRequired(true)
        )
        .addStringOption((options) =>
            options
                .setName("reason")
                .setDescription("The reason for the timeout.")
                .setRequired(false)
        ),
    async execute(client, interaction) {
        //Declaring variables
        const target = interaction.options.getUser('user')
        const duration = interaction.options.getString('duration')
        const reason = interaction.options.getString('reason') || "No reason provided."
        const memberTarget = interaction.guild.members.cache.get(target.id)

        const durationInMs = ms(duration)

        //Check

        if(memberTarget.id == interaction.user.id) {
            const error_cannot_use_on_self = new MessageEmbed()
                .setColor('ff2020')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("Error")
                .setDescription('You cannot timeout yourself.')

            interaction.reply({embeds: [error_cannot_use_on_self], ephemeral: false});
            return;
        }
        if(!durationInMs) {
            const error_duration = new MessageEmbed()
                .setColor('#ff2020')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('Error')
                .setDescription('Invalid duration. Please use a valid duration.')
                .addField("Examples", "1s *(min)*, 5m, 1h, 30d *(max)*")

            interaction.reply({embeds: [error_duration], ephemeral: false});
            return;
        }

        //Code
        memberTarget.timeout(durationInMs, reason)
            .then(timeoutResult => {
                const success_timeout = new MessageEmbed()
                    .setColor('20ff20')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setTitle("User timeout")
                    .setDescription(`<@${interaction.user.id}> timed out <@${memberTarget.id}> for ${duration}.`)

                interaction.reply({embeds: [success_timeout], ephemeral: false});
            })
    }
}
