import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import ErrorIcon from '@mui/icons-material/Error';
import FolderIcon from '@mui/icons-material/Folder';
import { Alert, Avatar, Collapse, IconButton, List, ListItemButton, ListItemText } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { GroupActionEnum } from './group-action-enum';
import { useThemeContext } from '../../context/theme-context';
import { generateColorMode, generateIconColorMode, generateLinkColorMode } from '../../design/style/enable-dark-mode'
import { TypeGroupEnum } from '../../utils/type-group-enum';
import { dateParser } from '../../utils/date-formater';
import { SkeletonLoader } from '../skeleten-loader';
import { setCurrentActiveGroup, setGroupName } from '../../reducers';
import { StoreState } from '../../reducers/types';
import { useLoaderContext } from '../../context/loader-context';

interface ClockType {
  date: string
}

const Clock: React.FunctionComponent<ClockType> = ({ date }) => {
    const [currentCount, setCount] = useState(dateParser(date));

    useEffect(() => {
        const dateInterval = setInterval(() => {
            setCount(dateParser(date));
        }, 60000);
        return () => {
            clearInterval(dateInterval);
        };
    },
    [currentCount]
    );
    return (
        <React.Fragment>
            { dateParser(date) }
        </React.Fragment>
    );
};

export const WebsocketGroupsComponent: React.FunctionComponent = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const {
        setLoading
    } = useLoaderContext();
    const [loadingState, setLoadingState] = React.useState(true);
    const { theme } = useThemeContext();

    const {
        isWsConnected,
        wsUserGroups
    } = useSelector(
        (state: StoreState) => state.globalReducer
    );

    const groupUrl = window.location.pathname.split('/').slice(-1)[0];

    function changeGroupName (url: string) {
        const currentGroup = wsUserGroups.find((elt) => elt.url === url);
        dispatch(setGroupName({ groupName: currentGroup?.name || '' }));
    }

    useEffect(() => {
        if (wsUserGroups) {
            if (wsUserGroups.length !== 0) {
                changeGroupName(groupUrl);
                dispatch(setCurrentActiveGroup({ currentActiveGroup: groupUrl }));
            }
            setLoading(false);
            setLoadingState(false);
        }
    }, [wsUserGroups]);

    function redirectToGroup (id: number, url: string) {
        changeGroupName(url);
        dispatch(setCurrentActiveGroup({ currentActiveGroup: url }));
        history.push('/t/messages/' + url);
    }

    function handleAddUserAction (action: GroupActionEnum) {
        console.log(action);
    }

    function styleSelectedGroup (selectedUrl: string) {
        if (generateColorMode(theme) === 'light') {
            return selectedUrl === groupUrl ? 'selected-group-light' : '';
        }
        if (generateColorMode(theme) === 'dark') {
            return selectedUrl === groupUrl ? 'selected-group-dark' : '';
        }
    }

    function styleUnreadMessage (isLastMessageSeen: boolean) {
        return isLastMessageSeen ? theme ? 'bold-unread-message-light' : 'bold-unread-message-dark' : '';
    }

    return (
        <div
            className={ 'sidebar' }
            style={ {
                borderRight: '1px solid #C8C8C8',
                overflowY: 'scroll'
            } }>

            <Collapse in={ !isWsConnected }>
                <Alert severity="error">
                    Application is currently unavailable
                </Alert>
            </Collapse>

            <div style={ {
                marginTop: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            } }>
                <span style={ {
                    marginLeft: '10px',
                    fontSize: '20px',
                    fontWeight: 'bold'
                } }>
                    Discussions
                </span>
                <div>
                    <IconButton onClick={ () => handleAddUserAction(GroupActionEnum.OPEN) }>
                        <AddCircleIcon style={ { color: generateIconColorMode(theme) } } fontSize={ 'large' }/>
                    </IconButton>
                </div>
            </div>
            {
                !loadingState && wsUserGroups && wsUserGroups.length === 0 &&
                    <div
                        className={ generateColorMode(theme) }
                        style={ {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            marginTop: '20px'
                        } }>
                        <ErrorIcon fontSize={ 'large' }/>
                        <h4>
                            You don&apos;t have a group yet !
                        </h4>
                        <div style={ { display: 'flex' } }>
                            <ArrowRightAltIcon/>
                            <Link style={ { color: generateLinkColorMode(theme) } } className={ 'lnk' }
                                to={ '/create' }>Create group</Link>
                        </div>
                    </div>
            }
            <List>
                { !loadingState && wsUserGroups && wsUserGroups.map((group) => (
                    <ListItemButton className={ styleSelectedGroup(group.url) } key={ group.id }
                        onClick={ () => redirectToGroup(group.id, group.url) }>
                        <Avatar>
                            {
                                group.groupType === TypeGroupEnum.GROUP
                                    ? <FolderIcon/>
                                    : <AccountCircleIcon/>
                            }
                        </Avatar>
                        <ListItemText
                            style={ { marginLeft: '5px' } }
                            primary={
                                <React.Fragment>
                                    <span
                                        className={ styleUnreadMessage(!group.lastMessageSeen) }>{ group.name }
                                    </span>
                                </React.Fragment> }
                            secondary={
                                <React.Fragment>
                                    <span
                                        className={ styleUnreadMessage(!group.lastMessageSeen) + ' group-subtitle-color' }
                                        style={ {
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        } }>
                                        <span
                                            className={ 'clrcstm' }
                                            style={ {
                                                overflowX: 'hidden',
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis'
                                            } }>
                                            { group.lastMessageSender ? group.lastMessageSender + ': ' : '' }
                                            { group.lastMessage
                                                ? group.lastMessage
                                                : <span style={ { fontStyle: 'italic' } }>No message for the moment</span> }
                                            { group.lastMessage ? <span style={ { fontWeight: 'bold' } }> · </span> : '' }
                                            <Clock date={ group.lastMessageDate }/>
                                        </span>
                                    </span>
                                </React.Fragment> }
                        />
                    </ListItemButton>
                )) }
                {
                    loadingState && <SkeletonLoader/>
                }
            </List>
        </div>
    );
};
