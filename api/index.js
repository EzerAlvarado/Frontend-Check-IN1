import axios from "axios"

const baseurl = "http://192.168.1.190:8000"
const defaultOptions = {
    baseURL:baseurl,
    timeout : 36000,
    headers : {
        'Content-Type': 'application/json',
      },
}

const http = axios.create(defaultOptions)


export default http