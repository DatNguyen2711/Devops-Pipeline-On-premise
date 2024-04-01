import axios from "axios";



const authApi = axios.create({
    baseURL: process.env.API_URL,
});

authApi.defaults.headers.common["Content-Type"] = "application/json";

authApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default authApi;