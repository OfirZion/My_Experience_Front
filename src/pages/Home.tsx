import {  useCallback, useEffect, useReducer} from "react";
import Page from "../components/Page";
import { usePosts } from "../context/PostContext";
import Spinner from "../components/Spinner";
import Post from "../components/Post";
import { useAuth } from "../context/AuthContext";
import {filterByComments, filterByUser, initialPostReducerState, postsReducer, search, setPosts, sortAscending, sortDescending } from "../reducer/postReducer";

export default function Home() {

    const {loading, posts: allPosts} = usePosts()

    const [{ posts}, dispatch] = useReducer(postsReducer, initialPostReducerState)

    useEffect(() => {
        dispatch(setPosts(allPosts))
    }, [allPosts])


    const {user} = useAuth()
        

    const Posts = useCallback(() => {
        if(loading) {
            return <Spinner size="lg" tip={"Loading posts..."}/>
        }
        return <div className="flex flex-col gap-[2rem] p-4 items-center w-full mb-[32px]">
            <div className="flex flex-row items-center gap-2">
                <button onClick={() => dispatch(setPosts(allPosts))} className="bg-blue-500 text-white p-2 rounded-md">
                        All posts
                </button>
                <button onClick={() => dispatch(sortAscending())} className="bg-blue-500 text-white p-2 rounded-md">
                        Sort old to new
                </button>
                <button onClick={() => dispatch(sortDescending())} className="bg-blue-500 text-white p-2 rounded-md">
                        Sort new to old
                </button>
                <button onClick={() => dispatch(filterByComments())} className="bg-blue-500 text-white p-2 rounded-md">
                        Show posts with comments
                </button>
                {user && 
                <button onClick={() => dispatch(filterByUser(user._id))} className="bg-blue-500 text-white p-2 rounded-md">
                        Show My posts
                </button>}
            </div>
            {posts.map(post => <Post post={post} key={post._id}/>)}
            </div>
    }, [posts, loading, user, allPosts])

    return <Page>
        <div className="flex flex-col">
        <input placeholder="Search something.." 
                    className="border-2 border-gray-300 mx-auto  rounded-md p-2 focus:outline-none focus:border-blue-500"
                    onInput={(e) =>  {
                
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    dispatch(search((e.target as any).value))
        }}/>
        <Posts/>
        </div>
    </Page>
}