const fetch = require('window-fetch');
require('dotenv').config()

module.exports = {
    callback: async (message, Discord, client, ...args) => {
        //Command information
        const COMMAND_NAME = "ip_location";
        const ROLE_REQUIRED = "PL0";
        const EXCPECTED_ARGUMENTS = 1;
        const OPTIONAL_ARGUMENTS = 0;

        //Help command
        if(args[0] == '?') {
            const help_command = new Discord.MessageEmbed()
                .setColor('#2020ff')
                .setAuthor({name: "./commands/ip_location.js; Lines: 107; File size: ~5.2 KB", iconURL: "https://winaero.com/blog/wp-content/uploads/2018/12/file-explorer-folder-libraries-icon-18298.png"})
                .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle(`%${COMMAND_NAME} command help (${ROLE_REQUIRED})`)
                .setDescription('This command shows location information about an IP adress.')
                .addField(`Usage`, "`" + `%${COMMAND_NAME}` + " <IP adress>" + "`", false)
                .addField(`Excpected arguments`, `${EXCPECTED_ARGUMENTS} case-sensitive`, true)
                .addField(`Optional arguments`, `${OPTIONAL_ARGUMENTS}`, true)
                .addField('Related commands', "`ping`", false)
                .setFooter({text: `${message.author.tag} • ${COMMAND_NAME}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                .setTimestamp();

            message.channel.send({embeds: [help_command]})
            return;
        }

        //Declaring variables
        let ipAdress;
        let ipAdressType;
        let ipAdressContinentCode;
        let ipAdressContinentName;
        let ipAdressCountryCode;
        let ipAdressCountryName;
        let ipAdressRegionCode;
        let ipAdressRegionName;
        let ipAdressCity;
        let ipAdressZipCode;
        let ipAdressLatitude;
        let ipAdressLongitude;
        let ipAdressCapital;

        //Declaring functions

        //Checks
        if(!message.member.roles.cache.find(role => role.name == ROLE_REQUIRED)) {
            const error_permissions = new Discord.MessageEmbed()
                .setColor('#ff2020')
                .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")

            message.channel.send({embeds: [error_permissions]})
            return;
        }
        if(!args[0]) {
            const error_missing_arguments = new Discord.MessageEmbed()
                .setColor('#ff2020')
                .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription(`**Error:** Excpected **${EXCPECTED_ARGUMENTS}** arguments but only provided **0**.` + " Use " + "`" + `%${COMMAND_NAME} ?` + "`" + " for help.")
                .setFooter({text: "Please provide an IP adress to search."})

            message.channel.send({embeds: [error_missing_arguments]})
            return;
        }
        ipAdress = args[0];

        //Code
        await fetch(`http://api.ipstack.com/${ipAdress}?access_key=${process.env.IPSTACK_API_KEY_JERRY}`)
            .then(response => response.json())
            .then(data => {
                ipAdress = data.ip
                ipAdressType = data.type
                ipAdressContinentCode = data.continent_code;
                ipAdressContinentName = data.continent_name;
                ipAdressCountryCode = data.country_code;
                ipAdressCountryName = data.country_name;
                ipAdressRegionCode = data.region_code;
                ipAdressRegionName = data.region_name;
                ipAdressCity = data.city;
                ipAdressZipCode = data.zip;
                ipAdressLatitude = data.latitude;
                ipAdressLongitude = data.longitude;
                ipAdressCapital = data.location.capital;

                const ipAdressInfo = new Discord.MessageEmbed()
                    .setColor('#20ff20')
                    .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setTitle('IP adress info')
                    .setDescription(`IP adress: ${ipAdress} (${ipAdressType})`)
                    .addField('IP Adress type', `${ipAdressType}`, true)
                    .addField('IP Adress continent', `${ipAdressContinentName} (${ipAdressContinentCode})`, true)
                    .addField('IP Adress country', `${ipAdressCountryName} (${ipAdressCountryCode})`, true)
                    .addField('IP Adress region', `${ipAdressRegionName} (${ipAdressRegionCode})`, true)
                    .addField('IP Adress capital', `${ipAdressCapital}`, true)
                    .addField('IP Adress city', `${ipAdressCity}`, true)
                    .addField('IP Adress longitude', `${ipAdressLongitude}`, false)
                    .addField('IP Adress latitude', `${ipAdressLatitude}`, false)
                    .addField('IP Adress zip', `${ipAdressZipCode}`)

                message.channel.send({embeds: [ipAdressInfo]})

            }).catch(console.error)
    }
}
