import React from "react";
import Button from "@material-ui/core/Button";
import {generateColorMode, generateIconColorMode} from "../style/enable-dark-mode";
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import CallEndRoundedIcon from '@material-ui/icons/CallEndRounded';
import IconButton from "@material-ui/core/IconButton";
import {useThemeContext} from "../../context/theme-context";

export const CallWindowComponent = () => {
    const {theme} = useThemeContext();
    const [isMicMuted, setMicState] = React.useState<boolean>(false);

    function handleAudio() {
        navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
        //     const mediaRecorder = new MediaRecorder(stream);
        //     const audioTemp = [];
        //     mediaRecorder.start();
        //     console.log("Starting audio")
        //
        //     mediaRecorder.addEventListener("dataavailable", (event) => {
        //         audioTemp.push(event.data)
        //     })
        //
        //     mediaRecorder.addEventListener("stop", () => {
        //         const audioBlob = new Blob(audioTemp);
        //         const audioTempUrl = URL.createObjectURL(audioBlob)
        //         const audio = new Audio(audioTempUrl);
        //         audio.play().then(r => {
        //             console.log(r)
        //         });
        //     })
        //
        //     setTimeout(() => {
        //         mediaRecorder.stop();
        //         console.log("Ending audio")
        //     }, 3000)
        // }).catch(err => {
        //     console.log(err)
        })
    }

    function changeMicState() {
        setMicState(!isMicMuted)
    }

    function closeCallWindow() {
        window.close();
    }

    function initVoiceCall() {
        console.log("Starting peer connection")

        // function send(message) {
        //     console.log("Message sent : " + message)
        // }

        let constraints = {
            audio: true
        };
        // let peerConnection: RTCPeerConnection = new RTCPeerConnection(constraints, {
        //     optional: [{
        //         RtpDataChannels: true
        //     }]
        // });
        // let dataChannel = peerConnection.createDataChannel("dataChannel", {reliable: true});
        //
        // peerConnection.createOffer((offer) => {
        //     console.log("Creating offer")
        //     send({
        //         event: "offer",
        //         data: offer
        //     });
        //     peerConnection.setLocalDescription(offer).then();
        // }, (error) => {
        //     console.log(error)
        // });

        // function handleOffer(offer) {
        //     peerConnection.setRemoteDescription(new RTCSessionDescription(offer)).then();
        //
        //     // create and send an answer to an offer
        //     peerConnection.createAnswer(function (answer) {
        //         peerConnection.setLocalDescription(answer);
        //         send({
        //             event: "answer",
        //             data: answer
        //         });
        //     }, function (error) {
        //         alert("Error creating an answer");
        //     }).then(r => {
        //         console.log(r)
        //     });
        // }

        // peerConnection.onicecandidate = function (event) {
        //     console.log("onicecandidate")
        //     if (event.candidate) {
        //         let candidate = event.candidate;
        //         peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).then(r => {
        //             console.log(r)
        //         });
        //         send({
        //             event: "candidate",
        //             data: event.candidate
        //         });
        //     }
        // };

        // var configuration = {
        //     "iceServers" : [ {
        //         "url" : "stun:stun2.1.google.com:19302"
        //     } ]
        // };

        // navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        //     console.log("Started audio")
        //     stream.getTracks().forEach(track => {
        //         peerConnection.addTrack(track, stream);
        //     })
        // }).catch(err => {
        //     console.log(err)
        // })
        //
        // dataChannel.onerror = function (error) {
        //     console.log("Error:", error);
        // };
        // dataChannel.onclose = function () {
        //     console.log("Data channel is closed");
        // };
        //
        // peerConnection.onicecandidate = function (event) {
        //     if (event.candidate) {
        //         send({
        //             event: "candidate",
        //             data: event.candidate
        //         });
        //     }
        // };
    }


    return (
        <div className={generateColorMode(theme)}
             style={{width: "100%", height: "100%", textAlign: "center"}}>

            <Button type={"button"} variant={"contained"} onClick={() => handleAudio()}>
                Record
            </Button>
            <Button type={"button"} variant={"contained"} onClick={() => initVoiceCall()}>
                INIT
            </Button>
            <IconButton onClick={() => closeCallWindow()}>
                <CallEndRoundedIcon
                    className={generateIconColorMode(theme)}
                    style={{
                        backgroundColor: "#ff00008a",
                        borderRadius: "50%",
                        height: "40px",
                        width: "40px",
                        padding: "4px"
                    }}/>
            </IconButton>

            <IconButton onClick={() => changeMicState()}>
                {
                    isMicMuted ?
                        <MicOffIcon
                            className={generateIconColorMode(theme)}
                            style={{
                                backgroundColor: "rgba(255,255,255,0.54)",
                                borderRadius: "50%",
                                height: "40px",
                                width: "40px",
                                padding: "4px"
                            }}/>
                        :
                        <MicIcon
                            className={generateIconColorMode(theme)}
                            style={{
                                backgroundColor: "rgba(255,255,255,0.54)",
                                borderRadius: "50%",
                                height: "40px",
                                width: "40px",
                                padding: "4px"
                            }}/>
                }
            </IconButton>
        </div>
    )
}
