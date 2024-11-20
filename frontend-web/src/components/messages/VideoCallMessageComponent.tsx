import React from "react"
import "./VideoCallMessageComponent.css"
import {Card, CardHeader, IconButton} from "@mui/material"
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk"

interface VideoCallMessageProps {
    url: string
    groupUrl: string
}

export function VideoCallMessageComponent({url, groupUrl}: VideoCallMessageProps) {
    function openPage() {
        window.open(`${url}?u=${groupUrl}`, "_blank")
    }

    return <>
        <Card className={"call-container"} onClick={openPage} variant="outlined">
            <CardHeader
                avatar={
                    <IconButton>
                        <PhoneInTalkIcon/>
                    </IconButton>
                }
                title="Video call in progress"
                subheader="Thibaut, Mark and John"
            />
        </Card>
    </>
}
