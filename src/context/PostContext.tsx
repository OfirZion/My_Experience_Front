import { IPostContext } from "../types/context.types";
import React, { useEffect } from "react";
import { IPostForm, IPostRatingForm } from "../types/schemas.types";
import { useAuth } from "./AuthContext";
import * as postService from "../services/postService";
import { findPostRating, normalizeDate, normalizePosts, updatePostRating } from "../utils";
import {   IPostCommentWithUserAndRatings, IPostFull, IPostWithRatings } from "../types/posts.types";
const PostContext = React.createContext<IPostContext | null>(null)


export default function PostContextProvider({children}: {children: React.ReactNode}) {
    const auth  = useAuth()

    const [posts, setPosts] = React.useState<IPostContext["posts"]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<IPostContext["error"]>(null);


    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await postService.getPosts();
                if(response.data) {
                    setPosts(normalizePosts(response.data, auth.user?._id))
                } else {
                    throw new Error(response.message)
                }
            } catch (error) {
                setError(error)
            } finally {
                setLoading(false)
            }
        }
        if(!auth.loading) // if the auth context is not loading
            fetchPosts()
    }, [auth.loading, auth.user])


    function addCommentToPost(postId: string, comment:IPostCommentWithUserAndRatings) {
        const post = posts.find(post => post._id === postId)
        if(post) {
            post.comments.push(comment)
            setPosts([...posts])
        }
        return post
    }
    function removeCommentFromPost(postId: string, commentId: string) {
        const post = posts.find(post => post._id === postId)
        if(post) {
            const commentIndex = post.comments.findIndex(comment => comment._id === commentId)
            if(commentIndex !== -1) {
                post.comments.splice(commentIndex, 1)
                setPosts([...posts])
            }
        }
        return post
    }

    async function addPost(post: IPostForm) {
        try {
            if(!auth.user) {
                throw new Error("You must be logged in to add a post")
            }
            const response = await postService.createPost(post)
            if(response.data) {
                setPosts([...posts, normalizeDate(response.data)])
            } else {
                throw new Error(response.message)
            }
            return response.data
        } catch (error) {
            setError(error)
            return null
        }
    }
    async function editPost(postId: string, post: Partial<IPostFull>) {
        try {
            if(!auth.user) {
                throw new Error("You must be logged in to add a post")
            }
            const response = await postService.editPost(postId,post)
            const newPost = response.data
            if(newPost) {
                setPosts(posts.map(post => post._id === postId ? normalizeDate(newPost) : post))
            } else {
                throw new Error(response.message)
            }
            return response.data
        } catch (error) {
            setError(error)
            return null
        }
    }
    async function deletePost(postId: string) {
        try {
            if(!auth.user) {
                throw new Error("You must be logged in to add a post")
            }
            const response = await postService.removePost(postId)
            if(response.data) {
                setPosts(posts.filter(post => post._id !== postId))
            } else {
                throw new Error(response.message)
            }
            return response.data
        } catch (error) {
            setError(error)
            return null
        }
    }

    async function ratePost(post: IPostWithRatings, rating: IPostRatingForm) {
        try {
            if(!auth.user) {
                throw new Error("You must be logged in to add a post")
            }
            const existingRatingIndex = findPostRating(post, auth.user._id)
            
            const response = await postService.ratePost(post._id, rating)
            if(response.data) {
                const postFromArray = posts.find(somePost => somePost._id === post._id)
                if(existingRatingIndex !== -1) { // existing rating
                    // if the user clicks the same rating type again, remove the rating
                    updatePostRating(postFromArray!, existingRatingIndex, rating)
                    const newPosts = [...posts]
                    setPosts(newPosts)
                } else { // new rating
                    postFromArray!.isLikedByCurrentUser = rating.rating_type === 1
                    postFromArray!.isDislikedByCurrentUser = rating.rating_type === -1
                    postFromArray!.ratings.push(response.data)
                    const newPosts = [...posts]
                    setPosts(newPosts)
                }
            } else {
                throw new Error(response.message)
            }
            return response.data
        } catch (error) {
            setError(error)
            return null
        }
    }

    return <PostContext.Provider value={{posts, loading, error,
         setLoading, setError, addPost, ratePost,deletePost, editPost,
     addCommentToPost,removeCommentFromPost}}>
        {children}
    </PostContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePosts() {
    const context = React.useContext(PostContext);
    if(!context) {
        throw new Error("usePost must be used within a PostContextProvider")
    }
    return context;
}