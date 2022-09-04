switch(interaction.guild.id) {
    case process.env.DISCORD_JERRY_GUILD_ID:
        var MINIMUM_EXECUTION_ROLE = null;
        break;
    case process.env.DISCORD_GOLDFISH_GUILD_ID:
        var MINIMUM_EXECUTION_ROLE = null;
        break;
    case process.env.DISCORD_CRA_GUILD_ID:
        var MINIMUM_EXECUTION_ROLE = null;
        break;
    case process.env.DISCORD_311_GUILD_ID:
        var MINIMUM_EXECUTION_ROLE = null;
        break;
    default:
        await Log('append', interaction.guild.id, "└─Throwing because of bad permission configuration.", 'ERROR'); // Logs
        throw `Error: Bad permission configuration.`;
}