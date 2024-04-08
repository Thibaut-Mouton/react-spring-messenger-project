import React from "react"
import "./App.css"
import { LinearProgress } from "@mui/material"
import {BrowserRouter as Router} from "react-router-dom"
import { HeaderComponent } from "./components/partials/header-component"
import { useLoaderContext } from "./context/loader-context"
import { AlertComponent } from "./components/partials/alert-component"

export const App = () => {
  const { loading } = useLoaderContext()

  return (
    <Router>
	 {
	   loading &&
		  <LinearProgress style={{
		  position: "absolute",
		  top: "0",
		  width: "100%"
		}}/>
	 }
	 <HeaderComponent/>
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
	   <Route exact path="/call/:uuid">
		<VideoComponent/>
	   </Route>
	 <AlertComponent/>
    </Router>
  )
}
