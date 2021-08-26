import React, {useContext, useEffect, useState} from 'react'
import UserModel from "../model/user-model";
import AuthService from "../service/auth-service";
import {AxiosResponse} from "axios";

type AuthContextType = {
    user: UserModel | undefined
    setUser: (user: UserModel | undefined) => void
}

export const AuthContext = React.createContext<AuthContextType>({} as AuthContextType);

export const AuthContextProvider: React.FunctionComponent = ({children}) => {
    const [user, setUser] = useState<UserModel | undefined>(undefined);

    useEffect(() => {
        async function authInit() {
            const res: AxiosResponse<UserModel> = await new AuthService().testRoute();
            setUser(res.data);
        }

        authInit();
    }, [])

    return (
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);