import { Alert, Collapse } from "@mui/material"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { StoreState } from "../../reducers/types"
import { setAllAlerts } from "../../reducers"

export const AlertComponent: React.FunctionComponent = () => {
  const { alerts } = useSelector((state: StoreState) => state.globalReducer)
  const dispatch = useDispatch()

  function closeAlert (id?: string) {
    if (!id) {
	 return
    }
    const indexToDelete = alerts.findIndex((elt) => elt.id === id)
    const allAlerts = [...alerts]
    const eltToDelete = { ...allAlerts[indexToDelete] }
    eltToDelete.isOpen = false
    allAlerts[indexToDelete] = eltToDelete
    dispatch(setAllAlerts({ allAlerts }))
  }

  return (
    <div style={{
	 position: "absolute",
	 bottom: "2%",
	 left: "1%"
    }}>
	 {
	   alerts.map((value) => (
		<div key={value.id} style={{ margin: "5px" }}>
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
