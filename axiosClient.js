import axios from 'axios'

const baseURL = 'https://api.gothereforeministries.org' // 'http://localhost:8041' // 

const axiosClient = axios.create({
  baseURL
})

export { axiosClient, baseURL }
