import React from "react"
import {Box, TextField, Typography} from "@mui/material"

export function ResetPasswordComponent(): React.JSX.Element {
    return <Box m={2}>
        <Typography variant="h6" color="inherit">
            Forgot your password ? Type your mail below. We will send to you a recovery mail.
        </Typography>
        <TextField variant={"outlined"} fullWidth={true} label={"You mail"}/>
    </Box>
}