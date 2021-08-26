import React, {useContext, useState} from "react";

const defaultStatus: boolean = false;

type LoaderContextType = {
    loading: boolean;
    setLoading: (isLoading: boolean) => void
};

const LoaderContext = React.createContext<LoaderContextType>(
    {} as LoaderContextType
);

export const LoaderProvider: React.FC = ({children}) => {
    const [loading, setLoading] = useState<boolean>(defaultStatus);
    return (
        <LoaderContext.Provider value={{loading, setLoading}}>
            {children}
        </LoaderContext.Provider>
    );
};

export const useLoaderContext = () => useContext(LoaderContext);