const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require('discord.js');

const CronJob = require('cron').CronJob;
const fetch = require('node-fetch');

const {Log, Sleep} = require('../modules/JerryUtils');

module.exports = async function (client) {
    const new_year = new CronJob('* * 1 1 *', async () => { // Interval of every year on January 1st
        await Sleep(3000);

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
                .then(async (msg) => {
                    await msg.react('🥳');
                });

            await alt_channel.send({content: ":tada: Happy new year everyone! :partying_face: :fireworks:"})
                .then(async (msg) => {
                    await msg.react('🎉');
                });
        }
    });

    new_year.start();

    Log('append', 'new_year', `[NewYear] The new year announcer is ready!`, 'DEBUG'); // Logs
    console.log(`[NewYear] The new year announcer is ready!`);
};
