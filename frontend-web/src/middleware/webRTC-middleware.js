import {handleAnswer, handleOffer, handleRtCandidate} from "../actions/web-rtc-actions";

export function handleRTCSubscribeEvents(data, store) {
    console.log(data.type)
    if (data.name !== 5) {
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
    switch (payload.type) {
        case "init":
            break;
        case "offer":
            if (wsClient !== null) {
                console.log("Sending offer to server...")
                wsClient.publish({
                    destination: "/app/message/call/" + 5 + "/group/" + groupUrl,
                    body: JSON.stringify(payload)
                });
            }
            break;
        case "answer":
            if (wsClient !== null) {
                console.log(payload.event)
                console.log("Sending answer to server...")
                wsClient.publish({
                    destination: "/app/message/call/" + 5 + "/group/" + groupUrl,
                    body: JSON.stringify(payload)
                });
            }
            break;
        case "candidate":
            if (wsClient !== null) {
                console.log(payload.event)
                console.log("Sending candidate to server...")
                wsClient.publish({
                    destination: "/app/message/call/" + 5 + "/group/" + groupUrl,
                    body: JSON.stringify(payload)
                });
            }
            break;
        case "video-offer":
        case "new-ice-candidate":
            if (wsClient !== null) {
                wsClient.publish({
                    destination: "/app/message/call/" + 5 + "/group/" + groupUrl,
                    body: JSON.stringify(payload)
                });
            }
            break;
        default:
            console.log("ERROR NOTHING MATCH SWITCH STATEMENT : " + payload);
            break;
    }
}