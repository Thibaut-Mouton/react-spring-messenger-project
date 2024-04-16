import ClearAllIcon from "@mui/icons-material/ClearAll"
import {TextField, Toolbar, Typography} from "@mui/material"
import React from "react"
import {AccountMenu} from "../user-account/UseAccountComponent"

export function HeaderComponent(): React.JSX.Element {
    const theme = "light"
    // useEffect(() => {
    //     setCookie("pref-theme", theme)
    // }, [theme])

    // async function logoutUser(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    //     event.preventDefault()
    //     await httpService.logout()
    //     setUser(undefined)
    //     dispatch(setAlerts({
    //         alert: {
    //             text: "You log out successfully",
    //             alert: "success",
    //             isOpen: true
    //         }
    //     }))
    //     history.push("/")
    // }

    return (
        <>
            <div style={{backgroundColor: "#f6f8fc"}} className={theme}>
                <Toolbar className={"clrcstm"} style={{
                    display: "flex",
                    justifyContent: "space-between",
                }}>
                    <Typography variant="h6">
                        <span style={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap"
                        }}><ClearAllIcon/><span style={{letterSpacing: "1px"}}>FastLiteMessage</span></span>
                    </Typography>
                    <TextField style={{width: "50%"}} variant={"outlined"} size={"small"}
                               label={"Rechercher dans les discussions"}/>
                    <AccountMenu/>
                </Toolbar>
            </div>
        </>
    )
}
