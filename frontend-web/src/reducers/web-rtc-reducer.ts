import {HANDLE_RTC_CANDIDATE, SET_RTC_ANSWER, SET_RTC_OFFER} from "../utils/redux-constants";

const initialState = {
    webRtcOffer: null,
    webRtcAnswer: null,
    webRtcCandidate: null
}

const WebRTCReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case HANDLE_RTC_CANDIDATE:
            return {...state, webRtcCandidate: action.payload}
        case SET_RTC_OFFER:
            return {...state, webRtcOffer: action.payload}
        case SET_RTC_ANSWER:
            return {...state, webRtcAnswer: action.payload}
        default:
            return state;
    }
}

export default WebRTCReducer;