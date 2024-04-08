import React from "react"
import "./index.css"
import { Provider } from "react-redux"
import { AuthContextProvider } from "./context/auth-context"
import { LoaderProvider } from "./context/loader-context"
import { ThemeProvider } from "./context/theme-context"
import { store } from "./reducers"
import * as serviceWorker from "./serviceWorker"
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {HomeComponent} from "./components/home";
import {createRoot} from "react-dom/client";

// ReactDOM.render(
//   <React.StrictMode>
//     <Provider store={store}>
// 	 <AuthContextProvider>
// 	   <LoaderProvider>
// 		<ThemeProvider>
// 		  <App/>
// 		</ThemeProvider>
// 	   </LoaderProvider>
// 	 </AuthContextProvider>
//     </Provider>
//   </React.StrictMode>,
//   document.getElementById("root")
// )

const router = createBrowserRouter([
	{
		path: "/",
		element: <HomeComponent/>,
	},
	{
		path: "about",
		element: <div>About</div>,
	},
]);

createRoot(document.getElementById("root")!).render(
	<RouterProvider router={router} />
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
