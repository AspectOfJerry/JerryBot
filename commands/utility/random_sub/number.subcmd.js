const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const {PermissionCheck, Log, Sleep} = require("../../../modules/JerryUtils.js");


module.exports = async function (client, interaction) {
    if(await PermissionCheck(interaction) === false) {
        return;
    }

    // Declaring variables
    const min = interaction.options.getInteger('min') ?? 0;
    const max = interaction.options.getInteger('max') ?? 100;

    // Checks

    // Main

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId("random_restart_button")
                .setLabel("Restart")
                .setStyle("PRIMARY")
                .setDisabled(false),
            new MessageButton()
                .setCustomId("random_cancel_button")
                .setLabel("Cancel")
                .setStyle("SECONDARY")
                .setDisabled(false)
        );

    const random_embed = new MessageEmbed()
        .setColor("GREEN")
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setTitle(`Math random ${min} to ${max}`)
        .setDescription(`Random number: **${Math.floor((Math.random() * (max - min)) + min)}**`);

    await interaction.reply({embeds: [random_embed], components: [row]});

    const filter = async (button_collector) => {
        if(button_collector.user.id == interaction.user.id) {
            return true;
        }
        button_collector.reply({content: "You cannot use this button.", ephemeral: true});
        return;
    };

    await Restart();

    async function Restart() {
        const button_collector = interaction.channel.createMessageComponentCollector({filter, time: 30000});

        button_collector.on("collect", async (buttonInteraction) => {
            await buttonInteraction.deferUpdate();
            await button_collector.stop();

            if(buttonInteraction.customId == "random_restart_button") {
                random_embed.setDescription(`Random number: **${Math.floor((Math.random() * (max - min)) + min)}**`);

                await interaction.editReply({embeds: [random_embed]});
                Restart();
            }

            if(buttonInteraction.customId === "random_cancel_button") {
                row.components[0]
                    .setStyle("SECONDARY")
                    .setDisabled(true);
                row.components[1]
                    .setStyle("SUCCESS")
                    .setDisabled(true);

                await interaction.editReply({embeds: [random_embed], components: [row]});
            }
        });
    }
};
