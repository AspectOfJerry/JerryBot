const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");

const {PermissionCheck, Log, Sleep} = require("../../modules/JerryUtils");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('move')
        .setDescription("Moves a user to a voice channel.")
        .addChannelOption((options) =>
            options
                .setName('channel')
                .setDescription("[REQUIRED] The targeted channel to move to.")
                .setRequired(true))
        .addUserOption((options) =>
            options
                .setName('user')
                .setDescription("[OPTIONAL] The user to move. Defaults to yourself.")
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('all')
                .setDescription("[OPTIONAL] If you want to move everyone in the user's channel with them. Defaults to false.")
                .setRequired(false)),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'@${interaction.user.tag}' executed '/${interaction.commandName}${interaction.options.getSubcommand(false) ? " " + interaction.options.getSubcommand(false) : ""}'.`, 'INFO');        
        // await interaction.deferReply();

        // Set minimum execution role
        switch(interaction.guild.id) {
            case process.env.DISCORD_JERRY_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "PL3";
                break;
            case process.env.DISCORD_GOLDFISH_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "staff";
                break;
            case process.env.DISCORD_CRA_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "PL3";
                break;
            case process.env.DISCORD_311_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "PL1";
                break;
            default:
                await Log('append', interaction.guild.id, "└─Throwing because of bad permission configuration.", 'ERROR');
                throw `Error: Bad permission configuration.`;
        }

        // Declaring variables
        const target = interaction.options.getUser('user') || interaction.user;
        const memberTarget = interaction.guild.members.cache.get(target.id);
        await Log('append', interaction.guild.id, `├─memberTarget: '${memberTarget.user.tag}'`, 'INFO');

        const is_all = interaction.options.getBoolean('all') || false;
        await Log('append', interaction.guild.id, `├─is_all: ${is_all}`, 'INFO');
        const new_voice_channel = interaction.options.getChannel('channel');

        // Checks
        // -----BEGIN ROLE CHECK-----
        if(MINIMUM_EXECUTION_ROLE !== null) {
            if(!interaction.member.roles.cache.find(role => role.name === MINIMUM_EXECUTION_ROLE)) {
                const error_permissions = new MessageEmbed()
                    .setColor('RED')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setTitle('PermissionError')
                    .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                    .setFooter({text: `Use '/help' to access the documentation on command permissions.`});

                await interaction.reply({embeds: [error_permissions]});
                await Log('append', interaction.guild.id, `└─'@${interaction.user.tag}' did not have the required role to execute '/${interaction.commandName}${interaction.options.getSubcommand(false) ? " " + interaction.options.getSubcommand(false) : ""}'. [PermissionError]`, 'WARN');
                return 10;
            }
        } // -----END ROLE CHECK-----
        if(!memberTarget.voice.channel) {
            const user_not_in_vc = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription(`Error: <@${memberTarget.id}> is not in a voice channel.`);

            interaction.reply({embeds: [user_not_in_vc]});
            return;
        }

        // Main
        if(!is_all) {
            const current_voice_channel = memberTarget.voice.channel;
            memberTarget.voice.setChannel(new_voice_channel)
                .then(async () => {
                    const success_move = new MessageEmbed()
                        .setColor('GREEN')
                        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                        .setDescription(`Successfully moved <@${memberTarget.id}> from ${current_voice_channel} to ${new_voice_channel}.`);

                    await interaction.reply({embeds: [success_move]});
                    await Log('append', interaction.guild.id, `├─Successfully moved '${member.tag}' from <#${current_voice_channel.name}> to #<${new_voice_channel.name}>.`);
                });
        } else {
            const current_voice_channel = memberTarget.voice.channel;
            let member_count = memberTarget.voice.channel.members.size;
            const moving_members = new MessageEmbed()
                .setColor('YELLOW')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription(`Moving all ${member_count} members from <#${current_voice_channel.id}> to <#${new_voice_channel.id}>...`);

            await interaction.reply({embeds: [moving_members]});
            await Log('append', interaction.guild.id, `└─Attemping to move every member in <#${current_voice_channel.name}> to <#${new_voice_channel.name}>...`);

            let failed_member_count = 0;
            let failed_string = "";

            await memberTarget.voice.channel.members.forEach(async (member) => {
                let current_voice_channel = member.voice.channel;
                await member.voice.setChannel(new_voice_channel)
                    .then(async () => {
                        const move_success = new MessageEmbed()
                            .setColor('GREEN')
                            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                            .setDescription(`Successfully moved <@${member.id}> from <#${current_voice_channel.id}> to <#${new_voice_channel.id}>.`);

                        await interaction.editReply({embeds: [move_success]});
                        await Log('append', interaction.guild.id, `├─Successfully moved '${member.tag}' from <#${current_voice_channel.name}> to #<${new_voice_channel.name}>.`);
                    }).catch(async () => {
                        const move_error = new MessageEmbed()
                            .setColor('RED')
                            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                            .setDescription(`An error occurred while moving <@${member.id}>.`);

                        await interaction.editReply({embeds: [move_error]});
                        await Log('append', interaction.guild.id, `├─An error occurred while moving '${member.tag}' from <#${current_voice_channel.name}> to #<${new_voice_channel.name}>.`);

                        member_count--
                        failed_member_count++
                    });
                await Sleep(100);
            });
            let embed_color = 'GREEN';
            if(failed_member_count !== 0) {
                embed_color = 'YELLOW';
                failed_string = `\nFailed to move ${failed_member_count} members.`;
            }
            if(failed_member_count !== 0 && member_count === 0) {
                embed_color = 'RED';
            }

            const succes_move = new MessageEmbed()
                .setColor(embed_color)
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription(`Successfully moved ${member_count} members from <#${current_voice_channel.id}> to <#${new_voice_channel.id}>.${failed_string}`);

            await interaction.editReply({embeds: [succes_move]});
            await Log('append', interaction.guild.id, `└─Successfully moved ${member_count} members from <#${current_voice_channel.name}> to <#${new_voice_channel.name}> and failed to move ${failed_member_count} members.`);

        }
    }
};
