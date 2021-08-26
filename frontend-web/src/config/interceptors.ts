import axios from "axios";

const jwtToken: string | null = localStorage.getItem("authorization");

axios.interceptors.request.use(
    (config) => {
        console.log("Interceptors")
        if (jwtToken) {
            config.headers["authorization"] = "Bearer " + jwtToken;
        }
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);