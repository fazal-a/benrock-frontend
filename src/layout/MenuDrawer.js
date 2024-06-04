import React, { useState } from 'react'
import { Drawer, Button } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import { BiArrowBack } from 'react-icons/bi'

import MainMenu from './MainMenu'
// import WhiteLogo from '../assets/Logo.png'
import logo from '../assets/logo.png'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const MenuStyle = {
  cursor: 'pointer',
  background: 'transparent',
  border: 'none',
  outline: 'none',
  fontSize: '20px',
  height: 'auto',
}

const MenuDrawer = ({ active }) => {
  const [visible, setVisible] = useState(false)
  const theme = useSelector((state) => state.theme.theme)
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)

  const showDrawer = () => {
    setVisible(!visible) // Toggle the value of 'visible'
  }

  const onClose = () => {
    setVisible(false)
  }

  return (
    <>
      <div className='m-header'>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Button onClick={showDrawer} style={MenuStyle}>
            <MenuOutlined />
          </Button>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '.5rem',
              fontSize: '18px',
              alignItems: 'center',
            }}
          >
            <strong style={{ color: 'var(--textColor)' }}>Hello, </strong>
            <p style={{ color: 'var(--primary)' }}>{user?.user?.name}</p>
          </div>
        </div>
      </div>
      <Drawer
        className='mobile-menu-drawer'
        placement='left'
        closable={false}
        onClose={onClose}
        open={visible}
        width={200}
        style={{ zIndex: 6 }}
      >
        <div style={{ marginTop: '40px' }}>
          {/* <div
            // className='m-drawer'
            style={{ backgroundColor: 'var(--dark)', padding: '1rem 0 0 2rem', width: '100%' }}
          >
            <BiArrowBack
              onClick={() => setVisible(false)}
              className='back-arrow'
              color={theme === 'dark' ? '#000' : '#fff'}
              style={{ marginTop: '40px' }}
            />
          </div> */}
          <MainMenu active={active} setVisible={setVisible} visible={visible} />
        </div>
      </Drawer>
    </>
  )
}

export default MenuDrawer
