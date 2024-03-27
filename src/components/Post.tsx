import { useMemo } from "react";
import { usePosts } from "../context/PostContext";
import { IPostFull } from "../types/posts.types";
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useComment } from "../context/CommentContext";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import {Modal} from 'antd'
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { toBeautifiedDate } from "../utils";

export const DEFAULT_IMAGE = "https://t3.ftcdn.net/jpg/04/34/72/82/360_F_434728286_OWQQvAFoXZLdGHlObozsolNeuSxhpr84.jpg"
const likedStyle = (isLikedByCurrentUser: boolean) => isLikedByCurrentUser ? "text-[green] font-bold w-[1rem] text-[12px]" : "text-[black] font-bold w-[1rem] text-[12px]"
const dislikedStyle = (isDislikedByCurrentUser: boolean) => isDislikedByCurrentUser ? "text-[red] font-bold w-[1rem] text-[12px]" : "text-[black] font-bold w-[1rem] text-[12px]"


export default function Post({post} : {post: IPostFull}) {
    const { ratePost } = usePosts()
    const nav = useNavigate()
    const {user} = useAuth()
    const {deletePost } = usePosts()
    const { openComments } = useComment()
    const likes = useMemo(() => post.ratings.filter(r => r.rating_type === 1).length, [post.ratings])
    return <div style={{boxShadow:'rgba(0, 0, 0, 0.16) 0px 1px 4px', border:'1px solid lightgray'}} className=" z-[100] relative flex flex-row items-start  overflow-y-hidden rounded-lg max-w-[900px] w-full">
            
            {post.imgUrl && <img src={post.imgUrl} height={400} className="rounded-md w-[300px] h-[300px] object-contain"/>}   
            <div className="p-2 w-full">
            <div className="flex flex-row gap-2 items-center pt-2">
            <div className="flex flex-col gap-2">
            <div className="text-[22px] font-bold">{post.title}</div>
               <div className="flex flex-row items-center py-2">
                    <img className="rounded-full border-[1px] border-[lighrtgray]" width={30} height={30} src={post.post_owner.imgUrl ?? DEFAULT_IMAGE}></img>
                    <div>{post.post_owner_name}</div>
                    <div className="text-[12px] text-[gray] ml-4">{toBeautifiedDate(post.created_at)}</div>
                </div> 
                </div>
          
            </div>
            <div className="py-4 pl-2 w-full">
                <textarea  disabled value={post.message} className="text-[18px] w-full min-h-[150px]  max-h-[200px] h-full overflow-y-scroll"/>
            </div>
        <div className="flex flex-col gap-1 items-center py-2 pl-2 absolute right-4 bottom-4">
        <div className="flex flex-row items-center gap-2 justify-end">
            <div className="flex flex-col items-center">
             
                <div className="flex flex-row gap-2">
                    <div className="flex flex-row items-center gap-2">
                    <ThumbDownIcon fontSize="small" onClick={() => ratePost(post, {rating_type:-1})} 
                                    className={dislikedStyle(post.isDislikedByCurrentUser)}/>

                        <ThumbUpIcon fontSize="small" onClick={() => ratePost(post, {rating_type:1})} 
                                    className={likedStyle(post.isLikedByCurrentUser)}/>
                    </div>
                    <div className="pl-2"> {likes} likes</div>

                     </div>
                     <div className="text-[12px] text-[gray] pl-2">
                    {post.isLikedByCurrentUser ? "You liked this post." : post.isDislikedByCurrentUser ? "You disliked this post." : ""}
                </div>
            </div>
           
        </div>
        </div>
        <div className="text-[18px] text-[black] font-bold pl-2">Overall rating:{post.exp_rating}</div>

        <div className="h-full min-h-[20px] flex flex-col justify-end">
            {post.comments.length === 0 
                ?   <div 
                onClick={() => openComments(post)}
                className="text-[gray] font-bold cursor-pointer pl-2">No comments</div>
                 :  <div
                onClick={() => openComments(post)}
                className="text-[gray] font-bold cursor-pointer pl-2">View all {post.comments.length} comments</div>}
        </div>
            {user && (user._id === post.post_owner._id || typeof post.post_owner === 'string' && user._id === post.post_owner) 
        && <div className="absolute top-4 right-4">
            <DeleteOutline className="text-red-500" onClick={() =>  {
            Modal.confirm({
                title: 'Are you sure you want to delete this post?',
                content: 'This action cannot be undone',
                async onOk() {
                    await deletePost(post._id)
                    toast.success("Post deleted successfully", {
                        autoClose: 2000
                    })
                },
                okButtonProps: {
                    danger: true
                }
            })
        }}/>
         <EditOutlined className="text-blue-500" onClick={() =>  {
            nav(`/post-edit/${post._id}`)
        }}/>
            </div>}
          
            </div>
            <hr className="my-[1rem]"/>
        </div>
}