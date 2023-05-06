const process = require("process");
const mongoose = require("mongoose");
// const {log, sleep} = require("../../modules/JerryUtils.js");

const configSchema = require("./schema/configSchema.js");
const guildSchema = require("./schema/guildSchema.js");


const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@cluster0.3vjmcug.mongodb.net/?retryWrites=true&w=majority`;


async function connect() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB!");
        // log("append", "Database", "Connected to MongoDB!", "DEBUG");
    } catch(err) {
        console.error(err);
    }
}


/**
 * @param {string} guildId The guild ID
 */
async function deleteGuild(guildId) {
    guildSchema.deleteOne({id: guildId})
        .then((result) => {
            if(result.deletedCount < 1) {
                throw "Guild does not exist.";
            }
            return result;
        });

    // log("appenbd", "Database", `Deleted guild '${guildId}'`, "WARN");
}


/**
 * @returns The config document
 */
async function getConfig() {
    const id = "config";

    const res = await configSchema.findOne({id: id});
    if(res === []) {
        // log("append", "Database", "Config not found", "FATAL");
        throw "Config not found";
    }
    return res;
}


/**
 * @param {string} guildId The guild ID
 * @return The guild document
 */
async function getGuildConfig(guildId) {
    const res = await guildSchema.findOne({id: guildId});
    return res;
}


/**
 * @param {string} id The id of the config document (`config` is always used)
 * @param {Array.<string>} guildBlacklist The list of blacklisted guilds
 * @param {Array.<string>} superUsers The list of superusers
 * @param {Array.<string>} userBlacklist The list of blacklisted users
 * @param {Array.<string>} voiceChannelHubs The list of voice channel hubs
 * @returns The new config document
*/
async function updateConfig(id, guildBlacklist, superUsers, userBlacklist, voiceChannelHubs) {
    const update = {
        $set: {
            guildBlacklist: guildBlacklist ? guildBlacklist : void (0),
            superUsers: superUsers ? superUsers : void (0),
            userBlacklist: userBlacklist ? userBlacklist : void (0),
            voiceChannelHubs: voiceChannelHubs ? voiceChannelHubs : void (0)
        }
    };

    const res = await configSchema.findOneAndUpdate({id: id}, update, {new: true, upsert: true});
    return res;
}


/**
 * @param {Object} client The Discord client
 */
async function refreshDatabase(client) {
    // Delete guilds not in cache
    const guilds_ids = client.guilds.cache.map(guild => guild.id);
    await guildSchema.deleteMany({id: {$nin: guilds_ids}});

    // Adding missing guilds
    for(const [guildId, guild] of client.guilds.cache.entries()) {
        await guildSchema.findOneAndUpdate(
            {id: guildId},
            {
                $set: {
                    id: guildId,
                    name: guild.name,
                },
                $setOnInsert: {
                    permissionRoles: {
                        l1: "",
                        l2: "",
                        l3: ""
                    }
                }
            },
            {new: true, upsert: true}
        );
    }
}


/**
 * @param {string} guildId The guild ID
 * @param {string} [l1] The layer 1 role
 * @param {string} [l2] The layer 2 role
 * @param {string} [l3] The layer 3 role
 */
async function updateGuild(guildId, guildName, l1, l2, l3) {
    const update = {
        $set: {
            name: guildName,
            permissionRoles: {}
        }
    };

    l1 || l1 !== "" ? update.$set.permissionRoles.l1 = l1 : void (0);
    l2 || l2 !== "" ? update.$set.permissionRoles.l2 = l2 : void (0);
    l3 || l3 !== "" ? update.$set.permissionRoles.l3 = l3 : void (0);

    const res = await guildSchema.findOneAndUpdate({id: guildId}, update, {new: true, upsert: true});
    // log("appenbd", "Database", `Update guild '${guildId}' with: ${update}`, "DEBUG");
    return res;
}


module.exports = {
    connect,
    deleteGuild,
    getConfig,
    getGuildConfig,
    refreshDatabase,
    updateConfig,
    updateGuild
};
