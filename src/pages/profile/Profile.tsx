import { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import AuthenticatedGuard from "../../guard/AuthentictedGuard";


// eslint-disable-next-line react-refresh/only-export-components
function Profile() {

    const {user} = useAuth()

    const averageRating = useMemo(() => {
        if(!user || user.ratings.length === 0) return 0
        console.log(user.ratings)
        return user.ratings.reduce((acc,curr) => acc + curr.rating_type, 0) / user.ratings.length
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

// eslint-disable-next-line react-refresh/only-export-components
export default AuthenticatedGuard(Profile)