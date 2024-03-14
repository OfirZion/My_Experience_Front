import { useState } from "react"
import { UserRegistrationSchema } from "../../types/schemas.types"
import { useNavigate } from "react-router"
import * as formStyles from "../../styles/forms.ts"
import { useAuth } from "../../context/AuthContext.tsx"
import {toast} from 'react-toastify'
export default function Register() {
    const [errors, setErrors] = useState<Map<string, string>>(new Map())
    const nav = useNavigate()
    const {register,error} = useAuth()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const  form = e.target as HTMLFormElement
        const formData = new FormData(form)
        const data = Object.fromEntries(formData.entries())  
        const parseResult = UserRegistrationSchema.safeParse({
            ...data,
            age: data.age ? parseInt(data.age as string) : null
        })
        if(parseResult.success) {
            const newUser = await register(parseResult.data)
            if(newUser) {
                form.reset()
                toast.success("Registered successfully, you may login!")
                nav("/auth/login")
            }else {
                toast.error(`Registration failed: ${error}`)
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
        <input type="text" placeholder="Enter Full name" name="name" onChange={clearErrors}className={formStyles.inputStyle} />
        {errors.get('name') && <p className={formStyles.errorStyle}>{errors.get('name')}</p>}
        <input type="number" placeholder="Enter Age" name="age" onChange={clearErrors} className={formStyles.inputStyle} />
        {errors.get('age') && <p className={formStyles.errorStyle}>{errors.get('age')}</p>}
        <input type="text" placeholder="Enter Image URL" name="imgUrl" onChange={clearErrors} className={formStyles.inputStyle}  />
        {errors.get('imgUrl') && <p className={formStyles.errorStyle}>{errors.get('imgUrl')}</p>}
        <input type="email" placeholder="Enter Email address" name="email" onChange={clearErrors} className={formStyles.inputStyle} />
        {errors.get('email') && <p className={formStyles.errorStyle}>{errors.get('email')}</p>}
        <input type="password" placeholder="Enter Password" name="password" onChange={clearErrors} className={formStyles.inputStyle} />
        {errors.get('password') && <p className={formStyles.errorStyle}>{errors.get('password')}</p>}
        <button type="submit" className={formStyles.buttonStyle}>Register</button>
    </form>
}