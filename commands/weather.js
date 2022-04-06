const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const weather = require('weather-js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("weather")
        .setDescription("Send the weather for a given location.")
        .addStringOption((options) =>
            options
                .setName("location")
                .setDescription("City or ZIP code.")
                .setRequired(true)
        ).addStringOption((options) =>
            options
                .setName("unit")
                .setDescription("The unit of measurement for temperatures (C or F). Defaults to 'C'")
                .addChoice("C", "C")
                .addChoice("F", "F")
                .setRequired(false)
        ),
    async execute(client, interaction) {
        //Command information
        const REQUIRED_ROLE = "everyone";

        //Declaring variables
        const search_location = interaction.options.getString('location');
        const search_unit = interaction.options.getString('unit') || "C";

        //Checks

        //Code
        weather.find({search: search_location, degreeType: search_unit}, function (error, result) {
            if(error) {
                console.error(error);
            }
            if(result.length === 0) {
                const search_error = new MessageEmbed()
                    .setColor('#ff2020')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setTitle('Error')
                    .setDescription(`Could not find weather for "${search_location}".`)
                    .setFooter({text: "Powered by the MSN Weather Service using npm weather-js"});

                interaction.reply({embeds: [search_error], ephemeral: false});
                return;
            }
            //Current stats
            const degree_type = result[0].location.degreetype;
            const location = result[0].location.name;
            const zip_code = result[0].location.zipcode ? ` (${result[0].location.zipcode})` : "";
            const local_day = result[0].current.day;
            const local_date = result[0].current.date;
            const local_observation_time = result[0].current.observationtime;
            const local_timezone = `UTC ${result[0].location.timezone}`;
            const local_temperature = result[0].current.temperature;
            const local_feelslike = result[0].current.feelslike;
            const local_winddisplay = result[0].current.winddisplay;
            const local_humidity = result[0].current.humidity;
            const local_condition = result[0].current.skytext;
            //Day 0
            const day0_day = result[0].forecast[0].day;
            const day0_date = result[0].forecast[0].date;
            const day0_lowest_temp = result[0].forecast[0].low;
            const day0_highest_temp = result[0].forecast[0].high;
            const day0_condition = result[0].forecast[0].skytextday;
            const day0_precipitations = result[0].forecast[0].precip || "0";
            //Day 1
            const day1_day = result[0].forecast[1].day;
            const day1_date = result[0].forecast[1].date;
            const day1_lowest_temp = result[0].forecast[1].low;
            const day1_highest_temp = result[0].forecast[1].high;
            const day1_condition = result[0].forecast[1].skytextday;
            const day1_precipitations = result[0].forecast[1].precip || "0";
            //Day 2
            const day2_day = result[0].forecast[2].day;
            const day2_date = result[0].forecast[2].date;
            const day2_lowest_temp = result[0].forecast[2].low;
            const day2_highest_temp = result[0].forecast[2].high;
            const day2_condition = result[0].forecast[2].skytextday;
            const day2_precipitations = result[0].forecast[2].precip || "0";
            //Day 3
            const day4_day = result[0].forecast[3].day;
            const day4_date = result[0].forecast[3].date;
            const day4_lowest_temp = result[0].forecast[3].low;
            const day4_highest_temp = result[0].forecast[3].high;
            const day4_condition = result[0].forecast[3].skytextday;
            const day4_precipitations = result[0].forecast[3].precip || "0";
            //Day 4
            const day5_day = result[0].forecast[4].day;
            const day5_date = result[0].forecast[4].date;
            const day5_lowest_temp = result[0].forecast[4].low;
            const day5_highest_temp = result[0].forecast[4].high;
            const day5_condition = result[0].forecast[4].skytextday;
            const day5_precipitations = result[0].forecast[4].precip || "0";

            const weather = new MessageEmbed()
                .setColor('#20ff20')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle(`Weather search results for ${search_location}`)
                .setDescription(`Location: ${location}${zip_code}\n` +
                    `• Local time: ${local_day} ${local_date} (${local_timezone})`, false)
                .addField(`:thermometer: Today at ${local_observation_time}`,
                    `• It was ${local_temperature}°${degree_type}, *felt like ${local_feelslike}°${degree_type}*. ${local_condition} during daytime.\n` +
                    `• Winds at ${local_winddisplay}.\n` +
                    `• Humidity: ${local_humidity} %\n\n` +
                    "**:calendar_spiral: Forecast**", false)
                //Day 0
                .addField(`** **${day0_day} (${day0_date})`,
                    `• Condition: ${day0_condition}\n` +
                    `• High: ${day0_highest_temp}°${degree_type}, Low: ${day0_lowest_temp}°${degree_type}\n` +
                    `• Precipitation: ${day0_precipitations}%`, false)
                //Day 2
                .addField(`** **${day1_day} (${day1_date})`,
                    `• Condition: ${day1_condition}\n` +
                    `• High: ${day1_highest_temp}°${degree_type}, Low: ${day1_lowest_temp}°${degree_type}\n` +
                    `• Precipitation: ${day1_precipitations}%`, false)
                //Day 2
                .addField(`** **${day2_day} (${day2_date})`,
                    `• Condition: ${day2_condition}\n` +
                    `• High: ${day2_highest_temp}°${degree_type}, Low: ${day2_lowest_temp}°${degree_type}\n` +
                    `• Precipitation: ${day2_precipitations}%`, false)
                //Day 3
                .addField(`** **${day4_day} (${day4_date})`,
                    `• Condition: ${day4_condition}\n` +
                    `• High: ${day4_highest_temp}°${degree_type}, Low: ${day4_lowest_temp}°${degree_type}\n` +
                    `• Precipitation: ${day4_precipitations}%`, false)
                //Day 4
                .addField(`** **${day5_day} (${day5_date})`,
                    `• Condition: ${day5_condition}\n` +
                    `• High: ${day5_highest_temp}°${degree_type}, Low: ${day5_lowest_temp}°${degree_type}\n` +
                    `• Precipitation: ${day5_precipitations}%`, false)
                .setFooter({text: "Powered by the MSN Weather Service using npm weather-js"})

            interaction.reply({embeds: [weather], ephemeral: false});
        });
    }
}
