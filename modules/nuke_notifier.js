const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent} = require('discord.js');

const Sleep = require('./sleep'); // dedlayInMilliseconds;
const Log = require('./logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

var nukeCheckTimerState = false;
var counterChannelDelete = 0;
var counterGuildBanAdd = 0;
var counterGuildBanAddUser
var counterRoleDelete = 0;

// Main
// Monitoring
async function MountAntiNuke(client) {
    NukeCheck(client);
}

async function AntiNuke(client) {

}

async function NukeEventMonitor(client) {


    // Events

    client.on('channelDelete', async (channel) => {
        counterChannelDelete++;
        await NukeCounterMonitor();
    });
    client.on('guildBanAdd', async (member) => {
        counterGuildBanKickAdd++;
        await NukeCounterMonitor();
    });
    client.on('guildK', async (member) => {
        counterGuildBanKickAdd++;
        await NukeCounterMonitor();
    });

    client.on('roleDelete', async (role) => {
        counterRoleDelete++;
        await NukeCounterMonitor();
    });

}

async function NukeCounterMonitor() {

}

async function NukeCheckTimer(client) {
    if(!nukeCheckTimerState) {
        return;
    }

    await ResetCounters();
    await Sleep();
}

async function ResetCounters() {
    counterChannelDelete = 0;
}


// Deployed
async function NukeAnalyzer(client, member) {

}

async function NukeTimer(client) {

}
module.exports = MountAntiNuke;