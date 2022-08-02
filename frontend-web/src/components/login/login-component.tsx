import LockIcon from "@mui/icons-material/Lock"
import { Button, Grid, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import { useLoaderContext } from "../../context/loader-context"
import { useThemeContext } from "../../context/theme-context"
import { generateIconColorMode, generateLinkColorMode } from "../utils/enable-dark-mode"
import { FooterComponent } from "../partials/footer-component"
import { CustomTextField } from "../partials/custom-material-textfield"
import { HttpService } from "../../service/http-service"
import { useDispatch } from "react-redux"
import { setAlerts } from "../../reducers"
import { AxiosError } from "axios"

export const LoginComponent: React.FunctionComponent = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const history = useHistory()
  const dispatch = useDispatch()
  const { theme } = useThemeContext()
  const { setLoading } = useLoaderContext()
  const httpService = new HttpService()

  useEffect(() => {
    document.title = "Login | FLM"
  }, [])

  function handleChange (e: any) {
    e.preventDefault()
    switch (e.target.name) {
    case "username":
	 setUsername(e.target.value)
	 break
    case "password":
	 setPassword(e.target.value)
	 break
    default:
	 throw Error("Whoops ! Something went wrong...")
    }
  }

  function submitLogin (event: any) {
    if (event.key === undefined || event.key === "Enter") {
	 if (!username || !password) {
	   return
	 }
	 login()
    }
  }

  const login = async () => {
    setLoading(true)
    try {
	 await httpService.authenticate({
	   username,
	   password
	 })
	 dispatch(setAlerts({
	   alert: {
		text: "You are connected",
		alert: "info",
		isOpen: true
	   }
	 }))
	 history.push("/")
    } catch (err: any) {
	 dispatch(setAlerts({
	   alert: {
		text: err.message,
		alert: "error",
		isOpen: true
	   }
	 }))
	 setUsername("")
	 setPassword("")
    } finally {
	 setLoading(false)
    }
  }

  return (
    <div className={theme}
	    style={{
		 height: "calc(100% - 64px)",
		 width: "100%"
	    }}>
	 <div className={"main-register-form"}>
	   <div style={{
		display: "flex",
		justifyContent: "center"
	   }}>
		<LockIcon fontSize={"large"}
				className={generateIconColorMode(theme)}
		/>
	   </div>
	   <Typography component="h1" variant="h5">
		Sign in
	   </Typography>
	   <div>
		<Grid container spacing={2}>
		  <Grid item xs={12}>
		    <CustomTextField id={"loginUsernameInput"}
						 label={"Username"}
						 name={"username"}
						 value={username}
						 isDarkModeEnable={theme}
						 handleChange={handleChange}
						 isMultiline={false}
						 type={"text"}/>
		  </Grid>
		  <Grid item xs={12}>
		    <CustomTextField id={"loginPasswordInput"}
						 label={"Password"}
						 name={"password"}
						 value={password}
						 isDarkModeEnable={theme}
						 handleChange={handleChange}
						 type={"password"}
						 isMultiline={false}
						 keyUp={submitLogin}
		    />
		  </Grid>
		</Grid>
		<div>
		  <Grid item xs={12}>
		    <Button
			 disabled={username === "" || password === ""}
			 className={"button-register-form"}
			 style={{ marginTop: "15px" }}
			 onClick={(event) => submitLogin(event)}
			 fullWidth
			 variant="contained"
			 color="primary"
		    >
			 Sign in
		    </Button>
		  </Grid>
		</div>
		<Grid container justifyContent={"space-between"}>
		  <Link className={"lnk"}
			   style={{ color: generateLinkColorMode(theme) }}
			   to={"/forgetpassword"}>
		    Forgot your password ?
		  </Link>
		  <Link className={"lnk"}
			   style={{ color: generateLinkColorMode(theme) }}
			   to={"/register"}>
		    Sign up
		  </Link>
		</Grid>
	   </div>
	   <FooterComponent/>
	 </div>
    </div>
  )
}
