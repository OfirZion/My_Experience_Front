import { useMemo, useRef, useState } from "react"
import { PostSchema, PostUpdateSchema } from "../../types/schemas.types"
import { usePosts } from "../../context/PostContext"
import { useNavigate, useParams } from "react-router"
import * as formStyles from "../../styles/forms.ts"
import {toast} from 'react-toastify'
import { useAuth } from "../../context/AuthContext.tsx"
import uploadFile from '../../services/fileService.ts'
import { DEFAULT_IMAGE } from "../../components/Post.tsx"
import { grammarCorrection } from "../../services/grammarCorrection.ts"
import Spinner from "../../components/Spinner.tsx"
export default function PostBody() {

    const [correctionLoading,setCorrectionLoading] = useState(false)
    const messageRef = useRef<HTMLTextAreaElement | null>(null)
    const [errors, setErrors] = useState<Map<string, string>>(new Map())
    const [imgFile, setImgFile] = useState<File | null>(null)
    const nav = useNavigate()
    const { addPost, editPost, error ,posts} = usePosts()
    const {user} = useAuth()

    const {id} = useParams() 
    const existingsPost = useMemo(() => posts.find(post => post._id === id), [posts, id])

    const correct =  async () => {
        if(!messageRef.current) return
        setCorrectionLoading(true)
        try {
            const corrected = await grammarCorrection(messageRef.current.value)
            if(corrected) {
                messageRef.current.value = corrected
            }else {
                toast.error("Failed to correct grammar")
            }
        }catch(error) {
            toast.error(`Failed to correct grammar: ${error}`)
        } finally {
            setCorrectionLoading(false)
        }
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const  form = e.target as HTMLFormElement
        const formData = new FormData(form)
        const data = Object.fromEntries(formData.entries())  
        const parseResult = existingsPost ? PostUpdateSchema.safeParse({
            ...data,
            post_owner_name: user!.name,
            exp_rating: data.exp_rating ? parseInt(data.exp_rating as string) : null
        }): PostSchema.safeParse({
            ...data,
            post_owner_name: user!.name,
            exp_rating: data.exp_rating ? parseInt(data.exp_rating as string) : null
        })
        if(parseResult.success) {
            const newPostData = parseResult.data
            if(imgFile) {
                const uploadResponse = await uploadFile(imgFile!)
                if(uploadResponse.data) {
                    newPostData.imgUrl = uploadResponse.data
                }
            }
            if(existingsPost) {
               
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const updatedPost = await editPost(id!, newPostData as any)
                if(updatedPost) {
                    form.reset()
                    toast.success("Post updated successfully")
                    nav("/")
                } else {
                    toast.error(`Post failed to update ${error}`)
                }
            } else {
               
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const newPost = await addPost(newPostData as any)
                if(newPost) {
                    form.reset()
                    toast.success("Post posted successfully")
                    nav("/")
                }else {
                    toast.error(`Post failed to post ${error}`)
                }
            }
            
        } else  {
           // create error dictionary
            const map = new Map<string,string>()
            for(const error of Object.entries(parseResult.error.formErrors.fieldErrors)) {
                map.set(error[0], error[1].join(", "))
            }
            setErrors(map)
        }
    }

    const clearErrors = () => {
        if(errors.size === 0) return
        setErrors(new Map())
    }
    const imgUrl = useMemo(() => {
        if (imgFile) 
            return URL.createObjectURL(imgFile)
        else if(existingsPost) {
            return existingsPost.imgUrl
        }
        else
            return DEFAULT_IMAGE 
    },[imgFile, existingsPost])
    const isPostEdit = existingsPost !== undefined
    

    return <form onSubmit={handleSubmit} className={formStyles.formStyle}>
        <img src={imgUrl} alt="user profile" className={formStyles.roundedImageStyle} />
        <input type="text" placeholder="Enter Title" defaultValue={existingsPost?.title} name="title" onChange={clearErrors}className={formStyles.inputStyle} />
        {errors.get('title') && <p className={formStyles.errorStyle}>{errors.get('title')}</p>}
        <textarea ref={messageRef} disabled={correctionLoading} placeholder="Enter Message" defaultValue={existingsPost?.message} name="message" onChange={clearErrors} className={formStyles.inputStyle} />
        {errors.get('message') && <p className={formStyles.errorStyle}>{errors.get('message')}</p>}
        <button type="button" disabled={correctionLoading} onClick={correct} className={`${formStyles.buttonStyle} flex flex-col items-center`}>
            <span>Correct Grammar</span>
            {correctionLoading && <Spinner size="md" tip={"Correcting..."}/>}
        </button>
        <input type="file" onChange={(e) => {
            if(e.target.files && e.target.files.length > 0)
                setImgFile(e.target.files[0])
        }} className={formStyles.inputStyle}  />
        {errors.get('imgUrl') && <p className={formStyles.errorStyle}>{errors.get('imgUrl')}</p>}
        <input type="number" defaultValue={existingsPost?.exp_rating} placeholder="Enter Overall experience (1-10 optional)" name="exp_rating" onChange={clearErrors} className={formStyles.inputStyle} />
        {errors.get('exp_rating') && <p className={formStyles.errorStyle}>{errors.get('exp_rating')}</p>}
        <button type="submit" className={formStyles.buttonStyle}>
            {isPostEdit ? "Edit Post" : "Add Post"}
        </button>
    </form>
}