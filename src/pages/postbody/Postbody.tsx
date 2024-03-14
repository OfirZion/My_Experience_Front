import { useState } from "react"
import { PostSchema } from "../../types/schemas.types"
import { usePosts } from "../../context/PostContext"
import { useNavigate } from "react-router"
import * as formStyles from "../../styles/forms.ts"
import {toast} from 'react-toastify'
import { useAuth } from "../../context/AuthContext.tsx"

export default function PostBody() {
    const [errors, setErrors] = useState<Map<string, string>>(new Map())
    const nav = useNavigate()
    const {addPost,error} = usePosts()
    const {user} = useAuth()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const  form = e.target as HTMLFormElement
        const formData = new FormData(form)
        const data = Object.fromEntries(formData.entries())  
        const parseResult = PostSchema.safeParse({
            ...data,
            post_owner_name: user!.name,
            exp_rating: data.exp_rating ? parseInt(data.exp_rating as string) : null
        })
        if(parseResult.success) {
            const newPost = await addPost(parseResult.data)
            if(newPost) {
                form.reset()
                toast.success("Post posted successfully")
                nav("/")
            }else {
                toast.error(`Post failed to post ${error}`)
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

    return <form onSubmit={handleSubmit} className={formStyles.formStyle}>
        <input type="text" placeholder="Enter Title" name="title" onChange={clearErrors}className={formStyles.inputStyle} />
        {errors.get('title') && <p className={formStyles.errorStyle}>{errors.get('title')}</p>}
        <input type="text" placeholder="Enter Message" name="message" onChange={clearErrors} className={formStyles.inputStyle} />
        {errors.get('message') && <p className={formStyles.errorStyle}>{errors.get('message')}</p>}
        <input type="text" placeholder="Enter Image URL" name="imgUrl" onChange={clearErrors} className={formStyles.inputStyle}  />
        {errors.get('imgUrl') && <p className={formStyles.errorStyle}>{errors.get('imgUrl')}</p>}
        <input type="number" placeholder="Enter Overall experience (1-10 optional)" name="exp_rating" onChange={clearErrors} className={formStyles.inputStyle} />
        {errors.get('exp_rating') && <p className={formStyles.errorStyle}>{errors.get('exp_rating')}</p>}
        <button type="submit" className={formStyles.buttonStyle}>Add post</button>
    </form>
}