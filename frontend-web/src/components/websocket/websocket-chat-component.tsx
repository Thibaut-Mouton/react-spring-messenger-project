import {Box} from "@mui/material"
import React, {useContext, useEffect, useState} from "react"
import {ActiveVideoCall} from "../partials/video/active-video-call"
import {NoDataComponent} from "../partials/NoDataComponent"
import {HttpMessageService} from "../../service/http-message.service"
import {AlertAction, AlertContext} from "../../context/AlertContext"
import {CreateMessageComponent} from "../messages/CreateMessageComponent"
import {WebSocketContext} from "../../context/WebsocketContext"
import {DisplayMessagesComponent} from "../messages/DisplayMessagesComponent"
import {FullMessageModel} from "../../interface-contract/full-message-model"

export const WebSocketChatComponent: React.FunctionComponent<{ groupUrl?: string }> = ({groupUrl}) => {
    const {dispatch} = useContext(AlertContext)!
    const {messages, setMessages, setAllMessagesFetched} = useContext(WebSocketContext)!
    const [isActiveCall, setActiveCall] = useState<boolean>(false)

    const [groupName, setGroupName] = React.useState<string>("")

    useEffect(() => {
        const fetchMessages = async () => {
            if (groupUrl) {
                try {
                    const http = new HttpMessageService()
                    const {data} = await http.getMessages(groupUrl, -1)
                    setMessages(data.messages)
                    setAllMessagesFetched(data.lastMessage)
                    setGroupName(data.groupName)
                    setActiveCall(data.isActiveCall)
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

    function updateMessages(messagesToAdd: FullMessageModel[]) {
        setMessages([...messagesToAdd, ...messages])
    }

    return (
        <>
            {
                !groupUrl ?
                    <div style={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "column",
                    }}>
                        <NoDataComponent/>
                    </div>
                    : groupName &&
                    <div style={{
                        backgroundColor: "#f6f8fc",
                        display: "flex",
                        width: "90%",
                        flexDirection: "column",
                    }}>
                        <div style={{
                            backgroundColor: "white",
                            borderRadius: "15px 15px 0 0",
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
                                <ActiveVideoCall isAnyCallActive={isActiveCall}/>
                            </Box>
                        </div>
                        <div
                            // onScroll={(event) => handleScroll(event)}
                            style={{
                                backgroundColor: "white",
                                display: "flex",
                                flexDirection: "column",
                                width: "100%",
                                height: "92%",
                            }}>

                            <DisplayMessagesComponent updateMessages={updateMessages} groupUrl={groupUrl} messages={messages}/>
                            <CreateMessageComponent groupUrl={groupUrl}/>
                        </div>
                    </div>
            }
        </>
    )
}
