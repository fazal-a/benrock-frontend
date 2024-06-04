import { Menu } from 'antd'
import {
  FaComment,
  FaGlobeEurope,
  FaPaperPlane,
  FaRocket,
  FaRocketchat,
  FaUser,
  FaUserAltSlash,
  FaUserCircle,
} from 'react-icons/fa'
import { FcEnteringHeavenAlive } from 'react-icons/fc'
import { MdLogout, MdOutlineFeed, MdPersonOutline } from 'react-icons/md'
import { TiHeartFullOutline, TiMessages } from 'react-icons/ti'

import { IoChatbubblesOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import Logo from '../assets/logosidbar.png'
import { useSelector } from 'react-redux'
import { useState } from 'react'

const MainMenu = ({ active }) => {
  const theme = useSelector((state) => state.theme.theme)
  const navigate = useNavigate()

  return (
    <Menu
      mode={'inline'}
      defaultSelectedKeys={[active]}

      // style={{
      //   background: 'green',
      // }}
    >
      <nav className='navLinks'>
        <div style={{ marginTop: '20px' }}>
          <div className='company-logo'>
            <img
              src={Logo}
              alt='logo'
              style={{ width: 100, cursor: 'pointer' }}
              onClick={() => navigate('/')}
            />
          </div>
          <div
            style={{
              boxShadow: active === 'map' ? '0 0 4px var(--primary)' : 'none',
              borderRadius: '10px',
            }}
            className='div'
          >
            <Menu.Item
              key='map'
              className={'sidebar-menu'}
              icon={
                <FaGlobeEurope
                  style={{
                    color: active === 'map' ? 'hotpink' : '#FFBF00',
                    boxShadow: active === 'map' ? '0px 0px 3px 3px pink' : 'none',
                    borderRadius: '10px',
                  }}
                  className='menu-icon'
                />
              }
              onClick={() => navigate('/')}
              style={{
                paddingLeft: '5px',
              }}
            >
              <p
                style={{
                  color: active === 'map' ? 'hotpink' : '#fff',
                }}
              >
                Map
              </p>
            </Menu.Item>
          </div>
          <div
            style={{
              boxShadow: active === 'feed' ? '0 0 4px var(--primary)' : 'none', // Add box shadow when active
              borderRadius: '10px',
            }}
            className='div'
          >
            <Menu.Item
              key='feed'
              className={'sidebar-menu'}
              icon={
                <MdOutlineFeed
                  style={{
                    color: active === 'feed' ? 'hotpink' : 'purple',
                    boxShadow: active === 'feed' ? '0px 0px 3px 3px pink' : 'none',
                    borderRadius: '10px',
                  }}
                  className='menu-icon'
                />
              }
              onClick={() => navigate('/feed')}
              style={{
                paddingLeft: '5px',
              }}
            >
              <p
                style={{
                  color: active === 'feed' ? 'hotpink' : '#fff  ',
                }}
              >
                Feed
              </p>
            </Menu.Item>
          </div>

          <div
            style={{
              boxShadow: active === 'chat' ? '0 0 4px var(--primary)' : 'none', // Add box shadow when active
              borderRadius: '10px',
            }}
          >
            <Menu.Item
              key='chat'
              className={'sidebar-menu'}
              icon={
                <FaRocketchat
                  style={{
                    color: active === 'chat' ? 'hotpink' : '#008080',
                    boxShadow: active === 'chat' ? '0px 0px 3px 3px pink' : 'none',
                    borderRadius: '10px',
                  }}
                  className='menu-icon'
                />
              }
              onClick={() => navigate('/chat')}
              style={{
                color: active === 'chat' ? 'hotpink' : '#fff',

                paddingLeft: '5px',
              }}
            >
              <p
                style={{
                  color: active === 'chat' ? 'hotpink' : '#fff',
                }}
              >
                Chat
              </p>
            </Menu.Item>
          </div>

          <div
            style={{
              boxShadow: active === 'profile' ? '0 0 4px var(--primary)' : 'none', // Add box shadow when active
              borderRadius: '10px',
            }}
          >
            <Menu.Item
              key='profile'
              className={'sidebar-menu'}
              icon={
                <FaUserCircle
                  style={{
                    color: active === 'profile' ? 'hotpink' : '#004080',
                    boxShadow: active === 'profile' ? '0px 0px 3px 3px pink' : 'none',
                    borderRadius: '10px',
                  }}
                  className='menu-icon'
                />
              }
              onClick={() => navigate('/profile')}
              style={{
                paddingLeft: '5px',
              }}
            >
              <p
                style={{
                  color: active === 'profile' ? 'hotpink' : '#fff',
                }}
              >
                Profile
              </p>
            </Menu.Item>
          </div>
        </div>
        <div
          style={{
            margin: '1% 0',
            backgroundColor: active === 'logout' ? '#324261' : 'transparent',
            borderRadius: '10px',
          }}
        >
          <Menu.Item
            onClick={() => {
              localStorage.removeItem('token')
              navigate('/login')
            }}
            key='logout'
            className={'sidebar-menu'}
            icon={<MdLogout style={{ color: active === 'logout' ? '#6366f1' : '#fff' }} />}
          >
            Logout
          </Menu.Item>
        </div>
      </nav>
    </Menu>
  )
}

export default MainMenu
