import { Layout, notification } from 'antd'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Header } from 'antd/es/layout/layout'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { imageBaseUrl } from '../config/constants'
import { LOGIN } from '../redux/types/authTypes'
import { getProfile } from '../services/profile'
import MainMenu from './MainMenu'

const VerticalLayout = ({ children, active }) => {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()

  // const dispatch = useDispatch()
  const navigate = useNavigate()
  const { Sider, Content } = Layout
  const theme = useSelector((state) => state.theme.theme)

  return (
    <div className='v-layout'>
      <Layout>
        <Sider trigger={null} collapsible width={200}>
          <MainMenu active={active} />
        </Sider>
        <Layout className='site-layout'>
          <Header>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '.5rem', fontSize: '18px' }}>
              <strong style={{ color: 'var(--textColor)' }}>Hello, </strong>
              <p style={{ color: 'var(--primary)' }}>{user?.user?.name}</p>
            </div>

            <img
              src={user?.user?.photo ? `${imageBaseUrl}/${user?.user?.photo}` : logo}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                cursor: 'pointer',
                outline: '1px solid gray',
                objectFit: 'contain',
              }}
              onClick={() => navigate('/profile')}
            />
          </Header>
          <Content className='main-content'>{children}</Content>
        </Layout>
      </Layout>
    </div>
  )
}

export default VerticalLayout
