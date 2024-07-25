import React, {useEffect, useState} from "react"
import {initWebSocket} from "../../config/websocket-config"
import {Client, IMessage} from "@stomp/stompjs"
import {Box, Skeleton} from "@mui/material"
import {useParams} from "react-router-dom"
import {RtcTransportDTO} from "../../interface-contract/rtc-transport-model"
import {RtcActionEnum} from "../../utils/rtc-action-enum"
import {SoundControl} from "../partials/video/sound-control"
import {VideoControl} from "../partials/video/video-control"
import {HangUpControl} from "../partials/video/hang-up-control"
import {CallEnded} from "../partials/video/call-ended"
import {HttpGroupService} from "../../service/http-group-service"
import {EmptyRoom} from "../partials/video/empty-room"

export const VideoComponent = (): React.JSX.Element => {
    const {callUrl, groupUrl} = useParams()
    const [ws, setWs] = useState<Client | null>()
    const [currentUserId, setCurrentUserId] = useState<number>(-1)
    const [isPageAuthorized, setPageStatus] = useState<boolean>(true)
    const [callEnded, setCallEnded] = useState<boolean>(false)
    const [currentLocalStream, setLocalStream] = useState<MediaStream | undefined>()
    const [activeLocalVideo, setActiveLocalVideo] = useState(false)

    // const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }
    const [localVideoReady, setLocalVideoState] = useState<boolean>(false)
    const configuration = {"iceServers": []}
    const peerConnection = new RTCPeerConnection(configuration)

    const http = new HttpGroupService()

    peerConnection.addEventListener("connectionstatechange", () => {
        switch (peerConnection.connectionState) {
            case "new": {
                console.log("Connecting...")
                break
            }
            case "connected": {
                console.log("Online")
                break
            }
            case "disconnected": {
                console.log("Disconnecting...")
                break
            }
            case "closed": {
                console.log("Offline")
                break
            }
            case "failed": {
                console.log("Error")
                break
            }
            default:
                console.log("Unknown")
                break
        }
    })

    peerConnection.addEventListener("icecandidate", (event) => {
        console.log("EVENT ICE candidate", event.candidate)
        if (ws && event.candidate) {
            const iceCandidateResponse = new RtcTransportDTO(currentUserId, groupUrl ?? "", RtcActionEnum.ICE_CANDIDATE, undefined, undefined, event.candidate.toJSON())
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

    peerConnection.addEventListener("track", (event) => {
        console.log("Track event", event)
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
        return () => {
            handleCloseTab()
        }
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
                    case RtcActionEnum.JOIN_ROOM: {
                        console.log("JOIN ROOM")
                        if (rtcTransportDto.offer) {
                            console.log("SET OFFER")
                            await peerConnection.setRemoteDescription(rtcTransportDto.offer)
                        }
                        const answer = await peerConnection.createAnswer()
                        await peerConnection.setLocalDescription(answer)

                        const answerRtcResponse = new RtcTransportDTO(currentUserId, groupUrl ?? "", RtcActionEnum.SEND_ANSWER, undefined, answer)
                        wsObj?.publish({
                            destination: `/rtc/${callUrl}`,
                            body: JSON.stringify(answerRtcResponse)
                        })
                        break
                    }
                    case RtcActionEnum.RECEIVE_ANSWER: {
                        console.log("RECEIVE ANSWER")
                        if (rtcTransportDto.answer) {
                            const answer = new RTCSessionDescription(rtcTransportDto.answer)
                            await peerConnection.setRemoteDescription(answer)
                        }
                        break
                    }
                    case RtcActionEnum.ICE_CANDIDATE: {
                        console.log("ICE CANDIDATE")
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
            const transport = new RtcTransportDTO(user.id, groupUrl ?? "", RtcActionEnum.INIT_ROOM, offer)
            wsObj.publish({
                destination: `/rtc/${callUrl}`,
                body: JSON.stringify(transport)
            })
        }
        wsObj.activate()
    }

    function handleCloseTab() {
        const transport = new RtcTransportDTO(currentUserId, groupUrl ?? "", RtcActionEnum.LEAVE_ROOM)
        if (ws) {
            ws.publish({
                destination: `/rtc/${callUrl}`,
                body: JSON.stringify(transport)
            })
        }
    }

    function changeVideoStatus() {
        if (currentLocalStream) {
            if (activeLocalVideo) {
                setActiveLocalVideo(true)
                currentLocalStream.getTracks().forEach((track) => {
                    track.stop()
                })
            } else {
                setActiveLocalVideo(false)
                currentLocalStream.getTracks().forEach((track) => {
                    peerConnection.addTrack(track, currentLocalStream)
                })
            }
        }
    }

    async function initRTC(): Promise<boolean> {
        // const urlCheckResponse = await http.ensureRoomExists(callUrl)
        // setPageStatus(urlCheckResponse.data)
        window.addEventListener("beforeunload", () => {
            handleCloseTab()
        })
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
            setLocalVideoState(true)
            const videoElement = document.querySelector("video#localVideo") as HTMLVideoElement
            setActiveLocalVideo(true)
            localStream.getTracks().forEach((track) => {
                peerConnection.addTrack(track, localStream)
            })
            if (videoElement) {
                setActiveLocalVideo(true)
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
        handleCloseTab()
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
                            <Box display={"flex"} m={1}>
                                {
                                    localVideoReady ?
                                        <video id="localVideo"
                                               width={600}
                                               height={400}
                                               autoPlay playsInline
                                               controls={false}/> :
                                        <Skeleton variant={"rectangular"} width={600} height={400}/>
                                }
                                <video id="remoteVideo"
                                       width={600}
                                       height={400}
                                       autoPlay playsInline
                                       controls={false}/>
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
