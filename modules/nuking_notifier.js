// THIS FEATURE IS DISABLED
const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const {log, sleep} = require("./jerryUtils");


var nukeCheckTimerState = false;
var counterChannelDelete = 0;
var counterGuildBanAdd = 0;
var counterGuildMemberRemove = 0;
var counterTotalMemberRemove = 0;
var counterRoleDelete = 0;

// Main
async function initNukeNotifier(client) {
    return;
    // const guild_ids = ['631939549332897842'];
    // await NukingEventMonitor(client, guild_ids);
}

async function antiNuke(client) {

}

async function nukingEventMonitor(client, guildIds) {
    // Events
    client.on("channelDelete", async (channel) => {
        if(!(channel.guild.id in guildIds)) {
            return;
        }

        counterChannelDelete++;
        await nukeCounterMonitor();
    });

    client.on("guildBanAdd", async (member) => {
        if(!(member.guild.id in guildIds)) {
            return;
        }

        counterGuildBanAdd++;
        await nukeCounterMonitor();
    });

    client.on("guildMemberRemove", async (member) => {
        if(!(member.guild.id in guildIds)) {
            return;
        }

        counterGuildMemberRemove++;
        await nukeCounterMonitor();
    });

    client.on("roleDelete", async (role) => {
        if(!(role.guild.id in guildIds)) {
            return;
        }

        counterRoleDelete++;
        await nukeCounterMonitor();
    });

    nukeCheckTimerState = true;
    nukeCheckTimer();
}

async function nukeCounterMonitor() {
    // counterTotalMemberRemove = counterGuildBanAdd + counterGuildMemberRemove;
    // console.log(`counterChannelDelete: ${counterChannelDelete};
    // counterGuildBanAdd: ${counterGuildBanAdd};
    // counterGuildMemberRemove: ${counterGuildMemberRemove};
    // counterTotalMemberRemove: ${counterTotalMemberRemove};
    // counterRoleDelete: ${counterRoleDelete};`);
}

async function nukeCheckTimer() {
    while(nukeCheckTimerState) {
        await resetCounters();
        await sleep(10000);
    }
}

async function resetCounters() {
    counterChannelDelete = 0;
    counterGuildBanAdd = 0;
    counterGuildMemberRemove = 0;
    counterTotalMemberRemove = 0;
    counterRoleDelete = 0;
}


// Deployed
async function nukeAnalyzer(client, member) {

}

async function nukeTimer(client) {

}

module.exports = {
    initNukeNotifier
};
