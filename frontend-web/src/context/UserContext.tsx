import React, {createContext, useEffect, useState} from "react"
import {IUser} from "../interface-contract/user/user-model"
import {HttpGroupService} from "../service/http-group-service"

type UserContextType = {
    user: IUser | undefined;
    setUser: (user: IUser) => void
};

const UserContext = createContext<UserContextType | undefined>(undefined)

const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [user, setUser] = useState<IUser | undefined>(undefined)

    useEffect(() => {
        const getUserData = async () => {
            try {
                const {data} = await new HttpGroupService().pingRoute()
                setUser(data.user)
            } catch (error) {
                if (window.location.pathname !== "/login") {
                    window.location.pathname = "/login"
                }
            }
        }
        getUserData()
    }, [])
    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}


export {UserContext, UserContextProvider}
