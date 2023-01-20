const fs = require("fs");
const Path = require("path");



/**
 * @param {object} guildObject
 * @param {boolean} setPermissions
 */
async function AddGuild(guildObject, setPermissions) {
    const new_guild = await ParseGuild(guildObject, setPermissions);

    new_guild.set(guildObject.id, new_guild);
}



/**
 * @param {object} clientglobalCommands
 * @returns {object} Guilds that the client is in, mapped by their ids (`client.guilds.cache`)
 */
async function GetClientGuilds(client) {
    return await client.guilds.cache;
}


/**
 * @returns {object} JSON object containing the full configuration file
 */
async function GetConfig() {
    const config = fs.readFileSync(Path.resolve(__dirname, "./config_guilds.json"));
    return JSON.parse(config);
}



/**
 * @returns {object} Map containing the guild configs
 */
async function GetGuildConfigMap() {
    const config = await GetConfig();

    const map = new Map(Object.entries(config.guilds));
    return map;
}


/**
 * @param {object} guildObject The Guild to parse
 * @param {boolean} setPermissions Whether a basic permission configuration with default roles should be set. Defaults to true
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
 * @param {object} interaction The Discord interaction object
 * @returns {boolean} Whether or not the execution is authorized
 */
async function PermissionCheck(interaction) {
    const guilds = await GetGuildConfigMap();
    let commandName = interaction.commandName;
    const subcommand_name = await interaction.options.getSubcommand(false);

    var permissionSet = {};

    for(const [key, value] of guilds) {
        if(key == interaction.guild.id) {
            permissionSet = value.commandPermissions;
        }
    }

    if(Object.keys(permissionSet).length === 0) {
        throw `Failed to find a permission set for guild ${interaction.guild.id} (${interaction.guild.name})`;
    }

    let permissionValue;

    if(subcommand_name) {
        commandName = commandName + "_sub";
    }

    for(const value of Object.values(permissionSet)) {
        const cmd = value[commandName];

        if(cmd !== undefined) {
            if(!subcommand_name) {
                permissionValue = cmd
                break;
            } else {
                const subcmd = cmd[subcommand_name];
                permissionValue = subcmd
                break;
            }
        }
    }

    return;
}



/**
 * @param {object} client The active Discord client
 */
async function RefreshDataset(client) {
    const new_config = new Map();

    const config = await GetConfig();
    const guilds = await GetClientGuilds(client);

    // Temporary storage
    const permission_roles = [];
    const command_permissions = [];

    for(const [key, value] of Object.entries(config.guilds)) {
        permission_roles.push(value.permissionRoles);
        command_permissions.push(value.commandPermissions);
    }

    // Main
    for(const guild of guilds.entries()) {
        new_config.set(guild[0], {
            id: guild[1].id,
            name: guild[1].name
        });
    }

    config.guilds = Object.fromEntries(new_config);

    // Restore data from temporary storage
    let i = 0;

    for(const [key, value] of Object.entries(config.guilds)) {
        value.permissionRoles = permission_roles[i];
        value.commandPermissions = command_permissions[i];
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
    GetClientGuilds,
    GetGuildConfigMap,
    ParseGuild,
    PermissionCheck,
    RefreshDataset,
    RemoveGuild,
    SetPermissions
};
