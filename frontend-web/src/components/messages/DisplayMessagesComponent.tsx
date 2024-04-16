import {Tooltip} from "@mui/material"
import {TypeMessageEnum} from "../../utils/type-message-enum"
import React from "react"
import {FullMessageModel} from "../../interface-contract/full-message-model"
import {GroupActionEnum} from "../websocket/group-action-enum"
import {ImagePreviewComponent} from "../partials/image-preview"

interface DisplayMessagesProps {
    messages: FullMessageModel[]
}

export function DisplayMessagesComponent({messages}: DisplayMessagesProps) {
    const [imgSrc, setImgSrc] = React.useState("")
    const [isPreviewImageOpen, setPreviewImageOpen] = React.useState(false)

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

    return <div>
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
    </div>
}
