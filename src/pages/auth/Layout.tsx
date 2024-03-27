import {  Outlet, useLocation } from "react-router";
import Page from "../../components/Page";
import { Link } from "react-router-dom";
import { useCallback } from "react";
import AlreadyLoggedGuard from "../../guard/AlreadyLoggedGuard";

// eslint-disable-next-line react-refresh/only-export-components
function Layout() {

    const { pathname }= useLocation()

    const BottomButton = useCallback(() => {
        return <div className="p-2 text-black flex flex-row justify-center gap-2">
            <Link to={
                pathname === "/auth/login" ? "/auth/register" : "/auth/login"
            }>
                {pathname === "/auth/login" ? "Don't have an account yet? " : "Already have an account? "}
                <b className="text-[#2c2c69]">
                    {pathname === "/auth/login" ? "Create one now" : "Login now"}
                </b>
            </Link>
        </div>
    }, [pathname])
    
    return <Page>
        <Outlet/>
        <BottomButton/>
    </Page>
}
// eslint-disable-next-line react-refresh/only-export-components
export default AlreadyLoggedGuard(Layout)