import {Client} from "@stomp/stompjs";
import UUIDv4 from "../utils/uuid-generator";


const WS_URL = process.env.NODE_ENV === "development" ? "localhost:9090/" : "localhost:9090/";

const WS_BROKER = process.env.NODE_ENV === "development" ? "ws" : "wss"

export function initWebSocket(userToken: string | undefined): Client {
    return new Client({
        // brokerURL: "ws://" + WS_URL + "messenger/websocket?token=" + userToken || "",
        brokerURL: `${WS_BROKER}://${WS_URL}messenger/websocket?token=${userToken || ""}`,
        // Uncomment lines to activate WS debug
        // debug: (str: string) => {
        //     console.log(str);
        // },
        connectHeaders: {clientSessionId: UUIDv4()},
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        // maxWebSocketChunkSize: 8 * 1024,
        // splitLargeFrames: true
    });
}