import { WsReducerInitType } from "./types"
import { IGroupWrapper } from "../interface-contract/user/group-wrapper-model"

const initialRtcState = {
  callIncoming: false,
  webRtcOffer: null,
  webRtcAnswer: null,
  webRtcCandidate: null
}

const initialWsState: WsReducerInitType = {
  currentGroup: {} as IGroupWrapper,
  isWsConnected: false,
  wsObject: null,
  groups: [],
  currentActiveGroup: "",
  allMessagesFetched: false,
  usersInConversationList: [],
  chatHistory: [],
  callStarted: false,
  callUrl: "",

  alerts: [],
  authLoading: true,
  userWsToken: undefined,
  userId: undefined
}

export const initialState = {
  ...initialRtcState,
  ...initialWsState,
}
