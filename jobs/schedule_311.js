const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, ModalBuilder} = require('discord.js');

const CronJob = require('cron').CronJob;
const fetch = require('node-fetch');

const Sleep = require('../modules/sleep'); // dedlayInMilliseconds;
const Log = require('../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = async function (client) {
    const schedule_311 = new CronJob('45 06 * * *', async () => { // Interval of 1 day, at 06h45
        await Log('append', 'schedule_311', `[Schedule_311] Posting today's schedule...`, 'DEBUG'); // Logs

        const guild = await client.guilds.fetch("1014278986135781438");
        const channel = await guild.channels.fetch("1015060767403421696");

        channel.send("<@611633988515266562>, urygufyjbxdldskjdfgjhbsisje");
    });

    schedule_311.start();

    Log('append', 'schedule_311', `[Schedule_311] The 311 daily schedule announcer job has been started! The CRON job was set to 06h45 everyday.`, 'DEBUG'); // Logs
    console.log(`[Schedule_311] The 311 daily schedule announcer job has been started! The CRON job was set to 06h45 everyday.`);

    const guild = await client.guilds.fetch("1014278986135781438");
    const channel = await guild.channels.fetch("1015060767403421696");

    const attached = new MessageEmbed()
        .setColor('GREEN')
        .setDescription("Successfully attached the schedule announcer to this channel!")
        .setFooter({text: "Announcement time: 06h45"});

    const delay_ms = 15000;
    const now = Math.round(Date.now() / 1000);
    const delay_timestamp = now + delay_ms / 1000;

    const embed = await channel.send({embeds: [attached]});
    channel.send(`> Auto deleting: <t:${delay_timestamp}:R>`)
        .then(async message => {
            await Sleep(delay_ms);
            message.delete();
            embed.delete();
        });
};
