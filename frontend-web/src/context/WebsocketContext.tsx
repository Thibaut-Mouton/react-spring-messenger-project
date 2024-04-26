import {Client, IMessage} from "@stomp/stompjs"
import React, {createContext, ReactNode, useContext, useEffect, useState} from "react"
import {playNotificationSound} from "../components/utils/play-sound-notification"
import {initWebSocket} from "../config/websocket-config"
import {FullMessageModel} from "../interface-contract/full-message-model"
import {OutputTransportDTO} from "../interface-contract/input-transport-model"
import {TransportActionEnum} from "../utils/transport-action-enum"
import {IUser} from "../interface-contract/user/user-model"
import {UserContext} from "./UserContext"
import {GroupContext, GroupContextAction} from "./GroupContext"

type WebSocketContextType = {
    ws: Client | undefined
    messages: FullMessageModel[]
    areAllMessagesFetched: boolean
    isWsConnected: boolean
    setAllMessagesFetched: (isLastMessage: boolean) => void
    setWsClient: (ws: Client) => void
    setMessages: (messages: FullMessageModel[]) => void
    setWsConnected: (isConnected: boolean) => void
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

const WebsocketContextProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [ws, setWsClient] = useState<Client | undefined>(undefined)
    const [messages, setMessages] = useState<FullMessageModel[]>([])
    const [isWsConnected, setWsConnected] = useState<boolean>(true)
    const [areAllMessagesFetched, setAllMessagesFetched] = useState<boolean>(true)
    const {user} = useContext(UserContext)!
    const {changeGroupState} = useContext(GroupContext)!

    useEffect(() => {
        if (user?.wsToken !== null) {
            initWs(user)
        }
    }, [user])

    async function initWs(user?: IUser) {
        if (!user) {
            return
        }
        const wsObj = await initWebSocket(user.wsToken)
        setWsClient(wsObj)
        wsObj.onConnect = () => {
            setWsConnected(true)
            console.log("WS connected")
            wsObj.subscribe(`/topic/user/${user.id}`, (res: IMessage) => {
                const data = JSON.parse(res.body) as OutputTransportDTO
                switch (data.action) {
                    case TransportActionEnum.FETCH_GROUP_MESSAGES: {
                        // const result = data.object as WrapperMessageModel
                        // dispatch(setGroupMessages({ messages: result.messages }))
                        // dispatch(setAllMessagesFetched({
                        //   allMessagesFetched: result.lastMessage
                        // }))
                        break
                    }

                    case TransportActionEnum.SEND_GROUP_MESSAGE:
                        break
                    case TransportActionEnum.NOTIFICATION_MESSAGE: {
                        const message = data.object as FullMessageModel
                        changeGroupState({
                            type: GroupContextAction.UPDATE_LAST_MESSAGE_GROUP, payload: {
                                groupUrl: message.groupUrl,
                                field: {
                                    lastMessage: message.message,
                                    lastMessageSender: message.sender,
                                    lastMessageDate: message.time,
                                    lastMessageSeen: false
                                }
                            }
                        })
                        setMessages(state => [...state, message])
                        if (message.userId !== user.id) {
                            playNotificationSound()
                        }
                    }
                        break
                    case TransportActionEnum.CALL_INCOMING:
                        // dispatch(setCallIncoming({ callStarted: true }))
                        // dispatch(setCallUrl({
                        //   callUrl: data.object as unknown as string
                        // }))
                        break
                    case TransportActionEnum.END_CALL: {
                        // const groupUrl = data.object as unknown as string
                        // dispatch(setGroupWithCurrentCall({ groupUrl }))
                        break
                    }
                    default:
                        break
                }
            })

        }

        // wsObj.onWebSocketClose = (evt) => {
        //     console.log("ERROR DURING HANDSHAKE WITH SERVER", evt)
        //     dispatch(wsHealthCheckConnected({ isWsConnected: false }))
        // }

        wsObj.onStompError = (error) => {
            console.error("Cannot connect to STOMP server", error)
        }

        wsObj.onWebSocketError = (evt) => {
            if (isWsConnected) {
                setWsConnected(false)
            }
            console.log("Cannot connect to server", evt)
        }
        wsObj.activate()
    }

    return (
        <WebSocketContext.Provider value={{
            ws,
            areAllMessagesFetched,
            messages,
            isWsConnected,
            setAllMessagesFetched,
            setWsClient,
            setMessages,
            setWsConnected
        }}>
            {children}
        </WebSocketContext.Provider>
    )
}

export {WebSocketContext, WebsocketContextProvider}
