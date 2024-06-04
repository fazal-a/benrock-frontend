import { Layout, Menu } from 'antd'
import { MenuOutlined, HomeOutlined, GlobalOutlined, UserOutlined } from '@ant-design/icons'

import MenuDrawer from './MenuDrawer'
import { useState } from 'react'

const { Content } = Layout

const MobileLayout = ({ active, children }) => {
  return (
    <Layout className='m-layout'>
      <div className='mobile-header'>
        <MenuDrawer active={active} />
        {/* <Switch
          style={{ marginRight: 10 }}
          className='themeSwitch'
          defaultChecked={theme === 'light' ? false : true}
          checkedChildren={<MdDarkMode style={{ fontSize: '20px', marginRight: '5px' }} />}
          unCheckedChildren={<MdOutlineDarkMode style={{ fontSize: '20px', marginLeft: '5px' }} />}
          onChange={() => dispatch(toggleTheme())}
        /> */}
      </div>

      <Content className='m-children'>{children}</Content>
    </Layout>
  )
}

export default MobileLayout
