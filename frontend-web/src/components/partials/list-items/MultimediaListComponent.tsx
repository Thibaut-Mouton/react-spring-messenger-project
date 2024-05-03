import React, {useContext, useEffect, useState} from "react"
import "./MultimediaListStyle.css"
import {CircularProgress, Collapse, ListItemButton, ListItemIcon, ListItemText} from "@mui/material"
import {ExpandLess, FolderCopy} from "@mui/icons-material"
import ExpandMore from "@mui/icons-material/ExpandMore"
import {HttpGroupService} from "../../../service/http-group-service"
import {AlertAction, AlertContext} from "../../../context/AlertContext"

interface MultimediaListProps {
    isDisabled: boolean
    groupUrl: string
}

export function MultimediaListComponent({groupUrl, isDisabled}: MultimediaListProps) {
    const {dispatch} = useContext(AlertContext)!
    const [isListOpened, setListStatus] = useState(false)
    const [multimediaContent, setMultimediaContent] = useState<string[]>([])
    const http = new HttpGroupService()
    const [mediaLoading, setMediaLoading] = useState(false)

    useEffect(() => {
        setMultimediaContent([])
    }, [groupUrl])

    async function changeState() {
        if (!isListOpened && multimediaContent.length === 0) {
            setMediaLoading(true)
            try {
                const {data} = await http.getMultimediaFiles(groupUrl)
                setMultimediaContent(data)
            } catch (error) {
                dispatch({
                    type: AlertAction.ADD_ALERT,
                    payload: {
                        id: crypto.randomUUID(),
                        text: `Cannot fetch multimedia content : ${error}`,
                        isOpen: true,
                        alert: "error",
                    }
                })
            } finally {

                setMediaLoading(false)
            }
        }
        setListStatus(!isListOpened)
    }

    return <>
        <ListItemButton disabled={isDisabled} onClick={changeState}>
            <ListItemIcon>
                <FolderCopy color={"primary"}/>
            </ListItemIcon>
            <ListItemText primary="Multimedia content"/>
            {isListOpened ? <ExpandLess/> : <ExpandMore/>}
        </ListItemButton>
        <Collapse in={isListOpened} timeout="auto" unmountOnExit>
            <div className={"display"}>
                {
                    multimediaContent.map((file, index) => {
                        return (
                            <div style={{backgroundImage: `url(${file})`}} className={"content"} key={index}/>
                        )
                    })
                }
            </div>
        </Collapse>
        {mediaLoading && <CircularProgress/>}
    </>
}
