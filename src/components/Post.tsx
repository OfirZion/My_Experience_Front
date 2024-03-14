import { useMemo } from "react";
import { usePosts } from "../context/PostContext";
import { IPostFull } from "../types/posts.types";
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useComment } from "../context/CommentContext";

const DEFAULT_IMAGE = "https://t3.ftcdn.net/jpg/04/34/72/82/360_F_434728286_OWQQvAFoXZLdGHlObozsolNeuSxhpr84.jpg"
const likedStyle = (isLikedByCurrentUser: boolean) => isLikedByCurrentUser ? "text-[green] font-bold w-[1rem] text-[12px]" : "text-[black] font-bold w-[1rem] text-[12px]"
const dislikedStyle = (isDislikedByCurrentUser: boolean) => isDislikedByCurrentUser ? "text-[red] font-bold w-[1rem] text-[12px]" : "text-[black] font-bold w-[1rem] text-[12px]"
export default function Post({post} : {post: IPostFull}) {
    const { ratePost } = usePosts()
    const { openComments } = useComment()
    const likes = useMemo(() => post.ratings.filter(r => r.rating_type === 1).length, [post.ratings])
    return <div>
            <div className="flex flex-row gap-2 items-center">
            <img className="rounded-full border-[1px] border-[lighrtgray]" width={30} height={30} src={post.post_owner.imgUrl ?? DEFAULT_IMAGE}></img>
                <div>{post.post_owner_name}</div>
            </div>
            {post.imgUrl && <img src={post.imgUrl} width={300} height={400} className="rounded-md border-[1px] border-[lightgray] my-2"/>}   
            
        <div className="flex flex-row gap-1 items-center py-2">
            <ThumbDownIcon fontSize="small" onClick={() => ratePost(post, {rating_type:-1})} 
                        className={dislikedStyle(post.isDislikedByCurrentUser)}/>

            <ThumbUpIcon fontSize="small" onClick={() => ratePost(post, {rating_type:1})} 
                        className={likedStyle(post.isLikedByCurrentUser)}/>
        </div>
           <div> {likes} likes</div>
            <div className="flex flex-row items-center gap-2 max-w-[300px] max-h-[100px] overflow-y-scroll">
                <div className={"font-bold"}>{post.post_owner_name}</div>
                <div className="text-[22px]">{post.message}</div>
            </div>
            {post.comments.length === 0 ? 
            <div 
                onClick={() => openComments(post)}
                className="text-[gray] font-bold cursor-pointer">No comments</div> : 
            <div
                onClick={() => openComments(post)}
                className="text-[gray] font-bold cursor-pointer">View all {post.comments.length} comments</div>}

            <div className="text-[12px] text-[gray]">
                {post.isLikedByCurrentUser ? "You liked this post." : post.isDislikedByCurrentUser ? "You disliked this post." : ""}
            </div>
            <hr className="my-[1rem]"/>
        </div>
}