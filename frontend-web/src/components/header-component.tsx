import React, {useEffect} from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ClearAllIcon from '@material-ui/icons/ClearAll';
import {Link as RouterLink, useHistory} from "react-router-dom";
import Button from "@material-ui/core/Button";
import AuthService from "../service/auth-service";
import {useThemeContext} from "../context/theme-context";
import {FormControlLabel, Switch} from "@material-ui/core";
import {useAuthContext} from "../context/auth-context";
import {AxiosResponse} from "axios";
import UserModel from "../model/user-model";
import {useAlertContext} from "../context/alert-context";
import UUIDv4 from "../utils/uuid-generator";
import {FeedbackModel} from "../model/feedback-model";
import {useCookies} from "react-cookie";

interface HeaderComponentType {
}

export const HeaderComponent: React.FunctionComponent<HeaderComponentType> = () => {
    const history = useHistory();
    const {user, setUser} = useAuthContext();
    const {theme, toggleTheme} = useThemeContext();
    const {alerts, setAlerts} = useAlertContext();
    const [cookie, setCookie] = useCookies();

    useEffect(() => {
        new AuthService().testRoute().then((res: AxiosResponse<UserModel>) => {
            setUser(res.data)
        }).catch((err) => {
            console.log(err)
        })
    }, [setUser])


    useEffect(() => {
        setCookie("pref-theme", theme)
    }, [theme])

    function toggleThemeMode() {
        toggleTheme()
    }

    function dispatchLogout(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.preventDefault();
        new AuthService().logout().then(() => {
            setUser(undefined);
            history.push("/");
            const temp = [...alerts]
            temp.push(new FeedbackModel(UUIDv4(), "You log out successfully", "success", true));
            setAlerts(temp)
        }).catch((err: any) => {
            console.log(cookie)
            console.log(err)
        })
    }

    return (
        <div className={theme}>
            <Toolbar className={"clrcstm"}
                     style={{flexWrap: "wrap", boxSizing: "border-box", borderBottom: "0.5px solid #C8C8C8"}}>
                <Typography variant="h6" style={{flexGrow: 1}}>
                    <RouterLink className={"lnk clrcstm"} to={"/"}>
                        <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap'
                        }}><ClearAllIcon/><span style={{letterSpacing: "1px"}}>FastLiteMessage</span></span>
                    </RouterLink>
                </Typography>
                <nav className={"lnk clrcstm"}>
                    {
                        user &&
                        <RouterLink className={"lnk clrcstm"} to={"/t/messages/" + user.firstGroupUrl}>
                            <Button className={"clrcstm"} variant="outlined"
                                    style={{margin: "8px 12px"}}>
                                Messages
                            </Button>
                        </RouterLink>
                    }
                    {
                        !user &&
                        <RouterLink className={"lnk clrcstm"} to={"/login"}>
                            <Button className={"clrcstm"} variant="outlined" style={{margin: "8px 12px"}}>
                                Login
                            </Button>
                        </RouterLink>
                    }
                    {
                        !user &&
                        <RouterLink className={"lnk clrcstm"} to={"/register"}>
                            <Button className={"clrcstm"} variant="outlined" style={{margin: "8px 12px"}}>
                                Register
                            </Button>
                        </RouterLink>
                    }
                    {
                        user &&
                        <RouterLink className={"lnk clrcstm"} to={"/create"}>
                            <Button className={"clrcstm"} variant="outlined"
                                    style={{margin: "8px 12px"}}>
                                Create group
                            </Button>
                        </RouterLink>
                    }
                    {
                        user &&
                        <Button className={"clrcstm"} variant="outlined" disabled
                                style={{margin: "8px 12px"}}>
                            {user?.username}
                        </Button>
                    }

                    {
                        user &&
                        <RouterLink className={"lnk clrcstm"} to={"#"}>
                            <Button className={"clrcstm"} variant="outlined"
                                    onClick={(event) => dispatchLogout(event)}
                                    style={{margin: "8px 12px"}}>
                                Logout
                            </Button>
                        </RouterLink>
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
    )
}