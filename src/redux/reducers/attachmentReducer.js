const initialState = {
  loading: 'false',
  file: null,
}

const attachmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      }
    case 'SET_FILE':
      return {
        ...state,
        file: action.payload,
      }

    default:
      return state
  }
}

export default attachmentReducer
