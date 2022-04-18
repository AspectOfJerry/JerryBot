const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const fetch = require('window-fetch')

const jerry_nasa_api_key = process.env.NASA_API_KEY_JERRY;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nasa_apod')
        .setDescription("Sends the Astronomy Picture of the Day (APOD) from NASA")
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("Whether you want the bot's messages to only be visible to yourself.")
                .setRequired(false)),
    async execute(client, interaction) {
        //Command information
        const REQUIRED_ROLE = "everyone";

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral');
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
            .then(response => response.json())
            .then(data => {
                if(data.error) {
                    const request_error = new MessageEmbed()
                        .setColor('RED')
                        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                        .setTitle("Error")
                        .setDescription("An error occured while trying to fetch the APOD from NASA. Please try again later.")
                        .addField(`Error code:`, `${data.error.code}`, false)
                        .addField(`Description`, `${data.error.message}`, false)

                    interaction.reply({embeds: [request_error], ephemeral: is_ephemeral});
                    return;
                }

                const response = data;
                if(data.hdurl) {
                    apod_image_url = response.hdurl;
                } else if(data.thumbnail_url) {
                    apod_image_url = response.thumbnail_url;
                }

                if(data.media_type == "image") {
                    apod_image_url = response.hdurl;
                } else if(data.media_type == "video") {
                    apod_image_url = response.thumbnail_url;
                }

                apod_date = response.date;
                apod_explanation = response.explanation;
                apod_url = response.url;
                apod_title = response.title;
            })

        const nasa_apod = new MessageEmbed()
            .setColor(nasa_logo_red_hex)
            .setAuthor({name: "NASA APOD", url: "https://apod.nasa.gov/apod/astropix.html", iconURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/110px-NASA_logo.svg.png"})
            .setTitle(`NASA Astronomy Picture of the Day (APOD)`)
            .setURL(`${apod_url}`)
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setDescription(`${apod_explanation}`)
            .addField(`Title`, `${apod_title}`, true)
            .addField(`Date`, `${apod_date}`, true)
            .setFooter({text: "NASA Open APIs", iconURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/110px-NASA_logo.svg.png"})
            .setImage(`${apod_image_url}`)

        interaction.reply({embeds: [nasa_apod], ephemeral: is_ephemeral});
    }
}
