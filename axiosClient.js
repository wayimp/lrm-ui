import axios from 'axios'

const baseURL = 'http://localhost:8041' // 'https://api.gothereforeministries.org' // 

const axiosClient = axios.create({
  baseURL
})

module.exports = { axiosClient, baseURL }
