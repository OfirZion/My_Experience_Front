import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCallback } from "react";
import Spinner from "./Spinner";


export default function Navbar() {

    const {user, loading} = useAuth()
    const AuthNavButtons = useCallback(() => {
        if(loading) {
            return <li>
                <Spinner/>
            </li>
        }
        if(user) {
            return <>
                <li>
                    <Link to="/profile">Profile</Link>
                </li>
                <li>
                    <Link to="/post-body">Create Post</Link>
                </li>
                <li>
                    <Link to="/explore-users">Explore users</Link>
                </li>
                <li>
                    <Link to="/logout">Logout</Link>
                </li>
            </>
        }
        return <>
            <li>
                <Link to="/auth/login">Login</Link>
            </li>
            <li>
                <Link to="/auth/register">Register</Link>
            </li>
      </> 
    },[user,loading])



    return <nav >
    <ul className="flex flex-row items-center justify-between gap-2 p-2 bg-slate-600 text-white">
      <li>
        <Link to="/">Home</Link>
      </li>
      <div className="flex flex-row items-center gap-2">
      <AuthNavButtons/>
      </div>
    </ul>
  </nav>
}