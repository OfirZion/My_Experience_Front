import { Navigate } from "react-router"
import { useAuth } from "../../context/AuthContext"
import { useEffect } from "react"

import {toast} from 'react-toastify'
export default function Logout() {

    const {user, logout} = useAuth()
  
    useEffect(() => {
        if(!user) return
        logout().then(() => toast.info("Logged out successfully!"))
    }, [user, logout])

    if(!user) {
        return <Navigate to="/auth/login"/>
    } 


    return null
}