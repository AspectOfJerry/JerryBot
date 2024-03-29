import {logger, sleep} from "../utils/jerryUtils.js";


export default {
    name: "inviteDelete",
    once: false, // Whether this event should only be triggered once
    async execute(invite) {
        logger.append("notice", "IVD", `An invite from <@${invite.inviter?.tag}> to <#${invite.channel.name}> in <${invite.guild?.name}> was deleted
            expiresAt: ${invite.expiresAt},
            maxUses: ${invite.maxUses},
            temporary: ${invite.temporary},
            code: ${invite.code},
            url: ${invite.url}.`);
    }
};
