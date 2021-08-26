import React from "react";
import Alert from "@material-ui/lab/Alert";
import {useAlertContext} from "../../context/alert-context";
import {Collapse} from "@material-ui/core";

interface AlertComponentType {
}

export const AlertComponent: React.FunctionComponent<AlertComponentType> = () => {
    const {alerts, setAlerts} = useAlertContext();

    function closeAlert(id: string) {
        const indexToDelete = alerts.findIndex((elt) => elt.id === id);
        const alertsCopy = [...alerts];
        const eltToDelete = alertsCopy[indexToDelete];
        eltToDelete.isOpen = false;
        alertsCopy[indexToDelete] = eltToDelete;
        setAlerts(alertsCopy);
        setTimeout(() => {
            alertsCopy.splice(indexToDelete, 1)
            setAlerts(alertsCopy);
        }, 3000)
    }

    return (
        <div style={{position: "absolute", bottom: "2%", left: "1%"}}>
            {
                alerts.map((value) => (
                    <div key={value.id} style={{margin: "5px"}}>
                        <Collapse in={value.isOpen}>
                            <Alert onClose={() => closeAlert(value.id)}
                                   severity={value.alert}
                                   variant={"standard"}>
                                {value.text}
                            </Alert>
                        </Collapse>
                    </div>
                ))
            }
        </div>
    )
}
