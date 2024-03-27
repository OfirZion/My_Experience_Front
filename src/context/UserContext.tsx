import React from "react";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import * as userService from "../services/usersService";
import { IUserAuth, IUserFull, IUserRatingWithRatedUser } from "../types/auth.types";
export interface IUserContext {
    followToggle: (userId: string) => void;
    getUserById: (userId: string) => Promise<IUserFull | null>;
    updateUser(authData: Partial<IUserAuth>, userData: Partial<IUserFull>): Promise<IUserFull | null>
    rateUser: (userId: string, rating_type: number) => Promise<IUserRatingWithRatedUser | null>;
    deleteUserRating: (ratingId: string) => Promise<IUserRatingWithRatedUser | null>;
}

const UserContext = React.createContext<IUserContext| null>(null)

export const UserContextProvider = ({children} : {children: React.ReactNode}) => {

    const {setUser,user} = useAuth()

    async function updateUser(authData: Partial<IUserAuth>, userData: Partial<IUserFull>) {
        try {
            const { data } = await userService.updateUser(authData, userData);
            if(data) {
                setUser(data);
                return data
            }
        } catch (error) {
            console.error(error)
        } 
        return null
    }


    const followToggle = async (userId: string) => {
      if(!user) return
       try {
        const hadFollowBefore = user.following?.find((followed_user) => followed_user.following._id === userId)
        const response = await userService.followUserToggle(userId)
        if(response.data) {
            if(hadFollowBefore) {
                setUser({...user, following: user.following?.filter((followed_user) => followed_user.following._id !== userId)})
            } else {
                setUser({...user, following: [...user.following!, response.data]})
            }
        }
        return response.data
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
       } catch(e: any) {
            if((e.status || 200) / 100 !== 2) {
                toast.error(e.message)
            } else {
                console.log(e.message)
                toast.error("Could not follow toggle user")
            }
            return null
       }
    }

    const rateUser = async (userId: string, rating_type: number) => {
        try {
            const response = await userService.rateUser(userId, rating_type)
            return response.data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }catch(e:any) {
            if((e.status || 200) / 100 !== 2) {
                if(e.status === 406) {
                    toast.error("Rating must be a number between 1 and 10")
                }else {
                    toast.error(e.message)
                    
                }
            } else {
                toast.error("Could not rate user")
            }
        }
        return null
    }

    const deleteUserRating = async (ratingId: string) => {
        try {
            const response = await userService.deleteUserRating(ratingId)
            return response.data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }catch(e:any) {
            if((e.status || 200) / 100 !== 2) {
                toast.error(e.message)
            } else {
                toast.error("Could not delete user rating")
            }
        }
        return null
    }

    const getUserById = async (userId: string) => {
        try {
            const response = await userService.getUserById(userId)
            return response.data
       
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }catch(e:any) {
            if((e.status || 200) / 100 !== 2) {
                toast.error(e.message)
            } else {
                toast.error("Could not get user")
            }
        }
        return null
    }

    return <UserContext.Provider value={{followToggle, rateUser, deleteUserRating,getUserById,updateUser}}>
        {children}
    </UserContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
    const context = React.useContext(UserContext)
    if(!context) {
        throw new Error("useUser must be used within an UserContextProvider")
    }
    return context
}