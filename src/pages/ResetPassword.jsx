import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { message, Button, Form, Input, Image } from 'antd'
import auditLogo from '../assets/social-media.png'
import { useDispatch } from 'react-redux'
import { authRequestToken, authResetPassword, authVerifyEmail } from '../redux'

function ResetPassword() {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const email = location.state && location.state.email

  const resetPassword = async (values) => {
    setLoading(true)
    console.log({ values })
    await dispatch(
      authResetPassword(
        { email: email, passwordResetToken: Number(values?.code), password: values?.password },
        navigate,
      ),
    )

    setLoading(false)
  }
  return (
    <div className='emailDiv'>
      <div className='email-heading'>
        <Image alt='Logo' src={auditLogo} preview={false} className='logo-image' />
        <div className='signin'>
          <Form name='login' className='email-form' layout='vertical' onFinish={resetPassword}>
            <h2>Reset Password</h2>
            <p>Code has been sent to {email}</p>

            <div>
              <label>CODE</label>
              <Form.Item
                name='code'
                rules={[
                  {
                    required: true,
                    message: 'Please enter the verification code sent to your email!',
                  },
                ]}
              >
                <Input placeholder='Verification Code' />
              </Form.Item>
            </div>
            <div>
              <label>PASSWORD</label>
              <Form.Item
                name='password'
                rules={[
                  {
                    type: 'password',
                    message: 'required field',
                  },
                ]}
              >
                <Input.Password placeholder='New Password' />
              </Form.Item>
            </div>
            <Form.Item>
              <Button loading={loading} type='primary' htmlType='submit'>
                Reset
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
