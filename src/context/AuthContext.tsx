import React, { useEffect } from "react";
import {   IUserFull } from "../types/auth.types";
import { IUserLoginForm, IUserRegistrationForm } from "../types/schemas.types";
import { IAuthContext } from "../types/context.types";
import * as authService from "../services/authService";
import { IResponse, IToken } from "../types/http.types";


const AuthContext = React.createContext<IAuthContext | null>(null)


export default function AuthContextProvider({children}: {children: React.ReactNode}) {

    const [user, setUser] = React.useState<IUserFull | null>(null);
    const [token, setToken] = React.useState<IToken | null>(
        JSON.parse(localStorage.getItem("token") || "null")
    );
    
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<unknown>(null);

    useEffect(() => {
        const fetchUser = async () => {
            if(token) {
                try {
                    const user = await authService.me();
                    setUser(user.data);
                } catch (error) { 
                    console.error(error) 
                } 
                setLoading(false);
            }
        }
        if(token) {
            fetchUser()
        } else {
            setLoading(false)
            setUser(null)
        }
    },[token])


    async function login(form: IUserLoginForm) {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.login(form.email, form.password);
            if(response.data?.accessToken) {
                setToken(response.data);
            } else {
                setError(response.message);
            }
            return response as IResponse<IToken>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch(error: any) {
            setError(error.message);
            return error
        }
    }

    async function register(form: IUserRegistrationForm) {
        setLoading(true);
        setError(null);
        try {
            const { data } = await authService.register({
                userData: {
                    name: form.name,
                    age: form.age,
                    imgUrl: form.imgUrl
                },
                authData: {
                    email: form.email,
                    password: form.password
                }
            });
            return data
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
        return null
    }

    async function logout() {
        setLoading(true);
        setError(null);
        try {
            // Clear the user and token state
            setUser(null);
            setToken(null);
            // Clear the token from the local storage
            localStorage.removeItem("token");
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    return <AuthContext.Provider value={{
        user,
        token,
        loading,
        setLoading,
        setUser,
        error,
        setError,
        login,
        register,
        logout
    }}>
        {children}
    </AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthContextProvider");
    }
    return context;
}