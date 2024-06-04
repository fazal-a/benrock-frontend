import Axios from 'axios'
// export const base_url = 'http://192.168.100.14:8001'
// export const base_url = 'http://192.168.100.12:8001'
// export const base_url = 'http://192.168.100.68:8001'

// export const base_url = 'https://drab-calf-tank-top.cyclic.app'
export const base_url = 'http://localhost:8001/'
export const publicAPI = Axios.create({ baseURL: base_url })

export const privateAPI = Axios.create({ baseURL: base_url })

export const attachToken = async () => {
  const jwt = localStorage.getItem('token')
  privateAPI.defaults.headers.common.Authorization = `${jwt}`
  // console.log("Token Attached");
}

export const imageBaseUrl = 'https://social-app-project.s3.us-east-005.backblazeb2.com'
export const AblyAPIKey = 'YDKSJA.880uXg:q-lpTmRiQFpDWWc15BjTtBllcFgh10sJHbgNQXumNH8'
export const clientId = localStorage.getItem('token')
console.log({ clientId })
