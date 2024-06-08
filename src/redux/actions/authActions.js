import { notification } from 'antd'
import { publicAPI, attachToken } from '../../config/constants'
import store from '../store'
import { LOGIN, TOGGLE_LIKE } from '../types/authTypes'

export const authSignup = (payload, navigate) => {
  return async (dispatch) => {
    try {
      const res = await publicAPI.post('/auth/register', payload)
      console.log({ payload })
      if (res) {
        attachToken()
        notification.success({
          description: res.data?.data.message,
          duration: 2,
        })
        // window.location.reload()
        dispatch(authRequestToken(payload?.email))
        navigate('/verifyEmail', { state: { email: payload?.email } })
      }
    } catch (err) {
      notification.error({
        message: err?.response?.data?.message || 'Server Error',
        duration: 3,
      })
    }
  }
}

export const authLogin = (payload, navigate, locationAccessGranted) => {
  return async (dispatch) => {
    try {
      const res = await publicAPI.post('/auth/login', payload)
      if (res) {
        let { data } = res.data
        console.log({ data })
        attachToken()
        if (data) {
          store.dispatch({
            type: LOGIN,
            payload: data,
          })
        }
        const isEmailVerified = data?.user?.emailVerified

        if (isEmailVerified) {
          localStorage.setItem('token', data?.token)
          localStorage.setItem('userId', data?.user?._id)
          if (locationAccessGranted) {
            navigate('/')
          } else {
            navigate('/profile')
          }
        } else {
          dispatch(authRequestToken(payload?.email))
          navigate('/verifyEmail', { state: { email: payload?.email } })
        }
      }
    } catch (err) {
      notification.error({
        message: err?.response?.data?.message || 'Server Error',
        duration: 3,
      })
    }
  }
}

export const authRequestToken = (payload) => {
  return async () => {
    try {
      const res = await publicAPI.post('/auth/requestEmailToken', { email: payload })
      console.log({ res })
      if (res) {
        attachToken()
        let { data } = res.data
        notification.success({
          description: data,
          duration: 2,
        })
      }
    } catch (err) {
      notification.error({
        message: err?.response?.data?.message || 'Server Error',
        duration: 3,
      })
    }
  }
}
export const authVerifyEmail = (payload, navigate) => {
  return async () => {
    try {
      const res = await publicAPI.post('/auth/verifyEmail', payload)
      console.log({ res })
      if (res) {
        attachToken()
        let { data } = res.data
        notification.success({
          description: data,
          duration: 2,
        })
        navigate('/login')
      }
    } catch (err) {
      notification.error({
        message: err?.response?.data?.message || 'Server Error',
        duration: 3,
      })
    }
  }
}
export const authforgetPassword = (payload, navigate) => {
  return async () => {
    try {
      const res = await publicAPI.post('/auth/forgotPassword', { email: payload })
      console.log({ res })
      if (res) {
        attachToken()
        let { data } = res.data
        notification.success({
          description: data,
          duration: 3,
          style: { marginTop: '50px' },
        })
        navigate('/resetPassword', { state: { email: payload } })
      }
    } catch (err) {
      notification.error({
        message: err?.response?.data?.message || 'Server Error',
        duration: 3,
        style: { marginTop: '50px' },
      })
    }
  }
}
export const authResetPassword = (payload, navigate) => {
  return async () => {
    try {
      const res = await publicAPI.post('/auth/resetPassword', payload)
      console.log({ res })
      if (res) {
        attachToken()
        let { data } = res.data
        notification.success({
          description: data,
          duration: 3,
          style: { marginTop: '50px' },
        })
        navigate('/login')
      }
    } catch (err) {
      notification.error({
        message: err?.response?.data?.message || 'Server Error',
        duration: 3,
        style: { marginTop: '50px' },
      })
    }
  }
}

export const toggleLikeAction = (attachmentId) => {
  return async (dispatch, getState) => {
    try {
      const { user } = getState().auth

      const isLiked = user.user.likes.includes(attachmentId)
      const updatedLikes = isLiked
        ? user.user.likes.filter((id) => id !== attachmentId)
        : [...user.user.likes, attachmentId]

      // Update the user object in Redux store
      dispatch({
        type: TOGGLE_LIKE,
        payload: updatedLikes,
      })
    } catch (err) {
      console.error('Error toggling like status:', err)
      notification.error({
        message: 'Error toggling like status',
        duration: 3,
      })
    }
  }
}
