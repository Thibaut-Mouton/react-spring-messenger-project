import React from "react"
import CallIcon from "@mui/icons-material/Call"
import {IconButton, Tooltip} from "@mui/material"

interface CallWindowComponentProps {
    sendCallMessage: (id: string) => void
}

export function CallWindowComponent({sendCallMessage}: CallWindowComponentProps) {

    function initCall() {
        const url = crypto.randomUUID()
        sendCallMessage(url)
    }

    return (
        <React.Fragment>
            <Tooltip title="Start a call">
                <IconButton color="primary" onClick={initCall} aria-label="delete">
                    <CallIcon/>
                </IconButton>
            </Tooltip>
        </React.Fragment>
    )
}
