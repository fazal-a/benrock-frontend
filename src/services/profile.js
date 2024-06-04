/* eslint-disable no-empty */
import { attachToken, privateAPI } from '../config/constants'
import { notification } from 'antd'
import store from '../redux/store'
import { LOGIN } from '../redux/types/authTypes'

export const getProfile = async () => {
  try {
    attachToken()
    const res = await privateAPI.get('/me')
    console.log({ res })
    if (res) {
      await store.dispatch({
        type: LOGIN,
        payload: { user: res?.data },
      })
      console.log(res?.data)
      return res?.data
    }
  } catch (err) {
    notification.error({
      message: err?.response?.data?.message || 'Server Error',
      duration: 3,
      style: { marginTop: '50px' },
    })
  }
}

export const updateProfile = async (payload) => {
  try {
    attachToken()
    const res = await privateAPI.put('/me', payload)
    console.log('resprofile', res)
    if (res.status) {
      getProfile()

      return res?.data
    }
  } catch (err) {
    if (
      err.response &&
      err.response.status === 400 &&
      err.response.data &&
      err.response.data.error === 'Email already exist'
    ) {
      getProfile()
      throw err?.response?.data?.error
    } else {
      notification.error({
        message: err?.response?.data?.message || 'Server Error',
        duration: 3,
        style: { marginTop: '50px' },
      })
    }
  }
}
export const uploadProfile = async (file) => {
  try {
    attachToken()
    const formData = new FormData()
    formData.append('file', file)
    const res = await privateAPI.post('/me/upload', formData)
    // console.log({ res })
    if (res) {
      getProfile()

      return res?.data
    }
  } catch (err) {
    notification.error({
      message: err?.response?.data?.message || 'Server Error',
      duration: 3,
      style: { marginTop: '50px' },
    })
  }
}
export const deleteProfilePicture = async () => {
  try {
    attachToken()
    const res = await privateAPI.delete('/me/delete-picture')
    console.log({ res })
    if (res) {
      getProfile()
      console.log(res?.data)
      notification.error({
        message: res?.data?.message,
        duration: 3,
        style: { marginTop: '50px' },
      })
      return res?.data
    }
  } catch (err) {
    notification.error({
      message: err?.response?.data?.message || 'Server Error',
      duration: 3,
      style: { marginTop: '50px' },
    })
  }
}
