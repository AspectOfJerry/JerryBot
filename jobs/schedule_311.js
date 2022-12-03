const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent} = require('discord.js');

const CronJob = require('cron').CronJob;
const fetch = require('node-fetch');

const {Log, Sleep} = require('../modules/JerryUtils');

module.exports = async function (client) {
    const schedule_311 = new CronJob('30 06 * * *', async () => { // Interval of 1 day, at 06h30
        await Log('append', 'schedule_311', `[Schedule_311] Posting today's schedule...`, 'DEBUG'); // Logs

        const guild = await client.guilds.fetch("1014278986135781438");
        const channel = await guild.channels.fetch("1015060767403421696");

        channel.send("Hello, World!");
    });

    schedule_311.start();

    Log('append', 'schedule_311', `[Schedule_311] The 311 daily schedule announcer job has been started! The CRON job was set to 06h30 everyday.`, 'DEBUG'); // Logs
    console.log(`[Schedule_311] The 311 daily schedule announcer job has been started! The CRON job was set to 06h45 everyday.`);

    const guild = await client.guilds.fetch("1014278986135781438");
    const channel = await guild.channels.fetch("1015060767403421696");

    const now = Math.round(Date.now() / 1000);
    const auto_delete_timestamp = now + 10;

    const attached = new MessageEmbed()
        .setColor('GREEN')
        .setDescription("Successfully attached the schedule announcer to this channel!")
        .addFields(
            {name: 'Announcement time', value: ":loudspeaker: 06h30", inline: false},
            {name: 'Auto cancel', value: `> :red_square: Deleting <t:${auto_delete_timestamp}:R>*.`, inline: false}
        ).setFooter({text: "*Relative timestamps can look out of sync depending on your timezone."});

    await channel.send({embeds: [attached]})
        .then(async (msg) => {
            await Sleep(10000);
            msg.delete();
        });
};
