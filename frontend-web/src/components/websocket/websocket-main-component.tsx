import "./websocketStyle.css"
import React, {useEffect} from "react"
import {WebSocketChatComponent} from "./websocket-chat-component"
import {WebSocketGroupActionComponent} from "./websocket-group-actions-component"
import {WebsocketGroupsComponent} from "./websocket-groups-component"
import {useThemeContext} from "../../context/theme-context"
import {generateColorMode} from "../utils/enable-dark-mode"
import {useParams} from "react-router-dom"
import {WebsocketContextProvider} from "../../context/WebsocketContext"

export const WebSocketMainComponent: React.FunctionComponent = (): React.JSX.Element => {
    const {theme} = useThemeContext()
    const {groupId} = useParams()

    useEffect(() => {
        document.title = "Messages | FLM"
    }, [])

    return (
        <div className={generateColorMode(theme)}
             style={{
                 height: "calc(100% - 46px)",
                 display: "flex",
                 justifyContent: "space-between"
             }}>
            <WebsocketContextProvider>
                <WebsocketGroupsComponent groupUrl={groupId}/>
                <WebSocketChatComponent groupUrl={groupId}/>
                <WebSocketGroupActionComponent groupUrl={groupId}/>
            </WebsocketContextProvider>
        </div>
    )
}
