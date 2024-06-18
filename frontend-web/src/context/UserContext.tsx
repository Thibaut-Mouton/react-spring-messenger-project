import React, {createContext, useContext, useEffect, useState} from "react"
import {IUser} from "../interface-contract/user/user-model"
import {HttpGroupService} from "../service/http-group-service"
import {GroupContext, GroupContextAction} from "./GroupContext"

type UserContextType = {
    user: IUser | undefined;
    setUser: (user: IUser) => void
};

const UserContext = createContext<UserContextType | undefined>(undefined)

const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [user, setUser] = useState<IUser | undefined>(undefined)
    const {changeGroupState} = useContext(GroupContext)!

    useEffect(() => {
        const getUserData = async () => {
            try {
                if (window.location.pathname !== "/register") {
                    const {data} = await new HttpGroupService().pingRoute()
                    setUser(data.user)
                    changeGroupState({
                        type: GroupContextAction.SET_GROUPS,
                        payload: data.groupsWrapper.map((group) => group.group)
                    })
                }
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
