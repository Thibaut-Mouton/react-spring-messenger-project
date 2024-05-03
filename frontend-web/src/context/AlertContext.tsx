import React, {createContext, Dispatch, ReactNode, useReducer} from "react"

enum AlertAction {
    DELETE_ALERT = "DELETE_ALERT",
    ADD_ALERT = "ADD_ALERT"
}

type AlertSeverityType = "success" | "info" | "warning" | "error" | undefined

type AlertType = {
    id: string,
    isOpen: boolean,
    text: string,
    alert: AlertSeverityType
}

export type AlertActionType =
    | { type: AlertAction.ADD_ALERT; payload: AlertType }
    | { type: AlertAction.DELETE_ALERT; payload: string };

export const AlertContext = createContext<{
    alerts: AlertType[];
    dispatch: Dispatch<AlertActionType>;
} | null>(null)

export const alertsReducer = (state: AlertType[], action: AlertActionType): AlertType[] => {
    switch (action.type) {
        case AlertAction.ADD_ALERT: {
            return [...state, action.payload]
        }

        case AlertAction.DELETE_ALERT: {
            const indexToDelete = state.findIndex((alert) => alert.id === action.payload)
            const eltToDelete = state[indexToDelete]
            eltToDelete.isOpen = false
            state[indexToDelete] = eltToDelete
            return state.filter((alert) => alert.id !== action.payload)
        }

        default:
            return state
    }
}

const AlertContextProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [alerts, dispatch] = useReducer(alertsReducer, [])
    return (
        <AlertContext.Provider value={{alerts, dispatch}}>
            {children}
        </AlertContext.Provider>
    )
}

export {AlertContextProvider, AlertAction, type AlertSeverityType}
