import React, { useContext } from "react"


type LoaderContextType = {
    loading: boolean;
    setLoading: (isLoading: boolean) => void
};

const LoaderContext = React.createContext<LoaderContextType>(
    {} as LoaderContextType
)

// export const LoaderProvider: React.FunctionComponent<unknown> = ({ children }) => {
// 	const [loading, setLoading] = useState<boolean>(defaultStatus)
// 	return (
// 		<LoaderContext.Provider value={ { loading, setLoading } }>
// 			{ children }
// 		</LoaderContext.Provider>
// 	)
// }

export const useLoaderContext = (): LoaderContextType => useContext(LoaderContext)
