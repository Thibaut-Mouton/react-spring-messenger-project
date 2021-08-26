import {connect} from 'react-redux'
import {grantUserAdmin, setCurrentActiveGroup} from "../../actions/websocket-actions";
import {WebSocketGroupActionComponent} from "../../components/websocket/websocket-group-actions-component";
import {Dispatch} from "redux";
import {ReduxModel} from "../../model/redux-model";

const mapStateToProps = (state: any) => {
    const {currentActiveGroup} = state.WebSocketReducer;
    return {
        currentActiveGroup
    };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        setCurrentGroupActive: (groupUrl: string) => dispatch(setCurrentActiveGroup(groupUrl)),
        grantUserAdminInGroup: (model: ReduxModel) => dispatch(grantUserAdmin(model))
    }
}


const WebSocketGroupsActionContainer = connect(mapStateToProps, mapDispatchToProps)(WebSocketGroupActionComponent);

export default WebSocketGroupsActionContainer;