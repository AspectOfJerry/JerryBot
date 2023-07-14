import {logger, sleep} from "../modules/jerryUtils.js";


export default {
    name: "inviteCreate",
    once: false, // Whether or not this event should only be triggered once
    async execute(invite) {
        logger.append("notice", "0x495643", `[IVC] <@${invite.inviter?.tag}> created an invite to <#${invite.channel.name}> in <${invite.guild?.name}>
            expiresAt: ${invite.expiresAt},
            maxUses: ${invite.maxUses},
            temporary: ${invite.temporary},
            code: ${invite.code},
            url: ${invite.url}.`);
    }
};
