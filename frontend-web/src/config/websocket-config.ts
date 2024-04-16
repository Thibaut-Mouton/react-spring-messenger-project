import {Client} from "@stomp/stompjs"
import {HttpGroupService} from "../service/http-group-service"

const WS_URL = process.env.NODE_ENV === "development" ? "localhost:9090/api/" : "localhost:9090/api/"

const WS_BROKER = process.env.NODE_ENV === "development" ? "ws" : "wss"

export async function initWebSocket(userToken: string): Promise<Client> {
    console.log("Initiating WS connection...")
    const service = new HttpGroupService()
    const {data} = await service.getCsrfToken()
    const {headerName, token} = data
    return new Client({
        brokerURL: `${WS_BROKER}://${WS_URL}messenger/websocket?token=${userToken}`,
        connectHeaders: {clientSessionId: crypto.randomUUID(), [headerName]: token},
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000
    })
}
