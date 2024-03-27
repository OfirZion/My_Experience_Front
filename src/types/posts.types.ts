import { IUser } from "./auth.types";

export type RatingType = 1 | -1

export interface IPost {
    _id: string;
    title: string;
    message: string;
    post_owner_name: string;
    post_owner: string | IUser
    ratings: (string| IPostRating)[];
    imgUrl?: string;
    exp_rating: number;
    created_at: Date;
    comments: (string | IPostComment)[];
    // the following fields are not in the database
    isLikedByCurrentUser: boolean;
    isDislikedByCurrentUser: boolean;
}


export interface IPostComment {
    _id: string;
    title: string;
    message: string;
    post: (string | IPost); 
    ratings: (string | ICommentRating)[];
    comment_owner_name: string;
    comment_owner: (string| IUser); 
} 



export interface ICommentRating {
    _id: string;
    user: (string | IUser)
    comment: string; // comment id
    rating_type: RatingType; // 1 for like, -1 for dislike
} 

export interface IPostRating {
    _id: string;
    user: (string | IUser) 
    rating: string; 
    post: (string | IPost);
    rating_type: RatingType; // 1 for like, -1 for dislike
} 



export interface ICommentRatingWithUser extends ICommentRating {
    user: IUser;
}
export interface IPostCommentWithUser extends IPostComment {
    comment_owner: IUser;
}

export interface IPostCommentWithRatings extends IPostComment {
    ratings: ICommentRatingWithUser[];
}

export interface IPostCommentWithUserAndRatings extends IPostCommentWithUser {
    ratings: ICommentRating[];
}

export interface IPostRatingWithPost extends IPostRating {
    post: IPost;
}

export interface IPostRatingWithUser extends IPostRating {
    user: IUser;
}

export interface IPostRatingWithUserAndPost extends IPostRatingWithPost {
    user: IUser;
}

export interface IPostWithRatings extends IPost {
    ratings: IPostRating[];
}

export interface IPostWithUser extends IPost {
    post_owner: IUser;
}

export interface IPostWithUserAndRatings extends IPostWithUser {
    ratings: IPostRating[];
}

export interface IPostWithComments extends IPost {
    comments: IPostComment[];
}

export interface IPostWithUserAndComments extends IPostWithUser {
    comments: IPostComment[];
}

export interface IPostWithUserAndRatingsAndComments extends IPostWithUserAndRatings {
    comments: IPostComment[];
}

export interface IPostFull extends IPost {
    ratings: IPostRating[];
    comments: IPostCommentWithUserAndRatings[];
    post_owner: IUser;
}

