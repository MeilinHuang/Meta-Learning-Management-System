import React from 'react';
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "./useAuth";

// wrap the components that require authentication
const RequireAuth = ({ isStaff }) => {
    const { auth } = useAuth();    // use auth context
    const location = useLocation(); // for redirecting page
    
    // React.useEffect(() => {
    //     const a = JSON.parse(localStorage.getItem('auth'))
    //     if (a !== undefined) {
    //         setAuth(a)
    //     }
    // }, [])
    
    const a = JSON.parse(localStorage.getItem('auth'))
    if (a !== undefined) {
        return a.staff === isStaff         // check if the current user is staff
            ? <Outlet />    // render children
            : a.email   // check if current user exists (anyone logged in)
                ? <Navigate to="/unauthorized" state={{ from: location }} replace /> // if user is not staff, show unauthorized page
                : <Navigate to="/authentication/sign-in" state={{ from: location }} replace />        // if no user logged in, redirect to login page
   
    } else {
        return (
            auth?.staff === isStaff         // check if the current user is staff
                ? <Outlet />    // render children
                : auth?.email   // check if current user exists (anyone logged in)
                    ? <Navigate to="/unauthorized" state={{ from: location }} replace /> // if user is not staff, show unauthorized page
                    : <Navigate to="/authentication/sign-in" state={{ from: location }} replace />        // if no user logged in, redirect to login page
        );
    }


}

export default RequireAuth;