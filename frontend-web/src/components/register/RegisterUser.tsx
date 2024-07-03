import React, {useContext} from "react"
import CloseIcon from "@mui/icons-material/Close"
import {Alert, Button, Collapse, Grid, IconButton, TextField, Typography} from "@mui/material"
import {Link} from "react-router-dom"
import {useThemeContext} from "../../context/theme-context"
import {HttpGroupService} from "../../service/http-group-service"
import "./register-form.css"
import {generateLinkColorMode} from "../utils/enable-dark-mode"
import {LoaderContext} from "../../context/loader-context"
import {AlertAction, AlertContext} from "../../context/AlertContext"

export function RegisterUserComponent(): React.JSX.Element {
    const {theme} = useThemeContext()
    const {dispatch} = useContext(AlertContext)!
    const {loading, setLoading} = useContext(LoaderContext)
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
    const httpService = new HttpGroupService()

    function checkFormValidation(): string[] {
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

    async function registerUser(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.preventDefault()
        setLoading(true)
        errorArray.length = 0
        const result = checkFormValidation()
        if (result.length === 0) {
            try {
                await httpService.createUser(username, lastName, email, password)
                dispatch({
                    type: AlertAction.ADD_ALERT,
                    payload: {
                        alert: "success",
                        id: crypto.randomUUID(),
                        isOpen: true,
                        text: "Account created successfully. You can now sign in."
                    }
                })
            } catch (err: any) {
                if (err.response !== undefined) {
                    errorArray.push(err.response.data)
                }
                dispatch({
                    type: AlertAction.ADD_ALERT,
                    payload: {
                        alert: "error",
                        id: crypto.randomUUID(),
                        isOpen: true,
                        text: "Error during registration, please see above errors"
                    }
                })
            } finally {
                setDisplayFormValidationError(true)
                setLoading(false)
            }
        }
    }

    function closeAlert(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, code: string) {
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

    function handleChange(e: any) {
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

    function validateEmail(email: string) {
        const re = /\S+@\S+\.\S+/
        return re.test(String(email).toLowerCase())
    }

    return (
        <div className={theme}
             style={{
                 height: "100%",
                 width: "100%",
                 display: "flex",
                 justifyContent: "center",
                 alignItems: "center"
             }}>
            <Grid sx={{m: 2}} container xs={8}>
                <div className={"main-register-form"}>
                    <div style={{textAlign: "center"}}>
                        <Typography component="h1" variant="h5">
                            Sign up
                        </Typography>
                    </div>
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
                            <TextField id={"firstNameInput"}
                                       label={"First Name"}
                                       name={"firstName"}
                                       fullWidth
                                       value={username}
                                       onChange={handleChange}
                                       type={"text"}/>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField id={"lastNameInput"}
                                       label={"Last Name"}
                                       fullWidth
                                       name={"lastName"}
                                       value={lastName}
                                       onChange={handleChange}
                                       type={"text"}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField id={"emailInput"}
                                       fullWidth
                                       error={displayEmailNotValid}
                                       helperText={displayEmailNotValid ? "mail is not valid" : ""}
                                       label={"Email Address"}
                                       name={"email"}
                                       value={email}
                                       onChange={handleChange}
                                       type={"text"}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField id={"passwordInput"}
                                       label={"Password"}
                                       fullWidth
                                       name={"password"}
                                       onChange={handleChange}
                                       value={password}
                                       type={"password"}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField id={"repeatPasswordInput"}
                                       label={"Repeat password"}
                                       fullWidth
                                       error={noMatchPasswordsError}
                                       name={"repeatPassword"}
                                       onChange={handleChange}
                                       value={repeatPassword}
                                       multiline={false}
                                       helperText={noMatchPasswordsError ? "passwords does not match" : ""}
                                       type={"password"}
                            />
                        </Grid>
                    </Grid>
                    <div style={{marginTop: "10px"}}>
                        <Button
                            disabled={username === "" || password === "" || lastName === "" || repeatPassword === "" || email === "" || loading}
                            className={"button-register-form clrcstm"}
                            fullWidth
                            variant="outlined"
                            color="primary"
                            onClick={(e) => registerUser(e)}
                        >
                            Sign Up
                        </Button>
                    </div>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link className={"lnk"}
                                  style={{color: generateLinkColorMode(theme)}}
                                  to={"/login"}>
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </div>
            </Grid>
        </div>
    )
}
