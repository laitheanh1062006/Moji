import {create} from "zustand";
import {toast} from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";




export const useAuthStore = create<AuthState>((set,get) => ({
    accessToken: null,
    user: null,
    loading: false,

    setAccessToken: (accessToken: string) => set({accessToken}),

    clearState: () => set({accessToken: null, user: null, loading: false}),

    signUp: async(username, password, email, firstname, lastname) =>{
        try{
            await authService.signUp(username, password, email, firstname, lastname);
            toast.success("Sign up success! Please sign in to continue.");
        } catch(error){
            console.error("Sign up wrong ", error);
            toast.error("Sign up wrong!");
        }
    },

    signIn: async(username, password) =>{
        try{
            set({loading: true});

            const res = await authService.signIn(username, password);

            get().setAccessToken(res.accessToken);

            await get().fetchMe();

            toast.success("Sign in successful. Welcome back to Moji!");
        } catch(error){
            console.error("Sign in wrong ", error);
            toast.error("Sign in wrong!");
        } finally {
            set({loading: false});
        }
    },

    signOut: async() =>{
        try{
            get().clearState();
            await authService.signOut();
            toast.success("Sign out success!");
        } catch(error){
            console.error("Sign out wrong ", error);
            toast.error("Sign out wrong!");
        }
    },

    fetchMe: async() =>{
        try {
            set({loading: true});
            const user = await authService.fetchMe();
            set({user});
        } catch (error) {
            console.error(error);
            set({user:null, accessToken:null});
            toast.error("Error while fetching user! Try again!");
        } finally {
            set({loading: false});
        }
    },

    refresh: async() =>{
        try {
            set({loading: true});
            const {user, fetchMe} = get();
            
            const accessToken = await authService.refresh();
            get().setAccessToken(accessToken);

            if(!user){
                await fetchMe();
            }
        } catch (error) {
            console.error(error);
            
            toast.error("Logged out due to token expired!");
            get().clearState();
        } finally {
            set({loading: false});
        }
    }
}))