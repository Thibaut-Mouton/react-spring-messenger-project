import React from "react"
import "./index.css"
import * as serviceWorker from "./serviceWorker"
import {createBrowserRouter, redirect, RouterProvider} from "react-router-dom"
import {HomeComponent} from "./components/home"
import {createRoot} from "react-dom/client"
import {RegisterFormComponent} from "./components/register/register-user"
import {WebSocketMainComponent} from "./components/websocket/websocket-main-component"
import {VideoComponent} from "./components/websocket/video-component"
import {LoaderProvider} from "./context/loader-context"
import {AlertComponent} from "./components/partials/alert-component"
import {LoaderComponent} from "./components/partials/loader/LoaderComponent"
import {HttpService} from "./service/http-service"
import {AlertContextProvider} from "./context/AlertContext"
import {AuthUserContextProvider} from "./context/AuthContext"
import {HeaderComponent} from "./components/partials/HeaderComponent"

const router = createBrowserRouter([
    {
        path: "/",
        loader: async () => {
            return new HttpService().pingRoute().catch(() => redirect("/login"))
        },
    },
    {
        path: "login",
        element: <HomeComponent/>,
    },
    {
        path: "register",
        element: <RegisterFormComponent/>
    },
    {
        path: "t/messages",
        element: <WebSocketMainComponent/>
    },
    {
        path: "t/messages/:groupId",
        element: <WebSocketMainComponent/>
    },
    {
        path: "call/:uuid",
        element: <VideoComponent/>
    }
])

createRoot(document.getElementById("root")!)
    .render(
        <LoaderProvider>
            <AuthUserContextProvider>
                <AlertContextProvider>
                    <LoaderComponent/>
                    <HeaderComponent/>
                    <RouterProvider router={router}/>
                    <AlertComponent/>
                </AlertContextProvider>
            </AuthUserContextProvider>
        </LoaderProvider>
    )

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
