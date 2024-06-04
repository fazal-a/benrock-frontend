import React from 'react'
import ReactDOM from 'react-dom'
import App from './config/App'
import { Provider } from 'react-redux'
import { ConfigProvider } from 'antd'
import * as Ably from 'ably'
import { AblyProvider } from 'ably/react'
import store from './redux/store'

let clientId = localStorage.getItem('userId')
const client = new Ably.Realtime.Promise({
  key: 'vQNuYw.jLNiXg:ZrWKXA6f574CeVkZ_Wa3m8XnvdOywwzfoogIj986Rkw',
  clientId,
})

ReactDOM.render(
  <Provider store={store}>
    <ConfigProvider
      theme={{
        token: {
          // colorPrimary: '#F55139',
        },
      }}
    >
      <AblyProvider client={client}>
        <App />
      </AblyProvider>
    </ConfigProvider>
  </Provider>,
  document.getElementById('root'),
)
