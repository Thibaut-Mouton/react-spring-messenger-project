import React, {useEffect, useState} from "react"
import {initWebSocket} from "../../config/websocket-config"
import {Client, IMessage} from "@stomp/stompjs"
import {Box, Skeleton} from "@mui/material"
import {useParams} from "react-router-dom"
import {RtcTransportDTO} from "../../interface-contract/rtc-transport-model"
import {RtcActionEnum} from "../../utils/rtc-action-enum"
import {SoundControl} from "../partials/video/sound-control"
import {VideoControl} from "../partials/video/video-control"
import {EmptyRoom} from "../partials/video/empty-room"
import {HangUpControl} from "../partials/video/hang-up-control"
import {CallEnded} from "../partials/video/call-ended"
import {HttpGroupService} from "../../service/http-group-service"

export const VideoComponent = (): React.JSX.Element => {
    const {callUrl} = useParams()
    const [ws, setWs] = useState<Client | null>()
    const [currentUserId, setCurrentUserId] = useState<number>(-1)
    const [isPageAuthorized, setPageStatus] = useState<boolean>(true)
    const [callEnded, setCallEnded] = useState<boolean>(false)
    const [currentLocalStream, setLocalStream] = useState<MediaStream | undefined>()

    // const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }
    const [localVideoReady, setLocalVideoState] = useState<boolean>(false)
    const configuration = {"iceServers": []}
    const peerConnection = new RTCPeerConnection(configuration)

    const http = new HttpGroupService()

    peerConnection.addEventListener("connectionstatechange", () => {
        switch (peerConnection.connectionState) {
            case "new":
                console.log("Connecting...")
                break
            case "connected":
                console.log("Online")
                break
            case "disconnected":
                console.log("Disconnecting...")
                break
            case "closed":
                console.log("Offline")
                break
            case "failed":
                console.log("Error")
                break
            default:
                console.log("Unknown")
                break
        }
    })

    peerConnection.addEventListener("icecandidate", (event) => {
        console.log("EVENT", event.candidate)
        if (ws && event.candidate) {
            const iceCandidateResponse = new RtcTransportDTO(currentUserId, "", RtcActionEnum.ICE_CANDIDATE, undefined, undefined, event.candidate)
            ws.publish({
                destination: `/rtc/${callUrl}`,
                body: JSON.stringify(iceCandidateResponse)
            })
        }
    })

    peerConnection.addEventListener("icecandidateerror", (event) => {
        // eslint-disable-next-line no-console
        console.log("ERROR EVENT", event)
    })

    // peerConnection.addEventListener('icegatheringstatechange', (event) => {
    //   console.log('icegatheringstatechange', event)
    // })

    peerConnection.addEventListener("track", (event) => {
        const remoteVideo = document.querySelector("video#localVideo") as HTMLVideoElement
        const [remoteStream] = event.streams
        remoteVideo.srcObject = remoteStream
    })

    useEffect(() => {
        initRTC().then((res) => {
            if (res) {
                initWs()
            }
        })
    }, [])

    const initWs = async () => {
        const {data} = await http.pingRoute()
        const {user} = data
        setCurrentUserId(user.id)
        const wsObj = await initWebSocket(user.wsToken)

        setWs(wsObj)
        wsObj.onConnect = async () => {
            wsObj.subscribe(`/topic/rtc/${user.id}`, async (res: IMessage) => {
                const rtcTransportDto = JSON.parse(res.body) as RtcTransportDTO
                switch (rtcTransportDto.action) {
                    case RtcActionEnum.JOIN_ROOM:
                        if (rtcTransportDto.offer) {
                            await peerConnection.setRemoteDescription(rtcTransportDto.offer)
                        }
                        const answer = await peerConnection.createAnswer()
                        await peerConnection.setLocalDescription(answer)
                        wsObj?.publish({
                            destination: `/rtc/${callUrl}`,
                            body: JSON.stringify(answer)
                        })
                        // TODO get the offer and send back the answer
                        break
                    case RtcActionEnum.RECEIVE_ANSWER: {
                        if (rtcTransportDto.answer) {
                            const answer = new RTCSessionDescription(rtcTransportDto.answer)
                            await peerConnection.setRemoteDescription(answer)
                        }
                        break
                    }
                    case RtcActionEnum.ICE_CANDIDATE: {
                        if (rtcTransportDto.iceCandidate) {
                            await peerConnection.addIceCandidate(rtcTransportDto.iceCandidate)
                        }
                        break
                    }
                    default:
                        break
                }
            })
            const offer = await peerConnection.createOffer()
            await peerConnection.setLocalDescription(offer)
            const transport = new RtcTransportDTO(user.id, "", RtcActionEnum.INIT_ROOM, offer)
            wsObj.publish({
                destination: `/rtc/${callUrl}`,
                body: JSON.stringify(transport)
            })
        }
        wsObj.activate()
    }

    const changeVideoStatus = (stopVideo: boolean) => {
        if (currentLocalStream) {
            if (stopVideo) {
                currentLocalStream.getTracks().forEach((track) => {
                    track.stop()
                })
            } else {
                currentLocalStream.getTracks().forEach((track) => {
                    peerConnection.addTrack(track, currentLocalStream)
                })
            }
        }
    }

    async function initRTC(): Promise<boolean> {
        // const urlCheckResponse = await http.ensureRoomExists(callUrl)
        // setPageStatus(urlCheckResponse.data)
        setPageStatus(true)
        // if (urlCheckResponse && !urlCheckResponse.data) {
        //     return false
        // }
        try {
            const constraints = {
                "video": true,
                "audio": true
            }
            const localStream = await navigator.mediaDevices.getUserMedia(constraints)
            setLocalStream(localStream)
            const videoElement = document.querySelector("video#localVideo") as HTMLVideoElement
            localStream.getTracks().forEach((track) => {
                peerConnection.addTrack(track, localStream)
            })
            if (videoElement) {
                setLocalVideoState(true)
                videoElement.srcObject = localStream
            }
            return true
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("Error accessing media devices.", error)
            return false
        }
    }

    const hangOnRoom = () => {
        peerConnection.close()
        setCallEnded(true)
        if (ws) {
            const transport = new RtcTransportDTO(currentUserId, "groupUrlFromParent", RtcActionEnum.LEAVE_ROOM)
            ws.publish({
                destination: `/rtc/${callUrl}`,
                body: JSON.stringify(transport)
            })
        }
        if (currentLocalStream) {
            currentLocalStream.getTracks().forEach((track) => {
                track.stop()
            })
        }
    }

    return (
        <Box>
            {
                isPageAuthorized ?
                    !callEnded &&
                    <>
                        <Box m={2} display={"flex"} justifyContent={"center"}>
                            <Box m={1}>
                                <video style={{display: localVideoReady ? "block" : "none"}} id="localVideo" width={600}
                                       height={400}
                                       autoPlay playsInline
                                       controls={false}/>
                                {!localVideoReady &&
                                    <Skeleton variant={"rectangular"} width={600} height={400}/>
                                }
                            </Box>
                        </Box>
                        <Box position={"fixed"} width={"100%"} bottom={"10px"} display={"flex"}
                             justifyContent={"center"}>
                            <SoundControl/>
                            <VideoControl changeVideoStatus={changeVideoStatus}/>
                            <HangUpControl hangOnRoom={hangOnRoom}/>
                        </Box>
                    </>
                    :
                    <EmptyRoom/>
            }
            {
                callEnded && <CallEnded/>
            }
        </Box>
    )
}
