import axios from "axios"

const baseurl = "http://127.0.0.1:8000"
const defaultOptions = {
    baseURL:baseurl,
    timeout : 36000,
    headers : {
        'Content-Type': 'application/json',
      },
}

const http = axios.create(defaultOptions)


export default http