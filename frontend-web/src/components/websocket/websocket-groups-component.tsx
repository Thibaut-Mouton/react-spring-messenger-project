import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt"
import ErrorIcon from "@mui/icons-material/Error"
import FolderIcon from "@mui/icons-material/Folder"
import {Alert, Avatar, Box, Button, Collapse, List, ListItemButton, ListItemText} from "@mui/material"
import React, {useContext, useEffect, useState} from "react"
import {Link, useNavigate} from "react-router-dom"
import {useThemeContext} from "../../context/theme-context"
import {generateColorMode, generateLinkColorMode} from "../utils/enable-dark-mode"
import {TypeGroupEnum} from "../../utils/type-group-enum"
import {dateParser} from "../../utils/date-formater"
import {SkeletonLoader} from "../partials/skeleten-loader"
import {AuthUserContext} from "../../context/AuthContext"
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined"

interface IClockType {
    date: string
}

interface IWebSocketGroupComponent {
    groupUrl?: string
}

const Clock: React.FunctionComponent<IClockType> = ({date}) => {
    const [currentCount, setCount] = useState(dateParser(date))

    useEffect(() => {
            const dateInterval = setInterval(() => {
                setCount(dateParser(date))
            }, 60000)
            return () => {
                clearInterval(dateInterval)
            }
        },
        [currentCount]
    )
    return (
        <React.Fragment>
            {dateParser(date)}
        </React.Fragment>
    )
}

export const WebsocketGroupsComponent: React.FunctionComponent<IWebSocketGroupComponent> = ({groupUrl}) => {
    const [loadingState, setLoadingState] = React.useState(true)
    const {theme} = useThemeContext()
    const navigate = useNavigate()
    const {groups} = useContext(AuthUserContext)!
    const isWsConnected = true

    function changeGroupName(url: string) {
        const currentGroup = groups.find((group) => group.url === url)
        if (currentGroup) {
            // dispatch(setCurrentGroup({currentGroup}))
        }
    }

    useEffect(() => {
        if (groups) {
            if (groups.length !== 0) {
                changeGroupName(groupUrl || "")
                // dispatch(setCurrentGroup({currentGroup: groups[0]}))
                // dispatch(setCurrentActiveGroup({currentActiveGroup: groupUrl}))
            }
            // setLoading(false)
            setLoadingState(false)
        }
    }, [groups])

    function redirectToGroup(id: number, url: string) {
        if (url !== groupUrl) {
            changeGroupName(url)
            // dispatch(clearChatHistory())
            // dispatch(setCurrentActiveGroup({currentActiveGroup: url}))
            navigate(`/t/messages/${url}`)
        }
    }

    function styleSelectedGroup(selectedUrl: string) {
        if (generateColorMode(theme) === "light") {
            return selectedUrl === groupUrl ? "selected-group-light" : ""
        }
        if (generateColorMode(theme) === "dark") {
            return selectedUrl === groupUrl ? "selected-group-dark" : ""
        }
    }

    function styleUnreadMessage(isLastMessageSeen: boolean) {
        return isLastMessageSeen ? theme ? "bold-unread-message-light" : "bold-unread-message-dark" : ""
    }

    return (
        <div className={"sidebar"} style={{backgroundColor: "#f6f8fc"}}>
            <Collapse in={!isWsConnected}>
                <Alert severity="error">
                    Application is currently unavailable
                </Alert>
            </Collapse>

            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
				<span style={{
                    marginLeft: "10px",
                    fontSize: "20px",
                    fontWeight: "bold"
                }}>
                    Discussions
				</span>
            </div>
            <Box margin={"10px 0"} display={"flex"} justifyContent={"center"}>
                <Button variant="outlined" startIcon={<NoteAddOutlinedIcon/>} size={"large"}>
                    New conversation
                </Button>
            </Box>
            {
                !loadingState && groups && groups.length === 0 &&
                <div
                    className={generateColorMode(theme)}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                    }}>
                    <ErrorIcon fontSize={"large"}/>
                    <h4>
                        You don&apos;t have a group yet !
                    </h4>
                    <div style={{display: "flex"}}>
                        <ArrowRightAltIcon/>
                        <Link style={{color: generateLinkColorMode(theme)}} className={"lnk"}
                              to={"/create"}>Create group</Link>
                    </div>
                </div>
            }
            <Box m={1}>
                <List>
                    {!loadingState && groups && groups.map((group) => (
                        <ListItemButton sx={{borderRadius: 2, my: 1}} className={styleSelectedGroup(group.url)}
                                        key={group.id}
                                        onClick={() => redirectToGroup(group.id, group.url)}>
                            <Avatar>
                                {
                                    group.groupType === TypeGroupEnum.GROUP
                                        ? <FolderIcon/>
                                        : <AccountCircleIcon/>
                                }
                            </Avatar>
                            <ListItemText
                                style={{marginLeft: "5px"}}
                                primary={
                                    <React.Fragment>
									<span
                                        className={styleUnreadMessage(!group.lastMessageSeen)}>{group.name}
									</span>
                                    </React.Fragment>}
                                secondary={
                                    <React.Fragment>
									<span
                                        className={styleUnreadMessage(!group.lastMessageSeen) + " group-subtitle-color"}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between"
                                        }}>
										<span
                                            className={"clrcstm"}
                                            style={{
                                                overflowX: "hidden",
                                                whiteSpace: "nowrap",
                                                textOverflow: "ellipsis"
                                            }}>
											{group.lastMessageSender ? group.lastMessageSender + ": " : ""}
                                            {group.lastMessage
                                                ? group.lastMessage
                                                : <span
                                                    style={{fontStyle: "italic"}}>No message for the moment</span>}
                                            {group.lastMessage ?
                                                <span style={{fontWeight: "bold"}}> · </span> : ""}
                                            {
                                                group.lastMessage &&
                                                <Clock date={group.lastMessageDate}/>
                                            }
										</span>
									</span>
                                    </React.Fragment>}
                            />
                        </ListItemButton>
                    ))}
                    {
                        loadingState && <SkeletonLoader/>
                    }
                </List>
            </Box>

        </div>
    )
}
