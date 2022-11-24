import ClearAllIcon from "@mui/icons-material/ClearAll"
import { Button, FormControlLabel, Skeleton, Switch, Toolbar, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import { Link as RouterLink, useHistory } from "react-router-dom"
import { useAuthContext } from "../../context/auth-context"
import { useThemeContext } from "../../context/theme-context"
import { HttpService } from "../../service/http-service"
import { useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { StoreState } from "../../reducers/types"
import { setAlerts } from "../../reducers"

export const HeaderComponent: React.FunctionComponent = () => {
  const history = useHistory()
  const {
    user,
    setUser
  } = useAuthContext()
  const {
    authLoading,
    currentActiveGroup,
  } = useSelector(
    (state: StoreState) => state.globalReducer
  )
  const {
    theme,
    toggleTheme
  } = useThemeContext()
  const dispatch = useDispatch()
  const httpService = new HttpService()
  const [cookie, setCookie] = useCookies()
  const [isHeaderCouldRender, setHeaderRender] = useState<boolean>(false)
  const location = useLocation()

  useEffect(() => {
    const isCurrentPathVideoComponent = location.pathname.split("/")[1] !== "call"
    if (isCurrentPathVideoComponent) {
	 setHeaderRender(true)
    } else {
	 setHeaderRender(false)
    }
  }, [user])

  useEffect(() => {
    setCookie("pref-theme", theme)
  }, [theme])

  function toggleThemeMode () {
    toggleTheme()
  }

  async function logoutUser (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault()
    await httpService.logout()
    setUser(undefined)
    dispatch(setAlerts({
	 alert: {
	   text: "You log out successfully",
	   alert: "success",
	   isOpen: true
	 }
    }))
    history.push("/")
  }

  function generateLoading () {
    return [1, 2, 3, 4].map((index) => (
	 <div key={index} style={{ margin: "0 10px 0 10px" }}>
	   <Skeleton height={51} width={78}/>
	 </div>
    ))
  }

  return (
    <>
	 {
	   isHeaderCouldRender &&
		  <div className={theme}>
			  <Toolbar className={"clrcstm"}
					   style={{
					display: "flex",
					justifyContent: "space-between",
					borderBottom: "0.5px solid #C8C8C8"
				   }}>
				  <Typography variant="h6">
					  <RouterLink className={"lnk clrcstm"} to={"/"}>
          				<span style={{
						  display: "flex",
						  alignItems: "center",
						  flexWrap: "wrap"
						}}><ClearAllIcon/><span style={{ letterSpacing: "1px" }}>FastLiteMessage</span></span>
					  </RouterLink>
				  </Typography>
				  <nav className={"lnk clrcstm mnu"}>
				{authLoading && generateLoading()}
				{
				  !authLoading && user &&
						<RouterLink className={"lnk clrcstm"} to={`/t/messages/${currentActiveGroup}`}>
							<Button className={"clrcstm"} variant="outlined"
									style={{ margin: "8px 12px" }}>
								Messages
							</Button>
						</RouterLink>
				}
				{
				  !authLoading && !user &&
						<RouterLink className={"lnk clrcstm"} to={"/login"}>
							<Button className={"clrcstm"} variant="outlined" style={{ margin: "8px 12px" }}>
								Login
							</Button>
						</RouterLink>
				}
				{
				  !authLoading && !user &&
						<RouterLink className={"lnk clrcstm"} to={"/register"}>
							<Button className={"clrcstm"} variant="outlined" style={{ margin: "8px 12px" }}>
								Register
							</Button>
						</RouterLink>
				}
				{
				  !authLoading && user &&
						<RouterLink className={"lnk clrcstm"} to={"/create"}>
							<Button className={"clrcstm"} variant="outlined"
									style={{ margin: "8px 12px" }}>
								Create group
							</Button>
						</RouterLink>
				}
				{
				  !authLoading && user &&
						<Button className={"clrcstm"} variant="outlined" disabled
								style={{ margin: "8px 12px" }}>
					 {user?.firstName}
						</Button>
				}
				{
				  !authLoading && user &&
						<RouterLink className={"lnk clrcstm"} to={"#"}>
							<Button className={"clrcstm"} variant="outlined"
									onClick={(event) => logoutUser(event)}
									style={{ margin: "8px 12px" }}>
								Logout
							</Button>
						</RouterLink>
				}
					  <FormControlLabel
						  control={
					   <Switch
						checked={theme === "light"}
						onChange={() => toggleThemeMode()}
						name="checkedB"
						color="primary"
					   />
					 }
						  label={
					   theme === "light" ? "Light " : "Dark"
					 }
					  />
				  </nav>
			  </Toolbar>
		  </div>
	 }
    </>
  )
}
