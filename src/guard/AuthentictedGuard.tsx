import { FunctionComponent } from "react";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";


export default function AuthenticatedGuard<T extends object>(Component: FunctionComponent<T>) {

    return function useGuard(props: T) {
        const {user,loading} = useAuth()
        if(!user && loading) {
            return <Spinner size="lg" tip={"Loading..."}/>
        }
        if(!user) {
            return <div>
                <h1 className="text-2xl font-bold">You are not authenticated</h1>
                <p className="text-lg">Please login to continue <Link to="/auth/login">Login</Link></p>
            </div>
        }
        return <Component {...props}/>
    }
}