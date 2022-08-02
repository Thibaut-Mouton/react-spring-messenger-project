import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import CloseIcon from "@mui/icons-material/Close"
import { Alert, Button, Collapse, Grid, IconButton, Typography } from "@mui/material"
import React from "react"
import { Link, useHistory } from "react-router-dom"
import { useLoaderContext } from "../../context/loader-context"
import { useThemeContext } from "../../context/theme-context"
import { HttpService } from "../../service/http-service"
import "./register-form.css"
import { CustomTextField } from "../partials/custom-material-textfield"
import { generateColorMode, generateIconColorMode, generateLinkColorMode } from "../utils/enable-dark-mode"
import { FooterComponent } from "../partials/footer-component"
import { useDispatch } from "react-redux"
import { setAlerts } from "../../reducers"

export const RegisterFormComponent = (): JSX.Element => {
  const { theme } = useThemeContext()
  const history = useHistory()
  const { setLoading } = useLoaderContext()
  const [username, setUsername] = React.useState<string>("")
  const [lastName, setLastName] = React.useState<string>("")
  const [email, setEmail] = React.useState<string>("")
  const [password, setPassword] = React.useState<string>("")
  const [repeatPassword, setRepeatPassword] = React.useState<string>("")
  const [noMatchPasswordsError, setNoMatchPasswordsError] = React.useState<boolean>(false)
  const [isEmailNotValid, setEmailNotValid] = React.useState<boolean>(false)
  const [displayFormValidationError, setDisplayFormValidationError] = React.useState<boolean>(false)
  const [displayEmailNotValid, setDisplayEmailNotValid] = React.useState<boolean>(false)
  const [errorArray, setErrorArray] = React.useState<string[]>([])
  const refWrapper = React.useRef()
  const dispatch = useDispatch()
  const httpService = new HttpService()

  function checkFormValidation (): string[] {
    const validationErrors: string[] = []
    if (username === "") {
	 validationErrors.push("Username is required")
    }
    if (lastName === "") {
	 validationErrors.push("Last name is required")
    }
    if (isEmailNotValid) {
	 validationErrors.push("Email is not valid")
    }
    if (password === "") {
	 validationErrors.push("Password is required")
    }
    if (repeatPassword === "") {
	 validationErrors.push("Please type again your password")
    }
    if (noMatchPasswordsError) {
	 validationErrors.push("Password does not match")
    }
    setErrorArray(validationErrors)
    return validationErrors
  }

  async function registerUser (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault()
    setLoading(true)
    errorArray.length = 0
    const result = checkFormValidation()
    if (result.length === 0) {
	 try {
	   await httpService.createUser(username, lastName, email, password)
	   setLoading(false)
	   dispatch(setAlerts({
		alert: {
		  text: "Account created successfully",
		  alert: "success",
		  isOpen: true
		}
	   }))
	   history.push("/")
	 } catch (err: any) {
	   if (err.response !== undefined) {
		errorArray.push(err.response.data)
	   }
	   dispatch(setAlerts({
		alert: {
		  text: "Error during registration, please see above errors",
		  alert: "error",
		  isOpen: true
		}
	   }))
	 } finally {
	   setDisplayFormValidationError(true)
	   setLoading(false)
	 }
    }
  }

  function closeAlert (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, code: string) {
    event.preventDefault()
    switch (code) {
    case "arrayErrors":
	 setDisplayFormValidationError(false)
	 break
    case "email":
	 setDisplayEmailNotValid(false)
	 break
    case "repeatPassword":
	 setNoMatchPasswordsError(false)
	 break
    default:
	 throw new Error("Error")
    }
  }

  function handleChange (e: any) {
    e.preventDefault()
    switch (e.target.name) {
    case "firstName":
	 setUsername(e.target.value)
	 break
    case "lastName":
	 setLastName(e.target.value)
	 break
    case "email":
	 setEmail(e.target.value)
	 setDisplayEmailNotValid(true)
	 setEmailNotValid(true)
	 if (validateEmail(e.target.value)) {
	   setDisplayEmailNotValid(false)
	   setEmailNotValid(false)
	 }
	 break
    case "password":
	 setPassword(e.target.value)
	 break
    case "repeatPassword":
	 setRepeatPassword(e.target.value)
	 if (password !== e.target.value) {
	   setNoMatchPasswordsError(true)
	 } else {
	   setNoMatchPasswordsError(false)
	 }
	 break
    default:
	 throw Error
    }
  }

  function validateEmail (email: string) {
    const re = /\S+@\S+\.\S+/
    return re.test(String(email).toLowerCase())
  }

  return (
    <div className={generateColorMode(theme)}
	    style={{
		 height: "calc(100% - 64px)",
		 width: "100%"
	    }}>
	 <div className={"main-register-form"}>
	   <div style={{
		display: "flex",
		justifyContent: "center"
	   }}>
		<AccountCircleIcon fontSize={"large"}
					    className={generateIconColorMode(theme)}/>
	   </div>
	   <div style={{ textAlign: "center" }}>
		<Typography component="h1" variant="h5">
		  Sign up
		</Typography>
	   </div>
	   <form style={{ marginTop: "24px" }}>
		<Grid container spacing={2}>
		  <Grid item xs={12}>
		    {
			 <Collapse ref={refWrapper} in={displayFormValidationError}
					 timeout={500}>
			   <Alert action={
				<IconButton
				  aria-label="close"
				  color="inherit"
				  size="small"
				  onClick={(e) => closeAlert(e, "arrayErrors")}
				>
				  <CloseIcon fontSize="inherit"/>
				</IconButton>
			   } severity="warning">
				<ul>
				  {errorArray.map((error: string, index: number) => (
				    <li key={index}>
					 {error}
				    </li>
				  ))
				  }
				</ul>
			   </Alert>
			 </Collapse>
		    }
		  </Grid>
		  <Grid item xs={12} sm={6}>
		    <CustomTextField id={"firstNameInput"}
						 label={"First Name"}
						 name={"firstName"}
						 value={username}
						 handleChange={handleChange}
						 isMultiline={false}
						 type={"text"} isDarkModeEnable={theme}/>
		  </Grid>
		  <Grid item xs={12} sm={6}>
		    <CustomTextField id={"lastNameInput"}
						 label={"Last Name"}
						 name={"lastName"}
						 value={lastName}
						 handleChange={handleChange}
						 isMultiline={false}
						 type={"text"} isDarkModeEnable={theme}/>
		  </Grid>
		  <Grid item xs={12}>
		    <CustomTextField id={"emailInput"}
						 label={"Email Address"}
						 name={"email"}
						 value={email}
						 handleChange={handleChange}
						 isMultiline={false}
						 type={"text"} isDarkModeEnable={theme}/>
		    {
			 <Collapse in={displayEmailNotValid} timeout={1500}>
			   <Alert action={
				<IconButton
				  aria-label="close"
				  color="inherit"
				  size="small"
				  onClick={(e) => closeAlert(e, "email")}
				>
				  <CloseIcon fontSize="inherit"/>
				</IconButton>
			   } severity="warning">Email is not valid</Alert>
			 </Collapse>
		    }
		  </Grid>
		  <Grid item xs={12}>
		    <CustomTextField id={"passwordInput"}
						 label={"Password"}
						 name={"password"}
						 handleChange={handleChange}
						 value={password}
						 isMultiline={false}
						 type={"password"}
						 isDarkModeEnable={theme}/>
		  </Grid>
		  <Grid item xs={12}>
		    <CustomTextField id={"repeatPasswordInput"}
						 label={"Repeat password"}
						 name={"repeatPassword"}
						 handleChange={handleChange}
						 value={repeatPassword}
						 isMultiline={false}
						 type={"password"}
						 isDarkModeEnable={theme}/>
		    {
			 <Collapse in={noMatchPasswordsError} timeout={1500}>
			   <Alert action={
				<IconButton
				  aria-label="close"
				  color="inherit"
				  size="small"
				  onClick={(e) => closeAlert(e, "repeatPassword")}
				>
				  <CloseIcon fontSize="inherit"/>
				</IconButton>
			   } severity="error">Passwords does not match</Alert>
			 </Collapse>
		    }
		  </Grid>
		</Grid>
		<div style={{ marginTop: "10px" }}>
		  <Button
		    disabled={username === "" || password === "" || lastName === "" || repeatPassword === "" || email === ""}
		    className={"button-register-form clrcstm"}
		    type="submit"
		    fullWidth
		    variant="contained"
		    color="primary"
		    onClick={(e) => registerUser(e)}
		  >
		    Sign Up
		  </Button>
		</div>
		<Grid container justifyContent="flex-end">
		  <Grid item>
		    <Link className={"lnk"}
				style={{ color: generateLinkColorMode(theme) }}
				to={"/login"}>
			 Already have an account? Sign in
		    </Link>
		  </Grid>
		</Grid>
	   </form>
	 </div>
	 <FooterComponent/>
    </div>
  )
}
