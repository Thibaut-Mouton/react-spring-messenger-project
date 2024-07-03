import {Box, Typography} from "@mui/material"
import React from "react"
import {useThemeContext} from "../../context/theme-context"
import {generateColorMode} from "../utils/enable-dark-mode"

export function FooterComponent(): React.JSX.Element {
    const {theme} = useThemeContext()

    return (
        <Box mt={5} display="flex" flexDirection={"column"}>
            <Typography variant="body2" color="inherit" align="center">
                <a className={"clrcstm lnk" + generateColorMode(theme)} target={"_blank"} data-testid="footer-title"
                   href={"https://github.com/Thibaut-Mouton/react-spring-messenger-project"} rel="noreferrer">
                    FastLiteMessage - Open source software
                </a>
                {" | "}
                {new Date().getFullYear()}
            </Typography>
            <Typography variant="caption" color="inherit" align="center">
                <a role={"gcu"} className={"clrcstm lnk" + generateColorMode(theme)} target={"_blank"}
                   href={"#"} rel="noreferrer">
                    GCU
                </a>
            </Typography>
        </Box>
    )
}
