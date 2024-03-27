import axios from "axios"
import { IResponse } from "../types/http.types"
import {   IPostCommentWithUserAndRatings, IPostFull, IPostRatingWithUser } from "../types/posts.types"
import { ICommentForm, IPostForm, IPostRatingForm } from "../types/schemas.types"
import { withHandleError } from "../utils"


export const  getPosts = withHandleError(async () => {
    const response = await axios.get<IResponse<IPostFull[]>>("/posts")
    return response.data
})

export const createPost = withHandleError(async (post: IPostForm) => {
    const response = await axios.post<IResponse<IPostFull>>("/posts", post)
    return response.data
})
export const editPost = withHandleError(async (postId: string, post: Partial<IPostFull>) => {
    const response = await axios.put<IResponse<IPostFull>>(`/posts/${postId}`, post)
    return response.data
})

export const removePost = withHandleError(async (postId: string) => {
    const response = await axios.delete<IResponse<IPostFull>>(`/posts/${postId}`)
    return response.data
})

export const ratePost = withHandleError(async (postId: string, form: IPostRatingForm) => {
    const response = await axios.put<IResponse<IPostRatingWithUser>>(`/postRatings/${postId}`,form)
    return response.data
})

export const addComment = withHandleError(async (postId: string, comment: ICommentForm) => {
    const response = await axios.post<IResponse<IPostCommentWithUserAndRatings>>(`/comments/${postId}`, comment)

    return response.data
})

export const removeComment = withHandleError(async (commentId: string) => {
    const response = await axios.delete<IResponse<IPostCommentWithUserAndRatings>>(`/comments/${commentId}`)
    return response.data
})