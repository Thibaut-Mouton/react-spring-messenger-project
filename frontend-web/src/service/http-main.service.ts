import axios, {AxiosInstance} from "axios"

export abstract class HttpMainService {

    protected instance: AxiosInstance

    protected constructor() {
        const baseURL = process.env.NODE_ENV === "development" ? "http://localhost:9090/api" : "http://production-url.com/api"
        this.instance = axios.create({
            withCredentials: true,
            baseURL
        })
        this.instance.interceptors.request.use((config) => {
            const csrfToken = document.cookie.replace(/(?:^|.*;\s*)XSRF-TOKEN\s*=\s*([^;]*).*$|^.*$/, "$1")
            config.headers["X-CSRF-TOKEN"] = csrfToken
            return config
        })
        this.instance.interceptors.response.use((response) => {
            return response
        }, (error) => {
            console.log("ERROR", error)
            return Promise.reject(error)
        })
    }
}
