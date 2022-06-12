import CallIcon from '@mui/icons-material/Call'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { StoreState } from '../../reducers/types'
import UUIDv4 from '../../utils/uuid-generator'

interface CallWindowComponentType {
  sendToServer: (param: any) => {},
  isWsConnected: boolean,
  webRtcOffer: any,
  webRtcAnswer: RTCSessionDescriptionInit,
  webRtcCandidate: any,
  userId: number
}

const sendToServer = (msg: any) => {
}

//
// {
//     sendToServer,
//       isWsConnected,
//       webRtcOffer,
//       webRtcAnswer,
//       webRtcCandidate,
//       userId
// }

export const CallWindowComponent: React.FunctionComponent = () => {
  // let peerConnection = null;
  // const [isMicMuted, setMicStatus] = React.useState(false);
  let webRtcOffer: any
  let webRtcAnswer: any
  let webRtcCandidate: any
  const [peerConnection, setPeerConnection] = React.useState<RTCPeerConnection | null>(null)
  const [callingEvent, setCallingEvent] = React.useState(false)
  const {
    isWsConnected,
    userId,
  } = useSelector(
    (state: StoreState) => state.globalReducer
  )

  const peerConnectionInit = () => {
    return new RTCPeerConnection()
  }

  useEffect(() => {
    if (isWsConnected) {
      setPeerConnection(peerConnectionInit())
    }
  }, [isWsConnected])

  useEffect(() => {
    if (webRtcOffer !== null) {
      handleOffer(webRtcOffer)
    }
  }, [webRtcOffer])

  useEffect(() => {
    if (webRtcAnswer !== null) {
      handleAnswer(webRtcAnswer)
    }
  }, [webRtcAnswer])

  useEffect(() => {
    if (webRtcCandidate !== null) {
      // handleNewICECandidateMsg(webRtcCandidate)
    }
  }, [webRtcCandidate])

  useEffect(() => {
    if (peerConnection !== null) {
      initVoiceCall()
    }
  }, [peerConnection])

  // eslint-disable-next-line no-undef
  function handleAnswer (answer: RTCSessionDescriptionInit) {
    peerConnection?.setRemoteDescription(new RTCSessionDescription(answer))
  }

  function initVoiceCall () {
    if (peerConnection !== null) {
      peerConnection.onicecandidate = handleIceCandidate
      peerConnection.onnegotiationneeded = handleNegotiationNeededEvent
      // peerConnection.ontrack = handleTrackEvent;
      // peerConnection.onremovetrack = handleRemoveTrackEvent;
      // peerConnection.oniceconnectionstatechange = handleICEConnectionStateChangeEvent;
      // peerConnection.onicegatheringstatechange = handleICEGatheringStateChangeEvent;
      // peerConnection.onsignalingstatechange = handleSignalingStateChangeEvent;

      peerConnection.ontrack = function (data) {
        const remoteVideo = document.getElementById('remote-video')
        console.log(data)
        if (remoteVideo) {
          // remoteVideo.srcObject = data.streams[0].;
        }
      }
    }
  }

  // function changeMicState(event) {
  //     event.preventDefault();
  //     setMicStatus(!isMicMuted)
  // }
  //
  // function closeCallWindow() {
  //     window.close();
  // }

  function handleOffer (msg: any) {
    setCallingEvent(true)
    const ctx = new AudioContext()
    const rtcSessionDescription = new RTCSessionDescription(msg)
    peerConnection?.setRemoteDescription(rtcSessionDescription).then(() => {
      return navigator.mediaDevices.getUserMedia({ audio: true })
    }).then((stream) => {
      const source = ctx.createMediaStreamSource(stream)
      const gainNode = ctx.createGain()
      gainNode.gain.value = 0.5
      source.connect(gainNode)
      source.connect(ctx.destination)
    }).then(() => {
      return peerConnection?.createAnswer()
    }).then((answer) => {
      return peerConnection?.setLocalDescription(answer)
    }).then(() => {
      const msg = {
        name: userId,
        target: null,
        type: 'video-answer',
        sdp: peerConnection.localDescription
      }
      sendToServer(msg)
    })
  }

  // function openCallPage(event) {
  //     event.preventDefault();
  //     console.log("Creating offer ...")
  //     console.log(peerConnection)
  //     peerConnection.createOffer(offer => {
  //         createOffer({
  //             event: "offer",
  //             data: offer
  //         });
  //         peerConnection.setLocalDescription(offer).then();
  //     }, function (error) {
  //         console.log("Error during creating offer ! : ", error)
  //     }).then();
  //     // const callUrl = UUIDv4();
  //     // window.open("http://localhost:3000/call/" + callUrl, '_blank', "location=yes,height=570,width=520,scrollbars=yes,status=yes");
  // }

  async function handleNewICECandidateMsg (msg: any) {
    const candidate = new RTCIceCandidate(msg.candidate)
    console.log('*** Adding received ICE candidate: ' + JSON.stringify(candidate))
    try {
      await peerConnection?.addIceCandidate(candidate)
    } catch (err) {
      console.log(err)
    }
  }

  function handleIceCandidate (event: any) {
    if (event.candidate) {
      console.log('onicecandidate')
      sendToServer({
        name: userId,
        type: 'new-ice-candidate',
        target: null,
        candidate: event.candidate
      })
    }
  }

  function handleNegotiationNeededEvent () {
    console.log('handleNegotiationNeededEvent')
    peerConnection?.createOffer().then(function () {
      peerConnection?.createOffer().then(function (offer) {
        return peerConnection?.setLocalDescription(offer)
      }).then(function () {
        console.log(peerConnection?.localDescription)
        sendToServer({
          type: 'video-offer',
          name: userId,
          target: null,
          sdp: peerConnection?.localDescription
        })
      }).catch((err) => {
        console.log(err)
      })
    })
  }

  function openCallPage (event: any) {
    event.preventDefault()
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      stream.getTracks().forEach(track => {
        console.log(track)
        peerConnection?.addTrack(track, stream)
      })
    })
    const callUrl = UUIDv4();
    window.open("http://localhost:3000/call/" + callUrl, '_blank', "location=yes,height=570,width=520,scrollbars=yes,status=yes");
  }

  function handleClose (value: boolean) {
    return new Promise((resolve) => {
      setCallingEvent(false)
      resolve('done')
      console.log(value)
    })
  }

  return (
    <React.Fragment>
      <Button onClick={(event: any) => openCallPage(event)} variant="text" component="span">
        <CallIcon/>
      </Button>
      <Dialog open={callingEvent}>
        <DialogTitle id="alert-dialog-title">{'Someone is calling you'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to answer this call ? You can accept or deny the call
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)} color="primary">
            Deny
          </Button>
          <Button onClick={() => handleClose(true)} color="primary">
            Accept
          </Button>
        </DialogActions>
      </Dialog>
      <div id={'remote-video'}/>
    </React.Fragment>
  )
}
