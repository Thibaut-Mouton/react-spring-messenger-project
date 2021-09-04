import {GroupModel} from "../../model/group-model";
import {FullMessageModel} from "../../model/full-message-model";
import {Client} from "@stomp/stompjs";


export interface WsReducerInitType {
    isWsConnected: boolean,
    wsObject: Client | null,
    wsUserTokenValue: string,
    wsUserGroups: GroupModel[],
    currentActiveGroup: string,
    allMessagesFetched: boolean,
    usersInConversationList: [],
    chatHistory: FullMessageModel[]
}