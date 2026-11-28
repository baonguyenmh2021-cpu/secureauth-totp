
import axios from 'axios'

const apiClient = axios.create({
    baseURL: '/api',

    timeout: 10000,

    withCredentials: true,

    headers: {
        'Content-Type': 'application/json',
    },
})

export default apiClient
