import {
    ADD_CHAT_HISTORY,
    CURRENT_ACTIVE_GROUP, INIT_WS_CONNECTION,
    INIT_WS_TOKEN, SET_ACTIVE_GROUP, SET_ALL_MESSAGES_FETCHED, SET_CHAT_HISTORY,
    SET_WS_GROUPS,
    WS_CHECK_CONNECTED
} from "../utils/redux-constants";
import {WsReducerInitType} from "./types";


const initialState: WsReducerInitType = {
    isWsConnected: false,
    wsObject: null,
    wsUserTokenValue: "",
    wsUserGroups: [],
    currentActiveGroup: "",
    allMessagesFetched: false,
    usersInConversationList: [],
    chatHistory: []
}

const WebSocketReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case INIT_WS_TOKEN:
            return {...state, wsUserTokenValue: action.payload};
        case INIT_WS_CONNECTION:
            return {...state, wsObject: action.payload};
        case SET_WS_GROUPS:
            return {...state, wsUserGroups: action.payload};
        case WS_CHECK_CONNECTED:
            return {...state, isWsConnected: action.payload};
        case SET_ACTIVE_GROUP:
            return {...state, activeGroup: action.payload};
        case SET_ALL_MESSAGES_FETCHED:
            return {...state, allMessagesFetched: action.payload};
        case CURRENT_ACTIVE_GROUP:
            return {...state, currentActiveGroup: action.payload};
        case SET_CHAT_HISTORY:
            return {...state, chatHistory: action.payload};
        case ADD_CHAT_HISTORY:
            return {
                ...state,
                chatHistory: [...state.chatHistory, action.payload]
            }
        default:
            return state;
    }
}

export default WebSocketReducer;