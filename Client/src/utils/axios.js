import axios from "axios";
import SummaryApi, { baseURL } from "../common/SummaryApi";

const plainAxios = axios.create(); // no interceptors attached


const Axios = axios.create({
    baseURL : baseURL,
    withCredentials : true
})

//sending access token in the header

Axios.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken')
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config  // Always return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

//extend the life span of access token with the help of refresh

Axios.interceptors.response.use(
    (response)=>{
        return response
    },
    async (error) => {
        let originalRequest = error.config

        if(error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true

            const refreshToken = localStorage.getItem('refreshToken')

            if(refreshToken){
                const newAccessToken = await refreshAccessToken(refreshToken)

                if(newAccessToken){
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                    return Axios(originalRequest)
                }
            }
        }
        return Promise.reject(error)
    }
)

//getting new accesstoken from backend by sending refreshtoken
const refreshAccessToken = async(refreshToken)=>{
    try {
        const response = await plainAxios({
            ...SummaryApi.refreshToken,
            headers : {
                Authorization : `Bearer ${refreshToken}`  //passing headers so that backend can know who making request
            }
        })
        const accessToken = response.data.data.accessToken
        localStorage.setItem('accessToken', accessToken)
        return accessToken

    } catch (error) {
        console.log(error)
    }
}

export default Axios