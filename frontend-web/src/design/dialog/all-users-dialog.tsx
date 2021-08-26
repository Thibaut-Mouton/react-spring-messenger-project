import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {generateIconColorMode} from "../style/enable-dark-mode";
import GroupUserModel from "../../model/group-user-model";
import {useThemeContext} from "../../context/theme-context";
import {useAuthContext} from "../../context/auth-context";

interface AllUsersDialogType {
    setOpen: (open: boolean) => void
    usersList: GroupUserModel[]
    open: boolean
    dialogTitle: string
    action: (userId: string | number) => void
}


export const AllUsersDialog: React.FunctionComponent<AllUsersDialogType> = ({
                                                                                usersList,
                                                                                open,
                                                                                setOpen,
                                                                                dialogTitle,
                                                                                action
                                                                            }) => {
    const {theme} = useThemeContext();
    const {user} = useAuthContext();

    return (
        <Dialog
            onClose={(event, reason) => {
                if (reason === "backdropClick") setOpen(false)
            }}
            scroll={"paper"}
            aria-labelledby="simple-dialog-title"
            fullWidth
            open={open}>
            <DialogTitle id="simple-dialog-title">{dialogTitle}</DialogTitle>
            <List>
                {
                    usersList && usersList.map((users) => (
                        <ListItem button key={users.userId} disabled={users.userId === user?.id}
                                  onClick={() => action(users.userId)}>
                            <ListItemAvatar>
                                <Avatar>
                                    <AccountCircleIcon
                                        style={{color: generateIconColorMode(theme)}}/>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={
                                <React.Fragment>
                                        <span style={{display: "flex", justifyContent: "space-around"}}>
                                            {users.firstName + " " + users.lastName}
                                            {
                                                users.userId === user?.id && " (You)"
                                            }
                                        </span>
                                </React.Fragment>
                            }
                            />
                        </ListItem>
                    ))
                }
            </List>
        </Dialog>
    )
}
