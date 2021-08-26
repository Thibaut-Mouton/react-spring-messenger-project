import {connect} from 'react-redux'
import {WebSocketMainComponent} from "../components/websocket/websocket-main-component";
import {initWsConnection, wsHealthCheckConnected} from "../actions/websocket-actions";
import {Client} from "@stomp/stompjs";

const mapStateToProps = (state: any) => {
    const {wsUserTokenValue, wsUserGroups, isWsConnected} = state.WebSocketReducer;
    return {
        wsUserTokenValue,
        isWsConnected,
        wsUserGroups
    };
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        wsCheckConnected: (bool: boolean) => dispatch(wsHealthCheckConnected(bool)),
        setWsObject: (data: Client) => dispatch(initWsConnection(data))
    }
}

// @ts-ignore
const WebSocketMainContainer = connect(mapStateToProps, mapDispatchToProps)(WebSocketMainComponent);

export default WebSocketMainContainer;