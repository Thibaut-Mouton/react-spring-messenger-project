import CallIcon from "@mui/icons-material/Call"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import React from "react"
import { UUIDv4 } from "../../utils/uuid-generator"
import { useWebSocketContext } from "../../context/ws-context"
import { RtcTransportDTO } from "../../interface-contract/rtc-transport-model"
import { RtcActionEnum } from "../../utils/rtc-action-enum"
import { useDispatch, useSelector } from "react-redux"
import { StoreState } from "../../reducers/types"
import { setCallIncoming, setCallUrl, setGroupWithCurrentCall } from "../../reducers"

export const CallWindowComponent: React.FunctionComponent<{ userId: number, groupUrl: string }> = ({
  userId,
  groupUrl
}) => {
  const { ws } = useWebSocketContext()
  const dispatch = useDispatch()
  const {
    callStarted,
    callUrl
  } = useSelector(
    (state: StoreState) => state.globalReducer
  )

  const openCallPage = async (event: any) => {
    event.preventDefault()
    const startedCallUrl = UUIDv4()
    if (ws) {
	 const transport = new RtcTransportDTO(userId, groupUrl, RtcActionEnum.INIT_ROOM)
	 ws.publish({
	   destination: `/app/rtc/${startedCallUrl}`,
	   body: JSON.stringify(transport)
	 })
	 const callPage = window.open(`http://localhost:3000/call/${startedCallUrl}`, "_blank") as any
	 if (callPage) {
	   callPage.groupUrl = groupUrl
	   callPage.focus()
	 }
	 dispatch(setGroupWithCurrentCall({
	   roomUrl: startedCallUrl,
	   groupUrl
	 }))
    }
  }

  const handleClose = () => {
    dispatch(setCallIncoming({ callStarted: false }))
    dispatch(setCallUrl({ callUrl: "" }))
  }

  const startCall = () => {
    dispatch(setCallIncoming({ callStarted: false }))
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
