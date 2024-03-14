import { IFollow, IFollowWithFollowedUser, IFollowWithFollowerUser } from "./follow.types";
import { IPost } from "./posts.types";

export interface IUser {
    _id: string; 
    name: string;
    age: number;
    imgUrl?: string;
    auth: string | IUserAuth;
    ratings: (string | IUserRating)[]; 
    posts: (string | IPost)[]; 
    followers: (string | IFollow)[]; 
    following:  (string | IFollow)[];
} 

export interface IUserWithFollowers extends IUser {
    followers: IFollow[];
}

export interface IUserRating {
    rating_user: (string | IUser)
    rated_user: (string | IUser);
    _id: string;
    rating: string 
    rating_type: number; // 0-10
}
export interface IUserRatingFull extends IUserRating {
    rating_user: IUser
    rated_user: IUser;
}

export interface IUserRatingWithRatedUser extends IUserRating {
    rated_user: IUser;
}

export interface IUserFull extends IUser {
    followers: IFollowWithFollowerUser[];
    following: IFollowWithFollowedUser[];
    posts: IPost[];
    ratings: IUserRatingWithRatedUser[];
    auth: IUserAuth;
}

export interface IUserWithFollowing extends IUser {
    following: IFollow[];
}

export interface IUserWithPosts extends IUser {
    posts: IPost[];
}

export interface IUserWithRatings extends IUser {
    ratings: IUserRatingWithRatedUser[];
}

export interface IUseWithRatingsAndPosts extends IUser {
    ratings: IUserRatingWithRatedUser[];
    posts: IPost[];
}

export interface IUserWithAuth extends IUser {
    auth: IUserAuth;
}


export interface IUserAuth {
    email: string;
    password: string;
    refreshTokens?: string[]; 
    user: string // user id
}




