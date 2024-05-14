import * as React from "react"
import {useContext} from "react"
import Box from "@mui/material/Box"
import Avatar from "@mui/material/Avatar"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import Settings from "@mui/icons-material/Settings"
import Logout from "@mui/icons-material/Logout"
import {HttpGroupService} from "../../service/http-group-service"
import {AlertAction, AlertContext} from "../../context/AlertContext"
import {capitalize} from "@mui/material"
import {UserContext} from "../../context/UserContext"
import {useNavigate} from "react-router-dom"
import {LoaderContext} from "../../context/loader-context"

export function AccountMenu() {
    const {dispatch} = useContext(AlertContext)!
    const {user} = useContext(UserContext)!
    const {setLoading} = useContext(LoaderContext)
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    function getUserFullName() {
        const firstName = user?.firstName
        const lastName = user?.lastName
        return `${firstName} ${lastName}`
    }

    function getUserInitials() {
        const firstName = capitalize((user?.firstName || "").charAt(0))
        const lastName = capitalize((user?.lastName || "").charAt(0))
        return `${firstName}${lastName}`
    }

    async function logout() {
        setLoading(true)
        const http = new HttpGroupService()
        try {
            await http.logout()
            dispatch({
                type: AlertAction.ADD_ALERT,
                payload: {
                    alert: "success",
                    id: crypto.randomUUID(),
                    isOpen: true,
                    text: "You have successfully logged out"
                }
            })
            navigate("/login")
        } catch (error) {
            dispatch({
                type: AlertAction.ADD_ALERT,
                payload: {
                    alert: "error",
                    id: crypto.randomUUID(),
                    isOpen: true,
                    text: "Cannot perform logout. Unexpected error."
                }
            })
        } finally {
            handleClose()
            setLoading(false)
        }

    }

    return (
        <React.Fragment>
            <Box sx={{display: "flex", alignItems: "center", textAlign: "center"}}>
                <Tooltip title="Account settings">
                    <IconButton
                        onClick={handleClick}
                        sx={{ml: 2}}
                        aria-controls={open ? "account-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                    >
                        <Avatar>{getUserInitials()}</Avatar>
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        "&::before": {
                            content: "\"\"",
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{horizontal: "right", vertical: "top"}}
                anchorOrigin={{horizontal: "right", vertical: "bottom"}}
            >
                <MenuItem onClick={handleClose}>
                    <Avatar/> {getUserFullName()}
                </MenuItem>
                <Divider/>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <Settings fontSize="small"/>
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <MenuItem onClick={logout}>
                    <ListItemIcon>
                        <Logout fontSize="small"/>
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </React.Fragment>
    )
}
