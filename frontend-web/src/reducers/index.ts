import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit'
import { Client } from '@stomp/stompjs'
import { initialState } from './initial-store-state'
import { logger } from '../middleware/ws-middleware'
import { FullMessageModel } from '../model/full-message-model'
import { GroupModel } from '../model/group-model'
import { ReduxModel } from '../model/redux-model'
import { SET_WS_GROUPS } from '../utils/redux-constants'

const mainReducer = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setUserWsToken: (state, { payload }: PayloadAction<{ wsToken: string }>) => {
      state.userWsToken = payload.wsToken
    },
    setUserId: (state, { payload }: PayloadAction<{ userId: number }>) => {
      state.userId = payload.userId
    },
    setWsUserGroups: (state, { payload }: PayloadAction<{ groupsArray: GroupModel[] }>) => {
      state.wsUserGroups = payload.groupsArray
    },
    wsHealthCheckConnected: (state, { payload }: PayloadAction<{ isWsConnected: boolean }>) => {
      state.isWsConnected = payload.isWsConnected
    },
    setGroupMessages: (state, { payload }: PayloadAction<{ messages: FullMessageModel[] }>) => {
      state.chatHistory = payload.messages
    },
    setAllMessagesFetched: (state, { payload }: PayloadAction<{ allMessagesFetched: boolean }>) => {
      state.allMessagesFetched = payload.allMessagesFetched
    },
    setCurrentActiveGroup: (state, { payload }: PayloadAction<{ currentActiveGroup: string }>) => {
      state.currentActiveGroup = payload.currentActiveGroup
    },
    addChatHistory: (state, { payload }: PayloadAction<{ newMessage: FullMessageModel }>) => {
      state.chatHistory = [...state.chatHistory, payload.newMessage]
    },
    unsubscribeAll: (state) => {
    },
    sendWsMessage: (state, {
      payload
    }: PayloadAction<{ message: string }>) => {
    },
    fetchGroupMessages: (state, {
      payload
    }: PayloadAction<{ messageId: number }>) => {
    },
    setGroupName: (state, {
      type,
      payload
    }: PayloadAction<{ groupName: string }>) => {
      state.currentGroupName = payload.groupName
    },
    middlewareAction: (state, {
      type,
      payload
    }: PayloadAction<{ data: ReduxModel, type: string }>) => {
    },
    setWsObject: (state, {
      payload
    }: PayloadAction<{ wsObj: Client | null }>) => {
      state.wsObject = payload.wsObj
    },
    markMessageAsSeen: (state, {
      payload
    }: PayloadAction<{ groupUrl: string }>) => {
      const groups: GroupModel[] = state.wsUserGroups
      const groupToUpdateIndex = groups.findIndex(elt => elt.url === payload.groupUrl)
      if (groupToUpdateIndex === -1) {
        return
      }
      const groupsArray = [...groups]
      groupsArray[groupToUpdateIndex].lastMessageSeen = true
      state.wsUserGroups = groupsArray
    },
  }
})

export const globalReducer = mainReducer.reducer
export const {
  setWsUserGroups,
  wsHealthCheckConnected,
  setGroupMessages,
  setCurrentActiveGroup,
  setAllMessagesFetched,
  unsubscribeAll,
  addChatHistory,
  fetchGroupMessages,
  setGroupName,
  sendWsMessage,
  setUserWsToken,
  setUserId,
  markMessageAsSeen
} = mainReducer.actions

const reducer = {
  globalReducer
}

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger)
})
export type TStore = ReturnType<typeof store.getState>;

export type RootState = ReturnType<typeof store.getState>
