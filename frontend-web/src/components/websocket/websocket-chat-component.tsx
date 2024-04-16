import {Box, CircularProgress} from "@mui/material"
import React, {useContext, useEffect} from "react"
import {TransportActionEnum} from "../../utils/transport-action-enum"
import {TransportModel} from "../../interface-contract/transport-model"
import {ActiveVideoCall} from "../partials/video/active-video-call"
import {GroupModel} from "../../interface-contract/group-model"
import {NoDataComponent} from "../partials/NoDataComponent"
import {HttpMessageService} from "../../service/http-message.service"
import {AlertAction, AlertContext} from "../../context/AlertContext"
import {CreateMessageComponent} from "../messages/CreateMessageComponent"
import {WebSocketContext} from "../../context/WebsocketContext"
import {DisplayMessagesComponent} from "../messages/DisplayMessagesComponent"

export const WebSocketChatComponent: React.FunctionComponent<{ groupUrl?: string }> = ({groupUrl}) => {
    const {dispatch} = useContext(AlertContext)!
    const {ws, messages, setMessages} = useContext(WebSocketContext)!
    const [messageId, setLastMessageId] = React.useState(0)
    const [loadingOldMessages, setLoadingOldMessages] = React.useState<boolean>(false)
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

    function scrollToEnd() {
        messageEnd?.scrollIntoView({behavior: "auto"})
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

                            <DisplayMessagesComponent messages={messages}/>
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
