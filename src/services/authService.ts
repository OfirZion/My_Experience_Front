import axios from "axios";
import { IUser, IUserFull } from "../types/auth.types";
import { IResponse, IToken } from "../types/http.types";
import {IUserAuthForm, IUserDataForm} from '../types/schemas.types'
import { withHandleError } from "../utils";

export const register = withHandleError(async (form: {
    userData: IUserDataForm,
    authData: IUserAuthForm
}) => { // This function is used to register the user
    const response = await axios.post<IResponse<IUser>>("/auth/register", form)
    return response.data
})


export const login = withHandleError(async (email: string, password: string) => {
        const response = await axios.post<IResponse<IToken>>("/auth/login", {email, password})
        if(response.data.data) {
            localStorage.setItem("token", JSON.stringify(response.data.data))
        }
    return response.data})


export const me = withHandleError(async () => {
    const response = await axios.get<IResponse<IUserFull>>("/users/me")
    return response.data
})