const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require('discord.js');

const {Log, Sleep} = require('../../../modules/JerryUtils');

module.exports = async function (client, interaction) {
    await Log('append', interaction.guild.id, `└─'${interaction.user.tag}' executed '/311 roles'.`, 'INFO'); // Logs
    // interaction.deferReply();

    // Set minimum execution role
    switch(interaction.guild.id) {
        case process.env.DISCORD_JERRY_GUILD_ID:
            var MINIMUM_EXECUTION_ROLE = null;
            break;
        case process.env.DISCORD_GOLDFISH_GUILD_ID:
            var MINIMUM_EXECUTION_ROLE = null;
            break;
        case process.env.DISCORD_CRA_GUILD_ID:
            var MINIMUM_EXECUTION_ROLE = null;
            break;
        case process.env.DISCORD_311_GUILD_ID:
            var MINIMUM_EXECUTION_ROLE = null;
            break;
        default:
            await Log('append', interaction.guild.id, "  └─Throwing because of bad permission configuration.", 'ERROR'); // Logs
            throw `Error: Bad permission configuration.`;
    }

    // Declaring variables

    // Checks
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
            await Log('append', interaction.guild.id, `  └─'${interaction.user.id}' did not have the required role to perform '/311 roles'. [error_permissions]`, 'WARN'); // Logs
            return;
        }
    }
    // -----END ROLE CHECK-----

    // Main
    const select_menu = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('select_menu')
                .setPlaceholder("Select a role")
                .setMinValues(1)
                .addOptions([
                    {
                        lablel: "311_schedule",
                        description: "This role is mentioned in the schedule announcer.",
                        value: "schedule"
                    }
                ])
        );

    const filter = async (selectMenuInteraction) => {
        if(selectMenuInteraction.member.roles.highest.position > interaction.member.roles.highest.position) {
            isOverriddenText = ` (overriden by <@${selectMenuInteraction.user.id}>)`;
            await Log('append', interaction.guild.id, `├─'${selectMenuInteraction.user.tag}' overrode the decision.`, 'WARN'); // Logs
            return true;
        } else if(selectMenuInteraction.user.id == interaction.user.id) {
            return true;
        } else {
            await selectMenuInteraction.reply({content: "You cannot use this button.", ephemeral: true});
            await Log('append', interaction.guild.id, `├─'${selectMenuInteraction.user.tag}' did not have the permission to use this button.`, 'WARN'); // Logs
            return;
        }
    };

    const prompt_roles = new MessageEmbed()
        .setColor('YELLOW')
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setTitle('Self-toggle roles')
        .setDescription('Select the roles you want to toggle in the dropdown menu.');

    await interaction.reply({embeds: [prompt_roles], components: [select_menu]})
        .then(async (msg) => {
            const select_menu_collector = await msg.createMessageComponentCollector({filter, componentType: "SELECT_MENU", time: 15000});

            select_menu_collector.on('collect', async (selectMenuInteraction) => {
                if(selectMenuInteraction.customId == "select_menu") {
                    const selected = selectMenuInteraction.values;

                    if(selected.includes('schedule')) {
                        await selectMenuInteraction.member.roles.add('');
                    }

                    const added_embed = new MessageEmbed()
                        .setColor('GREEN')
                        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)

                }
            });
        });
};
