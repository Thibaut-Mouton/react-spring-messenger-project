import React, {createContext, useEffect, useState} from "react"
import {IUser} from "../interface-contract/user/user-model"
import {HttpGroupService} from "../service/http-group-service"
import {GroupModel} from "../interface-contract/group-model"
import {redirect} from "react-router-dom"

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
            try {
                const userData = await new HttpGroupService().pingRoute()
                setUser(userData.data.user)
                setGroups(userData.data.groupsWrapper.map((group => group.group)))
            } catch (error) {
                console.warn(`User not connected : ${error}`)
                redirect("/login")
            }
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
