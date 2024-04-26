import React, {createContext, Dispatch, useEffect, useReducer} from "react"
import {HttpGroupService} from "../service/http-group-service"
import {GroupModel} from "../interface-contract/group-model"

enum GroupContextAction {
    ADD_GROUP = "ADD_GROUP",
    UPDATE_GROUPS = "UPDATE_GROUPS",
    UPDATE_LAST_MESSAGE_GROUP = "UPDATE_LAST_MESSAGE_GROUP",
    UPDATE_SEEN_MESSAGE = "UPDATE_SEEN_MESSAGE",
    SET_GROUPS = "SET_GROUPS",
}

export type GroupActionType =
    | { type: GroupContextAction.UPDATE_GROUPS; payload: { id: number; field: Partial<GroupModel> } }
    | { type: GroupContextAction.ADD_GROUP; payload: GroupModel }
    | { type: GroupContextAction.UPDATE_SEEN_MESSAGE; payload: { groupUrl: string; isMessageSeen: boolean } }
    | { type: GroupContextAction.UPDATE_LAST_MESSAGE_GROUP; payload: { groupUrl: string; field: Partial<GroupModel> } }
    | { type: GroupContextAction.SET_GROUPS; payload: GroupModel[] }

const GroupContext = createContext<{
    groups: GroupModel[]
    changeGroupState: Dispatch<GroupActionType>;
} | undefined>(undefined)

export const groupReducer = (state: GroupModel[], action: GroupActionType): GroupModel[] => {
    switch (action.type) {
        case GroupContextAction.UPDATE_GROUPS: {
            const index = state.findIndex((group) => group.id === action.payload.id)
            if (index >= 0) {
                return state
            }
            return state
        }
        case GroupContextAction.ADD_GROUP: {
            return [action.payload, ...state] // at first index because new conversation
        }
        case GroupContextAction.UPDATE_LAST_MESSAGE_GROUP: {
            const index = state.findIndex((group) => group.url === action.payload.groupUrl)
            if (index > -1) {
                state[index].lastMessageSender = action.payload.field.lastMessageSender
                state[index].lastMessageDate = action.payload.field.lastMessageDate || ""
                state[index].lastMessageSeen = action.payload.field.lastMessageSeen || false
                state[index].lastMessage = action.payload.field.lastMessage || ""
            }
            return state
        }
        case GroupContextAction.UPDATE_SEEN_MESSAGE: {
            const index = state.findIndex((group) => group.url === action.payload.groupUrl)
            if (index > -1) {
                state[index].lastMessageSeen = action.payload.isMessageSeen
            }
            return state
        }
        case GroupContextAction.SET_GROUPS: {
            return action.payload
        }
        default:
            return state
    }
}

const GroupContextProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [groups, changeGroupState] = useReducer(groupReducer, [])

    useEffect(() => {
        const getUserData = async () => {
            try {
                const {data} = await new HttpGroupService().pingRoute()
                changeGroupState({
                    type: GroupContextAction.SET_GROUPS,
                    payload: data.groupsWrapper.map((group) => group.group)
                })

            } catch (error) {
                if (window.location.pathname !== "/login") {
                    window.location.pathname = "/login"
                }
            }
        }
        getUserData()
    }, [])
    return (
        <GroupContext.Provider value={{groups, changeGroupState}}>
            {children}
        </GroupContext.Provider>
    )
}

export {GroupContextProvider, GroupContext, GroupContextAction}

