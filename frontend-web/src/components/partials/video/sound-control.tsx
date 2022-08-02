import React, { useState } from "react"
import { Box, IconButton } from "@mui/material"
import MicIcon from "@mui/icons-material/Mic"
import MicOffIcon from "@mui/icons-material/MicOff"

export const SoundControl = (): JSX.Element => {
  const [isMicMuted, setMicMuted] = useState<boolean>(false)

  return (
    <Box m={1}>
	 <IconButton style={{ backgroundColor: isMicMuted ? "#b90000" : "#d2d2d2" }}
			   onClick={() => setMicMuted(!isMicMuted)}>
	   {isMicMuted ? <MicOffIcon style={{ color: "#d2d2d2" }}/> :
		<MicIcon style={{ color: "#525252" }}/>
	   }
	 </IconButton>
    </Box>
  )
}
