import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate } from 'react-router';


const Logout = () => {
    const {signOut} = useAuthStore();
    const navigate = useNavigate();
    const handleLogOut = async () => {
        try{
            await signOut();
            navigate("/signin");
        } catch(error){
            console.error(error);
            
        }
    }

    return (
        <button onClick={handleLogOut}>Log Out</button>
    )
}

export default Logout;