import axios from 'axios'
import store from '../store'
import { getToken } from '@/utils/auth'

const service = axios.create({
    timeout: 15000
})

service.interceptors.request.use(
    config => {

        if (store.getters.token) {
            config.headers['X-Token'] = getToken()
        }
        return config
    },
    error => {
        Promise.reject(error)
    }
)

service.interceptors.response.use(
    response => {
        const res = response.data
        return res;


    },
    error => {
        /*Message({
          message: error.message,
          type: 'error',
          duration: 5 * 1000
        })*/
        return Promise.reject(error)
    }
)

export default service