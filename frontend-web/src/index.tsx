import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {App} from './App';
import * as serviceWorker from './serviceWorker';
import {applyMiddleware, createStore} from "redux";
import {Provider} from "react-redux";
import rootReducer from "./reducers";
import thunk from "redux-thunk";
import WsClientMiddleWare from "./middleware/ws-middleware";
import {AuthContextProvider} from "./context/auth-context";
import {ThemeProvider} from "./context/theme-context";
import {AlertContextProvider} from "./context/alert-context";
import {LoaderProvider} from "./context/loader-context";


// @ts-ignore
const store = createStore(rootReducer, applyMiddleware(thunk, WsClientMiddleWare))

ReactDOM.render(
    <React.StrictMode>
        <AuthContextProvider>
            <ThemeProvider>
                <AlertContextProvider>
                    <Provider store={store}>
                        <LoaderProvider>
                            <App/>
                        </LoaderProvider>
                    </Provider>
                </AlertContextProvider>
            </ThemeProvider>
        </AuthContextProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
