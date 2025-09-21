import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

//zustand
export const useAuthStore = create((set) => ({
    authUser: {name: "john", _id: 123, age: 25},
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,

    checkAuth: async() =>{ 
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
          
        } catch (error) {
            console.log("Error in authCheck");
            set({ authUser: null });
        } finally{
            set({ isCheckingAuth: false });
        }
    },

    signup: async(data) =>{
        set({ isSigningUp: true })
        try {
            const res = await axiosInstance.post("/auth/signup", data)
            set({ authUser: res.data });
            toast.success("Account created successfully!");
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({ isSigningUp: false})
        }
    },

    login: async(data) => {
        set({isLoggingIn: true});
        try {console.log("test")
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");

        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    logout: async() =>{
        try {
            await axiosInstance.get("/auth/logout");
            set({ authUser: null })
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error.response.data.message);  
            console.log("Logout error:", error);
        }finally{
            set({ isSigningUp: false})
        }
    }
}));