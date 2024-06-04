import { LOGIN } from '../types/authTypes'
import {
  SET_CHAT,
  SET_CHATS,
  SET_CHAT_MESSAGES,
  SET_CONTACTS,
  SET_LOADING_CHAT,
} from '../types/chatTypes'

const initialState = {
  loading: false,
  chats: [],
  contacts: [],
  chat: {},
}

const ChatReducer = (state = initialState, action) => {
  const { type } = action
  switch (type) {
    case SET_LOADING_CHAT: {
      return {
        ...state,
        loading: action.payload,
      }
    }
    case SET_CONTACTS: {
      return {
        ...state,
        loading: false,
        contacts: action?.payload,
      }
    }
    case SET_CHATS: {
      return {
        ...state,
        loading: false,
        chats: action?.payload,
      }
    }
    case SET_CHAT: {
      return {
        ...state,
        loading: false,
        chat: action?.payload,
      }
    }

    case SET_CHAT_MESSAGES: {
      return {
        ...state,
        loading: false,
        chat: {
          ...state.chat,
          messages: action?.payload,
        },
      }
    }
    default:
      return state
  }
}

export default ChatReducer
