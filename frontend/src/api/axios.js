import axios from "axios";

const api = axios.create({
    baseURL: '/api',
})

api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('access')
    const isPublicEndpoint = config.url.includes('users/register/') || config.url.includes('users/login/')

    if(token && !isPublicEndpoint){
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})


export default api;