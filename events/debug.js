import {logger, sleep} from"../modules/jerryUtils.js";

export default {
    name: "debug",
    once: false,
    async execute(info) {
        const latency = info.match(/\[WS => Shard \d+\] Heartbeat acknowledged, latency of (\d+)ms/)?.[1];

        if(latency && parseInt(latency) <= 60 || info.startsWith("[WS => Shard 0] [HeartbeatTimer] Sending a heartbeat.")) {
            return;
        }

        logger.append("debug", "0x444247", info);
    }
};
