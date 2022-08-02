import { Client, IMessage } from "@stomp/stompjs"
import React, { useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Dispatch } from "redux"
import { useAuthContext } from "./auth-context"
import { useLoaderContext } from "./loader-context"
import { playNotificationSound } from "../components/utils/play-sound-notification"
import { initWebSocket } from "../config/websocket-config"
import { FullMessageModel } from "../interface-contract/full-message-model"
import { OutputTransportDTO } from "../interface-contract/input-transport-model"
import { WrapperMessageModel } from "../interface-contract/wrapper-message-model"
import {
  addChatHistory,
  removeUserFromGroup, setAlerts,
  setAllMessagesFetched,
  setCallIncoming,
  setCallUrl,
  setGroupMessages, setGroupWithCurrentCall,
  setWsUserGroups,
  wsHealthCheckConnected
} from "../reducers"
import { StoreState } from "../reducers/types"
import { TransportActionEnum } from "../utils/transport-action-enum"
import { TypeMessageEnum } from "../utils/type-message-enum"
import { ILeaveGroupModel } from "../interface-contract/leave-group-model"
import { IGroupWrapper } from "../interface-contract/user/group-wrapper-model"
import { IUser } from "../interface-contract/user/user-model"

type WebSocketContextType = {
  ws: Client | undefined
  setWsClient: (ws: Client) => void
}

export const WebSocketContext = React.createContext<WebSocketContextType>({} as WebSocketContextType)

export const WebsocketContextProvider: React.FunctionComponent<any> = ({ children }) => {
  const [ws, setWsClient] = useState<Client | undefined>(undefined)
  const { user } = useAuthContext()
  const { setLoading } = useLoaderContext()
  const dispatch = useDispatch()
  const {
    groups,
    userWsToken
  } = useSelector(
    (state: StoreState) => state.globalReducer
  )

  useEffect(() => {
    if (user && user.wsToken !== null) {
	 setLoading(true)
	 initWs(user, groups).then(() => (setLoading(false)))
    }
    return () => {
	 dispatch(wsHealthCheckConnected({ isWsConnected: false }))
    }
  }, [userWsToken])

  /**
   * Update groups sidebar with new messages
   *
   * @param dispatch
   * @param groupWrappers
   * @param message
   * @param userId
   */
  function updateGroupsWithLastMessageSent (dispatch: Dispatch, groupWrappers: IGroupWrapper[], message: FullMessageModel, userId: number) {
    const groupIdToUpdate = message.groupId
    const isMessageSendByCurrentUser = message.userId === userId

    const groups = groupWrappers.map((groupWrapper) => {
	 const group = { ...groupWrapper.group }
	 if (groupWrapper.group.id === groupIdToUpdate) {
	   if (message.type === TypeMessageEnum.TEXT) {
		group.lastMessageSender = message.sender
		group.lastMessage = message.message
	   } else {
		group.lastMessage = `${isMessageSendByCurrentUser ? "You" : message.sender} ${message.message}`
		group.lastMessageSender = undefined
	   }
	   group.lastMessageDate = message.time
	   group.lastMessageSeen = isMessageSendByCurrentUser ? true : message.isMessageSeen
	 }
	 return {
	   group,
	   groupCall: groupWrapper.groupCall
	 }
    })
    dispatch(setWsUserGroups({ groups }))
  }

  async function initWs (user: IUser, groups: IGroupWrapper[]) {
    const wsObj = await initWebSocket(user.wsToken)
    setWsClient(wsObj)
    wsObj.onConnect = () => {
	 dispatch(wsHealthCheckConnected({ isWsConnected: true }))
	 setLoading(false)
	 wsObj.subscribe(`/topic/user/${user.id}`, (res: IMessage) => {
	   const data = JSON.parse(res.body) as OutputTransportDTO
	   switch (data.action) {
	   case TransportActionEnum.FETCH_GROUP_MESSAGES: {
		const result = data.object as WrapperMessageModel
		dispatch(setGroupMessages({ messages: result.messages }))
		dispatch(setAllMessagesFetched({
		  allMessagesFetched: result.lastMessage
		}))
		break
	   }
	   case TransportActionEnum.LEAVE_GROUP: {
		const {
		  groupUrl,
		  groupName
		} = data.object as ILeaveGroupModel
		dispatch(removeUserFromGroup({ groupUrl }))
		dispatch(setAlerts({
		  alert: {
		    alert: "success",
		    isOpen: true,
		    text: `you left the group ${groupName}`
		  }
		}))
		break
	   }
	   case TransportActionEnum.ADD_CHAT_HISTORY: {
		const wrapper = data.object as WrapperMessageModel
		dispatch(setAllMessagesFetched({ allMessagesFetched: wrapper.lastMessage }))
		const messages = wrapper.messages
		dispatch(setGroupMessages({ messages }))
	   }
		break
	   case TransportActionEnum.SEND_GROUP_MESSAGE:
		break
	   case TransportActionEnum.NOTIFICATION_MESSAGE: {
		const message = data.object as FullMessageModel
		updateGroupsWithLastMessageSent(dispatch, groups, message, user.id)
		dispatch(addChatHistory({ newMessage: message }))
		if (message.userId !== user.id) {
		  playNotificationSound()
		}
	   }
		break
	   case TransportActionEnum.CALL_INCOMING:
		dispatch(setCallIncoming({ callStarted: true }))
		dispatch(setCallUrl({
		  callUrl: data.object as unknown as string
		}))
		break
	   case TransportActionEnum.END_CALL: {
		const groupUrl = data.object as unknown as string
		dispatch(setGroupWithCurrentCall({ groupUrl }))
		break
	   }
	   default:
		break
	   }
	 })

    }

    wsObj.onWebSocketClose = (evt) => {
	 console.log("ERROR DURING HANDSHAKE WITH SERVER", evt)
	 dispatch(wsHealthCheckConnected({ isWsConnected: false }))
    }

    wsObj.onWebSocketError = (evt) => {
	 console.log("Cannot connect to server", evt)
    }
    wsObj.activate()
  }

  return (
    <WebSocketContext.Provider value={{
	 ws,
	 setWsClient
    }}>
	 {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocketContext = (): WebSocketContextType => useContext(WebSocketContext)
