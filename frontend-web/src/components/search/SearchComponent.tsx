import React, {useContext, useState} from "react"
import {InputAdornment, OutlinedInput} from "@mui/material"
import {HttpGroupService} from "../../service/http-group-service"
import {AlertAction, AlertContext} from "../../context/AlertContext"
import {SearchContext} from "../../context/SearchContext"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"

export function SearchComponent() {
    const [search, setTextSearch] = useState("")
    const {dispatch} = useContext(AlertContext)!
    const {setSearchText, setSearchResponse} = useContext(SearchContext)!
    const [searchingLoading, setSearchingLoading] = useState<boolean>(false)
    const http = new HttpGroupService()

    function handleChange(event: any) {
        event.preventDefault()
        setTextSearch(event.target.value)
    }

    async function startSearch(event: any) {
        if (event.key === undefined || event.key === "Enter") {
            if (search !== "") {
                setSearchingLoading(true)
                setSearchText(event.target.value)
                try {
                    const {data} = await http.searchInConversations({text: search})
                    setSearchResponse(data)
                } catch (error) {
                    dispatch({
                        type: AlertAction.ADD_ALERT,
                        payload: {
                            alert: "error",
                            id: crypto.randomUUID(),
                            isOpen: true,
                            text: "Cannot perform search in conversations."
                        }
                    })
                } finally {
                    if (searchingLoading) {
                        setSearchingLoading(false)
                    }
                }
            }
        }
    }

    return <OutlinedInput
        endAdornment={<InputAdornment position="end">
            <IconButton>
                <CloseIcon/>
            </IconButton>
        </InputAdornment>}
        onChange={handleChange} value={search} onKeyDown={startSearch} style={{width: "50%"}}
        size={"small"}
        label={"Search in conversations"}/>
}
