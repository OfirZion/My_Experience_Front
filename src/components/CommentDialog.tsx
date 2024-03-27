import React from "react"
import { useComment } from "../context/CommentContext"
import { IPostCommentWithUserAndRatings } from "../types/posts.types"

import { SendOutlined } from "@mui/icons-material"
import { DeleteOutline } from "@mui/icons-material"
import { CloseOutlined } from "@mui/icons-material"
import { useAuth } from "../context/AuthContext"



type CommentProps = {comment: IPostCommentWithUserAndRatings}

export function Comment ({ comment } : CommentProps) {
  
    const { removeComment } = useComment()
  
    const { user } = useAuth()


    return <div className="flex flex-row items-center justify-between gap-2">
    <div className="flex flex-row items-center gap-2">
        <img src="https://via.placeholder.com/150" alt="user" className="w-10 h-10 rounded-full"/>
        <div className="flex flex-col">
            <h1 className="font-bold">{comment.comment_owner_name}</h1>
            <p className="text-gray-500">{comment.message}</p>
            
        </div>
    </div>
    {user && (user._id === comment.comment_owner._id) 
        && <DeleteOutline className="text-red-500" onClick={() => removeComment(comment._id)}/>}
</div>
}


export default function CommentDialog() {
    const { post, addComment, closeComments } = useComment()
    const { user } = useAuth()
    const ref = React.useRef<HTMLInputElement | null>(null)
    
    const sendComment = () => { 
        const message = ref.current?.value
        if(!message) return
        
        addComment({
            message,
            comment_owner_name: user?.name ?? "Anonymous",
        })
        if(ref.current)
            ref.current.value = ""
    }

    if(!post) return null
    
    return <div className="fixed inset-0 bg-black bg-opacity-50 flex z-[9999] justify-center items-center h-full w-full">
        <div className="bg-white min-h-[400px] min-w-[400px] p-4 rounded-lg relative">
            <h1 className="text-2xl font-bold">Comments</h1>
            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-scroll">
                {post.comments.map(comment => <Comment comment={comment} key={comment._id}/>)}
            </div>
            <div className="w-full absolute bottom-[.5rem] left-[.25rem]" style={{display:'grid', gridTemplateColumns:'90% 10%',placeItems:'center'}}>
                <input ref={ref} type="text"
                
                placeholder="Write a comment..." className="w-full border-[1px] border-[lightgray] p-2 rounded-md"/>
                <SendOutlined className="text-blue-500" onClick={sendComment}/>
            </div>

            <hr/>
            <CloseOutlined fontSize="large" className=" text-blue-500 p-2 rounded-md ml-auto m-2 absolute top-0 right-[.25rem]" onClick={closeComments}/>
        </div>
    </div>
}