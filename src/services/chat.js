import { attachToken, privateAPI } from '../config/constants'
import { notification } from 'antd'
import store from '../redux/store'
import { SET_CHAT, SET_CHATS, SET_CONTACTS } from '../redux/types/chatTypes'
import { setFileLoading } from '../redux/actions/attachmentAction'

export const getContacts = async () => {
  try {
    attachToken()
    const res = await privateAPI.get('/chat/contacts')
    if (res) {
      console.log('res ---->', res)
      store.dispatch({
        type: SET_CONTACTS,
        payload: res?.data,
      })
    }
  } catch (err) {
    notification.error({
      message: err?.response?.data?.message || 'Server Error',
      duration: 3,
      style: { marginTop: '50px' },
    })
  }
}

export const getChats = async () => {
  try {
    attachToken()
    const res = await privateAPI.get('/chat')
    if (res) {
      // console.log('chats res', res?.data)
      store.dispatch({
        type: SET_CHATS,
        payload: res?.data?.data?.chats,
      })
    }
  } catch (err) {
    notification.error({
      message: err?.response?.data?.message || 'Server Error',
      duration: 3,
      style: { marginTop: '50px' },
    })
  }
}

export const getSingleChat = async (chatId) => {
  try {
    attachToken()
    const res = await privateAPI.get(`/chat/getOne/${chatId}`)
    if (res) {
      // console.log('chats res single', res?.data)
      store.dispatch({
        type: SET_CHAT,
        payload: { messages: res?.data?.data?.messages, chatId: res?.data?.data?.chat },
      })
    }
  } catch (err) {
    notification.error({
      message: err?.response?.data?.message || 'Server Error',
      duration: 3,
      style: { marginTop: '50px' },
    })
  }
}

export const createChat = async (payload) => {
  try {
    attachToken()
    const res = await privateAPI.post('/chat', { users: payload })
    if (res) {
      return res
      // store.dispatch({
      //   type: SET_CHATS,
      //   payload: res?.data,
      // })
    }
  } catch (err) {
    notification.error({
      message: err?.response?.data?.message || 'Server Error',
      duration: 3,
      style: { marginTop: '50px' },
    })
  }
}

export const sendMessage = async (payload, setLoading) => {
  try {
    console.log('payload', payload)
    setLoading(true)
    attachToken()
    store.dispatch(setFileLoading(true))

    const res = await privateAPI.post('/chat/send-message', payload)
    if (res) {
      setLoading(false)
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
