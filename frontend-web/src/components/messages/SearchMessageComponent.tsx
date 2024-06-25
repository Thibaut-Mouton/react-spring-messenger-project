import React, {useContext} from "react"
import {SearchContext} from "../../context/SearchContext"
import "./SearchMessageComponent.css"
import {useNavigate} from "react-router-dom"
import {Box, List, ListItem, ListItemButton, ListItemText, Typography} from "@mui/material"

// export function DisplayMessagesComponent({messages, groupUrl, updateMessages}: DisplayMessagesProps) {

interface HighlightSearchedTextProps {
    message: string
    searchText: string
}

function HighlightSearchedText({message, searchText}: HighlightSearchedTextProps): React.JSX.Element {
    const position = message.search(searchText)
    const extracted = message.substring(position, position + searchText.length)
    const text = message.split(searchText)
    return <span>{text[0]}
        <span className={"simple-highlight"}>{extracted}</span>
        {text[1]}
    </span>
}

export function SearchMessageComponent() {
    const {searchResponse, setSearchText} = useContext(SearchContext)!
    const navigate = useNavigate()

    function redirectToGroup(groupUrl: string) {
        setSearchText("")
        navigate(`/t/messages/${groupUrl}`)
    }

    return <Box sx={{width: "100%"}}>
        <div style={{marginLeft: "10px", fontSize: "20px", fontWeight: "bold"}}>Search results</div>
        <div style={{margin: "12px"}}>
            {
                searchResponse && searchResponse.matchingMessages.map((searchResponseData, index) => (
                    <List key={index} subheader={<Typography variant={"h6"} component="div">
                        {searchResponseData.groupName}
                    </Typography>}>
                        {
                            searchResponseData.messages.map((message, messageIndex) => (
                                <ListItem onClick={() => redirectToGroup(searchResponseData.groupUrl)} key={messageIndex}
                                          disablePadding>
                                    <ListItemButton>
                                        <ListItemText
                                            secondary={<HighlightSearchedText searchText={searchResponse.matchingText}
                                                                              message={message}/>}/>
                                    </ListItemButton>
                                </ListItem>
                            ))
                        }
                    </List>
                ))
            }
        </div>
    </Box>
}
