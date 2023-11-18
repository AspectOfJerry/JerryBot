import process from "process";
import mongoose from "mongoose";
import {logger, sleep} from "../utils/jerryUtils.js";

import configSchema from "./schemas/configSchema.js";
import guildSchema from "./schemas/guildSchema.js";

async function connect() {
    const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@cluster0.3vjmcug.mongodb.net/?retryWrites=true&w=majority`;

    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB!");
        logger.append("debug", "STDOUT", "[Database] Connected to MongoDB!");
    } catch (err) {
        console.error(err);
    }
}

async function disconnect() {
    try {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB!");
    } catch (err) {
        console.error("Error disconnecting from MongoDB:", err);
    }
}

// CONFIG
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
 * @returns The config document
 */
async function getConfig() {
    const id = "config";

    const res = await configSchema.findOne({id: id});
    if (res.length <= 0) {
        logger.append("fatal", "STDERR", "[Database] Config not found");
        throw "Config not found";
    }
    return res;
}


// GUILD
/**
 * @param {string} guildId The guild ID
 */
async function deleteGuild(guildId) {
    const res = await guildSchema.deleteOne({id: guildId});
    if (res.deletedCount < 1) {
        throw "Guild does not exist.";
    }

    logger.append("warn", "STDOUT", `[Database] Deleted guild '${guildId}'`);
    return res;
}


/**
 * @param {string} guildId The guild ID
 * @return The guild document
 */
async function getGuildConfig(guildId) {
    const res = await guildSchema.findOne({id: guildId});
    if (res.length <= 0) {
        return void (0);
    }
    return res;
}


/**
 * @param {Object} client The Discord client
 */
async function refreshGuildCollection(client) {
    // Delete guilds not in cache
    const guilds_ids = client.guilds.cache.map(guild => guild.id);
    await guildSchema.deleteMany({id: {$nin: guilds_ids}});

    // Adding missing guilds
    for (const [guildId, guild] of client.guilds.cache.entries()) {
        await guildSchema.updateOne(
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
            {upsert: true}
        );
    }
}


/**
 * @param {string} guildId The guild ID
 * @param {string} guildName The guild name
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
    logger.append("debug", "STDOUT", `[Database] Update guild '${guildId}' with: ${update}`);
    return res;
}


export {
    connect,
    disconnect,
    // config
    getConfig,
    updateConfig,
    // guild
    deleteGuild,
    getGuildConfig,
    refreshGuildCollection,
    updateGuild
};
