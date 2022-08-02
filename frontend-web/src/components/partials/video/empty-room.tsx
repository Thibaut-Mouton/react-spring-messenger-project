import React from "react"
import NoMeetingRoomIcon from "@mui/icons-material/NoMeetingRoom"
import { Box, Button } from "@mui/material"
import SendIcon from "@mui/icons-material/Send"
import { Link as RouterLink } from "react-router-dom"

export const EmptyRoom = (): JSX.Element => {
  return (
    <Box display={"flex"} justifyContent={"center"}>
	 <Box m={1} display={"flex"} flexDirection={"column"} textAlign={"center"} justifyContent={"center"}>
	   <Box>
		<NoMeetingRoomIcon fontSize={"large"}/>
	   </Box>
	   <h2>No meeting room were found with this URL</h2>
	   <h3>Please check your room link and try again</h3>
	   <RouterLink className={"lnk clrcstm"} to={"/"}>
		<Button variant={"outlined"} startIcon={<SendIcon/>}>
		  Go Back
		</Button>
	   </RouterLink>
	 </Box>
    </Box>
  )
}
