const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const {Log, Sleep} = require('../../modules/JerryUtils');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription("Bans a user from the guild.")
        .addUserOption((options) =>
            options
                .setName('user')
                .setDescription("[REQUIRED] The user to ban.")
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName('reason')
                .setDescription("[OPTIONAL] The reason for the ban.")
                .setRequired(false)),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'${interaction.user.tag}' executed '/ban'.`, 'INFO');
        // await interaction.deferReply();

        // Set minimum execution role
        switch(interaction.guild.id) {
            case process.env.DISCORD_JERRY_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "PL1";
                break;
            case process.env.DISCORD_GOLDFISH_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "Mod";
                break;
            case process.env.DISCORD_CRA_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "PL1";
                break;
            case process.env.DISCORD_311_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = "PL1";
                break;
            default:
                await Log('append', interaction.guild.id, "└─Throwing because of bad permission configuration.", 'ERROR');
                throw `Error: Bad permission configuration.`;
        }

        // Declaring variables
        const target = interaction.options.getUser('user');
        const memberTarget = interaction.guild.members.cache.get(target.id);
        await Log('append', interaction.guild.id, `├─memberTarget: '${memberTarget.user.tag}'`, 'INFO');

        let reason = interaction.options.getString('reason');
        await Log('append', interaction.guild.id, `├─reason: '${reason}'`, 'INFO');

        // Check
        // -----BEGIN ROLE CHECK-----
        if(MINIMUM_EXECUTION_ROLE !== null) {
            if(!interaction.member.roles.cache.find(role => role.name === MINIMUM_EXECUTION_ROLE)) {
                const error_permissions = new MessageEmbed()
                    .setColor('RED')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setTitle('PermissionError')
                    .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                    .setFooter({text: `You need at least the '${MINIMUM_EXECUTION_ROLE}' role to use this command.`});

                await interaction.reply({embeds: [error_permissions]});
                await Log('append', interaction.guild.id, `└─'${interaction.user.id}' did not have the required role to perform '/ban'. [error_permissions]`, 'WARN');
                return 10;
            }
        }
        // -----END ROLE CHECK-----
        if(memberTarget.id == interaction.user.id) {
            const error_target_self = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("Error")
                .setDescription('You cannot ban yourself.');

            interaction.reply({embeds: [error_target_self]});
            await Log('append', interaction.guild.id, `└─'${interaction.user.id}' tried to ban themselves.`, 'WARN');
            return;
        }
        // -----BEGIN HIERARCHY CHECK-----
        if(memberTarget.roles.highest.position > interaction.member.roles.highest.position) {
            const error_role_too_low = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription(`Your highest role is lower than <@${memberTarget.id}>'s highest role.`);

            interaction.reply({embeds: [error_role_too_low]});
            await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' tried to ban ${memberTarget.user.tag} but their highest role was lower.`, 'WARN');
            return;
        }
        if(memberTarget.roles.highest.position >= interaction.member.roles.highest.position) {
            const error_equal_roles = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription(`Your highest role is equal to <@${memberTarget.id}>'s highest role.`);

            interaction.reply({embeds: [error_equal_roles]});
            await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' tried to ban '${memberTarget.user.tag}' but their highest role was equal.`, 'WARN');
            return;
        }
        // -----END HIERARCHY CHECK-----
        if(!memberTarget.bannable) {
            const member_not_bannable = new MessageEmbed()
                .setColor('FUCHSIA')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTilte('Error')
                .setDescription(`<@$${memberTarget.user.id}> is not bannable by the client user.`)

            await interaction.reply({embeds: [member_not_bannable]});
            await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' is not bannable by the client user.`, 'ERROR');
            return;
        }

        // Main
        let buttonRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('ban_confirm_button')
                    .setLabel(`Ban`)
                    .setStyle('DANGER')
                    .setDisabled(false),
                new MessageButton()
                    .setCustomId('ban_cancel_button')
                    .setLabel('Cancel')
                    .setStyle('SECONDARY')
                    .setDisabled(false),
            );

        let isOverriddenText = "";

        // const now = Math.round(Date.now() / 1000);
        // const auto_cancel_timestamp = now + 10;

        const confirm_ban = new MessageEmbed()
            .setColor('YELLOW')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle(`Confirm Ban`)
            .setDescription(`Are you sure you want to ban <@${memberTarget.id}>?`)
            // .addFields(
            //     {name: 'Auto cancel', value: `> :red_square: Canceling <t:${auto_cancel_timestamp}:R>*.`, inline: false}
            // ).setFooter({text: "*Relative timestamps look out of sync depending on your timezone."});
            .setFooter({text: "🟥 Canceling in 10s"});

        await interaction.reply({embeds: [confirm_ban], components: [buttonRow]});
        await Log('append', interaction.guild.id, `├─Execution authorized. Waiting for the confirmation.`, 'INFO');

        // Creating a filter for the collector
        const filter = async (buttonInteraction) => {
            if(buttonInteraction.member.roles.highest.position > interaction.member.roles.highest.position) {
                isOverriddenText = ` (overriden by <@${buttonInteraction.user.id}>)`;
                await Log('append', interaction.guild.id, `├─'${buttonInteraction.user.tag}' overrode the decision.`, 'WARN');
                return true;
            } else if(buttonInteraction.user.id == interaction.user.id) {
                return true;
            } else {
                await buttonInteraction.reply({content: "You cannot use this button.", ephemeral: true});
                await Log('append', interaction.guild.id, `├─'${buttonInteraction.user.tag}' did not have the permission to use this button.`, 'WARN');
                return;
            }
        }

        const button_collector = interaction.channel.createMessageComponentCollector({filter, componentType: "BUTTON", time: 10000});

        button_collector.on('collect', async buttonInteraction => {
            await buttonInteraction.deferUpdate();
            await button_collector.stop();
            // Disabling buttons
            buttonRow.components[0]
                .setDisabled(true);
            buttonRow.components[1]
                .setDisabled(true);
            await interaction.editReply({embeds: [confirm_ban], components: [buttonRow]});

            if(buttonInteraction.customId == 'ban_confirm_button') {
                const banning = new MessageEmbed()
                    .setColor('YELLOW')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`Banning <@${memberTarget.id}>...`);

                await interaction.editReply({embeds: [banning]});

                await Log('append', interaction.guild.id, `└─'${buttonInteraction.user.tag}' confirmed the ban.`, 'INFO');

                reason = reason ? ` \n**Reason:** ${reason}` : "";

                memberTarget.ban({reason: reason})
                    .then(async banResult => {
                        const success_ban = new MessageEmbed()
                            .setColor('GREEN')
                            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                            .setTitle("GuildMember ban")
                            .setDescription(`<@${interaction.user.id}> banned <@${memberTarget.id}> from the guild${isOverriddenText}.${reason}`);

                        await interaction.editReply({embeds: [success_ban], components: [buttonRow]});
                        await Log('append', interaction.guild.id, `  └─'${interaction.user.tag}' banned '${memberTarget.user.tag}' form the guild${isOverriddenText}.`, 'WARN');
                    });
            } else {
                const cancel_ban = new MessageEmbed()
                    .setColor('GREEN')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`<@${interaction.user.id}> cancelled the ban${isOverriddenText}.`);

                await interaction.editReply({embeds: [cancel_ban], components: [buttonRow]});
                await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' cancelled the ban${isOverriddenText}.`, 'INFO');
            }
        });

        button_collector.on('end', async collected => {
            // Disabling buttons
            buttonRow.components[0]
                .setDisabled(true);
            buttonRow.components[1]
                .setDisabled(true);

            if(collected.size === 0) {
                const auto_abort = new MessageEmbed()
                    .setColor('DARK_GREY')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`Auto aborted.`);

                await interaction.editReply({embeds: [auto_abort], components: [buttonRow]});
                await Log('append', interaction.guild.id, `└─Auto aborted.`, 'INFO');
                return;
            }
        });
    }
};
