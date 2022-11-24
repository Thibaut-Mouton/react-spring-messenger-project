import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Client } from "@stomp/stompjs"
import { initialState } from "./initial-store-state"
import { logger } from "../middleware/ws-middleware"
import { FullMessageModel } from "../interface-contract/full-message-model"
import { GroupModel } from "../interface-contract/group-model"
import { IGroupWrapper } from "../interface-contract/user/group-wrapper-model"
import { FeedbackModel, IPartialFeedBack } from "../interface-contract/feedback-model"
import { UUIDv4 } from "../utils/uuid-generator"
import { TypeMessageEnum } from "../utils/type-message-enum"

const mainReducer = createSlice({
  name: "main",
  initialState,
  reducers: {
    setAlerts: (state, { payload }: PayloadAction<{ alert: IPartialFeedBack }>) => {
	 const alertToSet = { ...payload.alert } as FeedbackModel
	 alertToSet.id = UUIDv4()
	 state.alerts = [...state.alerts, alertToSet]
    },
    setAllAlerts: (state, { payload }: PayloadAction<{ allAlerts: IPartialFeedBack[] }>) => {
	 state.alerts = payload.allAlerts
    },
    setUserWsToken: (state, { payload }: PayloadAction<{ wsToken: string }>) => {
	 state.userWsToken = payload.wsToken
    },
    setUserId: (state, { payload }: PayloadAction<{ userId: number }>) => {
	 state.userId = payload.userId
    },
    setCallIncoming: (state, { payload }: PayloadAction<{ callStarted: boolean }>) => {
	 state.callStarted = payload.callStarted
    },
    setCallUrl: (state, { payload }: PayloadAction<{ callUrl: string }>) => {
	 state.callUrl = payload.callUrl
    },
    setWsUserGroups: (state, { payload }: PayloadAction<{ groups: IGroupWrapper[] }>) => {
	 state.groups = payload.groups
    },
    wsHealthCheckConnected: (state, { payload }: PayloadAction<{ isWsConnected: boolean }>) => {
	 state.isWsConnected = payload.isWsConnected
    },
    clearChatHistory: (state) => {
	 state.chatHistory = []
    },
    setGroupMessages: (state, { payload }: PayloadAction<{ messages: FullMessageModel[] }>) => {
	 const messagesTemp = state.chatHistory
	 state.chatHistory = payload.messages.concat(messagesTemp)
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
    setCurrentGroup: (state, {
	 payload
    }: PayloadAction<{ currentGroup: IGroupWrapper }>) => {
	 state.currentGroup = payload.currentGroup
    },
    setWsObject: (state, {
	 payload
    }: PayloadAction<{ wsObj: Client | null }>) => {
	 state.wsObject = payload.wsObj
    },
    createGroup: (state, { payload }: PayloadAction<{ group: GroupModel }>) => {
	 const groups = [...state.groups]
	 groups.unshift({
	   group: payload.group,
	   groupCall: { anyCallActive: false }
	 })
	 state.chatHistory = []
	 state.groups = groups
    },
    setGroupWithCurrentCall: (state, { payload }: PayloadAction<{ groupUrl: string, roomUrl?: string }>) => {
	 const groups = [...state.groups]
	 groups.map((group) => {
	   if (group.group.url === payload.groupUrl) {
		group.groupCall.anyCallActive = !!payload.roomUrl
		group.groupCall.activeCallUrl = payload.roomUrl
	   }
	   return group
	 })
    },
    removeUserFromGroup: (state, { payload }: PayloadAction<{ groupUrl: string }>) => {
	 const groups = [...state.groups]
	 state.groups = groups.reduce((acc: IGroupWrapper[], group) => {
	   if (group.group.url === payload.groupUrl) {
		return acc
	   }
	   acc.push(group)
	   return acc
	 }, new Array<IGroupWrapper>())
    },
    markMessageAsSeen: (state, {
	 payload
    }: PayloadAction<{ groupUrl: string }>) => {
	 const groups = state.groups
	 state.groups = groups.map((groupWrapper) => {
	   if (groupWrapper.group.url === payload.groupUrl) {
		groupWrapper.group.lastMessageSeen = true
	   }
	   return groupWrapper
	 })
    },
    setAuthLoading: (state, { payload }: PayloadAction<{ isLoading: boolean }>) => {
	 state.authLoading = payload.isLoading
    },
    updateGroupsWithLastMessageSent: (state, { payload }: PayloadAction<{ message: FullMessageModel, userId: number }>) => {
	 const groupWrappers = [...state.groups]
	 const groupIdToUpdate = payload.message.groupId
	 const {
	   message,
	   userId
	 } = payload
	 const isMessageSendByCurrentUser = message.userId === userId
	 const groupsTemp = groupWrappers.map((groupWrapper) => {
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
	 const groupIndexToMove = groupsTemp.findIndex((elt) => elt.group.url === message.groupUrl)
	 if (groupIndexToMove !== -1) {
	   groupsTemp.unshift(groupsTemp.splice(groupIndexToMove, 1)[0])
	 }
	 state.groups = groupsTemp
    }
  }
})

export const globalReducer = mainReducer.reducer
export const {
  setWsUserGroups,
  wsHealthCheckConnected,
  updateGroupsWithLastMessageSent,
  setGroupMessages,
  clearChatHistory,
  setCurrentActiveGroup,
  createGroup,
  setAllMessagesFetched,
  addChatHistory,
  setAlerts,
  setAllAlerts,
  setCurrentGroup,
  setCallIncoming,
  setCallUrl,
  removeUserFromGroup,
  setGroupWithCurrentCall,
  setUserWsToken,
  setUserId,
  markMessageAsSeen,
  setAuthLoading
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
