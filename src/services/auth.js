import { publicAPI } from '../config/constants'

const signUp = async (values) => {
  try {
    console.log('values', values)
    let response = await publicAPI.post('/auth/register', values)
    if (response?.status === 200) {
      console.log('response?.data', response?.data?.data)
    }
  } catch (error) {
    console.log(error?.response?.data?.message)
  }
}

const login = async (values, navigate) => {
  try {
    console.log('values', values)
    let response = await publicAPI.post('/auth/login', values)
    if (response?.status === 200) {
      console.log('response?.data', response?.data?.data)
      navigate('/')
    }
  } catch (error) {
    console.log(error?.response?.data?.message)
  }
}

export { signUp, login }
