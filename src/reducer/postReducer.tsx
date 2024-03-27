import { IPostFull } from "../types/posts.types"

enum PostActionTypes {
    SORT_ASCENDING = "SORT_ASCENDING",
    SORT_DESCENDING = "SORT_DESCENDING",
    FILTER_BY_COMMENTS = "FILTER_BY_COMMENTS",
    FILTER_BY_USER = "FILTER_BY_USER",
    SEARCH = "SEARCH",
    SET_POSTS = "SET_POSTS"
}

export type PostAction = { type: PostActionTypes, payload?: IPostFull[] | string }
export type PostState = { posts: IPostFull[], copyPosts: IPostFull[]}
export const initialPostReducerState: PostState = { posts: [], copyPosts: []}

export function postsReducer(state: PostState, action:PostAction) {
    switch(action.type) {
        case PostActionTypes.SEARCH:
            if(!action.payload || action.payload === "") {
                return {posts: state.copyPosts, copyPosts: state.copyPosts}
            }
            return {
                posts: state.copyPosts.filter(post => 
                    post.title.toLowerCase().includes((action.payload as string).toLowerCase())
                     || post.message.toLowerCase().includes((action.payload as string).toLowerCase())), 
                copyPosts: state.copyPosts,
            }
        case PostActionTypes.SORT_ASCENDING:
            return {
                 posts: state.copyPosts.sort((a, b) => a.created_at.getTime() - b.created_at.getTime()),
                 copyPosts: state.copyPosts
                }
        case PostActionTypes.SORT_DESCENDING:
            return {
                posts: state.copyPosts.sort((a, b) => b.created_at.getTime() - a.created_at.getTime()),
                copyPosts: state.copyPosts
            }
        case PostActionTypes.FILTER_BY_COMMENTS:
            return {
                posts: state.copyPosts.filter(post => post.comments.length > 0), 
                copyPosts: state.copyPosts
            }
        case PostActionTypes.FILTER_BY_USER:
            return {
                posts: state.copyPosts.filter(post =>post.post_owner._id === action.payload || (typeof post.post_owner === 'string' && post.post_owner === action.payload)), 
                copyPosts: state.copyPosts}    
        case PostActionTypes.SET_POSTS:
            return {
                posts:(action.payload as IPostFull[]).sort((a, b) => b.created_at.getTime() - a.created_at.getTime()), 
                copyPosts: action.payload as IPostFull[]
            }
        default:
            return state
    }
}
  
// actions
export const sortAscending = () => ({type: PostActionTypes.SORT_ASCENDING })
export const sortDescending = () => ({type: PostActionTypes.SORT_DESCENDING})
export const filterByComments = () => ({type: PostActionTypes.FILTER_BY_COMMENTS})
export const filterByUser = (userId: string) => ({type: PostActionTypes.FILTER_BY_USER, payload: userId})
export const setPosts = (posts: IPostFull[]) => ({type: PostActionTypes.SET_POSTS, payload: posts})
export const search = (search: string) => ({type: PostActionTypes.SEARCH, payload: search})