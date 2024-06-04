import { attachToken, privateAPI } from '../config/constants'
import { notification } from 'antd'
import store from '../redux/store'
import { setFileLoading } from '../redux/actions/attachmentAction'

export const uploadAttachments = async (files, type, setLoading) => {
  try {
    setLoading(true)
    attachToken()
    store.dispatch(setFileLoading(true))
    const formData = new FormData()
    formData.append('type', type)
    files.forEach((file, index) => {
      formData.append(`file`, file)
    })
    const res = await privateAPI.post('/attachment', formData)
    console.log('res :', res)
    if (res) {
      notification.success({
        message: res?.data?.data?.message,
        duration: 3,
        style: { marginTop: '50px' },
      })
      setLoading(false)
      getAttachments()
      return res?.data
    }
  } catch (err) {
    setLoading(false)
    notification.error({
      message: err?.response?.data?.message || 'Server Error',
      duration: 3,
      style: { marginTop: '50px' },
    })
  } finally {
    store.dispatch(setFileLoading(false))
  }
}
export const getAttachments = async () => {
  try {
    attachToken()
    const res = await privateAPI.get('/attachment')
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

export const getAttachmentsByUserID = async (id) => {
  console.log({ id })
  try {
    attachToken()
    const res = await privateAPI.get(`/attachment?user=${id}`)
    console.log({ res })
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

export const getRecentAttachments = async () => {
  try {
    attachToken()
    const res = await privateAPI.get('/attachment/getRecentAttachments')
    if (res) {
      return res
    }
  } catch (err) {
    notification.error({
      message: err?.response?.data?.message || 'Server Error',
      duration: 3,
      style: { marginTop: '50px' },
    })
  }
}

export const getNearestAttachments = async () => {
  try {
    attachToken()
    const res = await privateAPI.get('/attachment/getNearByAttachments')
    if (res) {
      return res
    }
  } catch (err) {
    console.log('err', err)
    notification.error({
      message: err?.response?.data?.message || 'Server Error',
      duration: 3,
      style: { marginTop: '50px' },
    })
  }
}

export const addClick = async (id) => {
  try {
    attachToken()
    const res = await privateAPI.post(`/attachment/addClick/${id}`)
    if (res) {
      return res
    }
  } catch (err) {
    notification.error({
      message: err?.response?.data?.message || 'Server Error',
      duration: 3,
      style: { marginTop: '50px' },
    })
  }
}
