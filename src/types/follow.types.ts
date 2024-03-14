import { IUser } from "./auth.types";

export interface IFollow {
    _id: string;
    follower: string | IUser
    following: string | IUser
    dateAdded?: Date; 
} 

export interface IFollowWithUsers extends IFollow {
    follower: IUser
    following: IUser
}
export interface IFollowWithFollowedUser extends IFollow {
    following: IUser
}

export interface IFollowWithFollowerUser extends IFollow {
    follower: IUser
}