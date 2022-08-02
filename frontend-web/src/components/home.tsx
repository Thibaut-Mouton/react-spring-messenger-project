import { Box, Grid } from "@mui/material"
import React, { useEffect } from "react"
import { Link as RouterLink } from "react-router-dom"
import { generateColorMode } from "./utils/enable-dark-mode"
import { useAuthContext } from "../context/auth-context"
import { useLoaderContext } from "../context/loader-context"
import { useThemeContext } from "../context/theme-context"

export const HomeComponent = (): JSX.Element => {
  const { theme } = useThemeContext()
  const { user } = useAuthContext()
  const { setLoading } = useLoaderContext()

  useEffect(() => {
    document.title = "Home | FLM"
    setLoading(false)
  }, [setLoading])

  return (
    <div className={generateColorMode(theme)}
	    style={{
		 width: "100%",
		 height: "calc(100% - 64px)",
		 textAlign: "center"
	    }}>
	 <Box p={2}>
	   <Grid container spacing={2}>
		<Grid item xs={12}>
		  <h3>Welcome {user ? "back " + user.firstName : "visitor"} !</h3>
		  {
		    user
			 ? <p>You have 0 unread messages</p>
			 : <div>To start using FastLiteMessage, please register <RouterLink
			   className={"lnk clrcstm"} to={"/register"}><span style={{ color: "#005fc7" }}>here</span></RouterLink>
			 </div>
		  }
		</Grid>
	   </Grid>
	 </Box>
    </div>
  )
}
