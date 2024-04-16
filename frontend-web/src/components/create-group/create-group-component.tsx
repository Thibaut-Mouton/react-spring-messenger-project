import {Button, Container, CssBaseline, Grid, Typography} from "@mui/material"
import React, {useContext, useEffect, useState} from "react"
import {useThemeContext} from "../../context/theme-context"
import {CustomTextField} from "../partials/custom-material-textfield"
import {HttpGroupService} from "../../service/http-group-service"
import {AlertAction, AlertContext} from "../../context/AlertContext"

export const CreateGroupComponent = () => {
    const [groupName, setGroupName] = useState("")
    const {theme} = useThemeContext()
    const httpService = new HttpGroupService()
    const {dispatch} = useContext(AlertContext)!

    useEffect(() => {
        document.title = "Create group | FLM"
    }, [])

    function handleChange(event: any) {
        event.preventDefault()
        setGroupName(event.target.value)
    }

    async function createGroupByName(event: any) {
        event.preventDefault()
        if (groupName !== "") {
            try {
                await httpService.createGroup(groupName)
                dispatch({
                    type: AlertAction.ADD_ALERT,
                    payload: {
                        id: crypto.randomUUID(),
                        isOpen: true,
                        alert: "success",
                        text: `Group "${groupName}" has been created successfully`
                    }
                })
            } catch (error) {
                dispatch({
                    type: AlertAction.ADD_ALERT,
                    payload: {
                        id: crypto.randomUUID(),
                        isOpen: true,
                        alert: "error",
                        text: `Cannot create group "${groupName}" : ${error}`
                    }
                })
            }
            // dispatch(createGroup({ group: res.data }))
            // history.push({
            //   pathname: "/t/messages/" + res.data.url
            // })
            // setAlerts([...alerts, new FeedbackModel(UUIDv4(), `Cannot create group "${groupName}" : ${err.toString()}`, "error", true)])
        }
    }

    function submitGroupCreation(event: any) {
        if (event.key === undefined || event.key === "Enter") {
            if (groupName === "") {
                return
            }
            createGroupByName(event)
        }
    }

    return (
        <div className={theme}
             style={{
                 height: "calc(100% - 64px)",
                 textAlign: "center",
                 paddingTop: "40px"
             }}>
            <Container className={"clrcstm"} component="main" maxWidth="xs">
                <CssBaseline/>
                <div className={"main-register-form clrcstm"}>
                    <Typography className={"clrcstm"} variant="h6">
                        Create a group
                    </Typography>
                </div>
                <div className={"clrcstm"}>
                    <Grid className={"clrcstm"} container spacing={2}>
                        <Grid className={"clrcstm"} item xs={12}>
                            <CustomTextField id={"createGroupMessenger"}
                                             label={"Type a name for your group"}
                                             name={"groupName"}
                                             handleChange={handleChange}
                                             value={groupName}
                                             type={"text"}
                                             keyUp={submitGroupCreation}
                                             isDarkModeEnable={theme}
                                             isMultiline={false}/>
                        </Grid>
                        <div>
                            <Grid item xs={12}>
                                <Button
                                    className={"button-register-form"}
                                    style={{marginTop: "15px"}}
                                    onClick={(event) => createGroupByName(event)}
                                    fullWidth
                                    variant="outlined"
                                    color="primary"
                                >
                                    Create
                                </Button>
                            </Grid>
                        </div>
                    </Grid>
                </div>
            </Container>
        </div>
    )
}
