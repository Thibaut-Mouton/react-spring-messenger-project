import { Client } from "@stomp/stompjs"
import { FullMessageModel } from "../../interface-contract/full-message-model"
import { IGroupWrapper } from "../../interface-contract/user/group-wrapper-model"
import { FeedbackModel } from "../../interface-contract/feedback-model"

export interface StoreState {
  globalReducer: WsReducerInitType
}

export interface WsReducerInitType {
  userId?: number
  userWsToken?: string
  currentGroup: IGroupWrapper,
  isWsConnected: boolean,
  wsObject: Client | null,
  groups: IGroupWrapper[],
  currentActiveGroup: string,
  allMessagesFetched: boolean,
  usersInConversationList: [],
  chatHistory: FullMessageModel[],

  alerts: FeedbackModel[]

  authLoading: boolean

  callStarted: boolean
  callUrl: string
}
