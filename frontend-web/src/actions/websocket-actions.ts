import {
    ADD_CHAT_HISTORY,
    CURRENT_ACTIVE_GROUP,
    FETCH_GROUP_MESSAGES,
    GRANT_USER_ADMIN,
    INIT_WS_CONNECTION,
    MARK_MESSAGE_AS_SEEN,
    SEND_GROUP_MESSAGE,
    SET_ALL_MESSAGES_FETCHED,
    SET_CHAT_HISTORY,
    SET_WS_GROUPS,
    UNSUBSCRIBE_ALL,
    WS_CHECK_CONNECTED
} from "../utils/redux-constants";
import {GroupModel} from "../model/group-model";
import {ReduxModel} from "../model/redux-model";
import {MessageModel} from "../model/message-model";
import {FullMessageModel} from "../model/full-message-model";

export const initWsConnection = (reduxModel: ReduxModel) => ({
    type: INIT_WS_CONNECTION,
    payload: reduxModel
})

export const wsHealthCheckConnected = (isWsConnected: boolean) => ({
    type: WS_CHECK_CONNECTED,
    payload: isWsConnected
})

export const setWsUserGroups = (groupsArray: GroupModel[]) => ({
    type: SET_WS_GROUPS,
    payload: groupsArray
})

export const setCurrentActiveGroup = (groupUrl: string) => ({
    type: CURRENT_ACTIVE_GROUP,
    payload: groupUrl
})

export const grantUserAdmin = (model: ReduxModel) => ({
    type: GRANT_USER_ADMIN,
    payload: model
})

export const getGroupMessages = (model: ReduxModel) => ({
    type: SET_CHAT_HISTORY,
    payload: model
})

export const setGroupMessages = (messages: MessageModel[]) => ({
    type: SET_CHAT_HISTORY,
    payload: messages
})

export const setAllMessagesFetched = (isLastMessage: boolean) => ({
    type: SET_ALL_MESSAGES_FETCHED,
    payload: isLastMessage
})

export const addChatHistory = (model: FullMessageModel) => ({
    type: ADD_CHAT_HISTORY,
    payload: model
})

export const fetchGroupMessages = (model: ReduxModel) => ({
    type: FETCH_GROUP_MESSAGES,
    payload: model
})

export const sendWsMessage = (model: ReduxModel) => ({
    type: SEND_GROUP_MESSAGE,
    payload: model
})

export const unsubscribeAll = () => ({
    type: UNSUBSCRIBE_ALL
})

export const markMessageAsSeen = (model: ReduxModel) => ({
    type: MARK_MESSAGE_AS_SEEN,
    payload: model
})
