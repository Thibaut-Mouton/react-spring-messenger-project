import LockIcon from "@mui/icons-material/Lock"
import {Button, Grid, TextField, Typography} from "@mui/material"
import React, {useContext, useEffect, useState} from "react"
import {Link, useNavigate} from "react-router-dom"
import {useThemeContext} from "../../context/theme-context"
import {generateIconColorMode, generateLinkColorMode} from "../utils/enable-dark-mode"
import {HttpGroupService} from "../../service/http-group-service"
import {LoaderContext} from "../../context/loader-context"
import {AlertAction, AlertContext} from "../../context/AlertContext"

export function LoginComponent(): React.JSX.Element {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()
    const {dispatch} = useContext(AlertContext)!
    const {setLoading} = useContext(LoaderContext)
    const {theme} = useThemeContext()
    const httpService = new HttpGroupService()

    useEffect(() => {
        document.title = "Login | FLM"
    }, [])

    function handleChange(e: any) {
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

    function submitLogin(event: any) {
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
            navigate("/t/messages")
        } catch (err: any) {
            dispatch({
                type: AlertAction.ADD_ALERT,
                payload: {
                    id: crypto.randomUUID(),
                    text: err.message,
                    alert: "error",
                    isOpen: true
                }
            })
            setUsername("")
            setPassword("")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={theme}
             style={{
                 height: "100%",
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
                            <TextField label={"Username"}
                                       name={"username"}
                                       value={username}
                                       fullWidth={true}
                                       variant="outlined"
                                       onChange={handleChange}
                                       multiline={false}
                                       type={"text"}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label={"Password"}
                                       name={"password"}
                                       value={password}
                                       fullWidth={true}
                                       onChange={handleChange}
                                       type={"password"}
                                       multiline={false}
                                       onKeyDown={submitLogin}
                            />
                        </Grid>
                    </Grid>
                    <div>
                        <Grid item xs={12}>
                            <Button
                                disabled={username === "" || password === ""}
                                className={"button-register-form"}
                                style={{marginTop: "15px"}}
                                onClick={(event) => submitLogin(event)}
                                fullWidth
                                variant="outlined"
                                color="primary"
                            >
                                Sign in
                            </Button>
                        </Grid>
                    </div>
                    <Grid container justifyContent={"space-between"}>
                        <Link className={"lnk"}
                              style={{color: generateLinkColorMode(theme)}}
                              to={"/forgetpassword"}>
                            Forgot your password ?
                        </Link>
                        <Link className={"lnk"}
                              style={{color: generateLinkColorMode(theme)}}
                              to={"/register"}>
                            Sign up
                        </Link>
                    </Grid>
                </div>
            </div>
        </div>
    )
}
