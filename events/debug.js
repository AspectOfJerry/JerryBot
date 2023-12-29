import {logger, sleep} from "../utils/jerryUtils.js";

export default {
    name: "debug",
    once: false,
    async execute(info) {
        const latency = info.match(/\[WS => Shard \d+\] Heartbeat acknowledged, latency of (\d+)ms/)?.[1];

        if (latency && parseInt(latency) <= 50 || info.startsWith("[WS => Shard 0] [HeartbeatTimer] Sending a heartbeat.")) {
            return;
        }

        logger.append("debug", "DBG", info);
    }
};
