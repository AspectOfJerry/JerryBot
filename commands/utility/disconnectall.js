const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");

const {PermissionCheck, Log, Sleep} = require("../../modules/JerryUtils.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("disconnectall")
        .setDescription("Disconnects everyone in a user's channel.")
        .addChannelOption((options) =>
            options
                .setName("channel")
                .setDescription("[OPTIONAL] The channel to disconnect everyone from. Defaults to your voice channel.")
                .setRequired(false)),
    async execute(client, interaction) {
        if(await PermissionCheck(interaction) === false) {
            return;
        }

        // Declaring variables
        let voice_channel = interaction.options.get("channel");

        // Checks
        if(!voice_channel) {
            if(!interaction.member.voice.channel) {
                const not_in_vc = new MessageEmbed()
                    .setColor("RED")
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription("You must be in a voice channel if you are not providing a voice channel.");

                interaction.reply({embeds: [not_in_vc]});
                Log("append", interaction.guild.id, `└─'${interaction.user.tag}' was not in a voice channel and did not provide a channel`, "WARN"); // Logs
                return;
            }
            voice_channel = interaction.member.voice.channel;
            await Log("append", interaction.guild.id, `├─channel: '${voice_channel.name}'`, "INFO");
            await Log("append", interaction.guild.id, `├─No channel was provided. Using 'interaction.member.voice.channel' (${voice_channel.name})`, "INFO");
        }
        if(!voice_channel.isVoice) {
            const error_not_voice_channel = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription(`<#${voice_channel.channel.id}> is not a voice channel!`);

            interaction.reply({embeds: [error_not_voice_channel]});
            Log("append", interaction.guild.id, `└─The provided channel was not a voice channel (${voice_channel.channel.name}).`);
            return;
        }

        // Main
        try {
            voice_channel.members.size;
        } catch {
            const empty_voice_channel = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription(`The <#${voice_channel.channel.id}> voice channel is empty.`);

            interaction.reply({embeds: [empty_voice_channel]});
            Log("append", interaction.guild.id, "└─The provided channel was empty.", "WARN");
            return;
        }

        let member_count = interaction.member.voice.channel.members.size;
        const disconnecting_members = new MessageEmbed()
            .setColor("YELLOW")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription(`Disconnecting all ${member_count} members from <#${voice_channel.channel.id}>...`);

        interaction.reply({embeds: [disconnecting_members]});
        await Log("append", interaction.guild.id, `└─Attemping to disconnect all member in the '${voice_channel.name}' voice channel...`, "WARN");

        let failed_member_count = 0;
        let failed_string = "";

        await voice_channel.members.forEach(async (member) => {
            let voice_channel = member.voice.channel;
            await member.voice.setChannel(null)
                .then(() => {
                    const disconnect_success = new MessageEmbed()
                        .setColor("GREEN")
                        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                        .setDescription(`Successfully disconnected <@${member.id}> from <#${voice_channel.channel.id}>.`);

                    interaction.editReply({embeds: [disconnect_success], ephemeral: true});
                    Log("append", interaction.guild.id, `├─Successfully disconnected '${member.tag}' from the '${voice_channel.name}' voice channel.`, "INFO");
                }).catch(() => {
                    const disconnect_error = new MessageEmbed()
                        .setColor("RED")
                        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                        .setDescription(`An error occurred while disconnecting <@${member.id}>.`);

                    interaction.editReply({embeds: [disconnect_error]});
                    Log("append", interaction.guild.id, `├─An error occurred while disconnecting '${member.tag}' from the '${voice_channel.name}' voice channel.`);
                    member_count--;
                    failed_member_count++;
                });
            await Sleep(100);
        });
        let embed_color = "GREEN";
        if(failed_member_count !== 0) {
            embed_color = "YELLOW";
            failed_string = `\nFailed to disconnect ${failed_member_count} members.`;
        }
        if(failed_member_count !== 0 && member_count === 0) {
            embed_color = "RED";
        }

        const disconnected = new MessageEmbed()
            .setColor(embed_color)
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription(`Successfully disconnected ${member_count} members from <#${voice_channel.channel.id}>.${failed_string}`);

        interaction.editReply({embeds: [disconnected]});
        Log("append", interaction.guild.id, `└─Successfully disconnected ${member_count} members from '${voice_channel.name}' and failed to disconnect ${failed_member_count} members.`, "INFO");
    }
};
