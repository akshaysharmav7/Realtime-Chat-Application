import axios from "axios";

export const API = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000" : "/api",
    withCredentials: true
})