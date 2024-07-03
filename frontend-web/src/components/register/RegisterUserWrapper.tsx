import React, {useEffect} from "react"
import {WelcomeComponent} from "../welcome/WelcomeComponent"
import {RegisterUserComponent} from "./RegisterUser"

export function RegisterUserWrapper(): React.JSX.Element {

    useEffect(() => {
        document.title = "Register | FLM"
    }, [])

    return <>
        <WelcomeComponent>
            <RegisterUserComponent/>
        </WelcomeComponent>
    </>
}