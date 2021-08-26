import {
    FETCH_GROUP_MESSAGES,
    GRANT_USER_ADMIN,
    HANDLE_RTC_ACTIONS,
    HANDLE_RTC_ANSWER,
    HANDLE_RTC_OFFER,
    INIT_WS_CONNECTION,
    MARK_MESSAGE_AS_SEEN,
    SEND_GROUP_MESSAGE,
    SEND_TO_SERVER,
    SET_WS_GROUPS,
    UNSUBSCRIBE_ALL,
} from "../utils/redux-constants";
import {addChatHistory, setGroupMessages, setWsUserGroups, wsHealthCheckConnected} from "../actions/websocket-actions";
import {handleRTCActions} from "./webRTC-middleware";
import {Client, IMessage, StompSubscription} from "@stomp/stompjs";
import {ReduxModel} from "../model/redux-model";
import {Dispatch, Store} from "redux";
import {FullMessageModel} from "../model/full-message-model";
import {GroupModel} from "../model/group-model";
import {TransportModel} from "../model/transport-model";
import {TransportActionEnum} from "../utils/transport-action-enum";
import {OutputTransportDTO} from "../model/input-transport-model";
import {MessageModel} from "../model/message-model";
import {playNotificationSound} from "../config/play-sound-notification";

let mainSubscribe: StompSubscription;

function initWsAndSubscribe(wsClient: Client, store: Store, reduxModel: ReduxModel) {
    const wsUserTokenValue = reduxModel.userToken;
    const userId = reduxModel.userId;
    wsClient.onConnect = () => {
        store.dispatch(store.dispatch(wsHealthCheckConnected(true)))
        mainSubscribe = wsClient.subscribe(`/topic/user/${userId}`, (res: IMessage) => {
            const data: OutputTransportDTO = JSON.parse(res.body);
            switch (data.action) {
                case TransportActionEnum.INIT_USER_DATA:
                    store.dispatch(setWsUserGroups(data.object as GroupModel[]))
                    break;
                case TransportActionEnum.FETCH_GROUP_MESSAGES:
                    store.dispatch(setGroupMessages(data.object as MessageModel[]));
                    break;
                case TransportActionEnum.SEND_GROUP_MESSAGE:
                    break;
                case TransportActionEnum.NOTIFICATION_MESSAGE:
                    const message = data.object as FullMessageModel;
                    updateGroupsWithLastMessageSent(store, message, userId || 0);
                    store.dispatch(addChatHistory(message))
                    if (message.userId !== userId) {
                        playNotificationSound();
                    }
                    break;
                default:
                    break;
            }
        });
        publishWs(wsClient, new TransportModel(userId || 0, TransportActionEnum.INIT_USER_DATA, wsUserTokenValue));
    }

    wsClient.onWebSocketClose = () => {
        console.log("ERROR DURING HANDSHAKE WITH SERVER")
        store.dispatch(wsHealthCheckConnected(false))
    }
    wsClient.activate();
}

interface ReduxActionType {
    type: string
    payload: any
}

function publishWs(wsClient: Client, transportModel: TransportModel) {
    if (wsClient && wsClient.active) {
        wsClient.publish({
            destination: "/app/message",
            body: JSON.stringify(transportModel)
        });
    }
}

const WsClientMiddleWare = () => {
    let wsClient: Client;

    return (store: Store) => (next: Dispatch) => (action: ReduxActionType) => {
        const model: ReduxModel = action.payload;
        switch (action.type) {
            case INIT_WS_CONNECTION:
                if (action.payload === null) {
                    return next(action);
                }
                wsClient = action.payload.client;
                initWsAndSubscribe(wsClient, store, action.payload);
                break;
            case FETCH_GROUP_MESSAGES:
                store.dispatch(setGroupMessages([]));
                publishWs(wsClient, new TransportModel(model.userId || 0, TransportActionEnum.FETCH_GROUP_MESSAGES, undefined, model.groupUrl, undefined))
                break;
            case SEND_GROUP_MESSAGE:
                publishWs(wsClient, new TransportModel(model.userId || 0, TransportActionEnum.SEND_GROUP_MESSAGE, undefined, model.groupUrl, model.message));
                break;
            case MARK_MESSAGE_AS_SEEN:
                markMessageAsSeen(store, action.payload.groupUrl || "")
                break;
            case UNSUBSCRIBE_ALL:
                break;
            case HANDLE_RTC_ACTIONS:
                handleRTCActions(wsClient, store, action.payload);
                break;
            case HANDLE_RTC_OFFER:
                console.log("Create offer ...")
                handleRTCActions(wsClient, store, action.payload);
                break;
            case HANDLE_RTC_ANSWER:
                console.log("Create answer ...")
                handleRTCActions(wsClient, store, action.payload);
                break;
            case SEND_TO_SERVER:
                handleRTCActions(wsClient, store, action.payload);
                break;
            case GRANT_USER_ADMIN:
                publishWs(wsClient, new TransportModel(model.userId || 0, TransportActionEnum.GRANT_USER_ADMIN, model.userToken, model.groupUrl))
                break;
            default:
                // console.log(`Unhandled action : ${action.type}`);
                return next(action);
        }
    };
};


/**
 * Update groups sidebar with new messages
 *
 * @param store
 * @param value
 * @param userId
 */
function updateGroupsWithLastMessageSent(store: Store, value: FullMessageModel, userId: number) {
    const groupIdToUpdate = value.groupId;
    const groups: GroupModel[] = store.getState().WebSocketReducer.wsUserGroups;

    let groupToPlaceInFirstPosition = groups.findIndex((elt) => elt.id === groupIdToUpdate);
    if (groupToPlaceInFirstPosition === -1) {
        return
    }
    let groupsArray = [...groups];
    let item = {...groupsArray[groupToPlaceInFirstPosition]};
    item.lastMessage = value.message;
    item.lastMessageDate = value.time;
    groupsArray.splice(groupToPlaceInFirstPosition, 1);
    groupsArray.unshift(item);
    store.dispatch({type: SET_WS_GROUPS, payload: groupsArray})
}

function markMessageAsSeen(store: Store, groupUrl: string) {
    const groups: GroupModel[] = store.getState().WebSocketReducer.wsUserGroups;
    const groupToUpdateIndex = groups.findIndex(elt => elt.url === groupUrl);
    if (groupToUpdateIndex === -1) {
        return;
    }
    if (!groups[groupToUpdateIndex].isLastMessageSeen) {
        return;
    }
    let groupsArray = [...groups];
    groupsArray[groupToUpdateIndex].isLastMessageSeen = false;
    store.dispatch({type: SET_WS_GROUPS, payload: groupsArray})
}

export default WsClientMiddleWare();