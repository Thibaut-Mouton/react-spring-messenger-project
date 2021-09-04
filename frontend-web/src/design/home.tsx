import React, {useEffect} from "react";
import {generateColorMode} from "./style/enable-dark-mode";
import {useThemeContext} from "../context/theme-context";
import {Box, Grid} from "@material-ui/core";
import {useAuthContext} from "../context/auth-context";
import {Link as RouterLink} from "react-router-dom";

export const HomeComponent = () => {
    const {theme} = useThemeContext();
    const {user} = useAuthContext();

    useEffect(() => {
        document.title = 'Home | FLM'
    }, []);

    return (
        <div className={generateColorMode(theme)}
             style={{width: "100%", height: "calc(100% - 64px)", textAlign: "center"}}>
            <Box p={2}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <h3>Welcome {user ? 'back ' + user.username : 'visitor'} !</h3>
                        {
                            user ?
                                <p>You have 0 unread messages</p>
                                :
                                <div>To start using FastLiteMessage, please register <RouterLink
                                    className={"lnk clrcstm"} to={"/register"}><span style={{color: "#005fc7"}}>here</span></RouterLink>
                                </div>
                        }
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}