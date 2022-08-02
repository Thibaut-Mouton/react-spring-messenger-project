import React, { useContext, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { setUserId, setUserWsToken, setWsUserGroups } from "../reducers"
import { HttpService } from "../service/http-service"
import { IUser } from "../interface-contract/user/user-model"

type AuthContextType = {
  user: IUser | undefined
  setUser: (user: IUser | undefined) => void
}

export const AuthContext = React.createContext<AuthContextType>({} as AuthContextType)

export const AuthContextProvider: React.FunctionComponent<any> = ({ children }) => {
  const [user, setUser] = useState<IUser | undefined>({} as IUser)
  const dispatch = useDispatch()

  useEffect(() => {
    async function authInit () {
	 const response = await new HttpService().pingRoute()
	 const {
	   user,
	   groupsWrapper
	 } = response.data
	 setUser(user)
	 dispatch(setUserWsToken({ wsToken: user.wsToken }))
	 dispatch(setUserId({ userId: user.id }))
	 dispatch(setWsUserGroups({ groups: groupsWrapper }))
    }

    authInit()
  }, [])

  return (
    <AuthContext.Provider value={{
	 user,
	 setUser
    }}>
	 {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = (): AuthContextType => useContext(AuthContext)
