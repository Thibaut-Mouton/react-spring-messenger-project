import {connect} from 'react-redux'
import {CallWindowComponent} from "../components/websocket/call-window-component";
import {initWsConnection} from "../actions/websocket-actions";
import {createAnswer, createOffer, sendToServer} from "../actions/web-rtc-actions";
import {Client} from "@stomp/stompjs";
import {ReduxModel} from "../model/redux-model";

const mapStateToProps = (state: any) => {
    const {wsUserTokenValue, isWsConnected} = state.WebSocketReducer;
    const {webRtcOffer, webRtcAnswer, webRtcCandidate} = state.WebRTCReducer;
    return {
        wsUserTokenValue,
        isWsConnected,
        webRtcAnswer,
        webRtcCandidate,
        webRtcOffer
    };
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        setWsObject: (data: ReduxModel) => dispatch(initWsConnection(data)),
        createOffer: (data: any) => dispatch(createOffer(data)),
        createAnswer: (data: any) => dispatch(createAnswer(data)),
        sendToServer: (data: any) => dispatch(sendToServer(data))
    }
}

const CallWindowContainer = connect(mapStateToProps, mapDispatchToProps)(CallWindowComponent);

export default CallWindowContainer;