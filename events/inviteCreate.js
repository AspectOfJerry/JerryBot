const Sleep = require('../modules/sleep.js'); // delayInMilliseconds
const Log = require('../modules/logger.js'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

module.exports = {
    name: "inviteCreate",
    once: false, // Whether or not this event should only be triggered once
    async execute(invite) {
        await Log('append', 'inviteCreate', `<@${invite.inviter?.user.tag}> created an invite to <#${invite.channel.name}> in <${invite.guild?.name}>
            expiresAt: ${invite.expiresAt},
            maxUses: ${invite.maxUses}.`, 'DEBUG'); // Logs
    }
};
