import React from 'react';
import Button from '@material-ui/core/Button';
import {Link} from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Typography from '@material-ui/core/Typography';
import AuthService from "../../service/auth-service";
import Alert from "@material-ui/lab/Alert";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import "./register-form.css";
import {generateColorMode, generateIconColorMode, generateLinkColorMode} from "../style/enable-dark-mode";
import {CustomTextField} from "../partials/custom-material-textfield";
import {useThemeContext} from "../../context/theme-context";

export const RegisterFormComponent = () => {
    const {theme} = useThemeContext();
    const [username, setUsername] = React.useState<string>("");
    const [lastName, setLastName] = React.useState<string>("");
    const [email, setEmail] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const [repeatPassword, setRepeatPassword] = React.useState<string>("");
    const refWrapper = React.useRef();


    const [noMatchPasswordsError, setNoMatchPasswordsError] = React.useState<boolean>(false);
    const [isEmailNotValid, setEmailNotValid] = React.useState<boolean>(false);
    const [formValidationError, setFormValidationError] = React.useState<boolean>(false);
    const [displayFormValidationError, setDisplayFormValidationError] = React.useState<boolean>(false);
    const [displayEmailNotValid, setDisplayEmailNotValid] = React.useState<boolean>(false);
    const [displayNoMatchPasswordsError, setDisplayNoMatchPasswordError] = React.useState<boolean>(false);

    const errorArray: string[] = []

    function checkFormValidation() {
        console.log(formValidationError)
        console.log(displayNoMatchPasswordsError)
        if (username === "") {
            errorArray.push("Username is required")
        }
        if (lastName === "") {
            errorArray.push("Last name is required")
        }
        if (isEmailNotValid) {
            errorArray.push("Email is not valid")
        }
        if (password === "") {
            errorArray.push("Password is required")
        }
        if (repeatPassword === "") {
            errorArray.push("Please type again your password")
        }
        if (noMatchPasswordsError) {
            errorArray.push("Passwords does not match")
        }
    }

    function registerUser(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.preventDefault();
        errorArray.length = 0;
        checkFormValidation()
        if (errorArray.length === 0) {
            new AuthService().createUser(username, lastName, email, password).then(r => {
                console.log("User registered")
                // this.props.history.push({
                //     pathname: "/",
                //     openToaster: true,
                //     text: "Your account has been created ! Welcome " + username + " !",
                //     severity: "success"
                // })
            }).catch((e) => {
                console.log(e.response)
                console.log("Error during registration : ", e.message)
                if (e.response !== undefined) {
                    errorArray.push(e.response.data);
                }
                setDisplayFormValidationError(true)

            })
        } else {
            setDisplayFormValidationError(true);
            setFormValidationError(true);
        }
    }

    function closeAlert(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, code: string) {
        event.preventDefault();
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
        e.preventDefault();
        switch (e.target.name) {
            case "firstName":
                setUsername(e.target.value);
                break
            case "lastName":
                setLastName(e.target.value);
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
                setPassword(e.target.value);
                break
            case "repeatPassword":
                setRepeatPassword(e.target.value)
                if (password !== e.target.value) {
                    setNoMatchPasswordsError(true)
                    setDisplayNoMatchPasswordError(true);
                } else {
                    setNoMatchPasswordsError(false)
                    setDisplayNoMatchPasswordError(false)
                }
                break
            default:
                throw Error;
        }
    }

    function validateEmail(email: string) {
        const re = /\S+@\S+\.\S+/;
        return re.test(String(email).toLowerCase());
    }

    return (
        <div className={generateColorMode(theme)}
             style={{height: "calc(100% - 64px)", width: "100%"}}>
            <div className={"main-register-form"}>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <AccountCircleIcon fontSize={"large"}
                                       className={generateIconColorMode(theme)}/>
                </div>
                <div style={{textAlign: "center"}}>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                </div>
                <form style={{marginTop: "24px"}}>
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
                                            {errorArray ? errorArray.map((error: string, index: number) => (
                                                    <li key={index}>
                                                        {error}
                                                    </li>
                                                ))
                                                :
                                                <li/>}
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
                                             type={"password"} isDarkModeEnable={theme}/>
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
                    <div style={{marginTop: "10px"}}>
                        <Button
                            className={"button-register-form"}
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={(e) => registerUser(e)}
                        >
                            Sign Up
                        </Button>
                    </div>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link className={"lnk"}
                                  style={{color: generateLinkColorMode(theme)}}
                                  to={"/login"}>
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={5}>
                <Typography variant="body2" color="inherit" align="center">
                    {'Copyright © '}
                    <Link style={{color: generateLinkColorMode(theme)}} className={"lnk"}
                          color="inherit" to="/">
                        RS Software
                    </Link>{' '}
                    {new Date().getFullYear()}
                    {'.'}
                </Typography>
            </Box>
        </div>
    );
}

// class RegisterForm extends Component {
//     constructor(props) {
//         super(props);
//         this.wrapper = React.createRef();
//         this.state = {
//             username: "",
//             lastName: "",
//             email: "",
//             password: "",
//             repeatPassword: "",
//
//             noMatchPasswordsError: false,
//             displayNoMatchPasswordsError: false,
//             isEmailNotValid: false,
//             displayEmailNotValid: false,
//             formValidationError: false,
//             displayFormValidationError: false,
//             formError: []
//         };
//         this.handleChange = this.handleChange.bind(this)
//         this.closeAlert = this.closeAlert.bind(this)
//     }
//
//     errorArray = [];
//
//     checkFormValidation() {
//         if (this.state.username === "") {
//             this.errorArray.push("Username is required")
//         }
//         if (this.state.lastName === "") {
//             this.errorArray.push("Last name is required")
//         }
//         if (this.state.isEmailNotValid) {
//             this.errorArray.push("Email is not valid")
//         }
//         if (this.state.password === "") {
//             this.errorArray.push("Password is required")
//         }
//         if (this.state.repeatPassword === "") {
//             this.errorArray.push("Please type again your password")
//         }
//         if (this.state.noMatchPasswordsError) {
//             this.errorArray.push("Passwords does not match")
//         }
//     }
//
//     registerUser(e) {
//         e.preventDefault();
//         this.errorArray = [];
//         this.checkFormValidation()
//         if (this.errorArray.length === 0) {
//             console.log("Registering user ...")
//             new AuthService().createUser(this.state.username, this.state.lastName, this.state.email, this.state.password).then(r => {
//                 this.props.history.push({
//                     pathname: "/",
//                     openToaster: true,
//                     text: "Your account has been created ! Welcome " + this.state.username + " !",
//                     severity: "success"
//                 })
//             }).catch(e => {
//                 console.log(e.response)
//                 console.log("Error during registration : ", e.message)
//                 if (e.response !== undefined) {
//                     this.errorArray.push(e.response.data);
//                 }
//                 this.setState({displayFormValidationError: true})
//
//             })
//         } else {
//             this.setState({formValidationError: true});
//             this.setState({displayFormValidationError: true});
//         }
//
//     }
//
//     clearFields() {
//         this.setState({
//             username: "",
//             lastName: "",
//             email: "",
//             password: "",
//             repeatPassword: "",
//         });
//     }
//
//     validateEmail(email) {
//         const re = /\S+@\S+\.\S+/;
//         return re.test(String(email).toLowerCase());
//     }
//
//     closeAlert(e, code) {
//         e.preventDefault();
//         switch (code) {
//             case "arrayErrors":
//                 this.setState({displayFormValidationError: false})
//                 break
//             case "email":
//                 this.setState({displayEmailNotValid: false})
//                 break
//             case "repeatPassword":
//                 this.setState({displayNoMatchPasswordsError: false})
//                 break
//             default:
//                 throw new Error("Merde")
//         }
//     }
//
//     handleChange(e) {
//         e.preventDefault();
//         switch (e.target.name) {
//             case "firstName":
//                 this.setState({username: e.target.value});
//                 break
//             case "lastName":
//                 this.setState({lastName: e.target.value});
//                 break
//             case "email":
//                 this.setState({displayEmailNotValid: true})
//                 this.setState({isEmailNotValid: true})
//                 this.setState({email: e.target.value});
//                 if (this.validateEmail(this.state.email)) {
//                     this.setState({isEmailNotValid: false})
//                     this.setState({displayEmailNotValid: false})
//                 }
//                 break
//             case "password":
//                 this.setState({password: e.target.value});
//                 break
//             case "repeatPassword":
//                 this.setState({repeatPassword: e.target.value}, () => {
//                         if (this.state.password !== this.state.repeatPassword) {
//                             this.setState({noMatchPasswordsError: true})
//                             this.setState({displayNoMatchPasswordsError: true})
//                         } else {
//                             this.setState({noMatchPasswordsError: false})
//                             this.setState({displayNoMatchPasswordsError: false})
//                         }
//                     }
//                 );
//                 break
//             default:
//                 throw Error;
//         }
//     }
//
//     render() {
//         return (
//             <div className={generateColorMode(this.props.isDarkModeEnable)}
//                  style={{height: "calc(100% - 64px)", width: "100%"}}>
//                 <div className={"main-register-form"}>
//                     <div style={{display: "flex", justifyContent: "center"}}>
//                         <AccountCircleIcon fontSize={"large"}
//                                            className={generateIconColorMode(this.props.isDarkModeEnable)}/>
//                     </div>
//                     <div style={{textAlign: "center"}}>
//                         <Typography component="h1" variant="h5">
//                             Sign up
//                         </Typography>
//                     </div>
//                     <form style={{marginTop: "24px"}}>
//                         <Grid container spacing={2}>
//                             <Grid item xs={12}>
//                                 {
//                                     <Collapse ref={this.wrapper} in={this.state.displayFormValidationError}
//                                               timeout={500}>
//                                         <Alert action={
//                                             <IconButton
//                                                 aria-label="close"
//                                                 color="inherit"
//                                                 size="small"
//                                                 onClick={(e) => this.closeAlert(e, "arrayErrors")}
//                                             >
//                                                 <CloseIcon fontSize="inherit"/>
//                                             </IconButton>
//                                         } severity="warning">
//                                             <ul>
//                                                 {this.errorArray ? this.errorArray.map((error, index) => (
//                                                         <li key={index}>
//                                                             {error}
//                                                         </li>
//                                                     ))
//                                                     :
//                                                     <li/>}
//                                             </ul>
//                                         </Alert>
//                                     </Collapse>
//                                 }
//                             </Grid>
//                             <Grid item xs={12} sm={6}>
//                                 <CustomTextField id={"firstNameInput"} label={"First Name"} name={"firstName"}
//                                                  value={this.state.username}
//                                                  handleChange={this.handleChange}
//                                                  type={"text"} isDarkModeEnable={this.props.isDarkModeEnable}/>
//                             </Grid>
//                             <Grid item xs={12} sm={6}>
//                                 <CustomTextField id={"lastNameInput"} label={"Last Name"} name={"lastName"}
//                                                  value={this.state.lastName}
//                                                  handleChange={this.handleChange}
//                                                  type={"text"} isDarkModeEnable={this.props.isDarkModeEnable}/>
//                             </Grid>
//                             <Grid item xs={12}>
//                                 <CustomTextField id={"emailInput"} label={"Email Address"} name={"email"}
//                                                  value={this.state.email}
//                                                  handleChange={this.handleChange}
//                                                  type={"text"} isDarkModeEnable={this.props.isDarkModeEnable}/>
//                                 {
//                                     <Collapse in={this.state.displayEmailNotValid} timeout={1500}>
//                                         <Alert action={
//                                             <IconButton
//                                                 aria-label="close"
//                                                 color="inherit"
//                                                 size="small"
//                                                 onClick={(e) => this.closeAlert(e, "email")}
//                                             >
//                                                 <CloseIcon fontSize="inherit"/>
//                                             </IconButton>
//                                         } severity="warning">Email is not valid</Alert>
//                                     </Collapse>
//                                 }
//                             </Grid>
//                             <Grid item xs={12}>
//                                 <CustomTextField id={"passwordInput"} label={"Password"} name={"password"}
//                                                  handleChange={this.handleChange}
//                                                  value={this.state.password}
//                                                  type={"password"} isDarkModeEnable={this.props.isDarkModeEnable}/>
//                             </Grid>
//                             <Grid item xs={12}>
//                                 <CustomTextField id={"repeatPasswordInput"} label={"Repeat password"}
//                                                  name={"repeatPassword"}
//                                                  handleChange={this.handleChange}
//                                                  value={this.state.repeatPassword}
//                                                  type={"password"} isDarkModeEnable={this.props.isDarkModeEnable}/>
//                                 {
//                                     <Collapse in={this.state.displayNoMatchPasswordsError} timeout={1500}>
//                                         <Alert action={
//                                             <IconButton
//                                                 aria-label="close"
//                                                 color="inherit"
//                                                 size="small"
//                                                 onClick={(e) => this.closeAlert(e, "repeatPassword")}
//                                             >
//                                                 <CloseIcon fontSize="inherit"/>
//                                             </IconButton>
//                                         } severity="error">Passwords does not match</Alert>
//                                     </Collapse>
//                                 }
//                             </Grid>
//                         </Grid>
//                         <div style={{marginTop: "10px"}}>
//                             <Button
//                                 className={"button-register-form"}
//                                 type="submit"
//                                 fullWidth
//                                 variant="contained"
//                                 color="primary"
//                                 onClick={(e) => this.registerUser(e)}
//                             >
//                                 Sign Up
//                             </Button>
//                         </div>
//                         <Grid container justify="flex-end">
//                             <Grid item>
//                                 <Link className={"lnk"}
//                                       style={{color: generateLinkColorMode(this.props.isDarkModeEnable)}}
//                                       to={"/login"} variant="body2">
//                                     Already have an account? Sign in
//                                 </Link>
//                             </Grid>
//                         </Grid>
//                     </form>
//                 </div>
//                 <Box mt={5}>
//                     <Typography variant="body2" color="inherit" align="center">
//                         {'Copyright © '}
//                         <Link style={{color: generateLinkColorMode(this.props.isDarkModeEnable)}} className={"lnk"}
//                               color="inherit" to="/">
//                             RS Software
//                         </Link>{' '}
//                         {new Date().getFullYear()}
//                         {'.'}
//                     </Typography>
//                 </Box>
//             </div>
//         );
//     }
// }

// export default withRouter(RegisterForm);