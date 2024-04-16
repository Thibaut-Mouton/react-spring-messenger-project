import {LinearProgress} from "@mui/material"
import React, {useContext} from "react"
import {LoaderContext} from "../../../context/loader-context"

export function LoaderComponent() {
    const {loading} = useContext(LoaderContext)
    return <>
        {
            loading && <LinearProgress style={{
                position: "absolute",
                top: "0",
                width: "100%"
            }}/>
        }
    </>
}
