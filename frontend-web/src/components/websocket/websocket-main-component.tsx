import "./websocketStyle.css"
import React, { useEffect } from "react"
import { WebSocketChatComponent } from "./websocket-chat-component"
import { WebSocketGroupActionComponent } from "./websocket-group-actions-component"
import { WebsocketGroupsComponent } from "./websocket-groups-component"
import { useThemeContext } from "../../context/theme-context"
import { generateColorMode } from "../utils/enable-dark-mode"
import { useWebSocketContext, WebsocketContextProvider } from "../../context/ws-context"

export const WebSocketMainComponent: React.FunctionComponent = (): JSX.Element => {
  const { theme } = useThemeContext()
  const { ws } = useWebSocketContext()
  const [groupUrlProps, setGroupUrl] = React.useState<string>("")
  const currentActiveGroup = ""

  useEffect(() => {
    if (currentActiveGroup) {
	 setGroupUrl(currentActiveGroup)
    } else {
	 const groupUrl = window.location.pathname.split("/").slice(-1)[0]
	 if (groupUrl) {
	   setGroupUrl(groupUrl)
	 }
    }
  }, [currentActiveGroup])

  useEffect(() => {
    document.title = "Messages | FLM"
    return () => {
	 if (ws) {
	   ws.deactivate()
	 }
    }
  }, [])

  return (
    <div className={generateColorMode(theme)}
	    style={{
		 height: "calc(100% - 64px)",
		 display: "flex",
		 justifyContent: "space-between"
	    }}>
	 <WebsocketContextProvider>
	   <WebsocketGroupsComponent groupUrl={groupUrlProps}/>
	   <WebSocketChatComponent groupUrl={groupUrlProps}/>
	   <WebSocketGroupActionComponent groupUrl={groupUrlProps}/>
	 </WebsocketContextProvider>
    </div>
  )
}
