import ClearAllIcon from "@mui/icons-material/ClearAll"
import {Button, FormControlLabel, Skeleton, Switch, Toolbar, Typography} from "@mui/material"
import React, {useContext} from "react"
import {HttpService} from "../../service/http-service"
import {AuthUserContext} from "../../context/AuthContext"

export function HeaderComponent(): React.JSX.Element {
    const {user, setUser} = useContext(AuthUserContext)!
    const {
        authLoading,
    } = {authLoading: true}

    const httpService = new HttpService()

    const theme = "light"
    // useEffect(() => {
    //     setCookie("pref-theme", theme)
    // }, [theme])

    function toggleThemeMode() {
        // toggleTheme()
    }

    async function logoutUser(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.preventDefault()
        await httpService.logout()
        setUser(undefined)
        // dispatch(setAlerts({
        //     alert: {
        //         text: "You log out successfully",
        //         alert: "success",
        //         isOpen: true
        //     }
        // }))
        // history.push("/")
    }

    function generateLoading() {
        return [1, 2, 3, 4].map((index) => (
            <div key={index} style={{margin: "0 10px 0 10px"}}>
                <Skeleton height={51} width={78}/>
            </div>
        ))
    }

    return (
        <>
            <div style={{backgroundColor: "#f6f8fc"}} className={theme}>
                <Toolbar className={"clrcstm"} variant="dense"
                         style={{
                             display: "flex",
                             justifyContent: "space-between",
                         }}>
                    <Typography variant="h6">
                        {/*<RouterLink className={"lnk clrcstm"} to={"/"}>*/}
                        <span style={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap"
                        }}><ClearAllIcon/><span style={{letterSpacing: "1px"}}>FastLiteMessage</span></span>
                        {/*</RouterLink>*/}
                    </Typography>
                    <nav className={"lnk clrcstm mnu"}>
                        {authLoading && generateLoading()}
                        {
                            !authLoading && user &&
                            // <RouterLink className={"lnk clrcstm"} to={`/t/messages/${currentActiveGroup}`}>
                            <Button className={"clrcstm"} variant="outlined"
                                    style={{margin: "8px 12px"}}>
                                Messages
                            </Button>
                            // </RouterLink>
                        }
                        {
                            !authLoading && !user &&
                            // <RouterLink className={"lnk clrcstm"} to={"/login"}>
                            <Button className={"clrcstm"} variant="outlined" style={{margin: "8px 12px"}}>
                                Login
                            </Button>
                            // </RouterLink>
                        }
                        {
                            !authLoading && !user &&
                            // <RouterLink className={"lnk clrcstm"} to={"/register"}>
                            <Button className={"clrcstm"} variant="outlined" style={{margin: "8px 12px"}}>
                                Register
                            </Button>
                            // </RouterLink>
                        }
                        {
                            !authLoading && user &&
                            // <RouterLink className={"lnk clrcstm"} to={"/create"}>
                            <Button className={"clrcstm"} variant="outlined"
                                    style={{margin: "8px 12px"}}>
                                Create group
                            </Button>
                            // </RouterLink>
                        }
                        {
                            !authLoading && user &&
                            <Button className={"clrcstm"} variant="outlined" disabled
                                    style={{margin: "8px 12px"}}>
                                {user?.firstName}
                            </Button>
                        }
                        {
                            !authLoading && user &&
                            <Button className={"clrcstm"} variant="outlined"
                                    onClick={(event) => logoutUser(event)}
                                    style={{margin: "8px 12px"}}>
                                Logout
                            </Button>
                        }
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={theme === "light"}
                                    onChange={() => toggleThemeMode()}
                                    name="checkedB"
                                    color="primary"
                                />
                            }
                            label={
                                theme === "light" ? "Light " : "Dark"
                            }
                        />
                    </nav>
                </Toolbar>
            </div>
        </>
    )
}
