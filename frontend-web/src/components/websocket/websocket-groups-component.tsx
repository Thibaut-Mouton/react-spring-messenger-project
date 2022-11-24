import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt"
import ErrorIcon from "@mui/icons-material/Error"
import FolderIcon from "@mui/icons-material/Folder"
import { Alert, Avatar, Collapse, List, ListItemButton, ListItemText } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useHistory } from "react-router-dom"
import { useThemeContext } from "../../context/theme-context"
import { generateColorMode, generateLinkColorMode } from "../utils/enable-dark-mode"
import { TypeGroupEnum } from "../../utils/type-group-enum"
import { dateParser } from "../../utils/date-formater"
import { SkeletonLoader } from "../partials/skeleten-loader"
import { clearChatHistory, setCurrentActiveGroup, setCurrentGroup } from "../../reducers"
import { StoreState } from "../../reducers/types"
import { useLoaderContext } from "../../context/loader-context"

interface IClockType {
  date: string
}

interface IWebSocketGroupComponent {
  groupUrl: string
}

const Clock: React.FunctionComponent<IClockType> = ({ date }) => {
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

export const WebsocketGroupsComponent: React.FunctionComponent<IWebSocketGroupComponent> = ({ groupUrl }) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const {
    setLoading
  } = useLoaderContext()
  const [loadingState, setLoadingState] = React.useState(true)
  const { theme } = useThemeContext()

  const {
    isWsConnected,
    groups
  } = useSelector(
    (state: StoreState) => state.globalReducer
  )

  function changeGroupName (url: string) {
    const currentGroup = groups.find((elt) => elt.group.url === url)
    if (currentGroup) {
	 dispatch(setCurrentGroup({ currentGroup }))
    }
  }

  useEffect(() => {
    if (groups) {
	 if (groups.length !== 0) {
	   changeGroupName(groupUrl)
	   dispatch(setCurrentGroup({ currentGroup: groups[0] }))
	   dispatch(setCurrentActiveGroup({ currentActiveGroup: groupUrl }))
	 }
	 setLoading(false)
	 setLoadingState(false)
    }
  }, [groups])

  function redirectToGroup (id: number, url: string) {
    if (url !== groupUrl) {
	 changeGroupName(url)
	 dispatch(clearChatHistory())
	 dispatch(setCurrentActiveGroup({ currentActiveGroup: url }))
	 history.push("/t/messages/" + url)
    }
  }

  function styleSelectedGroup (selectedUrl: string) {
    if (generateColorMode(theme) === "light") {
	 return selectedUrl === groupUrl ? "selected-group-light" : ""
    }
    if (generateColorMode(theme) === "dark") {
	 return selectedUrl === groupUrl ? "selected-group-dark" : ""
    }
  }

  function styleUnreadMessage (isLastMessageSeen: boolean) {
    return isLastMessageSeen ? theme ? "bold-unread-message-light" : "bold-unread-message-dark" : ""
  }

  return (
    <div
	 className={"sidebar"}
	 style={{
	   borderRight: "1px solid #C8C8C8",
	   overflowY: "scroll"
	 }}>

	 <Collapse in={!isWsConnected}>
	   <Alert severity="error">
		Application is currently unavailable
	   </Alert>
	 </Collapse>

	 <div style={{
	   marginTop: "8px",
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
	 {
	   !loadingState && groups && groups.length === 0 &&
		  <div
			  className={generateColorMode(theme)}
			  style={{
			 display: "flex",
			 flexDirection: "column",
			 alignItems: "center",
			 textAlign: "center",
			 marginTop: "20px"
		    }}>
			  <ErrorIcon fontSize={"large"}/>
			  <h4>
				  You don&apos;t have a group yet !
			  </h4>
			  <div style={{ display: "flex" }}>
				  <ArrowRightAltIcon/>
				  <Link style={{ color: generateLinkColorMode(theme) }} className={"lnk"}
						to={"/create"}>Create group</Link>
			  </div>
		  </div>
	 }
	 <List>
	   {!loadingState && groups && groups.map((groupWrapper) => (
		<ListItemButton className={styleSelectedGroup(groupWrapper.group.url)} key={groupWrapper.group.id}
					 onClick={() => redirectToGroup(groupWrapper.group.id, groupWrapper.group.url)}>
		  <Avatar>
		    {
			 groupWrapper.group.groupType === TypeGroupEnum.GROUP
			   ? <FolderIcon/>
			   : <AccountCircleIcon/>
		    }
		  </Avatar>
		  <ListItemText
		    style={{ marginLeft: "5px" }}
		    primary={
			 <React.Fragment>
									<span
									  className={styleUnreadMessage(!groupWrapper.group.lastMessageSeen)}>{groupWrapper.group.name}
									</span>
			 </React.Fragment>}
		    secondary={
			 <React.Fragment>
									<span
									  className={styleUnreadMessage(!groupWrapper.group.lastMessageSeen) + " group-subtitle-color"}
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
											{groupWrapper.group.lastMessageSender ? groupWrapper.group.lastMessageSender + ": " : ""}
										  {groupWrapper.group.lastMessage
										    ? groupWrapper.group.lastMessage
										    : <span
											 style={{ fontStyle: "italic" }}>No message for the moment</span>}
										  {groupWrapper.group.lastMessage ?
										    <span style={{ fontWeight: "bold" }}> · </span> : ""}
										  {
										    groupWrapper.group.lastMessage &&
														<Clock date={groupWrapper.group.lastMessageDate}/>
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
    </div>
  )
}
