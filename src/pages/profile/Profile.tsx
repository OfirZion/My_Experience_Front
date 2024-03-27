import { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import AuthenticatedGuard from "../../guard/AuthentictedGuard";
import { Link } from "react-router-dom";


// eslint-disable-next-line react-refresh/only-export-components
function Profile() {

    const {user} = useAuth()

    const averageRating = useMemo(() => {
        if(!user || user.ratings.length === 0) return 0
        return user.ratings.reduce((acc,curr) => acc + curr.rating_type, 0) / user.ratings.length
    },[user])

    return  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr',marginTop:'32px'}}>
       
     <div className="flex flex-col items-center gap-4 max-w-[300px] mx-auto min-w-[300px] h-fit border-[1px] rounded-lg p-2 border-[lightgray]">
        <h1 className="text-2xl font-bold">Profile</h1>
        <img src={user?.imgUrl} alt="profile" className="rounded-full w-32 h-32 object-contain"/>
        <Link to="/user/edit" className="bg-blue-500 text-white p-2 rounded-md">Edit Profile</Link>
        <h2 className="text-xl font-bold">{user?.name}</h2>
        <h3 className="text-md">{user?.age} years old</h3>
        <h4 className="text-md">{user?.auth.email}</h4>
        <h4 className="text-md">Number of ratings: {user?.ratings.length}</h4>
        <h4 className="text-md">Average rating: {averageRating}</h4>
        </div>
        <div className="grid grid-cols-2 ">
            <div className="flex flex-col  gap-2 items-start">
                <div className="font-bold border-b-[1px] border-b-[lightgray]">Following</div>
                <ul className="max-h-[600px] overflow-y-scroll no-scrollbar">
                    {user?.following.map(f => 
                    <li key={f.following._id}>
                        <Link to={`/profile-other/${f.following._id}`}>{f.following.name}</Link>
                    </li>)}
                </ul>
            </div>
            <div className="flex flex-col gap-2 items-start">
                <div className="font-bold border-b-[1px] border-b-[lightgray]">Followers</div>
                <ul className="max-h-[600px] overflow-y-scroll no-scrollbar">
                    {user?.followers.map(f => 
                    <li key={f.follower._id}>
                        <Link to={`/profile-other/${f.follower._id}`}>{f.follower.name}</Link>
                    </li>)}
                </ul>
            </div>
        </div>
    </div>
}

// eslint-disable-next-line react-refresh/only-export-components
export default AuthenticatedGuard(Profile)