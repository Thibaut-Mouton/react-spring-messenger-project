import React, {useEffect} from "react";
import {generateColorMode} from "../../design/style/enable-dark-mode";
import WebSocketGroupsContainer from "../../container/websocket/websocket-groups-container";
import WebSocketChatContainer from "../../container/websocket/websocket-chat-container";
import "./websocketStyle.css"
import {initWebSocket} from "../../config/websocket-config";
import WebSocketGroupsActionContainer from "../../container/websocket/websocket-group-actions-container";
import {useThemeContext} from "../../context/theme-context";
import {useAuthContext} from "../../context/auth-context";
import {ReduxModel} from "../../model/redux-model";
import {useLoaderContext} from "../../context/loader-context";

interface WebsocketMainComponentType {
    setWsObject: (model: ReduxModel) => {}
    wsCheckConnected: (isConnected: boolean) => void
    unsubscribeAll: () => {}
    setCurrentActiveGroup: (groupUrl: string) => void
}


export const WebSocketMainComponent: React.FunctionComponent<WebsocketMainComponentType> = ({
                                                                                                setWsObject,
                                                                                                wsCheckConnected,
                                                                                                unsubscribeAll
                                                                                            }) => {
    const {theme} = useThemeContext();
    const {user} = useAuthContext();
    const {setLoading} = useLoaderContext();
    const [groupName, setGroupName] = React.useState<string>("");

    useEffect(() => {
        document.title = 'Messages | FLM'
    }, []);

    useEffect(() => {
        if (user && user.wsToken !== null) {
            setLoading(true)
            initWs()
        }
        return () => {
            wsCheckConnected(false);
            unsubscribeAll()
            setWsObject(new ReduxModel(undefined));
        }
    }, [user?.wsToken])

    const setGroupNameValue = (name: string) => {
        setGroupName(name)
    }

    async function initWs() {
        const wsClient = await initWebSocket(user?.wsToken);
        const toSend = new ReduxModel(wsClient, user?.wsToken, undefined, user?.id);
        setWsObject(toSend);
    }

    return (
        <div className={generateColorMode(theme)}
             style={{height: "calc(100% - 64px)", display: "flex", justifyContent: "space-between"}}>
            <WebSocketGroupsContainer setGroupName={setGroupNameValue}/>
            <WebSocketChatContainer groupName={groupName}/>
            <WebSocketGroupsActionContainer/>
        </div>
    )
}
