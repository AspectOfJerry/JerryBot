const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const {Log, Sleep} = require('./JerryUtils');


var nukeCheckTimerState = false;
var counterChannelDelete = 0;
var counterGuildBanAdd = 0;
var counterGuildMemberRemove = 0;
var counterTotalMemberRemove = 0;
var counterRoleDelete = 0;

// Main
// Monitoring
async function InitNukeNotifier(client) {
    return;
    // const guild_ids = ['631939549332897842'];
    // await NukingEventMonitor(client, guild_ids);
}

async function AntiNuke(client) {

}

async function NukingEventMonitor(client, guildIds) {
    // Events
    client.on('channelDelete', async (channel) => {
        if(!channel.guild.id in guildIds) {
            return;
        }

        counterChannelDelete++;
        await NukeCounterMonitor();
    });

    client.on('guildBanAdd', async (member) => {
        if(!member.guild.id in guildIds) {
            return;
        }

        counterGuildBanAdd++;
        await NukeCounterMonitor();
    });

    client.on('guildMemberRemove', async (member) => {
        if(!member.guild.id in guildIds) {
            return;
        }

        counterGuildMemberRemove++;
        await NukeCounterMonitor();
    });

    client.on('roleDelete', async (role) => {
        if(!role.guild.id in guildIds) {
            return;
        }

        counterRoleDelete++;
        await NukeCounterMonitor();
    });

    nukeCheckTimerState = true;
    NukeCheckTimer();
}

async function NukeCounterMonitor() {
    // counterTotalMemberRemove = counterGuildBanAdd + counterGuildMemberRemove;
    // console.log(`counterChannelDelete: ${counterChannelDelete};
    // counterGuildBanAdd: ${counterGuildBanAdd};
    // counterGuildMemberRemove: ${counterGuildMemberRemove};
    // counterTotalMemberRemove: ${counterTotalMemberRemove};
    // counterRoleDelete: ${counterRoleDelete};`);
}

async function NukeCheckTimer() {
    while(nukeCheckTimerState) {
        await ResetCounters();
        await Sleep(10000);
    }
}

async function ResetCounters() {
    counterChannelDelete = 0;
    counterGuildBanAdd = 0;
    counterGuildMemberRemove = 0;
    counterTotalMemberRemove = 0;
    counterRoleDelete = 0;
}


// Deployed
async function NukeAnalyzer(client, member) {

}

async function NukeTimer(client) {

}

module.exports = {
    InitNukeNotifier
};