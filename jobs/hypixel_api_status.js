const process = require("process");
const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const CronJob = require("cron").CronJob;
const fetch = require("node-fetch");

const {Log, Sleep} = require("../modules/JerryUtils.js");


let disabled = false;

let messages = [];
let embedMessage;

const success_emoji = "<:success:1102349129390248017>";
const warn_emoji = "<:warn:1102349145106284584>";
const fail_emoji = "<:fail:1102349156976185435>";

const sb_auctions = {
    name: "Active Auctions",
    success: 0,
    fail: 0,
    rate: 0,
    text: `${warn_emoji} **Active Auctions**: *Pending request* (--% failure)`
};


const sb_bazaar = {
    name: "Bazaar",
    success: 0,
    fail: 0,
    rate: 0,
    text: `${warn_emoji} **Bazaar**: *Pending request* (--% failure)`
};

const sb_collections = {
    name: "Collections",
    success: 0,
    fail: 0,
    rate: 0,
    text: `${warn_emoji} **Collections**: *Pending request* (--% failure)`
};

const sb_election = {
    name: "Elections",
    success: 0,
    fail: 0,
    rate: 0,
    text: `${warn_emoji} **Elections**: *Pending request* (--% failure)`
};

const sb_auctions_end = {
    name: "Ended Auctions",
    success: 0,
    fail: 0,
    rate: 0,
    text: `${warn_emoji} **Ended Auctions**: *Pending request* (--% failure)`
};

const sb_items = {
    name: "Items",
    success: 0,
    fail: 0,
    rate: 0,
    text: `${warn_emoji} **Items**: *Pending request* (--% failure)`
};

const sb_skills = {
    name: "Skills",
    success: 0,
    fail: 0,
    rate: 0,
    text: `${warn_emoji} **Skills**: *Pending request* (--% failure)`
};

const sb_profiles = {
    name: "Profiles",
    success: 0,
    fail: 0,
    rate: 0,
    text: `${warn_emoji} **Profiles**: *Pending request* (--% failure)`
};


// All endpoints
async function execute(client) {
    return;
    const status = new CronJob("*/4 * * * *", async () => { // Interval of 4 minutes
        await fetch(`https://api.hypixel.net/&key=${process.env.HYPIXEL_API_KEY_JERRY}`)
            .then((res) => res.json())
            .then((res) => {
            });
    });

    status.start();
}


// Skyblock endpoints
async function executeSB(client) {
    const skyblock_auctions = new CronJob("*/4 * * * *", async () => { // Interval of 4 minutes
        await fetch(`https://api.hypixel.net/skyblock/auctions?key=${process.env.HYPIXEL_API_KEY_JERRY}`)
            .then((res) => res.json())
            .then((res) => {
                if(res.success) {
                    sb_auctions.success++;
                } else {
                    sb_auctions.fail++;
                }
            });
    });

    const skyblock_auctions_end = new CronJob("*/4 * * * *", async () => { // Interval of 4 minutes
        await fetch(`https://api.hypixel.net/skyblock/auctions_ended?key=${process.env.HYPIXEL_API_KEY_JERRY}`)
            .then((res) => res.json())
            .then((res) => {
                if(res.success) {
                    sb_auctions_end.success++;
                } else {
                    sb_auctions_end.fail++;
                }
            });
    });

    const skyblock_bazaar = new CronJob("*/4 * * * *", async () => { // Interval of 4 minutes
        await fetch(`https://api.hypixel.net/skyblock/bazaar?&key=${process.env.HYPIXEL_API_KEY_JERRY}`)
            .then((res) => res.json())
            .then((res) => {
                if(res.success) {
                    sb_bazaar.success++;
                } else {
                    sb_bazaar.fail++;
                }
            });
    });

    const skyblock_collections = new CronJob("*/4 * * * *", async () => { // Interval of 4 minutes
        await fetch(`https://api.hypixel.net/resources/skyblock/collections?key=${process.env.HYPIXEL_API_KEY_JERRY}`)
            .then((res) => res.json())
            .then((res) => {
                if(res.success) {
                    sb_collections.success++;
                } else {
                    sb_collections.fail++;
                }
            });
    });

    const skyblock_election = new CronJob("*/4 * * * *", async () => { // Interval of 4 minutes
        await fetch(`https://api.hypixel.net/resources/skyblock/election?key=${process.env.HYPIXEL_API_KEY_JERRY}`)
            .then((res) => res.json())
            .then((res) => {
                if(res.success) {
                    sb_election.success++;
                } else {
                    sb_election.fail++;
                }
            });
    });

    const skyblock_items = new CronJob("*/4 * * * *", async () => { // Interval of 4 minutes
        await fetch(`https://api.hypixel.net/resources/skyblock/items?key=${process.env.HYPIXEL_API_KEY_JERRY_JERRY}`)
            .then((res) => res.json())
            .then((res) => {
                if(res.success) {
                    sb_items.success++;
                } else {
                    sb_items.fail++;
                }
            });
    });

    const skyblock_skills = new CronJob("*/4 * * * *", async () => { // Interval of 4 minutes
        await fetch(`https://api.hypixel.net/resources/skyblock/skills?key=${process.env.HYPIXEL_API_KEY_JERRY}`)
            .then((res) => res.json())
            .then((res) => {
                if(res.success) {
                    sb_skills.success++;
                } else {
                    sb_skills.fail++;
                }
            });
    });

    const skyblock_profiles = new CronJob("*/4 * * * *", async () => { // Interval of 4 minutes
        await fetch(`https://api.hypixel.net/skyblock/profiles?uuid=216fc23b7a4647a89e7a3a60d76356cd&key=${process.env.HYPIXEL_API_KEY_JERRY}`)
            .then((res) => res.json())
            .then((res) => {
                if(res.success) {
                    sb_profiles.success++;
                } else {
                    sb_profiles.fail++;
                }
            });
    });

    const master = new CronJob("*/4 * * * *", async () => { // Interval of 4 minutes
        await Sleep(5000);
        const monitors = [sb_auctions, sb_auctions_end, sb_bazaar, sb_collections, sb_election, sb_items, sb_skills, sb_profiles];
        let total_avg_rate = 0;
        let i = 1;

        for(const monitor of monitors) {
            monitor.rate = (monitor.fail / (monitor.success + monitor.fail)) * 100;
            monitor.text = `${monitor.rate <= 90 ? `${success_emoji} **${monitor.name}**: Operational (${monitor.rate}% failure)` : monitor.rate <= 48 ? `${warn_emoji} **${monitor.name}**: Degraded performance (${monitor.rate}% failure)` : `${fail_emoji} **${monitor.name}**: Failing (${monitor.rate}% failure)`}`;
            total_avg_rate + monitor.rate;
            i++;
        }

        const new_embed = new MessageEmbed()
            .setColor(`${total_avg_rate <= 90 ? "GREEN" : total_avg_rate <= 48 ? "YELLOW" : "RED"}`)
            .setTitle(`${total_avg_rate <= 90 ? `${success_emoji} Hypixel Skyblock API status` : total_avg_rate <= 48 ? `${warn_emoji} Hypixel Skyblock API status` : `${fail_emoji} Hypixel Skyblock API status`}`)
            .setDescription(`${sb_auctions.text}\n${sb_bazaar.text}\n${sb_collections.text}\n${sb_election.text}\n${sb_auctions_end.text}\n${sb_items.text}\n${sb_skills.text}\n${sb_profiles.text}`)
            .setFooter({text: "Updated every 4 minutes; resets daily."});

        for(const message of messages) {
            try {
                message.edit({embeds: [new_embed]});
            } catch(err) {
                console.error(err);
            }
        }
    });

    const reset = new CronJob("0 0 * * *", async () => { // Interval of 1 day
        const monitors = [sb_auctions, sb_auctions_end, sb_bazaar, sb_collections, sb_election, sb_items, sb_skills, sb_profiles];

        for(const monitor of monitors) {
            monitor.success = 0;
            monitor.fail = 0;
        }
    });

    skyblock_auctions.start();
    skyblock_auctions_end.start();
    skyblock_bazaar.start();
    skyblock_collections.start();
    skyblock_election.start();
    skyblock_items.start();
    skyblock_skills.start();
    skyblock_profiles.start();
    master.start();
    reset.start();


    const channel = await client.channels.resolve("1101906552954298508");

    embedMessage = new MessageEmbed()
        .setColor("DARK_GREY")
        .setTitle(`${warn_emoji} Hypixel Skyblock API status`)
        .setDescription(`${sb_auctions.text}\n${sb_bazaar.text}\n${sb_collections.text}\n${sb_election.text}\n${sb_auctions_end.text}\n${sb_items.text}\n${sb_skills.text}\n${sb_profiles.text}`)
        .setFooter({text: "Updated every 4 minutes; resets daily."});

    messages.push(await channel.send({embeds: [embedMessage]}));

    Log("append", "JOB_NAME", "[hypixel_api_status] Monitoring: skyblock_auctions, skyblock_auctions_end, skyblock_bazaar, skyblock_collections, skyblock_election, skyblock_items, skyblock_skills, skyblock_profiles", "DEBUG");
    console.log("hypixel_api_status monitor started!");
}


module.exports = {
    execute,
    executeSB
};
