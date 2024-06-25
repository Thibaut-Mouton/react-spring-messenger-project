import axios, {AxiosError, AxiosInstance} from "axios"

export abstract class HttpMainService {

    protected instance: AxiosInstance

    protected constructor() {
        const baseURL = process.env.NODE_ENV === "development" ? "http://localhost:9090/api" : "http://production-url.com/api"
        this.instance = axios.create({
            withCredentials: true,
            baseURL
        })
        this.instance.interceptors.request.use((config) => {
            config.headers["X-CSRF-TOKEN"] = document.cookie.replace(/(?:^|.*;\s*)XSRF-TOKEN\s*=\s*([^;]*).*$|^.*$/, "$1")
            return config
        })
        this.instance.interceptors.response.use((response) => {
            return response
        }, (error: AxiosError) => {
            if (error.response && error.response.status === 403) {
                if (window.location.pathname !== "/login") {
                    window.location.pathname = "/login"
                }
            }
            return Promise.reject(error)
        })
    }
}
