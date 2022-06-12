import { FeedbackModel } from '../../model/feedback-model'
import UUIDv4 from '../../utils/uuid-generator'
import { ReduxModel } from '../../model/redux-model'
import {
  Collapse,
  IconButton,
  List,
  ListItem, ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Tooltip
} from '@mui/material'
import { ExpandLess } from '@mui/icons-material'
import SecurityIcon from '@mui/icons-material/Security'
import ExpandMore from '@mui/icons-material/ExpandMore'
import PersonIcon from '@mui/icons-material/Person'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import GroupIcon from '@mui/icons-material/Group'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { AxiosResponse } from 'axios'
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GroupActionEnum } from './group-action-enum';
import { useAlertContext } from '../../context/alert-context'
import { useAuthContext } from '../../context/auth-context';
import { useThemeContext } from '../../context/theme-context';
import { AllUsersDialog } from '../../design/dialog/all-users-dialog';
import {
    generateClassName,
    generateIconColorMode
} from '../../design/style/enable-dark-mode';
import GroupUserModel from '../../model/group-user-model';
import { StoreState } from '../../reducers/types';
import AuthService from '../../service/auth-service';

export const WebSocketGroupActionComponent: React.FunctionComponent = () => {
    const groupUrl = window.location.pathname.split('/').slice(-1)[0];
    const [paramsOpen, setParamsOpen] = useState(false);
    const [popupOpen, setPopupOpen] = useState(false);
    const [usersInConversation, setUsersInConversation] = useState<GroupUserModel[]>([]);
    const [allUsers, setAllUsers] = useState<GroupUserModel[]>([]);
    const [isCurrentUserAdmin, setCurrentUserIsAdmin] = useState(false);
    const [toolTipAction, setToolTipAction] = useState(false);
    const [openTooltipId, setToolTipId] = useState<number | null>(null);
    const { theme } = useThemeContext();
    const {
        alerts,
        setAlerts
    } = useAlertContext();
    const { user } = useAuthContext();

    const {
        currentActiveGroup,
        wsUserGroups
    } = useSelector((state: StoreState) => state.globalReducer);

    useEffect(() => {
        clearData();
        return () => {
            clearData();
        };
    }, [currentActiveGroup]);

    function handleTooltipAction (event: any, action: string) {
        event.preventDefault();
        if (action === GroupActionEnum.OPEN) {
            setToolTipAction(true);
        }
        if (action === GroupActionEnum.CLOSE) {
            setToolTipAction(false);
            setToolTipId(null);
        }
    }

    function clearData () {
        setAllUsers([]);
        setToolTipAction(false);
        setToolTipId(null);
        setCurrentUserIsAdmin(false);
        setUsersInConversation([]);
        handlePopupState(false);
        setParamsOpen(false);
    }

    function handleDisplayUserAction (event: any, id: number) {
        event.preventDefault();
        setToolTipId(id);
    }

    function closeDisplayUserAction (event: any) {
        event.preventDefault();
        setToolTipAction(false);
        setToolTipId(null);
    }

    function handleClick (event: any, action: string) {
        event.preventDefault();
        switch (action) {
        case GroupActionEnum.PARAM:
            usersInConversation.length === 0 && new AuthService().fetchAllUsersInConversation(groupUrl).then((res: AxiosResponse<GroupUserModel[]>) => {
                res.data.forEach((groupUserModel) => {
                    if (groupUserModel.userId === user?.id && groupUserModel.admin) {
                        setCurrentUserIsAdmin(true);
                    }
                });
                setUsersInConversation(res.data);
            });
            setParamsOpen(!paramsOpen);
            break;
        default:
            throw new Error('Error, please refresh page');
        }
    }

    function handlePopupState (isOpen: boolean) {
        setPopupOpen(isOpen);
    }

    function handleAddUserAction (action: string) {
        switch (action) {
        case GroupActionEnum.OPEN:
            handlePopupState(true);
            if (allUsers.length === 0) {
                new AuthService().fetchAllUsersWithoutAlreadyInGroup(groupUrl).then((r: AxiosResponse<GroupUserModel[]>) => {
                    setAllUsers(r.data);
                });
            }
            break;
        case GroupActionEnum.CLOSE:
            handlePopupState(false);
            break;
        default:
            throw new Error('Cannot handle AddUserAction');
        }
    }

    function leaveGroup () {

    }

    function removeUserFromAdminListInConversation (userId: string | number) {
        new AuthService().removeAdminUserInConversation(userId, groupUrl).then((res) => {
            const users = [...usersInConversation];
            const user = users.find((elt) => elt.userId === userId);
            if (user) {
                user.admin = false;
            }
            setUsersInConversation(users);
            setAlerts([...alerts, new FeedbackModel(UUIDv4(), res.data, 'success', true)]);
        }).catch(() => {
            setAlerts([...alerts, new FeedbackModel(UUIDv4(), 'Cannot remove user rights. Please retry later', 'error', true)]);
        });
    }

    function grantUserAdminInConversation (userId: number | string) {
    // grantUserAdminInGroup(new ReduxModel(undefined, user?.wsToken, groupUrl, Number(userId)));
        new AuthService().grantUserAdminInConversation(userId, groupUrl).then((res) => {
            setAlerts([...alerts, new FeedbackModel(UUIDv4(), res.data, 'success', true)]);
            const users = [...usersInConversation];
            const user = users.find((elt) => elt.userId === userId);
            if (user) {
                user.admin = true;
            }
            setUsersInConversation(users);
        }).catch(() => {
            setAlerts([...alerts, new FeedbackModel(UUIDv4(), 'Cannot grant user. Please retry later', 'error', true)]);
        });
    }

    function addUserInConversation (userId: string | number) {
        new AuthService().addUserToGroup(userId, groupUrl).then((res: AxiosResponse<GroupUserModel>) => {
            setAlerts([...alerts, new FeedbackModel(UUIDv4(), `${res.data.firstName} has been added to group`, 'success', true)]);
            const users = [...usersInConversation];
            users.push(res.data);
            setUsersInConversation(users);
        }).catch((err) => {
            setAlerts([...alerts, new FeedbackModel(UUIDv4(), 'Cannot add user to group : ' + err.toString(), 'error', true)]);
        }).finally(() => {
            setPopupOpen(false);
        });
    }

    function removeUserFromConversation (userId: string | number) {
        new AuthService().removeUserFromConversation(userId, groupUrl).then((res) => {
            setAlerts([...alerts, new FeedbackModel(UUIDv4(), res.data, 'success', true)]);
            const users = [...usersInConversation];
            const index = users.findIndex((elt) => elt.userId === userId);
            users.splice(index, 1);
            setUsersInConversation(users);
        }).catch((err) => {
            setAlerts([...alerts, new FeedbackModel(UUIDv4(), 'Cannot remove user from group : ' + err.toString(), 'error', true)]);
        });
    }

    return (
        <div>
            <div className={ 'sidebar' }>
                <List
                    component="nav">
                    <ListItemButton disabled={ wsUserGroups.length === 0 } onClick={ () => handleAddUserAction(GroupActionEnum.OPEN) }>
                        <ListItemIcon>
                            <GroupAddIcon style={ { color: generateIconColorMode(theme) } }/>
                        </ListItemIcon>
                        <ListItemText primary="Add user to group"/>
                    </ListItemButton>
                    <ListItemButton disabled={ wsUserGroups.length === 0 } onClick={ (event) => handleClick(event, GroupActionEnum.PARAM) }>
                        <ListItemIcon>
                            <GroupIcon style={ { color: generateIconColorMode(theme) } }/>
                        </ListItemIcon>
                        <ListItemText primary="Members"/>
                        { paramsOpen ? <ExpandLess/> : <ExpandMore/> }
                    </ListItemButton>
                    <Collapse in={ paramsOpen }>
                        <List component="div" disablePadding>
                            { paramsOpen && usersInConversation.map((value, index) => (
                                <ListItem key={ index }
                                    onMouseEnter={ event => handleDisplayUserAction(event, index) }
                                    onMouseLeave={ event => closeDisplayUserAction(event) }>
                                    <ListItemIcon>
                                        {
                                            value.admin
                                                ? <SecurityIcon
                                                        style={ { color: generateIconColorMode(theme) } }/>
                                                : <PersonIcon
                                                        style={ { color: generateIconColorMode(theme) } }/>
                                        }
                                    </ListItemIcon>
                                    <ListItemText primary={ value.firstName + ' ' + value.lastName }
                                        secondary={
                                            <React.Fragment>
                                                <span className={ generateClassName(theme) }>
                                                    {

                                                        value.admin
                                                            ? 'Administrator'
                                                            : ''
                                                    }
                                                </span>
                                            </React.Fragment>
                                        }/>
                                    <ListItemSecondaryAction
                                        onMouseEnter={ event => handleDisplayUserAction(event, index) }
                                        onMouseLeave={ event => closeDisplayUserAction(event) }
                                    >
                                        { openTooltipId === index
                                            ? <Tooltip
                                                    PopperProps={ {
                                                    disablePortal: false
                                                } }
                                                    onClose={ event => handleTooltipAction(event, GroupActionEnum.CLOSE) }
                                                    open={ toolTipAction }
                                                    disableFocusListener
                                                    disableHoverListener
                                                    disableTouchListener
                                                    title={
                                                    <React.Fragment>
                                                            <div>
                                                            {
                                                                isCurrentUserAdmin && value.admin &&
                                                                    <MenuItem
                                                                        onClick={ () => removeUserFromAdminListInConversation(value.userId) }
                                                                        dense={ true }>Remove from administrator
                                                                    </MenuItem>
                                                            }
                                                            {
                                                                isCurrentUserAdmin && !value.admin &&
                                                                    <MenuItem
                                                                        onClick={ () => grantUserAdminInConversation(value.userId) }
                                                                        dense={ true }>Grant
                                                                        administrator</MenuItem>
                                                            }
                                                            {
                                                                !(user?.id === value.userId) &&
                                                                    <MenuItem
                                                                        onClick={ () => removeUserFromConversation(value.userId) }
                                                                        dense={ true }>Remove from group</MenuItem>
                                                            }
                                                            {
                                                                user?.id === value.userId &&
                                                                    <MenuItem
                                                                        onClick={ () => leaveGroup() }
                                                                        dense={ true }>Leave group</MenuItem>
                                                            }
                                                        </div>
                                                        </React.Fragment>
                                                }>
                                                <IconButton
                                                    onClick={ event => handleTooltipAction(event, GroupActionEnum.OPEN) }
                                                    style={ { color: generateIconColorMode(theme) } }>
                                                    <MoreHorizIcon/>
                                                </IconButton>
                                            </Tooltip>
                                            : <IconButton/>
                                        }
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )) }
                        </List>
                    </Collapse>
                </List>
            </div>
            <AllUsersDialog usersList={ allUsers } open={ popupOpen } setOpen={ handlePopupState }
                dialogTitle={ 'Add user to conversation' } action={ addUserInConversation }/>
        </div>
    );
};
