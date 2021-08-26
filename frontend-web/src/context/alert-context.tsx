import React, {useContext, useState} from 'react';
import {FeedbackModel} from "../model/feedback-model";

type AlertContextType = {
    alerts: FeedbackModel[]
    setAlerts: (user: FeedbackModel[]) => void
}

export const AlertContext = React.createContext<AlertContextType>({} as AlertContextType);

export const AlertContextProvider: React.FunctionComponent = ({children}) => {
    const [alerts, setAlerts] = useState<FeedbackModel[]>([]);

    return (
        <AlertContext.Provider value={{alerts, setAlerts}}>
            {children}
        </AlertContext.Provider>
    );
};

export const useAlertContext = () => useContext(AlertContext);