import React, {useEffect, useState} from "react";
import Collapse from "@material-ui/core/Collapse";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import {generateColorMode, generateIconColorMode, generateLinkColorMode} from "../../design/style/enable-dark-mode";
import ErrorIcon from "@material-ui/icons/Error";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import {Link} from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import {TypeGroupEnum} from "../../utils/type-group-enum";
import FolderIcon from "@material-ui/icons/Folder";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ListItemText from "@material-ui/core/ListItemText";
import {useHistory} from "react-router-dom";
import {dateParser} from "../../utils/date-formater";
import {useThemeContext} from "../../context/theme-context";
import {SkeletonLoader} from "../skeleten-loader";
import {GroupModel} from "../../model/group-model";
import {GroupActionEnum} from "./group-action-enum";

interface ClockType {
    date: string
}

const Clock: React.FunctionComponent<ClockType> = ({date}) => {
    const [currentCount, setCount] = useState(dateParser(date));

    useEffect(() => {
            const dateInterval = setInterval(() => {
                setCount(dateParser(date))
            }, 60000);
            return () => {
                clearInterval(dateInterval);
            }
        },
        [currentCount]
    );
    return (
        <React.Fragment>
            {dateParser(date)}
        </React.Fragment>
    )
};


interface WebsocketGroupsComponentType {
    setGroupName: (groupName: string) => void
    isWsConnected: boolean
    setCurrentActiveGroup: (test: string) => {}
    currentActiveGroup: string
    wsUserGroups: GroupModel[]
}

export const WebsocketGroupsComponent: React.FunctionComponent<WebsocketGroupsComponentType> = ({
                                                                                                    isWsConnected,
                                                                                                    setCurrentActiveGroup,
                                                                                                    currentActiveGroup,
                                                                                                    wsUserGroups,
                                                                                                    setGroupName
                                                                                                }) => {
    const history = useHistory();
    const [loading, setLoading] = React.useState(true);
    const {theme} = useThemeContext();
    const groupUrl = window.location.pathname.split("/").slice(-1)[0];


    function changeGroupName(url: string) {
        const val = wsUserGroups.find((elt) => elt.url === url)
        setGroupName(val?.name || "");
    }

    useEffect(() => {
        if (wsUserGroups) {
            changeGroupName(groupUrl);
            setLoading(false);
        }
    }, [wsUserGroups])

    function redirectToGroup(id: number, url: string) {
        changeGroupName(url);
        setCurrentActiveGroup(url);
        history.push("/t/messages/" + url);
    }

    function handleAddUserAction(action: string) {

    }

    function styleSelectedGroup(selectedUrl: string) {
        if (generateColorMode(theme) === "light") {
            return selectedUrl === groupUrl ? "selected-group-light" : "";
        }
        if (generateColorMode(theme) === "dark") {
            return selectedUrl === groupUrl ? "selected-group-dark" : "";
        }
    }

    function styleUnreadMessage(isLastMessageSeen: boolean) {
        return isLastMessageSeen ? theme ? "bold-unread-message-light" : "bold-unread-message-dark" : "";
    }

    return (
        <div
            className={"sidebar"}
            style={{borderRight: "1px solid #C8C8C8", overflowY: "scroll"}}>

            <Collapse in={!isWsConnected}>
                <Alert severity="error">
                    Application is currently unavailable
                </Alert>
            </Collapse>

            <div style={{marginTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <span style={{marginLeft: "10px", fontSize: "20px", fontWeight: "bold"}}>
                Discussions
                </span>
                <div>
                    <IconButton onClick={() => handleAddUserAction(GroupActionEnum.OPEN)}>
                        <AddCircleIcon style={{color: generateIconColorMode(theme)}} fontSize={"large"}/>
                    </IconButton>
                </div>
            </div>
            {
                !loading && wsUserGroups && wsUserGroups.length === 0 &&
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
                        You don't have a group yet !
                    </h4>
                    <div style={{display: "flex"}}>
                        <ArrowRightAltIcon/>
                        <Link style={{color: generateLinkColorMode(theme)}} className={"lnk"}
                              to={"/create"}>Create group</Link>
                    </div>
                </div>
            }
            <List>
                {!loading && wsUserGroups && wsUserGroups.map(data => (
                    <ListItem className={styleSelectedGroup(data.url)} button key={data.id}
                              onClick={() => redirectToGroup(data.id, data.url)}>
                        <Avatar>
                            {
                                data.groupType === TypeGroupEnum.GROUP ?
                                    <FolderIcon/>
                                    :
                                    <AccountCircleIcon/>
                            }
                        </Avatar>
                        <ListItemText
                            style={{marginLeft: "5px"}}
                            primary={
                                <React.Fragment>
                                    <span
                                        className={styleUnreadMessage(data.isLastMessageSeen)}>{data.name}
                                    </span>
                                </React.Fragment>}
                            secondary={
                                <React.Fragment>
                                        <span
                                            className={styleUnreadMessage(data.isLastMessageSeen) + " group-subtitle-color"}
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
                                            {data.lastMessage} <span style={{fontWeight: "bold"}}> · </span><Clock
                                            date={data.lastMessageDate}/>
                                        </span>
                                            {/*<span className={"clrcstm"} style={{fontWeight: "inherit"}}>*/}
                                            {/*   <Clock date={data.lastMessageDate}/>*/}
                                            {/*</span>*/}
                                        </span>
                                </React.Fragment>}
                        />
                    </ListItem>
                ))}
                {
                    loading && <SkeletonLoader/>
                }
            </List>
            {/*<AllUsersDialog closeDialog={handleAddUserAction}*/}
            {/*                doUserDialogAction={createConversation}*/}
            {/*                open={popupOpen}*/}
            {/*                dialogTitleText={"Start conversation with someone"}/>*/}
        </div>
    )
}