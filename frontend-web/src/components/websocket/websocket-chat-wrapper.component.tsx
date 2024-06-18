import React, {useContext} from "react"
import {WebSocketChatComponent} from "./websocket-chat-component"
import {SearchMessageComponent} from "../messages/SearchMessageComponent"
import {SearchContext} from "../../context/SearchContext"

interface WebsocketChatWrapperComponentProps {
    groupUrl?: string
}

export function WebsocketChatWrapperComponent({groupUrl}: WebsocketChatWrapperComponentProps) {
    const {searchText} = useContext(SearchContext)!

    return <>
        {
            searchText === "" ? <WebSocketChatComponent groupUrl={groupUrl}/> : <SearchMessageComponent/>
        }
    </>

}
