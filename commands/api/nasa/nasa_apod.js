const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const fetch = require('node-fetch');

const Sleep = require('../../../modules/sleep'); //delayInMilliseconds;
const Log = require('../../../modules/logger'); //DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─;

const jerry_nasa_api_key = process.env.NASA_API_KEY_JERRY;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nasa_apod')
        .setDescription("Sends the Astronomy Picture of the Day (APOD) from NASA")
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                .setRequired(false)),
    async execute(client, interaction) {
        //Command information
        await Log(interaction.guild.id, `'${interaction.user.tag}' executed '/nasa_apod'.`, 'INFO');
        const REQUIRED_ROLE = "everyone";

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
        await Log(interaction.guild.id, `├─ephemeral: ${is_ephemeral}`, 'INFO'); //Logs
        const nasa_logo_red_hex = '#0b3d91'
        let apod_date;
        let apod_explanation;
        let apod_url;
        let apod_image_url;
        let apod_title;

        //Checks

        //Code
        //API request
        await fetch(`https://api.nasa.gov/planetary/apod?api_key=${jerry_nasa_api_key}`)
            .then(res => res.json())
            .then(res => {
                if(res.error) {
                    const request_error = new MessageEmbed()
                        .setColor('RED')
                        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                        .setTitle("Error")
                        .setDescription("An error occured while trying to fetch the APOD from NASA. Please try again later.")
                        .addField(`Error code:`, `${res.error.code}`, false)
                        .addField(`Description`, `${res.error.message}`, false)

                    interaction.reply({embeds: [request_error], ephemeral: is_ephemeral});
                    return;
                }

                if(res.hdurl) {
                    apod_image_url = res.hdurl;
                } else if(res.thumbnail_url) {
                    apod_image_url = res.thumbnail_url;
                }

                if(res.media_type == "image") {
                    apod_image_url = res.hdurl;
                } else if(res.media_type == "video") {
                    apod_image_url = res.thumbnail_url;
                }

                apod_date = res.date;
                apod_explanation = res.explanation;
                apod_url = res.url;
                apod_title = res.title;
            })

        const nasa_apod = new MessageEmbed()
            .setColor(nasa_logo_red_hex)
            .setTitle(`NASA Astronomy Picture of the Day (APOD)`)
            .setURL(`https://apod.nasa.gov/apod/astropix.html`)
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setDescription(`${apod_explanation}`)
            .addField(`Title`, `${apod_title}`, true)
            .addField(`Date`, `${apod_date}`, true)
            .setFooter({text: "NASA Open APIs", iconURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/110px-NASA_logo.svg.png"})
            .setImage(`${apod_image_url}`)

        interaction.reply({embeds: [nasa_apod], ephemeral: is_ephemeral});
    }
}
