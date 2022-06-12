import React from 'react';
import './App.css';
import { LinearProgress } from '@mui/material';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { CreateGroupComponent } from './components/create-group-component';
import { HeaderComponent } from './components/header-component';
import { LoginComponent } from './components/login-component';
import { WebSocketMainComponent } from './components/websocket/websocket-main-component';
import { useLoaderContext } from './context/loader-context';
import { HomeComponent } from './design/home';
import { RegisterFormComponent } from './design/register/register-user';
import { AlertComponent } from './design/utils/alert-component';

export const App = () => {
    const { loading } = useLoaderContext();

    return (
        <Router>
            {
                loading &&
                    <LinearProgress style={ {
                        position: 'absolute',
                        top: '0',
                        width: '100%'
                    } }/>
            }
            <HeaderComponent/>
            <Switch>
                <Route exact path="/">
                    <HomeComponent/>
                </Route>
                <Route exact path="/create">
                    <CreateGroupComponent/>
                </Route>
                <Route exact path="/t/messages">
                    <WebSocketMainComponent/>
                </Route>
                <Route exact path="/t/messages/:groupId">
                    <WebSocketMainComponent/>
                </Route>
                <Route exact path="/register">
                    <RegisterFormComponent/>
                </Route>
                <Route exact path="/login">
                    <LoginComponent/>
                </Route>
            </Switch>
            <AlertComponent/>
        </Router>
    );
};
