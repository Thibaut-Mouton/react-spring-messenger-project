import React, {createContext, useEffect, useState} from "react"
import {IUser} from "../interface-contract/user/user-model"
import {HttpService} from "../service/http-service"
import {GroupModel} from "../interface-contract/group-model"

type AuthUserContextType = {
    user: IUser | undefined;
    groups: GroupModel[]
    setUser: (user: IUser | undefined) => void
    setGroups: (groups: GroupModel[]) => void
};

const AuthUserContext = createContext<AuthUserContextType | null>(null)

const AuthUserContextProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [user, setUser] = useState<IUser | undefined>(undefined)
    const [groups, setGroups] = useState<GroupModel[]>([])
    useEffect(() => {
        const getUserData = async () => {
            const userData = await new HttpService().pingRoute()
            setUser(userData.data.user)
            setGroups(userData.data.groupsWrapper.map((group => group.group)))
        }
        getUserData()
    }, [])
    return (
        <AuthUserContext.Provider value={{user, groups, setGroups, setUser}}>
            {children}
        </AuthUserContext.Provider>
    )
}


export {AuthUserContext, AuthUserContextProvider}
