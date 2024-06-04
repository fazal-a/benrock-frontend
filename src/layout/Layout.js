import React, { useEffect } from 'react'
import { notification } from 'antd'

import VerticalLayout from './VerticalLayout'
import MobileLayout from './MobileLayout'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

const Layout = ({ children, active }) => {
  const user = useSelector((state) => state.auth.user)
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.user?.emailVerified == false) {
      notification.error({
        message: 'Your Email is not Verified',
        duration: 3,
        style: { marginTop: '50px' },
      })

      localStorage.removeItem('token')
      navigate('/login')
    } else if (user == null) {
      localStorage.removeItem('token')
      navigate('/login')
    }
  }, [])
  return (
    <div className='layout'>
      {window.innerWidth > 800 ? (
        <VerticalLayout children={children} active={active} />
      ) : (
        <MobileLayout active={active}>{children}</MobileLayout>
      )}
    </div>
  )
}

export default Layout
