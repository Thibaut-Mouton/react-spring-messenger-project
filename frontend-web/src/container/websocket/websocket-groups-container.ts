import {connect} from 'react-redux'
import {WebsocketGroupsComponent} from "../../components/websocket/websocket-groups-component";
import {setCurrentActiveGroup} from "../../actions/websocket-actions";
import {Dispatch} from "redux";

const mapStateToProps = (state: any) => {
    const {isWsConnected, wsUserGroups, currentActiveGroup} = state.WebSocketReducer;
    return {
        isWsConnected,
        currentActiveGroup,
        wsUserGroups
    };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        setCurrentActiveGroup: (groupUrl: string) => dispatch(setCurrentActiveGroup(groupUrl)),
    }
}


const WebSocketGroupsContainer = connect(mapStateToProps, mapDispatchToProps)(WebsocketGroupsComponent);

export default WebSocketGroupsContainer;