import { useState } from "react"
import { UserLoginSchema } from "../../types/schemas.types"
import { useNavigate } from "react-router"
import * as formStyles from "../../styles/forms.ts"
import { useAuth } from "../../context/AuthContext.tsx"
import {toast} from 'react-toastify'
import { GoogleLogin } from '@react-oauth/google';

  
export default function Login() {
    const [errors, setErrors] = useState<Map<string, string>>(new Map())
    const nav = useNavigate()
    const {login, googleLogin} = useAuth()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const  form = e.target as HTMLFormElement
        const formData = new FormData(form)
        const data = Object.fromEntries(formData.entries())  
        const parseResult = UserLoginSchema.safeParse(data)
        if(parseResult.success) {
            const loginResponse = await login(parseResult.data)
            if(loginResponse && loginResponse.data) {
                form.reset()
                toast.success("Welcome! have fun exploring our website")
                nav("/")
            } else {
                toast.error(`Login failed: ${loginResponse?.message ?? "Unknown error"}`)
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
        <input type="email" placeholder="Enter Email address" name="email" onChange={clearErrors} className={formStyles.inputStyle} />
        {errors.get('email') && <p className={formStyles.errorStyle}>{errors.get('email')}</p>}
        <input type="password" placeholder="Enter Password" name="password" onChange={clearErrors} className={formStyles.inputStyle} />
        {errors.get('password') && <p className={formStyles.errorStyle}>{errors.get('password')}</p>}
        <button type="submit" className={formStyles.buttonStyle}>Login</button>
        <GoogleLogin
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
        />
    </form>
}