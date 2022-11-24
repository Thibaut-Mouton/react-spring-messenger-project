import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import { Provider } from "react-redux"
import { App } from "./App"
import { AuthContextProvider } from "./context/auth-context"
import { LoaderProvider } from "./context/loader-context"
import { ThemeProvider } from "./context/theme-context"
import { store } from "./reducers"
import * as serviceWorker from "./serviceWorker"

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
	 <AuthContextProvider>
	   <LoaderProvider>
		<ThemeProvider>
		  <App/>
		</ThemeProvider>
	   </LoaderProvider>
	 </AuthContextProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
