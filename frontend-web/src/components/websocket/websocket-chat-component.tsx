import {Box, CircularProgress, Tooltip} from "@mui/material"
import React, {useContext, useEffect, useState} from "react"
import {GroupActionEnum} from "./group-action-enum"
import {useThemeContext} from "../../context/theme-context"
import {FullMessageModel} from "../../interface-contract/full-message-model"
import {TransportActionEnum} from "../../utils/transport-action-enum"
import {TypeMessageEnum} from "../../utils/type-message-enum"
import {TransportModel} from "../../interface-contract/transport-model"
import {ImagePreviewComponent} from "../partials/image-preview"
import {ActiveVideoCall} from "../partials/video/active-video-call"
import {GroupModel} from "../../interface-contract/group-model"
import {NoDataComponent} from "../partials/NoDataComponent"
import {HttpMessageService} from "../../service/http-message.service"
import {AlertAction, AlertContext} from "../../context/AlertContext"
import {CreateMessageComponent} from "../message/CreateMessageComponent"
import {WebSocketContext} from "../../context/WebsocketContext"

export const WebSocketChatComponent: React.FunctionComponent<{ groupUrl?: string }> = ({groupUrl}) => {
    const {theme} = useThemeContext()
    const {dispatch} = useContext(AlertContext)!
    const {ws} = useContext(WebSocketContext)!
    const [isPreviewImageOpen, setPreviewImageOpen] = React.useState(false)
    const [messageId, setLastMessageId] = React.useState(0)
    const [loadingOldMessages, setLoadingOldMessages] = React.useState<boolean>(false)
    const [messages, setMessages] = useState<FullMessageModel[]>([])
    const [imgSrc, setImgSrc] = React.useState("")
    let messageEnd: HTMLDivElement | null

    const {
        allMessagesFetched,
        userId
    } = {currentGroup: {} as GroupModel} as any // TODO remove any

    const [groupName, setGroupName] = React.useState<string>("")

    useEffect(() => {
        const fetchMessages = async () => {
            if (groupUrl) {
                try {
                    const http = new HttpMessageService()
                    const {data} = await http.getMessages(groupUrl)
                    setMessages(data.messages)
                    setGroupName(data.groupName)
                } catch (error) {
                    dispatch({
                        type: AlertAction.ADD_ALERT,
                        payload: {
                            id: crypto.randomUUID(),
                            text: `Cannot fetch messages : ${error}`,
                            alert: "error",
                            isOpen: true
                        }
                    })
                }
            }
        }
        fetchMessages()
    }, [groupUrl])

    useEffect(() => {
        if (!loadingOldMessages) {
            scrollToEnd()
        }
        setLoadingOldMessages(false)
        if (messages && messages.length > 0) {
            setLastMessageId(messages[0].id)
        }
    }, [messages])

    function styleSelectedMessage() {
        return theme === "dark" ? "hover-msg-dark" : "hover-msg-light"
    }

    function generateImageRender(message: FullMessageModel) {
        if (message.fileUrl === undefined) {
            return null
        }
        return (
            <div>
                <img src={message.fileUrl} height={"200px"} alt={message.name}
                     onClick={() => handleImagePreview(GroupActionEnum.OPEN, message.fileUrl)}
                     style={{
                         border: "1px solid #c8c8c8",
                         borderRadius: "7%"
                     }}/>
            </div>
        )
    }

    function scrollToEnd() {
        messageEnd?.scrollIntoView({behavior: "auto"})
    }

    function handlePopupState(isOpen: boolean) {
        setPreviewImageOpen(isOpen)
    }

    function handleImagePreview(action: string, src: string) {
        switch (action) {
            case GroupActionEnum.OPEN:
                setImgSrc(src)
                handlePopupState(true)
                break
            case GroupActionEnum.CLOSE:
                handlePopupState(false)
                break
            default:
                throw new Error("handleImagePreview failed")
        }
    }

    function handleScroll(event: any) {
        if (event.target.scrollTop === 0) {
            if (!allMessagesFetched && ws) {
                setLoadingOldMessages(true)
                const transport = new TransportModel(userId || 0, TransportActionEnum.FETCH_GROUP_MESSAGES, undefined, groupUrl, undefined, messageId)
                ws.publish({
                    destination: "/message",
                    body: JSON.stringify(transport)
                })
            }
        } else {
            setLoadingOldMessages(false)
        }
    }

    return (
        <>
            {
                !groupUrl ?
                    <div style={{
                        display: "flex",
                        flex: "1",
                        flexDirection: "column",
                    }}>
                        <NoDataComponent/>
                    </div>
                    : groupName &&
                    <div style={{
                        backgroundColor: "#f6f8fc",
                        display: "flex",
                        flex: "1",
                        flexDirection: "column",
                    }}>
                        <div style={{
                            backgroundColor: "white",
                            borderRadius: "30px 30px 0 0",
                            width: "100%",
                            borderBottom: "1px solid #d5d5d5"
                        }}>
                            <Box p={1} display={"flex"} justifyContent={"space-between"}>
                                <Box display={"flex"} flexDirection={"column"} justifyContent={"center"}>
                                    <div style={{
                                        fontSize: "20px",
                                        fontWeight: "bold"
                                    }}>{groupName}</div>
                                </Box>
                                <ActiveVideoCall isAnyCallActive={true}/>
                            </Box>
                        </div>
                        <div
                            onScroll={(event) => handleScroll(event)}
                            style={{
                                backgroundColor: "white",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                width: "100%",
                                height: "100%",
                            }}>

                            {
                                !allMessagesFetched && loadingOldMessages &&
                                <div style={{
                                    width: "inherit",
                                    boxSizing: "border-box",
                                    height: "40px",
                                    position: "relative",
                                    display: "flex",
                                    justifyContent: "center"
                                }}>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column"
                                    }}>
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "center"
                                        }}>
                                            <CircularProgress style={{margin: "5px"}} size={40}/>
                                        </div>
                                        <span style={{fontSize: "16px"}}>Loading older messages ....</span>
                                    </div>
                                </div>
                            }
                            <ImagePreviewComponent imgSrc={imgSrc}
                                                   displayImagePreview={isPreviewImageOpen}
                                                   setDisplayImagePreview={handlePopupState}/>
                            {messages.map((messageModel, index, array) => (
                                <Tooltip
                                    key={index}
                                    enterDelay={1000}
                                    leaveDelay={0}
                                    title={new Date(messageModel.time).getHours() + ":" + new Date(messageModel.time).getMinutes()}
                                    placement="left">
                                    <div className={"msg " + styleSelectedMessage()} key={index}
                                         style={{display: "flex"}}>
                                        {index >= 1 && array[index - 1].userId === array[index].userId
                                            ? <div style={{
                                                minWidth: "40px",
                                                width: "40px",
                                                height: "40px"
                                            }}/>
                                            : <div style={{
                                                fontFamily: "Segoe UI,SegoeUI,\"Helvetica Neue\",Helvetica,Arial,sans-serif",
                                                backgroundColor: `${messageModel.color}`,
                                                fontWeight: "bold",
                                                minWidth: "40px",
                                                width: "40px",
                                                height: "40px",
                                                textAlign: "center",
                                                fontSize: "20px",
                                                borderRadius: "8px",
                                                lineHeight: "37px"
                                            }}>
                                                <div style={{color: "#FFFFFF"}}>{messageModel.initials}</div>
                                            </div>
                                        }
                                        <div style={{margin: "4px"}}>
                                            {index >= 1 && array[index - 1].userId === array[index].userId
                                                ? <div/>
                                                : <div>
                                                    <b>{messageModel.sender} </b>
                                                </div>
                                            }
                                            {
                                                messageModel.type === TypeMessageEnum.TEXT
                                                    ? <div style={{overflowWrap: "break-word"}}>
                                                        {messageModel.message}
                                                    </div>
                                                    : <div>
                                                        {generateImageRender(messageModel)}
                                                    </div>
                                            }
                                        </div>
                                    </div>
                                </Tooltip>
                            ))}
                            {/*<div style={{*/}
                            {/*    float: "left",*/}
                            {/*    clear: "both"*/}
                            {/*}}*/}
                            {/*     ref={(el) => {*/}
                            {/*         messageEnd = el*/}
                            {/*     }}>*/}
                            {/*</div>*/}
                            <CreateMessageComponent groupUrl={groupUrl}/>
                        </div>
                    </div>
            }
        </>
    )
}
