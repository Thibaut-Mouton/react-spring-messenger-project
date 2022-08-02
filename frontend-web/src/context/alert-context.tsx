import React, { useContext, useState } from "react"
import { FeedbackModel } from "../interface-contract/feedback-model"

type AlertContextType = {
    alerts: FeedbackModel[]
    setAlerts: (user: FeedbackModel[]) => void
}

export const AlertContext = React.createContext<AlertContextType>({} as AlertContextType)

export const AlertContextProvider: React.FunctionComponent<any> = ({ children }) => {
	const [alerts, setAlerts] = useState<FeedbackModel[]>([])

	return (
		<AlertContext.Provider value={ { alerts, setAlerts } }>
			{ children }
		</AlertContext.Provider>
	)
}

export const useAlertContext = (): AlertContextType => useContext(AlertContext)
