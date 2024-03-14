import { FunctionComponent } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router";


export default function AlreadyLoggedGuard<T extends object>(Component: FunctionComponent<T>) {
    return function useGuard(props: T) {
        const {user} = useAuth()
        if(user) {
            return <Navigate to={"/"}/>
        }
        return <Component {...props}/>
    }
}