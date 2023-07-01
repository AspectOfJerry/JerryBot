const {MessageActionRow, MessageButton, MessageEmbed} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");

const {log, permissionCheck, sleep} = require("../../modules/jerryUtils.js");


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
        if(await permissionCheck(interaction, 3) === false) {
            return;
        }

        // Declaring variables
        const voice_channel = interaction.options.getChannel("channel") || interaction.member.voice.channel;
        log("append", interaction.guild.id, `├─voice_channel: '${voice_channel.name}'`, "INFO");

        // Checks

        if(!interaction.member.voice.channel) {
            const not_in_vc = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setTitle("VoiceStateException")
                .setDescription("You must be in a voice channel if you are not providing a voice channel.");

            interaction.reply({embeds: [not_in_vc]});
            log("append", interaction.guild.id, `└─'${interaction.user.tag}' was not in a voice channel and did not provide a channel`, "WARN");
            return;
        }

        if(!voice_channel.isVoice) {
            const invalid_input_channel_type_exception = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setTitle("InvalidInputChannelTypeException")
                .setDescription(`<#${voice_channel.id}> is not a voice channel!`);

            interaction.reply({embeds: [invalid_input_channel_type_exception]});
            log("append", interaction.guild.id, `└─The provided channel was not a voice channel (${voice_channel.name}).`);
            return;
        }

        // Main
        try {
            voice_channel.members.size;
        } catch {
            const empty_voice_channel = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription(`The <#${voice_channel.id}> voice channel is empty.`);

            interaction.reply({embeds: [empty_voice_channel]});
            log("append", interaction.guild.id, "└─The provided channel was empty.", "WARN");
            return;
        }

        let memberCount = voice_channel.members.size;
        const disconnecting_members = new MessageEmbed()
            .setColor("YELLOW")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription(`Disconnecting all ${memberCount} members from <#${voice_channel.id}>...`);

        await interaction.reply({embeds: [disconnecting_members]});
        log("append", interaction.guild.id, `└─Attemping to disconnect all member in the '${voice_channel.name}' voice channel...`, "WARN");

        let failedMemberCount = 0;
        let failedString = "";

        await voice_channel.members.forEach(async (member) => {
            const voice_channel = member.voice.channel; // using variable here because we wont be able to access it after the member is disconnected
            await member.voice.setChannel(null)
                .then(() => {
                    // const disconnect_success = new MessageEmbed()
                    //     .setColor("GREEN")
                    //     .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    //     .setDescription(`Successfully disconnected <@${member.id}> from <#${voice_channel.id}>.`);

                    // interaction.editReply({embeds: [disconnect_success], ephemeral: true});
                    log("append", interaction.guild.id, `├─Successfully disconnected '${member.tag}' from the '${voice_channel.name}' voice channel.`, "INFO");
                }).catch(() => {
                    // const disconnect_error = new MessageEmbed()
                    //     .setColor("RED")
                    //     .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    //     .setDescription(`An error occurred while disconnecting <@${member.id}>.`);

                    // interaction.editReply({embeds: [disconnect_error]});
                    log("append", interaction.guild.id, `├─An error occurred while disconnecting '${member.tag}' from '${voice_channel.name}'.`);
                    memberCount--;
                    failedMemberCount++;
                });
        });

        // using a functio because too lazy to figure out why the final embed was being sent before the disconnects :/
        let embedColor = "GREEN";
        if(failedMemberCount !== 0) {
            embedColor = "YELLOW";
            failedString = `\nFailed to disconnect ${failedMemberCount} members.`;
        }
        if(failedMemberCount !== 0 && memberCount === 0) {
            embedColor = "RED";
        }

        const disconnected = new MessageEmbed()
            .setColor(embedColor)
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription(`Successfully disconnected ${memberCount} members from <#${voice_channel.id}>.${failedString}`);

        interaction.editReply({embeds: [disconnected]});
        log("append", interaction.guild.id, `└─Successfully disconnected ${memberCount} members from '${voice_channel.name}' and failed to disconnect ${failedMemberCount} members.`, "INFO");
    }
};
