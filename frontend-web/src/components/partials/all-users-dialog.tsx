import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import { Avatar, Dialog, DialogTitle, List, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material"
import React from "react"
import { useAuthContext } from "../../context/auth-context"
import { useThemeContext } from "../../context/theme-context"
import { GroupUserModel } from "../../interface-contract/group-user-model"
import { generateIconColorMode } from "../utils/enable-dark-mode"

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
  const { theme } = useThemeContext()
  const { user } = useAuthContext()

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
		  <ListItemButton key={users.userId} disabled={users.userId === user?.id}
					   onClick={() => action(users.userId)}>
		    <ListItemAvatar>
			 <Avatar>
			   <AccountCircleIcon
				style={{ color: generateIconColorMode(theme) }}/>
			 </Avatar>
		    </ListItemAvatar>
		    <ListItemText primary={
			 <React.Fragment>
									<span style={{
									  display: "flex",
									  justifyContent: "space-around"
									}}>
										{users.firstName + " " + users.lastName}
									  {
									    users.userId === user?.id && " (You)"
									  }
									</span>
			 </React.Fragment>
		    }
		    />
		  </ListItemButton>
		))
	   }
	 </List>
    </Dialog>
  )
}
