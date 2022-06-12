import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import UserModel from '../model/user-model'
import { setUserId, setUserWsToken, setWsUserGroups } from '../reducers'
import AuthService from '../service/auth-service'

type AuthContextType = {
  user: UserModel | undefined
  setUser: (user: UserModel | undefined) => void
}

export const AuthContext = React.createContext<AuthContextType>({} as AuthContextType)

export const AuthContextProvider: React.FunctionComponent<any> = ({ children }) => {
  const [user, setUser] = useState<UserModel | undefined>(undefined)
  const dispatch = useDispatch()

  useEffect(() => {
    async function authInit () {
      const res: AxiosResponse<UserModel> = await new AuthService().testRoute()
      const user = res.data
      setUser(user)
      dispatch(setUserWsToken({ wsToken: user.wsToken }))
      dispatch(setUserId({ userId: user.id }))
      dispatch(setWsUserGroups({ groupsArray: user.groups }))
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

export const useAuthContext = () => useContext(AuthContext)
