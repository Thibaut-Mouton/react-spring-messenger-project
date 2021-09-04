import React from 'react';
import './App.css';
import {createBrowserHistory} from 'history';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import {RegisterFormComponent} from "./design/register/register-user";
import HeaderContainer from "./container/header-container";
import HomeContainer from "./container/home-container";
import LoginContainer from "./container/login-container";
import CreateGroupContainer from "./container/create-group-container";
import WebSocketMainContainer from "./container/websocket/websocket-main-container";
import {AlertComponent} from "./design/utils/alert-component";
import {LinearProgress} from "@material-ui/core";
import {useLoaderContext} from "./context/loader-context";


const history = createBrowserHistory();

export const App = () => {
    const {loading} = useLoaderContext();

    return (
        <Router>
            {
                loading &&
                <LinearProgress style={{position: "absolute", top: "0", width: "100%"}}/>
            }
            <HeaderContainer/>
            <Switch>
                <Route exact path="/" render={(props: any) =>
                    <HomeContainer
                        {...props}
                    />}
                />
                <Route exact path="/create" render={(props: any) =>
                    <CreateGroupContainer
                        {...props}
                    />}
                />
                <Route exact path="/t/messages" render={(props: any) =>
                    <WebSocketMainContainer
                        {...props}
                    />}
                />

                <Route exact path="/t/messages/:groupId" render={(props: any) =>
                    <WebSocketMainContainer
                        {...props}
                    />}
                />
                <Route exact path="/register" render={(props: any) =>
                    <RegisterFormComponent
                        {...props}
                        history={history}
                    />}
                />
                <Route exact path="/login" render={(props: any) =>
                    <LoginContainer
                        {...props}
                        history={history}
                    />}
                />
            </Switch>
            <AlertComponent/>
        </Router>
    )
}
