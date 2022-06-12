import { Client } from '@stomp/stompjs';
import { FullMessageModel } from '../../model/full-message-model';
import { GroupModel } from '../../model/group-model';

export interface StoreState {
  globalReducer: WsReducerInitType
}

export interface UserReducerType {
  userId?: number
  userWsToken?: string
}

export interface WsReducerInitType {
  userId?: number
  userWsToken?: string
  currentGroupName: string,
  isWsConnected: boolean,
  wsObject: Client | null,
  wsUserGroups: GroupModel[],
  currentActiveGroup: string,
  allMessagesFetched: boolean,
  usersInConversationList: [],
  chatHistory: FullMessageModel[]
}
