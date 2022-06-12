import { Action } from '@reduxjs/toolkit'
import { Client, IMessage, StompSubscription } from '@stomp/stompjs'
import { Dispatch, MiddlewareAPI } from 'redux'
import { handleRTCActions } from './webRTC-middleware'
import { playNotificationSound } from '../config/play-sound-notification'
import { FullMessageModel } from '../model/full-message-model'
import { GroupModel } from '../model/group-model'
import { OutputTransportDTO } from '../model/input-transport-model'
import { TransportModel } from '../model/transport-model'
import { WrapperMessageModel } from '../model/wrapper-message-model'
import {
  RootState, addChatHistory,
  setAllMessagesFetched,
  setCurrentActiveGroup,
  setGroupMessages,
  wsHealthCheckConnected
} from '../reducers'
import {
  GRANT_USER_ADMIN,
  HANDLE_RTC_ACTIONS,
  HANDLE_RTC_ANSWER,
  HANDLE_RTC_OFFER,
  MARK_MESSAGE_AS_SEEN,
  SEND_TO_SERVER,
  SET_WS_GROUPS,
  UNSUBSCRIBE_ALL
} from '../utils/redux-constants'
import { TransportActionEnum } from '../utils/transport-action-enum'

let mainSubscribe: StompSubscription

function initWsAndSubscribe (wsClient: Client, store: MiddlewareAPI) {
  const { globalReducer }: RootState = store.getState()
  const {
    userId
  } = globalReducer
  if (wsClient) {
    wsClient.onConnect = () => {
      store.dispatch(wsHealthCheckConnected({ isWsConnected: true }))
      console.log('USER ID', userId)
      mainSubscribe = wsClient.subscribe(`/topic/user/${userId}`, (res: IMessage) => {
        const data = JSON.parse(res.body) as OutputTransportDTO
        console.log('RECEIVING MESSAGE', data)
        switch (data.action) {
          case TransportActionEnum.FETCH_GROUP_MESSAGES: {
            const result = data.object as WrapperMessageModel
            store.dispatch(setGroupMessages({ messages: result.messages }))
            store.dispatch(setAllMessagesFetched({
              allMessagesFetched: result.lastMessage
            }))
            break
          }
          case TransportActionEnum.ADD_CHAT_HISTORY: {
            const wrapper = data.object as WrapperMessageModel
            store.dispatch(setAllMessagesFetched({ allMessagesFetched: wrapper.lastMessage }))
            const newMessages = wrapper.messages
            const currentMessages: FullMessageModel[] = store.getState().WebSocketReducer.chatHistory
            store.dispatch(setGroupMessages({ messages: newMessages.concat(currentMessages) }))
          }
            break
          case TransportActionEnum.SEND_GROUP_MESSAGE:
            break
          case TransportActionEnum.NOTIFICATION_MESSAGE: {
            const message = data.object as FullMessageModel
            console.log('NOTIFICATION MESSAGE', message)
            store.dispatch(setCurrentActiveGroup({
              currentActiveGroup: message.groupUrl
            }))
            console.log('MESSAGE', message)
            updateGroupsWithLastMessageSent(store, message, userId || 0)
            store.dispatch(addChatHistory({ newMessage: message }))
            if (message.userId !== userId) {
              playNotificationSound()
            }
          }
            break
          default:
            break
        }
      })
    }

    wsClient.onWebSocketClose = () => {
      console.log('ERROR DURING HANDSHAKE WITH SERVER')
      store.dispatch(wsHealthCheckConnected({ isWsConnected: false }))
    }
    wsClient.activate()
    console.log('userId', userId)
  }
}

function publishWs (wsClient: Client, transportModel: TransportModel) {
  if (wsClient && wsClient.active) {
    wsClient.publish({
      destination: '/app/message',
      body: JSON.stringify(transportModel)
    })
  }
}

export interface CustomAction extends Action {
  payload: any
}

export const logger = (store: MiddlewareAPI) => (next: Dispatch) => (action: Action) => {
  console.log('dispatching', action)
  // console.log('next state', store.getState())
  return next(action)
}

export const WsClientMiddleWare = (store: MiddlewareAPI) => (next: Dispatch) => (action: CustomAction) => {
  const { globalReducer }: RootState = store.getState()
  const {
    wsObject,
    userId,
    currentActiveGroup,
    userWsToken
  } = globalReducer

  switch (action.type) {
    case 'main/setWsObject':
      const client = action.payload.wsObj
      if (client) {
        initWsAndSubscribe(client, store)
      }
      break
    case 'main/fetchGroupMessages':
      if (wsObject) {
        publishWs(wsObject, new TransportModel(userId || 0, TransportActionEnum.FETCH_GROUP_MESSAGES, undefined, currentActiveGroup, undefined, action.payload.messageId))
      }
      break
    case 'main/sendWsMessage':
      // TODO send back alert to UI
      break
    case MARK_MESSAGE_AS_SEEN:
      markMessageAsSeen(store, currentActiveGroup)
      if (wsObject) {
        publishWs(wsObject, new TransportModel(userId || 0, TransportActionEnum.MARK_MESSAGE_AS_SEEN, undefined, currentActiveGroup))
      }
      break
    case UNSUBSCRIBE_ALL:
      if (mainSubscribe) {
        mainSubscribe.unsubscribe()
      }
      break
    case HANDLE_RTC_ACTIONS:
      if (wsObject) {
        handleRTCActions(wsObject, store, action.payload)
      }
      break
    case HANDLE_RTC_OFFER:
      if (wsObject) {
        handleRTCActions(wsObject, store, action.payload)
      }
      break
    case HANDLE_RTC_ANSWER:
      if (wsObject) {
        handleRTCActions(wsObject, store, action.payload)
      }
      break
    case SEND_TO_SERVER:
      if (wsObject) {
        handleRTCActions(wsObject, store, action.payload)
      }
      break
    case GRANT_USER_ADMIN:
      if (wsObject) {
        publishWs(wsObject, new TransportModel(userId || 0, TransportActionEnum.GRANT_USER_ADMIN, userWsToken, currentActiveGroup))
      }
      break
    default:
      break
  }
  return next(action)
}

/**
 * Update groups sidebar with new messages
 *
 * @param store
 * @param value
 * @param userId
 */
function updateGroupsWithLastMessageSent (store: MiddlewareAPI, value: FullMessageModel, userId: number) {
  console.log(userId)
  const groupIdToUpdate = value.groupId
  const groups: GroupModel[] = store.getState().WebSocketReducer.wsUserGroups
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
  store.dispatch({
    type: SET_WS_GROUPS,
    payload: groupsArray
  })
}

function markMessageAsSeen (store: MiddlewareAPI, groupUrl: string) {
  const groups: GroupModel[] = store.getState().WebSocketReducer.wsUserGroups
  const groupToUpdateIndex = groups.findIndex(elt => elt.url === groupUrl)
  if (groupToUpdateIndex === -1) {
    return
  }
  const groupsArray = [...groups]
  groupsArray[groupToUpdateIndex].lastMessageSeen = true
  store.dispatch({
    type: SET_WS_GROUPS,
    payload: groupsArray
  })
}
