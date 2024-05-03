import React, {useContext, useState} from "react"
import LoadingButton from "@mui/lab/LoadingButton"
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined"
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material"
import {HttpGroupService} from "../../service/http-group-service"
import {AlertAction, AlertContext} from "../../context/AlertContext"
import {useNavigate} from "react-router-dom"
import {GroupContext, GroupContextAction} from "../../context/GroupContext"

export function CreateConversationComponent(): React.JSX.Element {
    const [open, setOpen] = useState(false)
    const [groupName, setGroupName] = useState<string>("")
    const [groupCreationLoading, setGroupCreationLoading] = useState<boolean>(false)
    const httpService = new HttpGroupService()
    const {changeGroupState} = useContext(GroupContext)!
    const {dispatch} = useContext(AlertContext)!
    const navigate = useNavigate()

    function handleClickOpen() {
        setOpen(true)
    }

    function handleClose() {
        setOpen(false)
    }

    async function createGroupByName() {
        if (groupName !== "") {
            setGroupCreationLoading(true)
            try {
                const {data} = await httpService.createGroup(groupName)
                dispatch({
                    type: AlertAction.ADD_ALERT,
                    payload: {
                        id: crypto.randomUUID(),
                        isOpen: true,
                        alert: "success",
                        text: `Group "${groupName}" has been created successfully`
                    }
                })
                changeGroupState({type: GroupContextAction.ADD_GROUP, payload: data})
                setOpen(false)
                navigate(`/t/messages/${data.url}`)
            } catch (error) {
                dispatch({
                    type: AlertAction.ADD_ALERT,
                    payload: {
                        id: crypto.randomUUID(),
                        isOpen: true,
                        alert: "error",
                        text: `Cannot create group "${groupName}" : ${error}`
                    }
                })
            } finally {
                setGroupCreationLoading(false)
            }
        }
    }

    function handleChange(event: any) {
        event.preventDefault()
        setGroupName(event.target.value)
    }

    function submitGroupCreation(event: any) {
        if (event.key === undefined || event.key === "Enter") {
            if (groupName === "") {
                return
            }
            createGroupByName()
        }
    }


    return (
        <>
            <Button onClick={handleClickOpen} variant="outlined" startIcon={<NoteAddOutlinedIcon/>} size={"large"}>
                New conversation
            </Button>
            <Dialog
                open={open}
                fullWidth={true}
                maxWidth={"sm"}
                onClose={handleClose}
                PaperProps={{
                    component: "form",
                }}
            >
                <DialogTitle>New conversation</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="groupName"
                        label="New group name"
                        type="text"
                        value={groupName}
                        onChange={handleChange}
                        onKeyDown={submitGroupCreation}
                        fullWidth
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <LoadingButton loading={groupCreationLoading} onClick={createGroupByName}>Create</LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    )
}
