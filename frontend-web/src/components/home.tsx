import {Box, Card, CardContent, Grid, Typography} from "@mui/material"
import React, {useContext, useEffect} from "react"
import {generateColorMode} from "./utils/enable-dark-mode"
import {useThemeContext} from "../context/theme-context"
import {FooterComponent} from "./partials/footer-component"
import {LoginComponent} from "./login/LoginComponent"
import {UserContext} from "../context/UserContext"

export const HomeComponent = (): React.JSX.Element => {
    const {theme} = useThemeContext()
    const {user} = useContext(UserContext)!

    useEffect(() => {
        document.title = "Home | FLM"
    }, [])

    return (
        <div className={generateColorMode(theme)}
             style={{
                 width: "100%",
                 height: "calc(100% - 64px)",
                 textAlign: "center"
             }}>
            <Box p={2}>
                <Grid container>
                    <Grid item xs={6}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Welcome to FastLiteMessage {user?.firstName}
                                </Typography>

                                <img src={"/assets/icons/landing_logo.svg"} height={"300"} alt={"test svg"}/>

                                <Typography variant="h5" gutterBottom>
                                    Simple, fast and secure
                                </Typography>
                                <div>FastLiteMessage allow to communicate with other people, create groups, make
                                    serverless video calls in an easy way. Log into your account or register to start
                                    using FastLiteMessage.
                                </div>
                                <FooterComponent/>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6}>
                        <LoginComponent/>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}
