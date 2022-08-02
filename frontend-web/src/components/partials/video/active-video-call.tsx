import React from "react"
import { Box, Button, Icon } from "@mui/material"

export const ActiveVideoCall: React.FunctionComponent<{ isAnyCallActive: boolean }> = ({ isAnyCallActive }): JSX.Element => {

  return (
    <>
	 {
	   isAnyCallActive &&
		  <Box style={{
		  borderRadius: "5px",
		  display: "flex",
		  padding: "1px 6px 1px 3px",
		  alignItems: "center",
		  flexWrap: "wrap",
		}}>
			  <Button
				  style={{
				borderColor: "#a9a9a9",
				textTransform: "none"
			   }} size={"small"} variant={"outlined"}
				  startIcon={<Icon style={{
				display: "contents"
			   }}>
				<img src={"/assets/icons/live.svg"} height={"24px"}
					width={"18px"} alt={"live-icon"}/>
			   </Icon>}>
	   <span style={{
		fontSize: "14px",
		paddingLeft: "8px"
	   }}>Call in progress</span>
			  </Button>
		  </Box>
	 }
    </>
  )
}
