import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";

const {log, permissionCheck, sleep} = require("../../../modules/jerryUtils.js");


module.exports = async function (client, interaction) {
    if(await permissionCheck(interaction, 0) === false) {
        return;
    }

    // Declaring variables

    // Checks

    // Main

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId("random_restart_button")
                .setLabel("Restart")
                .setStyle("PRIMARY")
                .setDisabled(false)
        );

    const number = Math.floor(Math.random());

    const random_embed = new MessageEmbed()
        .setColor("GREEN")
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setTitle("Coinflip")
        .addFields(
            {name: "Coin", value: `${number ? "Head" : "Tail"}`, inline: false},
            {name: "Binary", value: `${number}`, inline: false}
        );

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
        const button_collector = interaction.channel.createMessageComponentCollector({filter, time: 10000});

        button_collector.on("collect", async (buttonInteraction) => {
            await buttonInteraction.deferUpdate();
            await button_collector.stop();

            const number = Math.round(Math.random());

            if(buttonInteraction.customId == "random_restart_button") {
                random_embed
                    .setFields(
                        {name: "Coin", value: `${number ? "Head" : "Tail"}`, inline: false},
                        {name: "Decimal", value: `${number}`, inline: false}
                    );

                await interaction.editReply({embeds: [random_embed], components: [row]});
                Restart();
            }
        });

        button_collector.on("end", (collected, reason) => {
            if(reason === "time") {
                row.components[0].setDisabled(true);

                interaction.editReply({embeds: [random_embed], components: [row]});
            }
        });
    }
};
