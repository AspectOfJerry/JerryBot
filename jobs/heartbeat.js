const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const CronJob = require('cron').CronJob;
const fetch = require("node-fetch");

const {Log, Sleep} = require("../modules/JerryUtils");

const {ChecklistHeartbeat, UpdateHeartbeat} = require('../modules/telemetry');


once = false;

module.exports = async function (client) {
    const heartbeat_interval = '1 minute';
    const grace_period = '10 seconds';

    const heartbeat = new CronJob('* * * * *', async () => { // Interval of 1 minute
        try {
            await fetch(`https://betteruptime.com/api/v1/heartbeat/ixeh3Ufdvq9EKWznsZMPFrpq`, {method: 'POST'})
                .then(async () => {
                    await Log("append", 'heartbeat', `[Heartbeat] Heartbeat sent to the status page.`, "DEBUG");
                    const now = Math.round(Date.now() / 1000);
                    UpdateHeartbeat(client, now);
                    if(!once) {
                        ChecklistHeartbeat();
                        once = true;
                    }
                });
        } catch(err) {
            if(err) {
                console.error(err);
            }

            Log("append", 'heartbeat', `[Heartbeat] An error occurred while sending the Heartbeat. Retrying in 6 seconds.`, "ERROR");
            await Sleep(6000);
            await fetch(`https://betteruptime.com/api/v1/heartbeat/ixeh3Ufdvq9EKWznsZMPFrpq`, {method: 'POST'})
                .then(async () => {
                    await Log("append", 'heartbeat', `[Heartbeat] Heartbeat sent to status page.`, "DEBUG");
                    const now = Math.round(Date.now() / 1000);
                    UpdateHeartbeat(client, now);
                    if(!once) {
                        ChecklistHeartbeat();
                        once = true;
                    }
                });
        }
    });

    heartbeat.start();

    Log("append", 'heartbeat', `[Heartbeat] Heartbeat started! The Heartbeat interval is set to ${heartbeat_interval} with a grace period of ${grace_period}.`, "DEBUG");
    console.log(`[Heartbeat] Heartbeat started! The Heartbeat interval is set to ${heartbeat_interval} with a grace period of ${grace_period}.`);

    await fetch(`https://betteruptime.com/api/v1/heartbeat/ixeh3Ufdvq9EKWznsZMPFrpq`)
        .then(async () => {
            await Log("append", 'heartbeat', `[Heartbeat] The first Heartbeat was sent to the status page.`, "DEBUG");
            const now = Math.round(Date.now() / 1000);
            UpdateHeartbeat(client, now);
        });
};
