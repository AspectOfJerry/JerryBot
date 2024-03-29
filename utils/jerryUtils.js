import {MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import fs from "fs";
import dayjs from "dayjs";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import URL from "url";
import moment from "moment";

import {getConfig, getGuildConfig} from "../database/mongodb.js";

const __dirname = path.dirname(URL.fileURLToPath(import.meta.url));

/**
 * @deprecated
 * Returns files in a given directory and its subdirectories recursively
 * @param {string} dir
 * @param {string} suffix
 * @returns
 */
async function getDirFiles(dir, suffix) {
    const files = await fs.readdir(dir, {withFileTypes: true});

    const returnFiles = [];

    for (const file of files) {
        const filepath = `${dir}/${file.name}`;

        if (file.isDirectory()) {
            const subFiles = await getDirFiles(filepath, suffix);
            returnFiles.push(...subFiles);
        } else if (file.name.endsWith(suffix)) {
            returnFiles.push(filepath);
        }
    }

    return returnFiles;
}


/**
 * Private internal function
 */
async function _getDirCommandFiles(dir, suffix, command_files) {
    const files = fs.readdirSync(dir, {
        withFileTypes: true
    });

    for (const file of files) {
        if (file.name.endsWith(".subcmd.js") || file.name.endsWith(".subcmd.e.js")) {
            command_files.ignored.push(`${dir}/${file.name} => subcommand`); // Ignoring subcommand files because they will be called by the handler.
            continue;
        } else if (file.name.endsWith(".todo")) {
            command_files.ignored.push(`${dir}/${file.name} => todo`);
            continue;
        } else if (file.name.endsWith(".template")) {
            command_files.ignored.push(`${dir}/${file.name} => template file`);
            continue;
        } else if (file.name.endsWith(".hdlr.js") || file.name.endsWith(".hdlr.e.js")) {
            command_files.skipped.push(`${dir}/${file.name} => subcommand handler`);
            // Do not put `continue;` here! Subcommand handlers should not be ignored as they work the same way as command files.
        } else if (file.name.endsWith("dbms.js")) {
            command_files.skipped.push(`${dir}/${file.name} => database manager`);
            continue;
        }

        if (file.isDirectory()) {
            _getDirCommandFiles(`${dir}/${file.name}`, suffix, command_files);
        } else if (file.name.endsWith(".e.js") && !file.name.endsWith("subcmd.e.js")) {
            // Exclusive command files
            command_files.exclusive.push(`${dir}/${file.name}`);
        } else if (file.name.endsWith(suffix)) {
            command_files.commands.push(`${dir}/${file.name}`);
        }
    }
}

/**
 * @param {string} dir The directory
 * @param {string} suffix The file suffix to search for
 * @returns {array} The list of command files
 */
async function getCommandFiles(dir, suffix) {
    const command_files = {
        commands: [],
        ignored: [],
        skipped: [],
        exclusive: []
    };

    _getDirCommandFiles(dir, suffix, command_files);

    return command_files;
}


/**
 * @deprecated
 * Private internal function
 */
async function _getDirSubCommandFiles(dir, suffix, subcommand_files) {
    const files = fs.readdirSync(dir, {
        withFileTypes: true
    });

    for (const file of files) {
        // If the file is a folder
        if (file.isDirectory()) {
            _getDirSubCommandFiles(`${dir}/${file.name}`, suffix, subcommand_files);
        } else if (file.name.endsWith(suffix)) {
            subcommand_files.push(`${dir}/${file.name}`);
        }
    }
}

/**
 * @deprecated
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

    if (Object.keys(missing_fields).length > 0) {
        return missing_fields;
    }

    for (let i = 1; i < Object.keys(guild_config.permissionRoles).length + 1; i++) {
        if (roles.has(guild_config.permissionRoles[`PL${i}`])) {
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

    if (config.superUsers.includes(userId)) {
        return true;
    }
    return false;
}

const custom_logger_levels = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        notice: 3,
        info: 4,
        debug: 5
    },
    colors: {
        fatal: "magenta",
        error: "red",
        warn: "yellow",
        notice: "cyan",
        info: "green",
        debug: "gray"
    }
};

const logger = winston.createLogger({
    level: "debug",
    exitOnError: true,
    levels: custom_logger_levels.levels,
    transports: [
        new DailyRotateFile({
            datePattern: "YYYY-MM-DD",
            // eslint-disable-next-line no-undef
            filename: path.resolve(__dirname, "../logs", "%DATE%_JerryBot.log"),
            zippedArchive: false,
            format: winston.format.combine(
                winston.format.printf(({level, message}) => {
                    return `[${moment().format("HH:mm:ss.SSS")}] [${level.toUpperCase()}/${message}`;
                    // return `[${moment().format("HH:mm:ss.SSS")}] ${message}`;
                })
            )
        })
    ]
    // exceptionHandlers: [
    //     new DailyRotateFile({
    //         datePattern: "YYYY-MM-DD",
    //         // eslint-disable-next-line no-undef
    //         filename: path.resolve(__dirname, "../logs", "%DATE%_JerryBot.log"),
    //         zippedArchive: false,
    //         format: winston.format.combine(
    //             winston.format.printf(({level, message}) => {
    //                 return `[${moment().format("HH:mm:ss.SSS")}] [${level.toUpperCase()}/${message}`;
    //                 // return `[${moment().format("HH:mm:ss.SSS")}] ${message}`;
    //             })
    //         )
    //     })
    // ]
});

/**
 * Custom logger function to allow for extra parameters
 * @param {string} level fatal, error, warn, note, info, debug
 * @param {*} message Message to log
 * @param depCheck forgot what this is for
 */
logger.append = (level, label, message) => {
    logger.log(level, `${label}]: ${message}`);
};


/**
 * @async
 * @param {Object} interaction The Discord interaction object.
 * @param pl The permission level required to execute the command.
 * @returns {boolean} Whether or not the execution is authorized.
 */
async function permissionCheck(interaction, pl) {
    const config = await getConfig();

    if (config.userBlacklist.includes(interaction.member.id)) {
        const user_blacklisted = new MessageEmbed()
        .setColor("FUCHSIA")
        .setTitle("User Blacklisted")
        .setDescription("I'm sorry but you are in the bot's blacklist. Please contact the bot administrators if you believe that this is an error.")
        .setFooter({text: "Contact @jerrydev for help."});

        try {
            interaction.reply({embeds: [user_blacklisted]});
        } catch {
            interaction.editReply({embeds: [user_blacklisted]});
        }

        logger.append("warn", "STDOUT", `[permissionCheck] > '@${interaction.user.tag}' is blacklisted from the bot`);
        return false;
    } else if (config.superUsers.includes(interaction.member.id)) {
        if (config.guildBlacklist.includes(interaction.guild.id)) {
            const guild_blacklisted_warning = new MessageEmbed()
            .setColor("FUCHSIA")
            .setDescription(`<@${interaction.user.id}>, This guild is blacklisted! Sudo mode bypess.`);

            interaction.channel.send({embeds: [guild_blacklisted_warning]});
            logger.append("warn", "STDOUT", `[permissionCheck] > "${interaction.guild.name}" is blacklisted from the bot. Execution authorized (superuser).`);
        }

        logger.append("warn", "STDOUT", `[permissionCheck] > '@${interaction.user.tag}' is a super user. Execution authorized.`);
        return true;
    } else if (config.guildBlacklist.includes(interaction.guild.id)) {
        const guild_blacklisted = new MessageEmbed()
        .setColor("FUCHSIA")
        .setTitle("Guild Blacklisted")
        .setDescription("I'm sorry but this Guild is in the bot's blacklist. Please contact the bot administrators if you believe that this is an error.")
        .setFooter({text: "Contact @jerrydev for help."});

        try {
            interaction.reply({embeds: [guild_blacklisted]});
        } catch {
            interaction.editReply({embeds: [guild_blacklisted]});
        }

        logger.append("warn", "STDOUT", `[permissionCheck] > "${interaction.guild.name}" (${interaction.guild.id}) is blacklisted from the bot. [GuildBlacklist]`);
        return false;
    }


    const guild_config = await getGuildConfig(interaction.guild.id);

    if (!guild_config) {
        const embed = new MessageEmbed()
        .setColor("FUCHSIA")
        .setDescription("This guild's permission configuration is not in the database. Please contact the bot administrators for help.")
        .setFooter({text: "Contact @jerrydev for help."});

        try {
            interaction.reply({embeds: [embed]});
            return false;
        } catch {
            interaction.editReply({embeds: [embed]});
            return false;
        }
    }

    const member_pl = await getMemberPL(interaction.member);
    if (isNaN(member_pl)) {
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setLabel("Documentation")
            .setEmoji("📘")
            .setStyle("LINK")
            .setURL("https://bot.jerrydev.net")
        );

        const guild_roles_permissions_config_resolve_exception = new MessageEmbed()
        .setColor("FUCHSIA")
        .setTitle("GuildRolesPermissionsConfigResolveException")
        .setDescription(`The role configuration is missing for${member_pl.l1 ? " L1 commands" : void (0)}${member_pl.l2 ? " L2 commands" : void (0)}${member_pl.l3 ? " L3 commands" : void (0)}.\nPlease use the configuration commands to set the roles.`)
        .setFooter({text: "Refer to the documentation for permission levels."});
        try {
            interaction.reply({embeds: [guild_roles_permissions_config_resolve_exception], components: [row]});
            return false;
        } catch {
            interaction.editReply({embeds: [guild_roles_permissions_config_resolve_exception], components: [row]});
            return false;
        }
    }

    // CHECK
    if (pl === 0 || (member_pl <= pl && member_pl !== 0)) {
        return true;
    }

    const invalid_permission_level_exception = new MessageEmbed()
    .setColor("RED")
    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
    .setTitle("InsufficientPermissionException")
    .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the bot administrators if you believe that this is an error.")
    .setFooter({text: "Use '/help' to access the documentation on command permissions."});

    try {
        interaction.reply({embeds: [invalid_permission_level_exception]});
    } catch {
        interaction.editReply({embeds: [invalid_permission_level_exception]});
    }

    logger.append("notice", "permissionCheck", `[InsufficientPermissionException] on role compare, '@${interaction.user.tag}' GREATER '/${interaction.commandName}${interaction.options.getSubcommand(false) ? " " + interaction.options.getSubcommand(false) : ""}'`);
    return false;
}


/**
 * Sleep
 * @async `await` must be used when calling `sleep()`.
 * @param {number} delayInMsec The delay to wait for in milliseconds.
 * @throws {TypeError} Throws if `delayInMsec` is `NaN`.
 */
async function sleep(delayInMsec) {
    if (isNaN(delayInMsec)) {
        throw TypeError("delayInMsec is not a number");
    }
    await new Promise(resolve => setTimeout(resolve, delayInMsec));
}


/**
 * @param {Object} client The active Discord client
 * @param {array} commands The application commands to register in the `ready` event
 */
async function startEvents(client, commands) {
    console.log("Starting event listeners...");
    logger.append("info", "utils", "Starting event listeners...");

    const event_files = fs.readdirSync("./events").filter(file => file.endsWith(".js"));

    console.log(`Event files (${event_files.length}):`);
    console.log(event_files);

    for (const event_file of event_files) {
        const module = await import(`../events/${event_file}`);
        const event = module.default;

        if (event.once) {
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
    logger.append("info", "INIT", "Starting jobs...");

    const job_files = fs.readdirSync("./jobs").filter(file => file.endsWith(".js"));

    console.log(`Job files (${job_files.length}):`);
    console.log(job_files);

    for (const job_file of job_files) {
        const {execute} = await import(`../jobs/${job_file}`);
        execute(client);
    }
}


/**
 * toNormalized removes irregular characters from a string.
 * @param {string} string The string to normalize.
 * @return {string} The normalized string.
 */
function toNormalized(string) {
    if (string === void (0) || string === null) {
        return;
    }
    return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


/**
 * Remove unwanted characters from a number. Does not remove whitespaces.
 * @param {*} n Number
 * @param {*} isInt Should it also remove punctuation?
 * @returns Cleaned number (int or float depending on `isInt`)
 */
function cleanNumber(n, isInt) {
    n.replace(/[^0-9\s,.]/g, "");
    if (!isInt) {
        return parseInt(n);
    }
    return parseFloat(n.replace(/[.,]/g, ""));
}

/**
 * MATH STUFF
 */

/**
 * Find the GCD using a slightly more optimized Euclidean algorithm
 * https://en.wikipedia.org/wiki/Greatest_common_divisor
 *
 * @param {number} n1 The first number
 * @param {number} n2 The second number
 */
function findGCD(n1, n2) {
    n1 = Math.abs(n1);
    n2 = Math.abs(n2);

    while (n2 !== 0) {
        [n1, n2] = [n2, n1 % n2];
    }
    return n1;
}

/**
 * Find the LCM using the GCD
 * https://en.wikipedia.org/wiki/Least_common_multiple
 *
 * @param {number} n1 The first number
 * @param {number} n2 The second number
 */
function findLCM(n1, n2) {
    n1 = Math.abs(n1);
    n2 = Math.abs(n2);

    const gcd = findGCD(n1, n2);
    const lcm = (n1 * n2) / gcd;

    return lcm;
}

/**
 * Solves a quadratic equation and returns the roots
 * https://en.wikipedia.org/wiki/Quadratic_equation
 *
 * @param {number} a - The coefficient of x^2.
 * @param {number} b - The coefficient of x.
 * @param {number} c - The constant term.
 * @returns {number[]} The roots of the quadratic equation.
 */
function solveQuadratic(a, b, c) {
    const discriminant = b * b - 4 * a * c;

    if (discriminant > 0) {
        const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        return [root1, root2];
    } else if (discriminant === 0) {
        const root = -b / (2 * a);
        return [root, root];
    } else {
        return [NaN, NaN];
    }
}

/**
 * Calculates the factorial of a number in a very elegant way
 *
 * @param {number} n - The number for which to calculate the factorial.
 * @returns {number} The factorial of the number.
 */
function calcFactorial(n) {
    // Invalid input for factorial
    if (n < 0) {
        return NaN;
    }

    const factorial = Array.from({length: n}, (_e, index) => index + 1).reduce((eax, ebx) => eax * ebx, 1); // eax: accumulator, ebx: current

    return factorial;
}

function solveSystemOfEquations(eq1, eq2) {

}

const success_emoji = "<:success:1102349129390248017>";
const warn_emoji = "<:warn:1102349145106284584>";
const fail_emoji = "<:fail:1102349156976185435>";

export {
    getDirFiles,
    getCommandFiles,
    getSubCommandFiles,
    isSuperUser,
    custom_logger_levels,
    logger,
    sleep,
    StartJobs,
    startEvents,
    toNormalized,
    getMemberPL,
    permissionCheck,
    cleanNumber,
};
export const jMath = {
    findGCD,
    findLCM,
    solveQuadratic,
    calcFactorial
};
export const jEmoji = {
    success_emoji,
    warn_emoji,
    fail_emoji
};
