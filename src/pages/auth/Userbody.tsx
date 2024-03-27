import { useEffect, useMemo, useState } from "react"
import { UserRegistrationSchema, UserUpdateSchema } from "../../types/schemas.types.ts"
import { useLocation, useNavigate } from "react-router"
import * as formStyles from "../../styles/forms.ts"
import { useAuth } from "../../context/AuthContext.tsx"
import uploadFile from '../../services/fileService.ts'
import {toast} from 'react-toastify'
import { DEFAULT_IMAGE } from "../../components/Post.tsx"
import { useUser } from "../../context/UserContext.tsx"
import { IUserAuth, IUserFull } from "../../types/auth.types.ts"
import { GoogleLogin } from '@react-oauth/google';


export default function Userbody() {


    const location = useLocation()


    const [errors, setErrors] = useState<Map<string, string>>(new Map())
    const [imgSrc,setImgSrc] = useState<File | null>(null)
    const {user, googleLogin,register,error} = useAuth()
    const {updateUser} = useUser()
    const nav = useNavigate()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const  form = e.target as HTMLFormElement
        const formData = new FormData(form)
       
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = Object.fromEntries(formData.entries())  
        const parseResult = isEditPage ? 
            UserUpdateSchema.safeParse({
                ...data,
                age: data.age ? parseInt(data.age as string) : null
            }) :  UserRegistrationSchema.safeParse({
                ...data,
                age: data.age ? parseInt(data.age as string) : null
            })
        if(parseResult.success) {
            if(imgSrc) {
                try {
                    const img = await uploadFile(imgSrc)
                    if(img.data) {
                        parseResult.data.imgUrl = img.data
                    }
                } catch (error) {
                    toast.error(`Image upload failed: ${error}`)
                }
            }
            if(isEditPage) {
                const authData : Partial<IUserAuth> = {}
                if(data.password && data.password.length > 0) {
                    authData.password = data.password
                    console.log(authData)
                }
                const userData : Partial<IUserFull> = {
                    name: parseResult.data.name,
                    age: parseResult.data.age,
                }
                if(parseResult.data.imgUrl) {
                    userData.imgUrl = parseResult.data.imgUrl
                }
                const updatedUser = await updateUser(authData, userData)
                if(updatedUser) {
                    form.reset()
                    toast.success("User updated successfully")
                    nav("/profile")
                } else {
                    toast.error(`User update failed: ${error}`)
                }
            } else {
               
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const newUser = await register(parseResult.data as any)
                if(newUser) {
                    form.reset()
                    toast.success("Registered successfully, you may login!")
                    nav("/auth/login")
                } else {
                    toast.error(`Registration failed: ${error}`)
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

    const isEditPage = useMemo(() => location.pathname === "/user/edit", [location])

    useEffect(() => {
        if(!isEditPage) {
           if(user) nav("/user/edit")
        } else {
            if(!user) nav("/auth/login")
        }
    },[location, user, nav, isEditPage])


    const imgUrl = useMemo(() => {
        if (imgSrc) 
            return URL.createObjectURL(imgSrc)
        else if(user) {
            return user.imgUrl
        }
        else
            return DEFAULT_IMAGE 
    },[user,imgSrc])
    

    return <form onSubmit={handleSubmit} className={formStyles.formStyle}>
        <img src={imgUrl} alt="user profile" className={formStyles.roundedImageStyle} />
        <input type="text" defaultValue={user?.name} placeholder="Enter Full name" name="name" onChange={clearErrors}className={formStyles.inputStyle} />
        {errors.get('name') && <p className={formStyles.errorStyle}>{errors.get('name')}</p>}
        <input type="number" placeholder="Enter Age" defaultValue={user?.age} name="age" onChange={clearErrors} className={formStyles.inputStyle} />
        {errors.get('age') && <p className={formStyles.errorStyle}>{errors.get('age')}</p>}
        <input type="file" onChange={(e) => {
            if(e.target.files && e.target.files.length > 0)
                setImgSrc(e.target.files[0])
        }} className={formStyles.inputStyle}  />
        {errors.get('imgUrl') && <p className={formStyles.errorStyle}>{errors.get('imgUrl')}</p>}
        <input type="email" disabled={isEditPage} defaultValue={user?.auth?.email} placeholder="Enter Email address" name="email" onChange={clearErrors} className={formStyles.inputStyle} />
        {errors.get('email') && <p className={formStyles.errorStyle}>{errors.get('email')}</p>}
        <input type="password" placeholder="Enter Password" name="password" onChange={clearErrors} className={formStyles.inputStyle} />
        {errors.get('password') && <p className={formStyles.errorStyle}>{errors.get('password')}</p>}
        <button type="submit" className={formStyles.buttonStyle}>{
            isEditPage ? "Save changes" : "Register"
        }</button>

        {!isEditPage && <GoogleLogin
                containerProps={{
                    className:"mx-auto"
                }}
                onSuccess={credentialResponse => {
                    if(credentialResponse.credential) {
                        googleLogin(credentialResponse.credential)
                    }
                    else {
                        toast.error('Login Failed')
                    }
                }}
                onError={() => {
                    toast.error('Login Failed')
                }}
        />}
    </form>
}