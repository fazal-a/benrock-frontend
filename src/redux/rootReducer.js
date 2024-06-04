import { combineReducers } from 'redux'

import theme from './reducers/themeReducer'
import auth from './reducers/authReducer'
import chat from './reducers/chatReducer'
import attachment from './reducers/attachmentReducer'

const rootReducer = combineReducers({
  theme,
  auth,
  chat,
  attachment,
})

export default rootReducer
