import React from "react"
import { Box, IconButton } from "@mui/material"
import CallEndIcon from "@mui/icons-material/CallEnd"

export const HangUpControl: React.FunctionComponent<{ hangOnRoom: () => void }> = ({ hangOnRoom }) => {

  return (
    <Box m={1}>
	 <IconButton style={{ backgroundColor: "#b90000" }}
			   onClick={() => hangOnRoom()}>
	   <CallEndIcon style={{ color: "#d2d2d2" }}/>
	 </IconButton>
    </Box>
  )
}
