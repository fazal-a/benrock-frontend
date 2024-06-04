import { attachToken, privateAPI } from '../config/constants'
import { notification } from 'antd'
import store from '../redux/store'
import { setFileLoading } from '../redux/actions/attachmentAction'
export const getALLusers = async () => {
  try {
    attachToken()
    const res = await privateAPI.get(`/auth/getUsers`)
    if (res) {
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

export const addReview = async (payload) => {
  try {
    // setLoading(true)
    attachToken()
    // store.dispatch(setFileLoading(true))

    const res = await privateAPI.post('/review', payload)
    if (res) {
      // setLoading(false)

      return res?.data
    }
  } catch (err) {
    // setLoading(false)
    notification.error({
      message: err?.response?.data?.message || 'Server Error',
      duration: 3,
      style: { marginTop: '50px' },
    })
  } finally {
    store.dispatch(setFileLoading(false))
  }
}
export const getReviews = async (id) => {
  try {
    attachToken()
    let string = ''
    if (id) string = `?givenTo=${id}`
    const res = await privateAPI.get(`/review/${string}`)
    if (res) {
      return res?.data
    }
    // return {}
  } catch (err) {
    notification.error({
      message: err?.response?.data?.message || 'Server Error',
      duration: 3,
      style: { marginTop: '50px' },
    })
  }
}
