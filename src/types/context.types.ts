import { IUser, IUserFull } from "./auth.types";
import { IResponse, IToken } from "./http.types";
import {  IPostCommentWithUserAndRatings, IPostFull, IPostRatingWithUser, IPostWithRatings } from "./posts.types";
import { ICommentForm, IPostForm, IPostRatingForm, IUserLoginForm, IUserRegistrationForm } from "./schemas.types";

export interface IContext {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: unknown
    setError: (error: unknown) => void;
}

export interface IAuthContext extends IContext {
    user: IUserFull | null;
    setUser: (user: IUserFull | null) => void;
    token: IToken | null;
    login: (form: IUserLoginForm) => Promise<IResponse<IToken>>;
    register: (form: IUserRegistrationForm) => Promise<IUser | null>
    logout: () => Promise<void>;
}


export interface IPostContext extends IContext {
    posts: IPostFull[];
    addPost: (post: IPostForm) => Promise<IPostFull | null>;
    addCommentToPost: (postId: string, comment: IPostCommentWithUserAndRatings) => IPostFull | undefined
    removeCommentFromPost: (postId: string, commentId: string) => IPostFull | undefined
    ratePost: (post: IPostWithRatings, rating: IPostRatingForm) => Promise<IPostRatingWithUser | null>;
}



export interface ICommentContext  {
    post: IPostFull | undefined
    addComment: (comment: ICommentForm) => Promise<IPostCommentWithUserAndRatings | null>
    removeComment: (commentId: string) => Promise<IPostCommentWithUserAndRatings | null>
    openComments: (post: IPostFull) => void
    closeComments: () => void
}