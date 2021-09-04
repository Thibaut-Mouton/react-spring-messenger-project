import {connect} from 'react-redux'
import {WebSocketMainComponent} from "../../components/websocket/websocket-main-component";
import {
    initWsConnection,
    setCurrentActiveGroup,
    unsubscribeAll,
    wsHealthCheckConnected
} from "../../actions/websocket-actions";
import {Dispatch} from "redux";
import {ReduxModel} from "../../model/redux-model";

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        wsCheckConnected: (isConnected: boolean) => dispatch(wsHealthCheckConnected(isConnected)),
        setCurrentActiveGroup: (groupUrl: string) => dispatch(setCurrentActiveGroup(groupUrl)),
        setWsObject: (model: ReduxModel) => dispatch(initWsConnection(model)),
        unsubscribeAll: () => dispatch(unsubscribeAll())
        // initCallWebRTC: (data: any) => dispatch(initCallWebRTC(data)),
    }
}


const WebSocketMainContainer = connect(null, mapDispatchToProps)(WebSocketMainComponent);

export default WebSocketMainContainer;