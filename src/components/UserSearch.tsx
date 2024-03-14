import { useCallback, useEffect, useState } from "react"
import {  IUserWithAuth } from "../types/auth.types"
import { getAllUsers } from "../services/usersService"
import {toast} from 'react-toastify'
import Spinner from "./Spinner"
import { Link } from "react-router-dom"
import AuthenticatedGuard from "../guard/AuthentictedGuard"
import { useAuth } from "../context/AuthContext"
import { useUser } from "../context/UserContext"


// eslint-disable-next-line react-refresh/only-export-components
 function UserSearch() {
    const {user: currentUser} = useAuth()
    const {followToggle,rateUser} = useUser()
    const [results,setResults] = useState<IUserWithAuth[]>([])

    const [allUsers,setAllUsers] = useState<IUserWithAuth[]>([])
    const [loading,setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers()
                const data = response.data?.filter((user: IUserWithAuth) => user._id !== currentUser?._id)
                if(data) {
                    setAllUsers(data)
                    setResults(data)
                }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch(e:any) {
                if((e.status || 200) / 100 !== 2) {
                    toast.error(e.message)
                } else {
                    toast.error("Error fetching users")
                }
            } finally {
                setLoading(false)
            }
        }
        fetchUsers()
    },[currentUser?._id]) 

    const rateUserPrompt = async (userId: string) => {
        const rating = prompt("Enter a rating", "5")
        if(isNaN(+rating!)) {
            toast.error("Rating must be a number")
            return
        }
        if(rating) {
           const rated = await rateUser(userId, +rating)
           if(rated) {
                toast.success("User rated")
           }
        }
    }

    const search = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        const filteredUsers = allUsers.filter(user => user.name.toLowerCase().includes(value.toLowerCase()))
        setResults(filteredUsers)
    } 

    const amFollowing = useCallback((otherUserId: string) => {
        const found = currentUser?.following.find(other => other.following._id === otherUserId)
        return found !== undefined
    },[currentUser])
    return <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Search for a user</h1>
        <input type="text" onChange={search} placeholder="Search for a user" className="p-2 border border-gray-300 rounded-md max-w-[300px]"/>
        <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">Results</h2>
                {loading && <Spinner size="lg"/>}
                 <div className="flex flex-col gap-4">
                    {results.map(user => <div key={user._id} className="flex flex-row items-center gap-4">
                    <img src="https://via.placeholder.com/150" alt="profile" className="rounded-full w-16 h-16"/>
                    <div>
                        <h3 className="text-lg font-bold">{user.name}</h3>
                        <h4 className="text-md">{user.auth.email}</h4>

                        <div className="flex flex-row gap-4">
                            <Link to={`/profile-other/${user._id}`} className="bg-green-500 text-white p-2 rounded-md">View Profile</Link>
                                <button onClick={() => rateUserPrompt(user._id)} className="bg-yellow-500 text-white p-2 rounded-md">Rate</button>
                                {amFollowing(user._id) ?
                                 <button onClick={() => followToggle(user._id)} className="bg-red-500 text-white p-2 rounded-md">Unfollow</button> 
                                 : <button onClick={() => followToggle(user._id)} className="bg-gray-500 text-white p-2 rounded-md">Follow</button>}
                            </div>
                            </div>
                      </div>)}
                  </div>    
            </div>
    </div>
}

// eslint-disable-next-line react-refresh/only-export-components
export default AuthenticatedGuard(UserSearch)