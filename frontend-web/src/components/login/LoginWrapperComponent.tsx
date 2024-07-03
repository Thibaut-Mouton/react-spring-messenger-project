import React, {useEffect} from "react"
import {WelcomeComponent} from "../welcome/WelcomeComponent"
import {LoginComponent} from "./LoginComponent"

export function LoginWrapperComponent(): React.JSX.Element {

    useEffect(() => {
        document.title = "Login | FLM"
    }, [])

    return <>
        <WelcomeComponent>
            <LoginComponent/>
        </WelcomeComponent>
    </>
}