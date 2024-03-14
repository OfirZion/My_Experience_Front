import { useCallback } from "react";
import Page from "../components/Page";
import { usePosts } from "../context/PostContext";
import Spinner from "../components/Spinner";
import Post from "../components/Post";


export default function Home() {


    const {posts,loading} = usePosts()

    const Posts = useCallback(() => {
        if(loading) {
            return <Spinner size="lg" tip={"Loading posts..."}/>
        }
        return <div className="flex flex-col gap-[2rem] p-4">
            {posts.map(post => <Post post={post} key={post._id}/>)}
            </div>
    },[posts, loading])

    return <Page>
        <Posts/>
    </Page>
}