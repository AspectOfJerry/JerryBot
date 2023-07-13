const process = require("process");
import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

const fetch = require("node-fetch");

const {log, permissionCheck, sleep} = require("../../../modules/jerryUtils.js");


module.exports = async function (client, interaction) {
    await interaction.deferReply();
    if(await permissionCheck(interaction, 0) === false) {
        return;
    }

    // Declaring variables
    const nasa_red_hex = "#FC3D21";
    let apodDate;
    let apodExplanation;
    let apodUrl;
    let apodImageUrl;
    let apodTitle;

    // Checks

    // Main
    // API request
    await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY_JERRY}`)
        .then(res => res.json())
        .then(async (res) => {
            if(res.error) {
                const api_request_failure_exception = new MessageEmbed()
                    .setColor("RED")
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setTitle("APIRequestFailureException")
                    .setDescription("An error occured while trying to fetch the APOD from NASA. Please try again later.")
                    .addFields(
                        {title: "Error code", description: `${res.error.code}`, inline: false},
                        {title: "Description", description: `${res.error.message}`}
                    );

                interaction.editReply({embeds: [api_request_failure_exception]});
                return;
            }

            if(res.hdurl) {
                apodImageUrl = res.hdurl;
            } else if(res.thumbnail_url) {
                apodImageUrl = res.thumbnail_url;
            }

            if(res.media_type == "image") {
                apodImageUrl = res.hdurl;
            } else if(res.media_type == "video") {
                apodImageUrl = res.thumbnail_url;
            }

            apodDate = res.date;
            apodExplanation = res.explanation;
            apodUrl = res.url;
            apodTitle = res.title;
        });

    const nasa_apod = new MessageEmbed()
        .setColor(nasa_red_hex)
        .setTitle("NASA Astronomy Picture of the Day (APOD)")
        .setURL("https://apod.nasa.gov/apod/astropix.html")
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setDescription(`${apodExplanation}`)
        .addFields(
            {name: "Title", value: `${apodTitle}`, inline: true},
            {name: "Date", value: `${apodTitle}`, inline: true}
        ).setFooter({text: "NASA Open APIs", iconURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/110px-NASA_logo.svg.png"})
        .setImage(`${apodImageUrl}`);

    interaction.editReply({embeds: [nasa_apod]});
};
