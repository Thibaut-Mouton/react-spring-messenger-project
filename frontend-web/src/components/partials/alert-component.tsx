import {Alert, AlertTitle, Collapse, Snackbar} from "@mui/material"
import React, {useContext} from "react"
import {AlertAction, AlertContext, AlertSeverityType} from "../../context/AlertContext"

export function AlertComponent(): React.JSX.Element {
    const {alerts, dispatch} = useContext(AlertContext)!

    function closeAlert(id: string) {
        dispatch({type: AlertAction.DELETE_ALERT, payload: id})
    }

    function getAlertTitle(severity: AlertSeverityType): string {
        switch (severity) {
            case "error":
                return "Error"
            case "warning":
                return "Warning"
            case "info":
                return "Info"
            case "success":
                return "Success"
            default:
                return "Error"
        }
    }

    return (
        <div style={{
            position: "absolute",
            bottom: "2%",
            left: "1%"
        }}>
            {
                alerts.map((value) => (
                    <div key={value.id} style={{margin: "5px"}}>
                        <Collapse in={value.isOpen}>
                            <Snackbar open={true} autoHideDuration={6000} onClose={() => closeAlert(value.id)}>
                                <Alert onClose={() => closeAlert(value.id)}
                                       severity={value.alert}
                                       variant={"filled"}>
                                    <AlertTitle>{getAlertTitle(value.alert)}</AlertTitle>
                                    {value.text}
                                </Alert>
                            </Snackbar>
                        </Collapse>
                    </div>
                ))
            }
        </div>
    )
}
