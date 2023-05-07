const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const fs = require("fs");
const date = require("date-and-time");
const {getConfig, getGuildConfig} = require("../database/mongodb.js");
const {registerEvent} = require("../jobs/log_digest");


/**
 * Private internal function
 */
async function _getDirCommandFiles(dir, suffix, command_files, ignored_files, skipped_files) {
    const files = fs.readdirSync(dir, {
        withFileTypes: true
    });

    for(const file of files) {
        if(file.name.endsWith(".subcmd.js")) {
            ignored_files.push(`${dir}/${file.name} => subcommand`); // Ignoring subcommand files because they will be called by the handler.
            continue;
        } else if(file.name.endsWith(".todo")) {
            ignored_files.push(`${dir}/${file.name} => todo`);
            continue;
        } else if(file.name.endsWith(".template")) {
            ignored_files.push(`${dir}/${file.name} => template file`);
            continue;
        } else if(file.name.endsWith(".hdlr.js")) {
            skipped_files.push(`${dir}/${file.name} => subcommand handler`);
            // Do not put `continue;` here! Subcommand handlers should not be ignored as they work the same way as command files.
        } else if(file.name.endsWith("dbms.js")) {
            skipped_files.push(`${dir}/${file.name} => database manager`);
            continue;
        }

        if(file.isDirectory()) {
            _getDirCommandFiles(`${dir}/${file.name}`, suffix, command_files, ignored_files, skipped_files);
        } else if(file.name.endsWith(suffix)) {
            command_files.push(`${dir}/${file.name}`);
        }
    }
}

/**
 * @param {string} dir The directory
 * @param {string} suffix The file suffix to search for
 * @returns {array} The list of command files
 */
async function getCommandFiles(dir, suffix) {
    let command_files = [];
    let ignored_files = [];
    let skipped_files = [];

    _getDirCommandFiles(dir, suffix, command_files, ignored_files, skipped_files);

    console.log(`Ignored ${ignored_files.length} files:`);
    console.log(ignored_files);
    console.log(`Skipped ${skipped_files.length} files:`);
    console.log(skipped_files);
    return command_files;
}


/**
 * Private internal function
 */
async function _getDirSubCommandFiles(dir, suffix, subcommand_files) {
    const files = fs.readdirSync(dir, {
        withFileTypes: true
    });

    for(const file of files) {
        // If the file is a folder
        if(file.isDirectory()) {
            _getDirSubCommandFiles(`${dir}/${file.name}`, suffix, subcommand_files);
        } else if(file.name.endsWith(suffix)) {
            subcommand_files.push(`${dir}/${file.name}`);
        }
    }
}

/**
 * @param {string} dir The directory
 * @param {string} suffix The file suffix to search for
 * @returns {array} The list of subcommand files
 */
async function getSubCommandFiles(dir, suffix) {
    let subcommand_files = [];

    _getDirSubCommandFiles(dir, suffix, subcommand_files);

    return subcommand_files;
}

/** 
 * @async
 * @param {Object} member The GuildMember to check
 * @returns {number} The highest PL
 */
async function getMemberPL(member) {
    const roles = member.roles.cache;

    const guild_config = await getGuildConfig(member.guild.id);

    const missing_fields = {};

    !guild_config.permissionRoles.l1 ? missing_fields.l1 = true : void (0);
    !guild_config.permissionRoles.l2 ? missing_fields.l2 = true : void (0);
    !guild_config.permissionRoles.l3 ? missing_fields.l3 = true : void (0);

    if(Object.keys(missing_fields).length > 0) {
        return missing_fields;
    }

    for(let i = 1; i < Object.keys(guild_config.permissionRoles).length + 1; i++) {
        if(roles.has(guild_config.permissionRoles[`PL${i}`])) {
            return i;
        }
    }

    return 0;
}

/**
 * @param {Object} client The active Discord client
 * @param userResolvable A userResolvable
 */
async function isSuperUser(client, userResolvable) {
    const config = "";
    const userId = client.users.resolveId(userResolvable);

    if(config.superUsers.includes(userId)) {
        return true;
    }
    return false;
}


/**
 * @async
 * @param {string} method The method to use {`append`, `read`}.
 * @param {string} tag The tag at the beginning of the line.
 * @param {string} body The main content.
 * @param {string} type The type of the message {`DEBUG`, `ERROR`, `FATAL`, `INFO`, `WARN`}.
 * @returns {object} `return_object`.
 */
async function log(method, tag, body, type) {
    switch(method) {
        case "append": {
            // Declaring variables
            const now = new Date();

            let tagLenght = 0;
            let tagExtraIndentNum = 0;
            let tagExtraIndent = "";
            let typeLenght = 0;
            let typeExtraIndentNum = 0;
            let typeExtraIndent = "";

            // Get current date
            const now_date = date.format(now, "YYYY-MM-DD");
            const now_time = date.format(now, "HH:mm:ss.SSS");

            // Generate the log file name
            const file_name = `${now_date}_JerryBot.log`;

            // Generate the new line content
            if(tag == null) {
                tag = "------------------";
            }
            tagLenght = tag.length;
            tagExtraIndentNum = 19 - tagLenght;
            for(let i = 0; i < tagExtraIndentNum; i++) {
                tagExtraIndent = tagExtraIndent + " ";
            }

            // DEBUG, ERROR, FATAL, INFO, WARN; │, ─, ├─, └─
            if(!type) {
                throw `Cannot use type of ${type}`;
            }

            typeLenght = type.length;
            typeExtraIndentNum = 5 - typeLenght;

            for(let i = 0; i < typeExtraIndentNum; i++) {
                typeExtraIndent = typeExtraIndent + " ";
            }

            const parsed_body = `[${tagExtraIndent}${tag}] [${now_time}] [JerryBot/${type}]:${typeExtraIndent} ${body}`;

            const return_object = {
                body: body,
                fileName: file_name,
                parsedBody: parsed_body
            };

            // Append to file
            fs.appendFile(`./logs/${file_name}`, parsed_body + "\n", (err) => {
                if(err) {
                    throw err;
                }
            });
            registerEvent(type, 1);
            return return_object;
        }
        case "read": {
            // Read stuff
        }
            break;
        default:
            throw "Unknown logging method.";
    }
}


/**
 * @async
 * @param {Object} interaction The Discord interaction object.
 * @returns {boolean} Whether or not the execution is authorized.
 */
async function permissionCheck(interaction, pl) {
    const config = await getConfig();

    if(config.userBlacklist.includes(interaction.member.id)) {
        const user_blacklisted = new MessageEmbed()
            .setColor("FUCHSIA")
            .setTitle("User Blacklisted")
            .setDescription("I'm sorry but you are in the bot's blacklist. Please contact the bot administrators if you believe that this is an error.")
            .setFooter({text: "Contact Jerry#3756 for help."});

        try {
            interaction.reply({embeds: [user_blacklisted]});
        } catch {
            interaction.editReply({embeds: [user_blacklisted]});
        }

        log("append", interaction.guild.id, `└─"@${interaction.user.tag}" is blacklisted from the bot. [UserBlacklist]`, "WARN");
        return false;
    } else if(config.superUsers.includes(interaction.member.id)) {
        if(config.guildBlacklist.includes(interaction.guild.id)) {
            const guild_blacklisted_warning = new MessageEmbed()
                .setColor("FUCHSIA")
                .setTitle("Guild Blacklisted Warning")
                .setDescription(`<@${interaction.user.id}>, This guild is blacklisted! Execution authorized (superuser).`);

            interaction.channel.send({embeds: [guild_blacklisted_warning]});
            log("append", interaction.guild.id, `├─"${interaction.guild.name}" is blacklisted from the bot. Execution authorized (superuser).`, "WARN");
        }

        await log("append", interaction.guild.id, `├─"@${interaction.user.tag}" is a super user. Execution authorized.`, "INFO");
        return true;
    } else if(config.guildBlacklist.includes(interaction.guild.id)) {
        const guild_blacklisted = new MessageEmbed()
            .setColor("FUCHSIA")
            .setTitle("Guild Blacklisted")
            .setDescription("I'm sorry but this Guild is in the bot's blacklist. Please contact the bot administrators if you believe that this is an error.")
            .setFooter({text: "Contact Jerry#3756 for help."});

        try {
            interaction.reply({embeds: [guild_blacklisted]});
        } catch {
            interaction.editReply({embeds: [guild_blacklisted]});
        }

        await log("append", interaction.guild.id, `└─"${interaction.guild.name}" (${interaction.guild.id}) is blacklisted from the bot. [GuildBlacklist]`, "WARN");
        return false;
    }


    const guild_config = await getGuildConfig(interaction.guild.id);

    if(guild_config === []) {
        const embed = new MessageEmbed()
            .setColor("FUCHSIA")
            .setDescription("This guild's permission configuration is not in the database. Please contact the bot administrators for help.")
            .setFooter({text: "Contact Jerry#3756 for help."});

        try {
            interaction.reply({embeds: [embed]});
            return false;
        } catch {
            interaction.editReply({embeds: [embed]});
            return false;
        }
    }

    const member_pl = await getMemberPL(interaction.member);
    if(isNaN(member_pl)) {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel("Documentation")
                    .setEmoji("📘")
                    .setStyle("LINK")
                    .setURL("https://bot.aspectofjerry.dev")
            );

        const embed = new MessageEmbed()
            .setColor("FUCHSIA")
            .setTitle("Error")
            .setDescription(`The role configuration is missing for${member_pl.l1 ? " L1 commands" : void (0)}${member_pl.l2 ? " L2 commands" : void (0)}${member_pl.l3 ? " L3 commands" : void (0)}.\nPlease use the configuration commands to set the roles.`)
            .setFooter({text: "Refer to the documentation for permission levels."});
        try {
            await interaction.reply({embeds: [embed], components: [row]});
            return false;
        } catch {
            await interaction.editReply({embeds: [embed], components: [row]});
            return false;
        }
    }

    if(pl === 0 || member_pl <= pl) {
        return true;
    }

    const error_permissions = new MessageEmbed()
        .setColor("RED")
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setTitle("PermissionError")
        .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the bot administrators if you believe that this is an error.")
        .setFooter({text: "Use '/help' to access the documentation on command permissions."});

    try {
        await interaction.reply({embeds: [error_permissions]});
    } catch {
        await interaction.editReply({embeds: [error_permissions]});
    }

    log("append", interaction.guild.id, `└─"@${interaction.user.tag}" did not have the required role to execute "/${interaction.commandName}${interaction.options.getSubcommand(false) ? " " + interaction.options.getSubcommand(false) : ""}". [PermissionError]`, "WARN");
    return false;
}


/**
 * Sleep
 * @async `await` must be used when calling `sleep()`.
 * @param {integer} delayInMsec The delay to wait for in milliseconds.
 * @throws {TypeError} Throws if `delayInMsec` is `NaN`.
 */
async function sleep(delayInMsec) {
    if(isNaN(delayInMsec)) {
        throw TypeError("delayInMsec is not a number", "sleep.js", 8);
    }
    await new Promise(resolve => setTimeout(resolve, delayInMsec));
}


/**
 * @param {Object} client The active Discord client
 * @param {array} commands The application commands to register in the `ready` event
 */
async function startEventListeners(client, commands) {
    console.log("Starting event listeners...");
    log("append", "JerryUtils", "Starting event listeners...", "DEBUG");

    const event_files = fs.readdirSync("./events").filter(file => file.endsWith(".js"));

    console.log(`Event files (${event_files.length}):`);
    console.log(event_files);

    for(const event_file of event_files) {
        const event = require(`../events/${event_file}`);

        if(event.once) {
            client.once(event.name, (...args) => event.execute(...args, commands));
        } else {
            client.on(event.name, (...args) => event.execute(...args, commands));
        }
    }
}


/**
 * StartJobs starts the jobs located in `root/jobs`.
 * @param {Object} client The Discord client.
 */
async function StartJobs(client) {
    console.log("Starting jobs...");
    await log("append", "JerryUtils", "Starting jobs...", "DEBUG");

    const job_files = fs.readdirSync("./jobs").filter(file => file.endsWith(".js"));

    console.log(`Job files (${job_files.length}):`);
    console.log(job_files);

    for(const job_file of job_files) {
        const {execute} = require(`../jobs/${job_file}`);
        execute(client);
    }

    const {executeSB} = require("../jobs/hypixel_api_status.js");
    executeSB(client);
}


/**
 * toNormalized removes irregular characters from a string.
 * @param {string} string The string to normalize.
 * @return {string} The normalized string.
 */
function toNormalized(string) {
    if(string === undefined || string === null) {
        return;
    }
    return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


module.exports = {
    getCommandFiles,
    getSubCommandFiles,
    isSuperUser,
    log,
    sleep,
    StartJobs,
    startEventListeners,
    toNormalized,
    getMemberPL,
    permissionCheck
};
