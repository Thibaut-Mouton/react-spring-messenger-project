import {
    HANDLE_RTC_ACTIONS,
    HANDLE_RTC_ANSWER,
    HANDLE_RTC_CANDIDATE,
    HANDLE_RTC_OFFER, SEND_TO_SERVER, SET_RTC_ANSWER,
    SET_RTC_OFFER
} from "../utils/redux-constants";

export const initCallWebRTC = (data: any) => ({
    type: HANDLE_RTC_ACTIONS,
    payload: data
})

export const createOffer = (data: any) => ({
    type: HANDLE_RTC_OFFER,
    payload: data
})

export const createAnswer = (data: any) => ({
    type: HANDLE_RTC_ANSWER,
    payload: data
})

export const handleOffer = (data: any) => ({
    type: SET_RTC_OFFER,
    payload: data
})

export const handleAnswer = (data: any) => ({
    type: SET_RTC_ANSWER,
    payload: data
})

export const sendToServer = (data: any) => ({
    type: SEND_TO_SERVER,
    payload: data
})

export const handleRtCandidate = (data: any) => ({
    type: HANDLE_RTC_CANDIDATE,
    payload: data
})