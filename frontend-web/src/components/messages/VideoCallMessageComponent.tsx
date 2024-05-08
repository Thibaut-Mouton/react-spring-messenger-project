import React from "react"
import {Card, CardHeader, IconButton} from "@mui/material"
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk"

interface VideoCallMessageProps {
    url: string
}

export function VideoCallMessageComponent({url}: VideoCallMessageProps) {
    function openPage() {
        window.open(url, "_blank")
    }

    // async function openCallPage(event: any) {
    //     event.preventDefault()
    //     const startedCallUrl = crypto.randomUUID()
    //     if (ws) {
    //         const transport = new RtcTransportDTO(user?.id || 0, groupUrl || "", RtcActionEnum.INIT_ROOM)
    //         ws.publish({
    //             destination: `/rtc/${startedCallUrl}`,
    //             body: JSON.stringify(transport)
    //         })
    //         const callPage = window.open(`http://localhost:3000/call/${startedCallUrl}`, "_blank") as any
    //         if (callPage) {
    //             callPage.groupUrl = groupUrl
    //             callPage.focus()
    //         }
    //         // dispatch(setGroupWithCurrentCall({
    //         //     roomUrl: startedCallUrl,
    //         //     groupUrl
    //         // }))
    //     }
    // }

    return <>
        <Card onClick={openPage} variant="outlined">
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
