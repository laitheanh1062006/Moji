import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore'
import { Navigate, Outlet } from 'react-router';

const ProtectedRoute = () => {
    const {accessToken, user, loading, refresh, fetchMe} = useAuthStore();
    const [starting, setStarting] = useState(true);

    const init = async () => {
        if(!accessToken){
            await refresh();
        }
        if(!user){
            await fetchMe();
        }
        setStarting(false);
    }

    useEffect(() => {
        init();
    }, []);

    if(loading || starting){
        return <div className='flex justify-center items-center h-screen'>Loading page...</div>
    }


    if (!accessToken){
        return(
            /* Redirect to login replace avoid user to back to protected page */
            <Navigate to="/signin" replace />
            
        )
    }
    return (
        <div>
            <Outlet></Outlet>
        </div>
    )
}

export default ProtectedRoute
