import "./websocketStyle.css"
import React, {useEffect} from "react"
import {WebSocketGroupActionComponent} from "./websocket-group-actions-component"
import {WebsocketGroupsComponent} from "./websocket-groups-component"
import {useParams} from "react-router-dom"
import {WebsocketContextProvider} from "../../context/WebsocketContext"
import {HeaderComponent} from "../partials/HeaderComponent"
import {WebsocketChatWrapperComponent} from "./websocket-chat-wrapper.component"

export const WebSocketMainComponent: React.FunctionComponent = (): React.JSX.Element => {
    const {groupId} = useParams()

    useEffect(() => {
        document.title = "Messages | FLM"
    }, [])

    return (
        <>
            <HeaderComponent/>
            <div style={{
                height: "calc(100% - 64px)",
                display: "flex",
            }}>
                <WebsocketContextProvider>
                    <WebsocketGroupsComponent groupUrl={groupId}/>
                    <WebsocketChatWrapperComponent groupUrl={groupId}/>
                    <WebSocketGroupActionComponent groupUrl={groupId}/>
                </WebsocketContextProvider>
            </div>
        </>
    )
}
