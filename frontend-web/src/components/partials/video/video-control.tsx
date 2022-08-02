import React, { useState } from "react"
import { Box, IconButton } from "@mui/material"
import VideocamIcon from "@mui/icons-material/Videocam"
import VideocamOffIcon from "@mui/icons-material/VideocamOff"

export const VideoControl: React.FunctionComponent<{ changeVideoStatus: (stopVideo: boolean) => void }> = ({ changeVideoStatus }) => {
	const [isWebCamOff, setWebCam] = useState<boolean>(false)

	const stopVideo = () => {
		if (isWebCamOff) {
			setWebCam(false)
			changeVideoStatus(false)
		} else {
			setWebCam(true)
			changeVideoStatus(true)
		}
	}

	return (
		<Box m={1}>
			<IconButton style={{ backgroundColor: isWebCamOff ? "#b90000" : "#d2d2d2" }}
				onClick={() => stopVideo()}>
				{isWebCamOff ? <VideocamOffIcon style={{ color: "#d2d2d2" }}/> :
					<VideocamIcon style={{ color: "#525252" }}/>
				}
			</IconButton>
		</Box>
	)
}
