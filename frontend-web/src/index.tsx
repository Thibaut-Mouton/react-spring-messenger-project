import React from "react"
import "./index.css"
import * as serviceWorker from "./serviceWorker"
import {createBrowserRouter, redirect, RouterProvider} from "react-router-dom"
import {HomeComponent} from "./components/home"
import {createRoot} from "react-dom/client"
import {WebSocketMainComponent} from "./components/websocket/websocket-main-component"
import {VideoComponent} from "./components/websocket/video-component"
import {LoaderProvider} from "./context/loader-context"
import {AlertComponent} from "./components/partials/alert-component"
import {LoaderComponent} from "./components/partials/loader/LoaderComponent"
import {HttpGroupService} from "./service/http-group-service"
import {AlertContextProvider} from "./context/AlertContext"
import {UserContextProvider} from "./context/UserContext"
import {GroupContextProvider} from "./context/GroupContext"
import {RegisterUserComponent} from "./components/register/RegisterUser"
import {SearchProvider} from "./context/SearchContext"

const router = createBrowserRouter([
    {
        path: "/",
        loader: async () => {
            return new HttpGroupService().pingRoute()
                .then(() => redirect("/t/messages"))
                .catch(() => redirect("/login"))
        },
    },
    {
        path: "login",
        element: <HomeComponent/>,
    },
    {
        path: "register",
        element: <RegisterUserComponent/>
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
        path: "room/:callUrl",
        element: <VideoComponent/>
    }
])

function RootComponent() {
    return (
        <LoaderProvider>
            <GroupContextProvider>
                <UserContextProvider>
                    <SearchProvider>
                        <AlertContextProvider>
                            <LoaderComponent/>
                            <RouterProvider router={router}/>
                            <AlertComponent/>
                        </AlertContextProvider>
                    </SearchProvider>
                </UserContextProvider>
            </GroupContextProvider>
        </LoaderProvider>
    )
}

createRoot(document.getElementById("root")!)
    .render(
        <RootComponent/>
    )

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
