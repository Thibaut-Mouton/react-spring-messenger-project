import React, {createContext, useState} from "react"

type LoaderContextType = {
    loading: boolean;
    setLoading: (isAppLoading: boolean) => void
};

const LoaderContext = createContext<LoaderContextType>(
    {} as LoaderContextType
)

const LoaderProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [loading, setLoading] = useState<boolean>(false)
    return (
        <LoaderContext.Provider value={{loading, setLoading}}>
            {children}
        </LoaderContext.Provider>
    )
}


export {LoaderContext, LoaderProvider}
