import { UserReducerType, WsReducerInitType } from './types';

const initialRtcState = {
    webRtcOffer: null,
    webRtcAnswer: null,
    webRtcCandidate: null
};

const initialUserState: UserReducerType = {
    userWsToken: undefined,
    userId: undefined
};

const initialWsState: WsReducerInitType = {
    currentGroupName: '',
    isWsConnected: false,
    wsObject: null,
    wsUserGroups: [],
    currentActiveGroup: '',
    allMessagesFetched: false,
    usersInConversationList: [],
    chatHistory: []
};

export const initialState = {
    ...initialUserState,
    ...initialRtcState,
    ...initialWsState
};
