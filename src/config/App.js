import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import 'antd/dist/reset.css'
import { Image } from 'antd'
import '../styles/style.css'
import Routes from './Routes'
import { light, dark } from './theme'
import { getProfile } from '../services/profile'
// import { io } from 'socket.io-client'
// import { CONNECT_SOCKET } from '../redux/types/authTypes'
// import { getProfile } from '../services/profile'
// import { base_url } from './constants'
// const socket = io(base_url)
import logo from '../assets/logo.png'
const App = () => {
  const dispatch = useDispatch()
  const theme = useSelector((state) => state.theme.theme)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getDetails()
    } else {
      setLoading(false)
    }
  }, [])

  const getDetails = async () => {
    getProfile().then(() => {
      setLoading(false)
    })
  }

  // useEffect(() => {
  //   if (localStorage.getItem('token')) {
  //     console.log('auth before socket join',auth)
  //     getProfile()
  //     // let instance = socket.emit('join', 'userID')
  //     let instance = socket.emit('join', auth?.user?.user?._id)
  //     dispatch({
  //       type: CONNECT_SOCKET,
  //       payload: instance,
  //     })
  //   }
  // }, [])

  // useEffect(() => {
  //   socket?.on('reconnect', (data) => {
  //     console.log('Reconnect ping received', data)
  //     socket.emit('join', 'userID')
  //   })
  // }, [auth.socket])

  useEffect(() => {
    if (theme === 'light') {
      Object.keys(light).forEach((key) => {
        document.body.style.setProperty(`--${key}`, light[key])
      })
    } else {
      Object.keys(dark).forEach((key) => {
        document.body.style.setProperty(`--${key}`, dark[key])
      })
    }
  }, [theme])

  return (
    <div className='App'>
      {loading ? (
        <div
          style={{
            height: '100vh',
            padding: '60px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            src={logo}
            alt='logo'
            style={{ width: '100%', height: '50%', objectFit: 'fill' }}
          />
          {/* <TableLoader /> */}
        </div>
      ) : (
        <Routes />
      )}
    </div>
  )
}

export default App
