const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const CronJob = require('cron').CronJob;
const fetch = require("node-fetch");

const {Log, Sleep} = require("../modules/JerryUtils.js");


// The first execution of the cron job went terribly (2022-2023)
// because of a wrong CRON interval('* * 1 1 *' instead of '0 0 1 1 *').
// The message did not send or maybe so the CRON job was changed to every minute to send the message anyway.
// Then the bot was not stopped so the @everyone ping happened 3 times in a row.
// Finally, bot was stopped 3 minutes after 2023 and the big issue was fixed.

module.exports = async function (client) {
    const new_year = new CronJob('0 0 1 1 *', async () => { // Interval of every year on January 1st

        const guilds = [];
        guilds.push(await client.guilds.fetch("631939549332897842"));
        guilds.push(await client.guilds.fetch("1014278986135781438"));

        const channels = [];
        channels.push('782060424220377128'); // devServer
        channels.push('1014293537363341332'); // 311

        const alt_channels = [];
        alt_channels.push('857978482374344734'); // devServer
        alt_channels.push('1014286502743773305'); // 311

        for(let i = 0; i < guilds.length; i++) {
            const channel = await guilds[i].channels.fetch(channels[i]);
            const alt_channel = await guilds[i].channels.fetch(alt_channels[i]);

            await channel.send({content: `:tada: Happy new year ${guilds[i].roles.everyone}! :tada:`})
                .then((msg) => {
                    msg.react('🥳');
                });

            await alt_channel.send({content: ":tada: Happy new year everyone! :partying_face: :fireworks:"})
                .then((msg) => {
                    msg.react('🎉');
                });
        }
    });

    new_year.start();

    Log("append", 'newYear', `[NewYear] The new year announcer is ready!`, "DEBUG");
    console.log(`[NewYear] The new year announcer is ready!`);
};
