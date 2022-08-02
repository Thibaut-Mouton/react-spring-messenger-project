import React from "react"
import "./App.css"
import { LinearProgress } from "@mui/material"
import { Route, BrowserRouter as Router, Switch } from "react-router-dom"
import { CreateGroupComponent } from "./components/create-group/create-group-component"
import { HeaderComponent } from "./components/partials/header-component"
import { LoginComponent } from "./components/login/login-component"
import { WebSocketMainComponent } from "./components/websocket/websocket-main-component"
import { useLoaderContext } from "./context/loader-context"
import { HomeComponent } from "./components/home"
import { AlertComponent } from "./components/partials/alert-component"
import { VideoComponent } from "./components/websocket/video-component"
import { RegisterFormComponent } from "./components/register/register-user"

export const App = (): JSX.Element => {
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
	   <Route exact path="/call/:uuid">
		<VideoComponent/>
	   </Route>
	 </Switch>
	 <AlertComponent/>
    </Router>
  )
}
