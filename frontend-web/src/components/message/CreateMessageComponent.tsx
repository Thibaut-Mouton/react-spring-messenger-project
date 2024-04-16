import {IconButton} from "@mui/material"
import {CustomTextField} from "../partials/custom-material-textfield"
import React, {useContext, useState} from "react"
import {getPayloadSize} from "../../utils/string-size-calculator"
import {TransportModel} from "../../interface-contract/transport-model"
import {TransportActionEnum} from "../../utils/transport-action-enum"
import {HttpService} from "../../service/http-service"
import HighlightOffIcon from "@mui/icons-material/HighlightOff"
import {WebSocketContext} from "../../context/WebsocketContext"
import {AuthUserContext} from "../../context/AuthContext"

interface CreateMessageComponentProps {
    groupUrl: string
}

export function CreateMessageComponent({groupUrl}: CreateMessageComponentProps): React.JSX.Element {
    const {ws} = useContext(WebSocketContext)!
    const {user} = useContext(AuthUserContext)!
    const [, setImageLoaded] = useState(false)
    const [message, setMessage] = useState("")
    const [file, setFile] = React.useState<File | null>(null)

    const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string>("")

    function submitMessage(event: any) {
        if (message !== "") {
            if (event.key !== undefined && event.shiftKey && event.keyCode === 13) {
                return
            }
            if (event.key !== undefined && event.keyCode === 13) {
                event.preventDefault()
                sendMessage()
                setMessage("")
            }
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
                console.log("SENDING MESSAGE", transport)
                ws.publish({
                    destination: "/message",
                    body: JSON.stringify(transport)
                })
            }
            setMessage("")
        }
        if (file !== null) {
            const httpService = new HttpService()
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
        // dispatch(markMessageAsSeen({
        //  groupUrl
        // }))
    }


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
                <input
                    accept="image/*"
                    style={{display: "none"}}
                    id="raised-button-file"
                    multiple
                    type="file"
                    onChange={event => previewFile(event)}
                />
                <CustomTextField
                    id={"inputChatMessenger"}
                    label={"Write a message"}
                    value={message}
                    onClick={markMessageSeen}
                    handleChange={(event: any) => handleChange(event)}
                    type={"text"}
                    keyUp={submitMessage}
                    isMultiline={true}
                    isDarkModeEnable={"true"}
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
