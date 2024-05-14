import {Box, Card, CardContent, Grid, Typography} from "@mui/material"
import React, {useEffect} from "react"
import {generateColorMode} from "./utils/enable-dark-mode"
import {useThemeContext} from "../context/theme-context"
import {FooterComponent} from "./partials/footer-component"
import {LoginComponent} from "./login/LoginComponent"

export const HomeComponent = (): React.JSX.Element => {
    const {theme} = useThemeContext()

    useEffect(() => {
        document.title = "Home | FLM"
    }, [])

    return (
        <div className={generateColorMode(theme)} style={{height: "100%", display: "flex", alignItems: "center"}}>
            <Grid sx={{m: 2}} container xs={12}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Welcome to FastLiteMessage
                        </Typography>

                        <Typography variant="h6" gutterBottom>
                            Simple, fast and secure
                        </Typography>
                        <Box sx={{display: "flex"}}>
                            <Box display={"flex"} flexDirection={"column"}>
                                <img src={"/assets/icons/landing_logo.svg"} height={"150"} alt={"test svg"}/>
                                <Box>
                                    FastLiteMessage allows to communicate with other people everywhere, create groups, make
                                    serverless video calls in an easy way. Log into your account or register to start
                                    using FastLiteMessage.
                                </Box>
                                <img src={"/assets/icons/landing_logo2.svg"} height={"150"} alt={"test svg"}/>
                            </Box>
                            <LoginComponent/>
                        </Box>
                        <FooterComponent/>
                    </CardContent>
                </Card>
            </Grid>
        </div>
    )
}
