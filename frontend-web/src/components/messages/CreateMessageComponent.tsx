import {Button, IconButton, styled, TextField} from "@mui/material"
import React, {useContext, useState} from "react"
import {getPayloadSize} from "../../utils/string-size-calculator"
import {TransportModel} from "../../interface-contract/transport-model"
import {TransportActionEnum} from "../../utils/transport-action-enum"
import {HttpGroupService} from "../../service/http-group-service"
import HighlightOffIcon from "@mui/icons-material/HighlightOff"
import {WebSocketContext} from "../../context/WebsocketContext"
import {CallWindowComponent} from "../websocket/CallWindowComponent"
import {UserContext} from "../../context/UserContext"
import {GroupContext, GroupContextAction} from "../../context/GroupContext"
import {InsertPhoto} from "@mui/icons-material"

interface CreateMessageComponentProps {
    groupUrl: string
}

export function CreateMessageComponent({groupUrl}: CreateMessageComponentProps): React.JSX.Element {
    const {ws} = useContext(WebSocketContext)!
    const {user} = useContext(UserContext)!
    const {changeGroupState} = useContext(GroupContext)!
    const [, setImageLoaded] = useState(false)
    const [message, setMessage] = useState("")
    const [file, setFile] = React.useState<File | null>(null)

    const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string>("")

    function submitMessage(event: any) {
        if (event.key !== undefined && event.shiftKey && event.keyCode === 13) {
            return
        }
        if (event.key !== undefined && event.keyCode === 13) {
            event.preventDefault()
            sendMessage()
        }
    }

    function handleChange(event: any) {
        setMessage(event.target.value)
    }

    function previewFile(event: any) {
        resetImageBuffer(event)
        const reader = new FileReader()
        const file = event.target.files[0]
        reader.readAsDataURL(file)

        reader.onload = (e) => {
            if (e.target && e.target.readyState === FileReader.DONE) {
                setFile(file)
                setImagePreviewUrl(reader.result as string)
                setImageLoaded(true)
            }
        }
    }

    function resetImageBuffer(event: any) {
        event.preventDefault()
        setFile(null)
        setImagePreviewUrl("")
        setImageLoaded(false)
    }

    async function sendMessage() {
        if (message !== "") {
            if (getPayloadSize(message) < 8192 && ws?.active) {
                const transport = new TransportModel(user?.id || 0, TransportActionEnum.SEND_GROUP_MESSAGE, undefined, groupUrl, message)
                ws.publish({
                    destination: "/message",
                    body: JSON.stringify(transport)
                })
            }
            setMessage("")
        }
        if (file !== null) {
            const httpService = new HttpGroupService()
            const formData = new FormData()
            formData.append("file", file)
            formData.append("userId", String(user?.id || 0))
            formData.append("groupUrl", groupUrl || "")
            await httpService.uploadFile(formData)
            setMessage("")
            setImageLoaded(false)
            setFile(null)
            setImagePreviewUrl("")
        }
    }

    function markMessageSeen() {
        changeGroupState({
            type: GroupContextAction.UPDATE_SEEN_MESSAGE, payload: {groupUrl, isMessageSeen: true}
        })
    }

    const VisuallyHiddenInput = styled("input")({
        clip: "rect(0 0 0 0)",
        clipPath: "inset(50%)",
        height: 1,
        overflow: "hidden",
        position: "absolute",
        bottom: 0,
        left: 0,
        whiteSpace: "nowrap",
        width: 1,
    })

    return (
        <>
            <div>
                {
                    imagePreviewUrl &&
                    <div style={{
                        padding: "10px",
                        height: "120px",
                        maxWidth: "120px",
                        background: "url('" + imagePreviewUrl + "')",
                        backgroundSize: "cover",
                        position: "relative",
                        borderRadius: "10%"
                    }}>
                        <IconButton style={{
                            height: "20px",
                            position: "absolute",
                            right: "8px",
                            top: "8px",
                            width: "20px"
                        }}
                                    onClick={event => resetImageBuffer(event)}>
                            <HighlightOffIcon/>
                        </IconButton>
                    </div>
                }
            </div>
            <div style={{
                display: "flex",
                alignItems: "center",
                position: "relative",
                bottom: "0",
                padding: "5px"
            }}>
                <Button
                    component="label"
                    role={undefined}
                    variant="outlined"
                    tabIndex={-1}
                    startIcon={<InsertPhoto/>}
                >
                    <VisuallyHiddenInput type="file" onChange={previewFile}/>
                </Button>
                <CallWindowComponent/>
                <TextField
                    variant={"outlined"}
                    label={"Write a message"}
                    value={message}
                    fullWidth
                    onClick={markMessageSeen}
                    onChange={(event: any) => handleChange(event)}
                    type={"text"}
                    onKeyDown={submitMessage}
                    multiline={true}
                    name={"mainWriteMessage"}/>
                {/*<Button*/}
                {/*    onClick={sendMessage}*/}
                {/*    variant="contained"*/}
                {/*    color="primary"*/}
                {/*    style={{*/}
                {/*        marginLeft: "3px",*/}
                {/*        maxWidth: "20px"*/}
                {/*    }}*/}
                {/*    disabled={!imageLoaded && message === ""}*/}
                {/*>*/}
                {/*    <SendIcon/>*/}
                {/*</Button>*/}
            </div>
        </>
    )
}
