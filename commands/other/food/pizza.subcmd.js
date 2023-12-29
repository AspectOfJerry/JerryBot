import {logger, permissionCheck, sleep} from "../../../utils/jerryUtils.js";


export default async function (client, interaction) {
    // interaction.deferReply();
    if(await permissionCheck(interaction, 0) === false) {
        return;
    }

    interaction.reply({content: ":pizza:"});
}
