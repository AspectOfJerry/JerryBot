import process from "process";
import mongoose from "mongoose";
// const {log, sleep} from "../../modules/jerryUtils.js");

import birthdaySchema from "./schemas/birthdaySchema.js";
import configSchema from "./schemas/configSchema.js";
import guildSchema from "./schemas/guildSchema.js";
import craScheduleSchema from "./schemas/craScheduleSchema.js";

async function connect() {
    const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@cluster0.3vjmcug.mongodb.net/?retryWrites=true&w=majority`;

    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB!");
        // log("append", "Database", "Connected to MongoDB!", "DEBUG");
    } catch(err) {
        console.error(err);
    }
}

async function disconnect() {
    try {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB!");
    } catch(err) {
        console.error("Error disconnecting from MongoDB:", err);
    }
}

// BIRTHDAY
/**
 * @param {number} day The day of the month
 * @param {number} month The month
 */
async function getBirthdayByDate(day, month) {
    const res = await birthdaySchema.find({day: day, month: month});
    if(res.length <= 0) {
        return void (0);
    }
    return res;
}


/**
 * @param {Object} client The Discord client
 */
async function refreshBirthdayCollection(client) {
    // Delete users not in cache
    const db_users = await birthdaySchema.find({});

    const removing = db_users
        .filter(user => !client.users.cache.get(user.id))
        .map(user => user.id);

    if(removing.length > 0) {
        await birthdaySchema.deleteMany({id: {$in: removing}});
    }

    // Update username for existing users
    const cached_users = Array.from(client.users.cache.values());
    const updating = db_users.filter(user => cached_users.some(cachedUser => cachedUser.id === user.id));

    if(updating.length > 0) {
        const bulk_op = updating.map((user) => ({
            updateOne: {
                filter: {id: user.id},
                update: {
                    $set: {
                        username: cached_users.find(cachedUser => cachedUser.id === user.id).username
                    }
                },
                upsert: true
            }
        }));

        await birthdaySchema.bulkWrite(bulk_op);
    }
}


/**
 * @param {Object} user The Discord user to update
 * @param {string} name A human readable 
 * @param {number} day The day of the monthname
 * @param {number} month The month
 * @param {Array.<string>} notes Additional info
 */
async function updateBirthday(user, name, day, month, notes) {
    const updated = {
        username: user.username,
        name: name,
        day: day,
        month: month,
        notes: notes
    };

    Object.keys(updated).forEach(key => updated[key] === void (0) && delete updated[key]);

    const res = await birthdaySchema.findOneAndUpdate(
        {id: user.id},
        updated,
        {new: true, upsert: true}
    );

    return res;
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
    if(res.length <= 0) {
        // log("append", "Database", "Config not found", "FATAL");
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
    if(res.deletedCount < 1) {
        throw "Guild does not exist.";
    }
    // log("appenbd", "Database", `Deleted guild '${guildId}'`, "WARN");
    return res;
}


/**
 * @param {string} guildId The guild ID
 * @return The guild document
 */
async function getGuildConfig(guildId) {
    const res = await guildSchema.findOne({id: guildId});
    if(res.length <= 0) {
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
    for(const [guildId, guild] of client.guilds.cache.entries()) {
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
    // log("appenbd", "Database", `Update guild '${guildId}' with: ${update}`, "DEBUG");
    return res;
}


async function createCraSchedule(json) {
    const res = await craScheduleSchema.findOneAndUpdate(
        {"data.cohort": json.data.cohort},
        json,
        {new: true, upsert: true, runValidators: true}
    );

    return res;
}


export {
    connect,
    disconnect,
    // birthday
    getBirthdayByDate,
    refreshBirthdayCollection,
    updateBirthday,
    // config
    getConfig,
    updateConfig,
    // guild
    deleteGuild,
    getGuildConfig,
    refreshGuildCollection,
    updateGuild,
    // cra
    createCraSchedule
};
