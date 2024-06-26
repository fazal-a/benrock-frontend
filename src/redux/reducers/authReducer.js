import { LOGIN, TOGGLE_LIKE } from '../types/authTypes'

const initialState = {
  token: localStorage.getItem('token'),
  user: null,
  socket: null,
}

const AuthReducer = (state = initialState, action) => {
  const { type } = action
  switch (type) {
    case LOGIN: {
      return {
        ...state,
        user: action?.payload,
      }
    }
    case 'CONNECT_SOCKET': {
      return {
        ...state,
        socket: action?.payload,
      }
    }
    case TOGGLE_LIKE: {
      return {
        ...state,
        user: {
          ...state.user,
          user: {
            ...state.user.user,
            likes: action?.payload
          },
        },
      };
    }

    default:
      return state
  }
}

export default AuthReducer
