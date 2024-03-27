import axios from "axios"
import { withHandleError } from "../utils"
import {  IUserAuth, IUserFull, IUserRatingWithRatedUser, IUserWithAuth } from "../types/auth.types"
import { IResponse } from "../types/http.types"
import { IFollowWithFollowedUser } from "../types/follow.types"



export const rateUser = withHandleError(async (
     userId: string, 
     rating_type:number) => {
    const response = await axios.post<IResponse<IUserRatingWithRatedUser>>(`/userRatings/${userId}`, {rating: rating_type.toString(), rating_type})
    return response.data
})

export const getUserById = withHandleError(async (userId: string) => {
    const response = await axios.get<IResponse<IUserFull>>(`/users/${userId}`)
    return response.data
})


export const getAllUsers = withHandleError(async () => {
    const response = await axios.get<IResponse<IUserWithAuth[]>>("/users")
    return response.data
})

export const deleteUserRating = withHandleError(async (ratingId: string) => { 
    const response = await axios.delete<IResponse<IUserRatingWithRatedUser>>(`/userRatings/${ratingId}`)
    return response.data
})


export const updateUser = withHandleError(async (authData: Partial<IUserAuth>, userData: Partial<IUserFull>) => {
    const response = await axios.put<IResponse<IUserFull>>(`/users`, {authData,userData})
    return response.data
})


export const followUserToggle = withHandleError(async (userId: string) => {
    const response = await axios.put<IResponse<IFollowWithFollowedUser>>(`/follows/${userId}`)
    return response.data
})