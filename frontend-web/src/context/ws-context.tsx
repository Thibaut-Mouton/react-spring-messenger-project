import { Client, IMessage } from '@stomp/stompjs'
import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch } from 'redux'
import { useAuthContext } from './auth-context'
import { useLoaderContext } from './loader-context'
import { playNotificationSound } from '../config/play-sound-notification'
import { initWebSocket } from '../config/websocket-config'
import { FullMessageModel } from '../model/full-message-model'
import { GroupModel } from '../model/group-model'
import { OutputTransportDTO } from '../model/input-transport-model'
import UserModel from '../model/user-model'
import { WrapperMessageModel } from '../model/wrapper-message-model'
import {
  addChatHistory,
  setAllMessagesFetched, setCurrentActiveGroup,
  setGroupMessages, setWsUserGroups,
  unsubscribeAll,
  wsHealthCheckConnected
} from '../reducers'
import { StoreState } from '../reducers/types'
import { TransportActionEnum } from '../utils/transport-action-enum'

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
    chatHistory,
    userWsToken
  } = useSelector(
    (state: StoreState) => state.globalReducer
  )

  /**
   * Update groups sidebar with new messages
   *
   * @param dispatch
   * @param groups
   * @param value
   * @param userId
   */
  function updateGroupsWithLastMessageSent (dispatch: Dispatch, groups: GroupModel[], value: FullMessageModel, userId: number) {
    const groupIdToUpdate = value.groupId
    const groupToPlaceInFirstPosition = groups.findIndex((elt) => elt.id === groupIdToUpdate)
    if (groupToPlaceInFirstPosition === -1) {
      return
    }
    const groupsArray = [...groups]
    const item = { ...groupsArray[groupToPlaceInFirstPosition] }
    item.lastMessage = value.message
    item.lastMessageDate = value.time
    item.lastMessageSeen = value.isMessageSeen
    item.lastMessageSender = value.sender
    groupsArray.splice(groupToPlaceInFirstPosition, 1)
    groupsArray.unshift(item)
    dispatch(setWsUserGroups({ groupsArray }))
  }

  async function initWs (user: UserModel) {
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
          case TransportActionEnum.ADD_CHAT_HISTORY: {
            const wrapper = data.object as WrapperMessageModel
            dispatch(setAllMessagesFetched({ allMessagesFetched: wrapper.lastMessage }))
            const newMessages = wrapper.messages
            dispatch(setGroupMessages({ messages: newMessages.concat(chatHistory) }))
          }
            break
          case TransportActionEnum.SEND_GROUP_MESSAGE:
            break
          case TransportActionEnum.NOTIFICATION_MESSAGE: {
            const message = data.object as FullMessageModel
            dispatch(setCurrentActiveGroup({
              currentActiveGroup: message.groupUrl
            }))
            updateGroupsWithLastMessageSent(dispatch, user.groups, message, user.id)
            dispatch(addChatHistory({ newMessage: message }))
            if (message.userId !== user.id) {
              playNotificationSound()
            }
          }
            break
          default:
            break
        }
      })
    }

    wsObj.onWebSocketClose = () => {
      console.log('ERROR DURING HANDSHAKE WITH SERVER')
      dispatch(wsHealthCheckConnected({ isWsConnected: false }))
    }
    wsObj.activate()
  }

  useEffect(() => {
    if (user && user.wsToken !== null) {
      setLoading(true)
      initWs(user)
    }
    return () => {
      dispatch(wsHealthCheckConnected({ isWsConnected: false }))
      dispatch(unsubscribeAll())
    }
  }, [userWsToken])

  return (
    <WebSocketContext.Provider value={{
      ws,
      setWsClient
    }}>
      {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocketContext = () => useContext(WebSocketContext)
