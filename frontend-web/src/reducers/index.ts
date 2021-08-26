import {combineReducers} from "redux";
import WebSocketReducer from "./websocket-reducer";
import WebRTCReducer from "./web-rtc-reducer";

const rootReducer = combineReducers({
    WebSocketReducer,
    WebRTCReducer
});

export default rootReducer;