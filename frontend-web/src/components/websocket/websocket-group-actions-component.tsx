import {
    Collapse,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    MenuItem,
    Tooltip
} from "@mui/material"
import {ExpandLess} from "@mui/icons-material"
import SecurityIcon from "@mui/icons-material/Security"
import ExpandMore from "@mui/icons-material/ExpandMore"
import PersonIcon from "@mui/icons-material/Person"
import GroupAddIcon from "@mui/icons-material/GroupAdd"
import GroupIcon from "@mui/icons-material/Group"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import React, {useContext, useState} from "react"
import {GroupActionEnum} from "./group-action-enum"
import {TransportModel} from "../../interface-contract/transport-model"
import {TransportActionEnum} from "../../utils/transport-action-enum"
import {AllUsersDialog} from "../partials/all-users-dialog"
import {HttpGroupService} from "../../service/http-group-service"
import {GroupUserModel} from "../../interface-contract/group-user-model"
import {WebSocketContext} from "../../context/WebsocketContext"
import {GroupContext} from "../../context/GroupContext"
import {UserContext} from "../../context/UserContext"
import {AlertAction, AlertContext} from "../../context/AlertContext"
import {MultimediaListComponent} from "../partials/list-items/MultimediaListComponent"

export const WebSocketGroupActionComponent: React.FunctionComponent<{ groupUrl?: string }> = ({groupUrl}) => {
    const [paramsOpen, setParamsOpen] = useState(false)
    const [popupOpen, setPopupOpen] = useState(false)
    const [usersInConversation, setUsersInConversation] = useState<GroupUserModel[]>([])
    const [allUsers, setAllUsers] = useState<GroupUserModel[]>([])
    const [isCurrentUserAdmin, setCurrentUserIsAdmin] = useState(false)
    const [toolTipAction, setToolTipAction] = useState(false)
    const [openTooltipId, setToolTipId] = useState<number | null>(null)
    const {dispatch} = useContext(AlertContext)!
    const {ws} = useContext(WebSocketContext)!
    const httpService = new HttpGroupService()
    const {groups} = useContext(GroupContext)!
    const {user} = useContext(UserContext)!

    function handleTooltipAction(event: any, action: string) {
        event.preventDefault()
        if (action === GroupActionEnum.OPEN) {
            setToolTipAction(true)
        }
        if (action === GroupActionEnum.CLOSE) {
            setToolTipAction(false)
            setToolTipId(null)
        }
    }

    function handleDisplayUserAction(event: any, id: number) {
        event.preventDefault()
        setToolTipId(id)
    }

    function closeDisplayUserAction(event: any) {
        event.preventDefault()
        setToolTipAction(false)
        setToolTipId(null)
    }

    async function handleClick(event: React.MouseEvent<HTMLElement>, action: string) {
        event.preventDefault()
        switch (action) {
            case GroupActionEnum.PARAM:
                if (usersInConversation.length === 0) {
                    const res = await httpService.fetchAllUsersInConversation(groupUrl || "")
                    res.data.forEach((groupUserModel) => {
                        if (groupUserModel.userId === user?.id && groupUserModel.admin) {
                            setCurrentUserIsAdmin(true)
                        }
                    })
                    setUsersInConversation(res.data)
                }
                setParamsOpen(!paramsOpen)
                break
            default:
                throw new Error("Error, please refresh page")
        }
    }

    function handlePopupState(isOpen: boolean) {
        setPopupOpen(isOpen)
    }

    async function handleAddUserAction(action: string) {
        switch (action) {
            case GroupActionEnum.OPEN:
                handlePopupState(true)
                if (allUsers.length === 0) {
                    const res = await httpService.fetchAllUsersWithoutAlreadyInGroup(groupUrl || "")
                    setAllUsers(res.data)
                }
                break
            case GroupActionEnum.CLOSE:
                handlePopupState(false)
                break
            default:
                throw new Error("Cannot handle AddUserAction")
        }
    }

    function leaveGroup(userId: number) {
        if (ws) {
            const transport = new TransportModel(userId, TransportActionEnum.LEAVE_GROUP, undefined, groupUrl)
            ws.publish({
                destination: "/message",
                body: JSON.stringify(transport)
            })
        }
    }

    async function removeUserFromAdminListInConversation(userId: string | number) {
        try {
            // const res = await httpService.removeAdminUserInConversation(userId, groupUrl)
            const users = [...usersInConversation]
            const user = users.find((elt) => elt.userId === userId)
            if (user) {
                user.admin = false
            }
            setUsersInConversation(users)
            // dispatch(setAlerts({
            //   alert: {
            // text: res.data,
            // alert: "success",
            // isOpen: true
            //   }
            // }))
        } catch (err) {
            // dispatch(setAlerts({
            //   alert: {
            // text: "Cannot remove user rights. Please retry later",
            // alert: "error",
            // isOpen: true
            //   }
            // }))
        }
    }

    async function grantUserAdminInConversation(userId: number | string) {
        try {
            // const res = await httpService.grantUserAdminInConversation(userId, groupUrl)
            // dispatch(setAlerts({
            //   alert: {
            // text: res.data,
            // alert: "success",
            // isOpen: true
            //   }
            // }))
            const users = [...usersInConversation]
            const user = users.find((elt) => elt.userId === userId)
            if (user) {
                user.admin = true
            }
            setUsersInConversation(users)
        } catch (err) {
            // dispatch(setAlerts({
            //   alert: {
            // text: "Cannot grant user. Please retry later",
            // alert: "error",
            // isOpen: true
            //   }
            // }))
        }
    }

    async function addUserInConversation(userId: string | number) {
        try {
            const res = await httpService.addUserToGroup(userId, groupUrl || "")
            const users = [...usersInConversation]
            users.push(res.data)
            setUsersInConversation(users)
        } catch (error: any) {
            dispatch({
                type: AlertAction.ADD_ALERT,
                payload: {
                    id: crypto.randomUUID(),
                    text: `Cannot add user to group : ${error.toString()}`,
                    alert: "error",
                    isOpen: true
                }
            })
        } finally {
            setPopupOpen(false)
        }
    }

    async function removeUserFromConversation(userId: string | number) {
        try {
            // const res = await httpService.removeUserFromConversation(userId, groupUrl)
            // dispatch(setAlerts({
            //   alert: {
            // text: res.data,
            // alert: "success",
            // isOpen: true
            //   }
            // }))
            const users = [...usersInConversation]
            const index = users.findIndex((elt) => elt.userId === userId)
            users.splice(index, 1)
            setUsersInConversation(users)
        } catch (err: any) {
            // dispatch(setAlerts({
            //   alert: {
            // text: `Cannot remove user from group : ${err.toString()}`,
            // alert: "error",
            // isOpen: true
            //   }
            // }))
        }
    }

    function isDisabled() {
        return groups && groups.length === 0
    }

    return (
        <div className={"sidebar"}>
            <div>
                <List
                    component="nav">
                    <ListItemButton disabled={isDisabled()}
                                    onClick={() => handleAddUserAction(GroupActionEnum.OPEN)}>
                        <ListItemIcon>
                            <GroupAddIcon color={"primary"}/>
                        </ListItemIcon>
                        <ListItemText primary="Add user to group"/>
                    </ListItemButton>
                    <ListItemButton disabled={isDisabled()}
                                    onClick={(event) => handleClick(event, GroupActionEnum.PARAM)}>
                        <ListItemIcon>
                            <GroupIcon color={"primary"}/>
                        </ListItemIcon>
                        <ListItemText primary="Members"/>
                        {paramsOpen ? <ExpandLess/> : <ExpandMore/>}
                    </ListItemButton>
                    <Collapse in={paramsOpen}>
                        <List component="div" disablePadding>
                            {paramsOpen && usersInConversation.map((value, index) => (
                                <ListItem key={index}
                                          onMouseEnter={(event) => handleDisplayUserAction(event, index)}
                                          onMouseLeave={event => closeDisplayUserAction(event)}>
                                    <ListItemIcon>
                                        {
                                            value.admin
                                                ? <SecurityIcon color={"secondary"}/>
                                                : <PersonIcon color={"secondary"}/>
                                        }
                                    </ListItemIcon>
                                    <ListItemText primary={value.firstName + " " + value.lastName}
                                                  secondary={
                                                      <React.Fragment>
												<span>
													{

                                                        value.admin
                                                            ? "Administrator"
                                                            : ""
                                                    }
												</span>
                                                      </React.Fragment>
                                                  }/>
                                    <ListItemSecondaryAction
                                        onMouseEnter={event => handleDisplayUserAction(event, index)}
                                        onMouseLeave={event => closeDisplayUserAction(event)}
                                    >
                                        {openTooltipId === index
                                            ? <Tooltip
                                                PopperProps={{
                                                    disablePortal: false
                                                }}
                                                onClose={event => handleTooltipAction(event, GroupActionEnum.CLOSE)}
                                                open={toolTipAction}
                                                disableFocusListener
                                                disableHoverListener
                                                disableTouchListener
                                                title={
                                                    <React.Fragment>
                                                        <div>
                                                            {
                                                                isCurrentUserAdmin && value.admin &&
                                                                <MenuItem
                                                                    onClick={() => removeUserFromAdminListInConversation(value.userId)}>Remove from administrator
                                                                </MenuItem>
                                                            }
                                                            {
                                                                isCurrentUserAdmin && !value.admin &&
                                                                <MenuItem
                                                                    onClick={() => grantUserAdminInConversation(value.userId)}>Grant
                                                                    administrator</MenuItem>
                                                            }
                                                            {
                                                                !(user?.id === value.userId) &&
                                                                <MenuItem
                                                                    onClick={() => removeUserFromConversation(value.userId)}>Remove from group</MenuItem>
                                                            }
                                                            {
                                                                user?.id === value.userId &&
                                                                <MenuItem
                                                                    onClick={() => leaveGroup(Number(value.userId))}
                                                                    dense={true}>Leave group</MenuItem>
                                                            }
                                                        </div>
                                                    </React.Fragment>
                                                }>
                                                <IconButton
                                                    onClick={event => handleTooltipAction(event, GroupActionEnum.OPEN)}>
                                                    <MoreHorizIcon/>
                                                </IconButton>
                                            </Tooltip>
                                            : <IconButton/>
                                        }
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                    {groupUrl && <MultimediaListComponent groupUrl={groupUrl} isDisabled={isDisabled()}/>}
                </List>
            </div>
            <AllUsersDialog usersList={allUsers} open={popupOpen} setOpen={handlePopupState}
                            dialogTitle={"Add user to conversation"} action={addUserInConversation}/>
        </div>
    )
}
