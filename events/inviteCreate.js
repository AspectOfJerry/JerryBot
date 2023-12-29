import {logger, sleep} from "../utils/jerryUtils.js";


export default {
    name: "inviteCreate",
    once: false, // Whether this event should only be triggered once
    async execute(invite) {
        logger.append("notice", "IVC", `<@${invite.inviter?.tag}> created an invite to <#${invite.channel.name}> in <${invite.guild?.name}>
            expiresAt: ${invite.expiresAt},
            maxUses: ${invite.maxUses},
            temporary: ${invite.temporary},
            code: ${invite.code},
            url: ${invite.url}.`);
    }
};
