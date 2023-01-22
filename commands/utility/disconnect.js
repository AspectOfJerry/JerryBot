const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");

const {PermissionCheck, Log, Sleep} = require("../../modules/JerryUtils");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('disconnect')
        .setDescription("Disconnect a user from their voice channel.")
        .addUserOption((options) =>
            options
                .setName('user')
                .setDescription("[OPTIONAL] The user to disconnect. Defaults to yourself.")
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('all')
                .setDescription("[OPTIONAL] If you want to disconnect everyone in the targted user's voice channel. Defaults to false")
                .setRequired(false)),
    async execute(client, interaction) {
        if(await PermissionCheck(interaction) === false) {
            return;
        }

        // Declaring variables
        const target = interaction.options.getUser('user') || interaction.user;
        const memberTarget = interaction.guild.members.cache.get(target.id);
        await Log("append", interaction.guild.id, `├─memberTarget: '${memberTarget.user.tag}'`, "INFO");

        const is_all = interaction.options.getBoolean('all') || false;
        await Log("append", interaction.guild.id, `├─is_all: ${is_all}`, "INFO");

        // Checks
        if(!memberTarget.voice.channel) {
            const user_not_in_vc = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription(`Error: <@${memberTarget.id}> is not in a voice channel.`);

            interaction.reply({embeds: [user_not_in_vc]});
            await Log("append", interaction.guild.id, `├─└─'${memberTarget.tag}' is not in a voice channel.`, "WARN");
            return;
        }

        // Main
        if(!is_all) {
            const current_voice_channel = memberTarget.voice.channel;
            const disconnecting = new MessageEmbed()
                .setColor("YELLOW")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription(`Disconnecting <@${memberTarget.id}> from ${current_voice_channel}...`);

            await interaction.reply({embeds: [disconnecting]});
            await memberTarget.voice.setChannel(null)
                .then(async () => {
                    const disconnect_success = new MessageEmbed()
                        .setColor("GREEN")
                        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                        .setDescription(`Successfully disconnected <@${memberTarget.id}> from ${current_voice_channel}.`);

                    await interaction.editReply({embeds: [disconnect_success]});
                });
        } else {
            const current_voice_channel = memberTarget.voice.channel;
            const member_count = memberTarget.voice.channel.members.size;
            const disconnecting = new MessageEmbed()
                .setColor("YELLOW")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription(`Disconnecting all ${member_count} members from ${current_voice_channel}...`);

            await interaction.reply({embeds: [disconnecting]});

            await memberTarget.voice.channel.members.forEach(member => {
                let current_voice_channel = member.voice.channel
                member.voice.setChannel(null)
                    .then(async () => {
                        const disconnect_success = new MessageEmbed()
                            .setColor("GREEN")
                            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                            .setDescription(`Successfully disconnected <@${member.id}> from ${current_voice_channel}.`);

                        await interaction.channel.followUp({embeds: [disconnect_success], ephemeral: true});
                    });
            });
            const disconnect_success = new MessageEmbed()
                .setColor("GREEN")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription(`Successfully disconnected all ${member_count} members from ${current_voice_channel}.`);

            await interaction.editReply({embeds: [disconnect_success]});
        }
    }
};
