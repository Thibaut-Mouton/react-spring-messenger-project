import React from "react"
import { Box, Button } from "@mui/material"
import SendIcon from "@mui/icons-material/Send"
import { Link as RouterLink } from "react-router-dom"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"

export const CallEnded = (): JSX.Element => {
  return (
    <Box display={"flex"} justifyContent={"center"}>
	 <Box m={1} display={"flex"} flexDirection={"column"} textAlign={"center"} justifyContent={"center"}>
	   <Box>
		<CheckCircleOutlineIcon fontSize={"large"}/>
	   </Box>
	   <h2>You leave the room meeting</h2>
	   <RouterLink className={"lnk clrcstm"} to={"/"}>
		<Button variant={"outlined"} startIcon={<SendIcon/>}>
		  Go Back
		</Button>
	   </RouterLink>
	 </Box>
    </Box>
  )
}
