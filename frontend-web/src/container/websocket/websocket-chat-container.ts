import {connect} from 'react-redux'
import {WebSocketChatComponent} from "../../components/websocket/websocket-chat-component";
import {
    fetchGroupMessages, getGroupMessages, markMessageAsSeen,
    sendWsMessage,
    setCurrentActiveGroup
} from "../../actions/websocket-actions";
import {Dispatch} from "redux";
import {ReduxModel} from "../../model/redux-model";


const mapStateToProps = (state: any) => {
    const {
        isWsConnected,
        currentActiveGroup,
        chatHistory,
        wsObject,
        wsUserGroups,
        allMessagesFetched
    } = state.WebSocketReducer;
    return {
        allMessagesFetched,
        currentActiveGroup,
        chatHistory,
        wsUserGroups,
        wsObject,
        isWsConnected,
    };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        fetchMessages: (model: ReduxModel) => dispatch(fetchGroupMessages(model)),
        getGroupMessages: (model: ReduxModel) => dispatch(getGroupMessages(model)),
        setCurrentActiveGroup: (groupUrl: string) => dispatch(setCurrentActiveGroup(groupUrl)),
        sendWsMessage: (message: ReduxModel) => dispatch(sendWsMessage(message)),
        markMessageAsSeen: (model: ReduxModel) => dispatch(markMessageAsSeen(model))
    }
}


const WebSocketChatContainer = connect(mapStateToProps, mapDispatchToProps)(WebSocketChatComponent);

export default WebSocketChatContainer;