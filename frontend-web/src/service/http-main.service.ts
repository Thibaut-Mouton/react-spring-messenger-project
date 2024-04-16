import axios, {AxiosInstance} from "axios"
import {Csrf} from "../interface-contract/csrf/csrf.type"

export abstract class HttpMainService {

    protected instance: AxiosInstance

    protected constructor() {
        const baseURL = process.env.NODE_ENV === "development" ? "http://localhost:9090/api" : "http://production-url.com/api"
        this.instance = axios.create({
            withCredentials: true,
            baseURL
        })
        this.instance.interceptors.response.use((response) => {
            const csrf = localStorage.getItem("csrf")
            if (csrf) {
                const {headerName, token} = JSON.parse(csrf) as Csrf
                response.config.headers[headerName] = token
            }
            return response
        }, (error) => {
            return Promise.reject(error)
        })
    }
}
