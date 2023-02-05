const {Collection, MessageEmbed} = require("discord.js");
const fs = require("fs");
const Path = require("path");


/**
 * @async
 * @param {object} guildObject A Discord guild object.
 * @param {boolean} setPermissions Whether the base permissions should be added into the object. Defaults to `true`.
 */
async function AddGuild(guildObject, setPermissions) {
    const new_guild = await ParseGuild(guildObject, setPermissions);

    new_guild.set(guildObject.id, new_guild);
}


/**
 * @async
 * @returns {object} A JSON object containing the base command permissions
 */
async function GetBaseConfig() {
    return require('../base/base_guild_config.json');
}


/**
 * @async
 * @returns {object} A JSON object containing the full configuration file.
 */
async function GetConfig() {
    return require('./config_guilds.json');
}


/**
 * @async
 * @returns {object} A map containing the guild configs.
 */
async function GetGuildConfigMap() {
    const config = await GetConfig();

    const map = new Map(Object.entries(config.guilds));
    return map;
}


/** 
 * @async
 * @param {object} member The GuildMember to check
 * @returns {number} The highest PL
 */
async function GetHighestPL(member) {
    const roles = member.roles.cache;

    const guilds = await GetGuildConfigMap();
    const guild = await guilds.get(member.guild.id);

    const role_config = guild.permissionRoles;

    if(!role_config) {
        throw `Missing permissionRoles configuration`;
    }

    for(let i = 1; i < Object.keys(role_config).length + 1; i++) {
        if(roles.has(role_config[`PL${i}`])) {
            return i;
        }
    }
}


/**
 * @async
 * @param {object} guildObject The Guild to parse.
 * @param {boolean} setPermissions Whether a basic permission configuration with default roles should be set. Defaults to true.
 * @returns {object} The parsed guild, adapted for storing.
 */
async function ParseGuild(guildObject, setPermissions) {
    const doSetPermissions = setPermissions ?? true;

    if(!doSetPermissions) {
        const parsed_guild = {
            id: guildObject.id,
            name: guildObject.name,
            permissionRoles: {},
            commandPermissions: {}
        };
        return parsed_guild;
    }

    const parsed_guild = {
        id: guildObject.id,
        name: guildObject.name,
        permissionRoles: {},
        commandPermissions: {}
    };
    return parsed_guild;
}


/**
 * @async
 * @param {object} client The active Discord client.
 */
async function RefreshDataset(client) {
    const new_config = new Map();
    const base_config = (await GetBaseConfig());

    const config = await GetConfig();
    const guilds = client.guilds.cache;

    // Temporary storage
    const command_permissions = [];
    const permission_roles = [];

    for(const guild of Object.values(config.guilds)) {
        if(!guild.commandPermissions && !guild.permissionRoles) {
            command_permissions.push(base_config.commandPermissions);
            permission_roles.push(base_config.permissionRoles);
            continue;
        }
        command_permissions.push(guild.commandPermissions);
        permission_roles.push(guild.permissionRoles);
    }

    // Main
    for(const guild of guilds.entries()) {
        new_config.set(guild[0], {
            id: guild[1].id,
            name: guild[1].name
        });
    }

    config.guilds = Object.fromEntries(new_config);

    // Check if superusers have mfa
    // for(const userId of config.superUsers) {
    //     const user = client.users.resolve(userId);

    // }

    // Restore data from temporary storage
    let i = 0;

    for(const guild of Object.values(config.guilds)) {
        guild.commandPermissions = command_permissions[i];
        guild.permissionRoles = permission_roles[i];

        Object.assign(guild.commandPermissions, base_config.commandPermissions);
        i++;
    }


    // Update the file
    fs.writeFileSync(Path.resolve(__dirname, "./config_guilds.json"), JSON.stringify(config), (err) => {
        if(err) {
            throw err;
        }
    });
}


async function RemoveGuild(guild) {

}


async function SetPermissions() {

}


module.exports = {
    AddGuild,
    GetConfig,
    GetGuildConfigMap,
    GetConfig,
    GetHighestPL,
    ParseGuild,
    RefreshDataset,
    RemoveGuild,
    SetPermissions
};
