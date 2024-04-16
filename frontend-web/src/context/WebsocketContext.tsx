import {Client, IMessage} from "@stomp/stompjs"
import React, {createContext, ReactNode, useContext, useEffect, useState} from "react"
import {playNotificationSound} from "../components/utils/play-sound-notification"
import {initWebSocket} from "../config/websocket-config"
import {FullMessageModel} from "../interface-contract/full-message-model"
import {OutputTransportDTO} from "../interface-contract/input-transport-model"
import {TransportActionEnum} from "../utils/transport-action-enum"
import {IUser} from "../interface-contract/user/user-model"
import {AuthUserContext} from "./AuthContext"

type WebSocketContextType = {
    ws: Client | undefined
    isWsConnected: boolean
    setWsClient: (ws: Client) => void
    setWsConnected: (isConnected: boolean) => void
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

const WebsocketContextProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [ws, setWsClient] = useState<Client | undefined>(undefined)
    const [isWsConnected, setWsConnected] = useState<boolean>(false)
    const {user} = useContext(AuthUserContext)!

    useEffect(() => {
        if (user && user.wsToken !== null) {
            initWs(user)
        }
    }, [user])

    async function initWs(user: IUser) {
        const wsObj = await initWebSocket(user.wsToken)
        setWsClient(wsObj)
        wsObj.onConnect = () => {
            console.log("WS connected")
            // dispatch(wsHealthCheckConnected({ isWsConnected: true }))
            // setLoading(false)
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
                    case TransportActionEnum.LEAVE_GROUP: {
                        // const {
                        //   groupUrl,
                        //   groupName
                        // } = data.object as ILeaveGroupModel
                        // dispatch(removeUserFromGroup({ groupUrl }))
                        // dispatch(setAlerts({
                        //   alert: {
                        //     alert: "success",
                        //     isOpen: true,
                        //     text: `you left the group ${groupName}`
                        //   }
                        // }))
                        break
                    }
                    case TransportActionEnum.ADD_CHAT_HISTORY: {
                        // const wrapper = data.object as WrapperMessageModel
                        // dispatch(setAllMessagesFetched({ allMessagesFetched: wrapper.lastMessage }))
                        // const messages = wrapper.messages
                        // dispatch(setGroupMessages({ messages }))
                    }
                        break
                    case TransportActionEnum.SEND_GROUP_MESSAGE:
                        break
                    case TransportActionEnum.NOTIFICATION_MESSAGE: {
                        const message = data.object as FullMessageModel
                        // dispatch(updateGroupsWithLastMessageSent({
                        //   userId: user.id,
                        //   message
                        // }))
                        // updateGroupsWithLastMessageSent(dispatch, groups, message, user.id)
                        // dispatch(addChatHistory({ newMessage: message }))
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
            console.log("Cannot connect to server", evt)
        }
        wsObj.activate()
    }

    return (
        <WebSocketContext.Provider value={{
            ws,
            isWsConnected,
            setWsClient,
            setWsConnected
        }}>
            {children}
        </WebSocketContext.Provider>
    )
}

export {WebSocketContext, WebsocketContextProvider}
