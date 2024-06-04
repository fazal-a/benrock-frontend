/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { message, Button, Form, Input, Image } from 'antd'
import auditLogo from '../assets/social-media.png'
import { useDispatch } from 'react-redux'
import { authforgetPassword } from '../redux'

function ForgetPassword() {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const getToken = async (values) => {
    setLoading(true)
    console.log({ values })
    await dispatch(authforgetPassword(values?.email, navigate))

    setLoading(false)
  }

  return (
    <div className='forget'>
      <div className='forget-heading'>
        <Image alt='Logo' src={auditLogo} preview={false} className='logo-image' />
        <div className='signin'>
          <Form name='login' className='forget-form' layout='vertical' onFinish={getToken}>
            <h2>Forgot Password ?</h2>
            <p>Enter your email address.</p>

            <div>
              <label>EMAIL</label>
              <Form.Item
                style={{ backgroundColor: '#fff !important' }}
                name='email'
                rules={[
                  {
                    type: 'email',
                    message: 'The entered email is not valid!',
                  },
                  {
                    required: true,
                    message: 'Email is Required',
                  },
                ]}
              >
                <Input
                  // autoComplete='off'
                  placeholder='Email'
                />
              </Form.Item>
            </div>

            <Form.Item>
              <Button loading={loading} type='primary' htmlType='submit'>
                Send
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default ForgetPassword
