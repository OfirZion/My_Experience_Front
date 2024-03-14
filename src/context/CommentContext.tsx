import React, { createContext, useState } from "react";
import { ICommentContext } from "../types/context.types";
import {  IPostFull } from "../types/posts.types";
import { ICommentForm } from "../types/schemas.types";

import * as postService from "../services/postService";
import { usePosts } from "./PostContext";
import {toast} from 'react-toastify'
const CommentContext = createContext<ICommentContext |null>(null)


export default function CommentContextProvider({children}: {children: React.ReactNode}) {
    const [post, setPost] = useState<IPostFull | undefined>(undefined)

    const {addCommentToPost,removeCommentFromPost} = usePosts()
    function openComments(post: IPostFull) {
        setPost(post)
    }

    function closeComments() {
        setPost(undefined)
    }

    async function addComment(comment: ICommentForm) {
        try {
            if(!post) {
                throw new Error("No post to add a comment to")
            }
            const newComment = await postService.addComment(post._id, comment)
            if(newComment.data) {
                setPost(addCommentToPost(post._id, newComment.data))
            } else {
                toast.error(newComment.message)
            }
            return newComment.data

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch(error: any) {
           console.log(error)
           if(error.status === 401) {
                toast.error("You must be logged in to add a comment")
           } else {
                toast.error(error.message)
           }
           return null
        }
    }

    async function removeComment(commentId: string) {
        try {
            if(!post) {
                throw new Error("No post to remove a comment from")
            }
            const removedComment = await postService.removeComment(commentId)
            if(removedComment.data) {
                setPost(removeCommentFromPost(post._id, removedComment.data._id))
            } else {
                toast.error(removedComment.message)
            }
            return removedComment.data

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch(e: any) {
            toast.error(e.message)
            return null
        }
    }

    return (
        <CommentContext.Provider value={{
            post,
            addComment,
            removeComment,
            openComments,
            closeComments
        }}>
            {children}
        </CommentContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useComment() {
    const context = React.useContext(CommentContext)
    if(!context) {
        throw new Error("useComment must be used within a CommentContextProvider")
    }
    return context
}