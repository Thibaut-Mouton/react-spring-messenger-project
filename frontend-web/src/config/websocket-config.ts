import {Client} from "@stomp/stompjs"

const WS_URL = process.env.REACT_APP_WS_URL ?? ""

const WS_BROKER = process.env.NODE_ENV === "development" ? "ws" : "wss"

export async function initWebSocket(userToken: string): Promise<Client> {
    // const {headerName, token} = JSON.parse(localStorage.getItem("csrf") || "")
    return new Client({
        brokerURL: `${WS_BROKER}://${WS_URL}/messenger/websocket?token=${userToken}`,
        // connectHeaders: {clientSessionId: crypto.randomUUID(), [headerName]: token},
        connectHeaders: {clientSessionId: crypto.randomUUID()},
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000
    })
}
