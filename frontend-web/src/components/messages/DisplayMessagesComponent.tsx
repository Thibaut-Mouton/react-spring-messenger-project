import {CircularProgress, Tooltip} from "@mui/material"
import {TypeMessageEnum} from "../../utils/type-message-enum"
import React, {useContext, useEffect, useState} from "react"
import {FullMessageModel} from "../../interface-contract/full-message-model"
import {GroupActionEnum} from "../websocket/group-action-enum"
import {ImagePreviewComponent} from "../partials/image-preview"
import {WebSocketContext} from "../../context/WebsocketContext"
import {HttpMessageService} from "../../service/http-message.service"
import {VideoCallMessageComponent} from "./VideoCallMessageComponent"

interface DisplayMessagesProps {
    messages: FullMessageModel[]
    groupUrl: string
    updateMessages: (messages: FullMessageModel[]) => void
}

export function DisplayMessagesComponent({messages, groupUrl, updateMessages}: DisplayMessagesProps) {
    const {areAllMessagesFetched, setAllMessagesFetched} = useContext(WebSocketContext)!
    const [imgSrc, setImgSrc] = React.useState("")
    const [isPreviewImageOpen, setPreviewImageOpen] = React.useState(false)
    const [messageId, setLastMessageId] = useState(0)
    const [loadingOldMessages, setLoadingOldMessages] = useState<boolean>(false)
    const httpService = new HttpMessageService()

    let messageEnd: HTMLDivElement | null

    async function handleScroll(event: any) {
        if (event.target.scrollTop === 0) {
            if (!areAllMessagesFetched) {
                setLoadingOldMessages(true)
                const {data} = await httpService.getMessages(groupUrl, messageId)
                updateMessages(data.messages)
                setAllMessagesFetched(data.lastMessage)
            }
        } else {
            setLoadingOldMessages(false)
        }
    }

    useEffect(() => {
        if (!loadingOldMessages) {
            scrollToEnd()
        }
        if (messages && messages.length > 0) {
            setLoadingOldMessages(false)
            setLastMessageId(messages[0].id)
        }
    }, [messages])

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

    return <div style={{overflowY: "auto", flex: "1 1 auto", height: "0px"}} onScroll={(event) => handleScroll(event)}>
        {
            !areAllMessagesFetched && loadingOldMessages && <div style={{
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
                <div className={"msg"} key={index}
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
                    <div style={{marginLeft: "2px"}}>
                        {index >= 1 && array[index - 1].userId === array[index].userId
                            ? <div/>
                            : <div>
                                <b>{messageModel.sender} </b>
                            </div>
                        }
                        {
                            messageModel.type === TypeMessageEnum.CALL &&
                            <VideoCallMessageComponent url={messageModel.message}/>
                        }
                        {
                            messageModel.type === TypeMessageEnum.TEXT &&
                            <div style={{overflowWrap: "break-word", wordBreak: "break-all"}}>
                                {messageModel.message}
                            </div>
                        }
                        {
                            messageModel.type === TypeMessageEnum.FILE && generateImageRender(messageModel)
                        }

                    </div>
                </div>
            </Tooltip>
        ))}
        <div style={{
            float: "left",
            clear: "both"
        }}
             ref={(el) => {
                 messageEnd = el
             }}>
        </div>
    </div>
}
