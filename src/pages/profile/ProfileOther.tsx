import { useNavigate, useParams } from "react-router";

import {useUser} from '../../context/UserContext'
import { useEffect, useMemo, useState } from "react";
import { IUserFull } from "../../types/auth.types";
import { useAuth } from "../../context/AuthContext";
function ProfileOther() {
    const {getUserById} = useUser()
    const {id} = useParams()
    const nav = useNavigate()

    const {user: currentUser} = useAuth()
    const [user, setUser] = useState<IUserFull | null>(null)
    useEffect(() => {
        const fetchUser = async () => {
            if(!id) return
            if(currentUser?._id === id) { 
                nav("/profile")
                return
            }
            const user = await getUserById(id as string)
            setUser(user)
        }
        fetchUser()
    },[id, currentUser,getUserById, nav])

    
    const averageRating = useMemo(() => {
        if(!user || user.ratings.length === 0) return 0
        return user.ratings.reduce((acc,curr) => acc + curr.rating_type, 0) / user?.ratings.length
    },[user])
    return <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">Profile</h1>
        <img src={user?.imgUrl} alt="profile" className="rounded-full w-32 h-32"/>
        <h2 className="text-xl">{user?.name}</h2>
        <h3 className="text-lg">{user?.age} years old</h3>
        <h4 className="text-lg">{user?.auth.email}</h4>
        <h4 className="text-lg">Number of ratings: {user?.ratings.length}</h4>
        <h4 className="text-lg">Average rating: {averageRating}</h4>
    </div>
}

export default ProfileOther