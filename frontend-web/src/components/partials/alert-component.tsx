import {Alert, AlertTitle, Collapse} from "@mui/material"
import React, {useContext} from "react"
import {AlertAction, AlertContext, AlertContextProvider} from "../../context/AlertContext"

export const AlertComponent: React.FunctionComponent = () => {
    const {alerts, dispatch} = useContext(AlertContext)!

    function closeAlert(id: string) {
        dispatch({type: AlertAction.DELETE_ALERT, payload: id})
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
                                <Alert onClose={() => closeAlert(value.id)}
                                       severity={value.alert}
                                       variant={"standard"}>
                                    <AlertTitle>Success</AlertTitle>
                                    {value.text}
                                </Alert>
                            </Collapse>
                        </div>
                    ))
                }
            </div>
    )
}
