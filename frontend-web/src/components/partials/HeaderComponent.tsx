import ClearAllIcon from "@mui/icons-material/ClearAll"
import {TextField, Toolbar, Typography} from "@mui/material"
import React, {useContext} from "react"
import {AccountMenu} from "../user-account/UseAccountComponent"
import {UserContext} from "../../context/UserContext"

export function HeaderComponent(): React.JSX.Element {
    const theme = "light"
    const {user} = useContext(UserContext)!
    // useEffect(() => {
    //     setCookie("pref-theme", theme)
    // }, [theme])

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
                    {user && <AccountMenu/>}
                </Toolbar>
            </div>
        </>
    )
}
