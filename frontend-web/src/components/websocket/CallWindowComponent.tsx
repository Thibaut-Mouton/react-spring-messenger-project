import CallIcon from "@mui/icons-material/Call"
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material"
import React, {useContext} from "react"
import {RtcTransportDTO} from "../../interface-contract/rtc-transport-model"
import {RtcActionEnum} from "../../utils/rtc-action-enum"
import {WebSocketContext} from "../../context/WebsocketContext"

interface CallWindowComponentProps {
    userId: number
    groupUrl?: string
}

export function CallWindowComponent({userId, groupUrl}: CallWindowComponentProps) {
    const {ws} = useContext(WebSocketContext)!
    const {
        callStarted,
        callUrl
    } = {callStarted: false, callUrl: ""}

    const openCallPage = async (event: any) => {
        event.preventDefault()
        const startedCallUrl = crypto.randomUUID()
        if (ws) {
            const transport = new RtcTransportDTO(userId, groupUrl || "", RtcActionEnum.INIT_ROOM)
            ws.publish({
                destination: `/rtc/${startedCallUrl}`,
                body: JSON.stringify(transport)
            })
            const callPage = window.open(`http://localhost:3000/call/${startedCallUrl}`, "_blank") as any
            if (callPage) {
                callPage.groupUrl = groupUrl
                callPage.focus()
            }
            // dispatch(setGroupWithCurrentCall({
            //     roomUrl: startedCallUrl,
            //     groupUrl
            // }))
        }
    }

    const handleClose = () => {
        // dispatch(setCallIncoming({callStarted: false}))
        // dispatch(setCallUrl({callUrl: ""}))
    }

    const startCall = () => {
        // dispatch(setCallIncoming({callStarted: false}))
        window.open(`http://localhost:3000/call/${callUrl}?mode=join`, "_blank")?.focus()
    }

    return (
        <React.Fragment>
            <Button onClick={(event: any) => openCallPage(event)} variant="text" component="span">
                <CallIcon/>
            </Button>
            <Dialog open={callStarted}>
                <DialogTitle id="alert-dialog-title">{"Someone is calling you"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Do you want to answer this call ? You can accept or deny the call
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose()} color="primary">
                        Deny
                    </Button>
                    <Button onClick={() => startCall()} color="primary">
                        Accept
                    </Button>
                </DialogActions>
            </Dialog>
            <div id={"remote-video"}/>
        </React.Fragment>
    )
}
