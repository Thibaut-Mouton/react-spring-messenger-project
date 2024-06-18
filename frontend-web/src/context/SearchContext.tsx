import React, {createContext, useState} from "react"
import {FullTextSearchResponseType} from "../interface-contract/search-text/search-text.type"

type SearchContextType = {
    searchText: string;
    searchResponse: FullTextSearchResponseType | undefined
    setSearchText: (searchQuery: string) => void
    setSearchResponse: (response: FullTextSearchResponseType) => void
};

const SearchContext = createContext<SearchContextType>(
    {} as SearchContextType
)

const SearchProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [searchText, setSearchText] = useState<string>("")
    const [searchResponse, setSearchResponse] = useState<FullTextSearchResponseType | undefined>()
    return (
        <SearchContext.Provider value={{searchText, searchResponse, setSearchText, setSearchResponse}}>
            {children}
        </SearchContext.Provider>
    )
}


export {SearchContext, SearchProvider}
