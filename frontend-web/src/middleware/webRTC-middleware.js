import {handleAnswer, handleOffer, handleRtCandidate} from "../actions/webRtcActions";

export function handleRTCSubscribeEvents(data, store) {
    const userId = store.getState().AuthReducer.userId;
    console.log(data.type)
    console.log("data.userIn !== userId ? ", data.name !== userId)
    if (data.name !== userId) {
        if (data.type === "video-offer") {
            console.log("Receiving offer")
            store.dispatch(handleOffer(data.sdp))
        }
        if (data.type === "video-answer") {
            console.log("Receiving answer")
            store.dispatch(handleAnswer(data))
        }
        if (data.type === "new-ice-candidate") {
            console.log("Receiving candidate")
            store.dispatch(handleRtCandidate(data))
        }
    }
}

export function handleRTCActions(wsClient, store, payload) {
    const groupUrl = localStorage.getItem("_cAG");
    const userId = store.getState().AuthReducer.userId;
    switch (payload.type) {
        case "init":
            // if (wsClient !== null) {
            //     wsClient.subscribe("/topic/call/reply/" + groupUrl, (res) => {
            //         const data = JSON.parse(res.body);
            //         console.log(data)
            //         console.log("data.userIn !== userId ? ", data.userIn !== userId)
            //         if (data.userIn !== userId) {
            //             if (data.rtc.event === "offer") {
            //                 store.dispatch(handleOffer(data))
            //             }
            //             if (data.rtc.event === "answer") {
            //                 store.dispatch(handleAnswer(data))
            //             }
            //             if (data.rtc.event === "candidate") {
            //                 // console.log("CANDIDATE")
            //                 store.dispatch(handleRtCandidate(data))
            //             }
            //         }
            //     });
            // }
            break;
        case "offer":
            console.log("CASE OFFER")
            if (wsClient !== null) {
                console.log("Sending offer to server...")
                wsClient.publish({
                    destination: "/app/message/call/" + userId + "/group/" + groupUrl,
                    body: JSON.stringify(payload)
                });
            }
            break;
        case "answer":
            if (wsClient !== null) {
                console.log(payload.event)
                console.log("Sending answer to server...")
                wsClient.publish({
                    destination: "/app/message/call/" + userId + "/group/" + groupUrl,
                    body: JSON.stringify(payload)
                });
            }
            break;
        case "candidate":
            if (wsClient !== null) {
                console.log(payload.event)
                console.log("Sending candidate to server...")
                wsClient.publish({
                    destination: "/app/message/call/" + userId + "/group/" + groupUrl,
                    body: JSON.stringify(payload)
                });
            }
            break;
        case "video-offer":
        case "new-ice-candidate":
            if (wsClient !== null) {
                console.log(payload.type)
                console.log(payload)
                wsClient.publish({
                    destination: "/app/message/call/" + userId + "/group/" + groupUrl,
                    body: JSON.stringify(payload)
                });
            }
            break;
        default:
            console.log("ERROR NOTHING MATCH SWITCH STATEMENT");
            console.log(payload)
            break;
    }
}