import {connect} from 'react-redux'
import {WebSocketMainComponent} from "../../components/websocket/websocket-main-component";
import {
    initWsConnection,
    setCurrentActiveGroup,
    unsubscribeAll,
    wsHealthCheckConnected
} from "../../actions/websocket-actions";
import {initCallWebRTC} from "../../actions/web-rtc-actions";

const mapStateToProps = (state) => {
    const {wsUserGroups, isWsConnected, currentActiveGroup} = state.WebSocketReducer;
    return {
        isWsConnected,
        currentActiveGroup,
        wsUserGroups
    };
}

const mapDispatchToProps = dispatch => {
    return {
        wsCheckConnected: (bool) => dispatch(wsHealthCheckConnected(bool)),
        setCurrentActiveGroup: (url) => dispatch(setCurrentActiveGroup(url)),
        setWsObject: (data) => dispatch(initWsConnection(data)),
        initCallWebRTC: (data) => dispatch(initCallWebRTC(data)),
        unsubscribeAll: () => dispatch(unsubscribeAll())
    }
}


const WebSocketMainContainer = connect(mapStateToProps, mapDispatchToProps)(WebSocketMainComponent);

export default WebSocketMainContainer;