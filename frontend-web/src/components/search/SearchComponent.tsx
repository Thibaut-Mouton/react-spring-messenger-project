import React, {useState} from "react"
import {TextField} from "@mui/material"
import {HttpGroupService} from "../../service/http-group-service"

export function SearchComponent() {
    const [search, setTextSearch] = useState("")
    const http = new HttpGroupService()

    function handleChange(event: any) {
        event.preventDefault()
        setTextSearch(event.target.value)
    }

    async function startSearch(event: any) {
        if (event.key === undefined || event.key === "Enter") {
            if (search !== "") {
                await http.searchInConversations({text: search})
            }
        }
    }

    return <TextField onChange={handleChange} value={search} onKeyDown={startSearch} style={{width: "50%"}}
                      variant={"outlined"} size={"small"}
                      label={"Search in conversations"}/>
}
