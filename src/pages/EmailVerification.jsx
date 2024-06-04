import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { message, Button, Form, Input, Image } from 'antd'
import auditLogo from '../assets/social-media.png'
import { useDispatch } from 'react-redux'
import { authRequestToken, authVerifyEmail } from '../redux'

const EmailVerification = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const email = location.state && location.state.email

  const VerifyEmail = async (values) => {
    setLoading(true)
    console.log({ values })
    await dispatch(
      authVerifyEmail({ email: email, emailVerificationToken: Number(values?.code) }, navigate),
    )

    setLoading(false)
  }
  return (
    <div className='emailDiv'>
      <div className='email-heading'>
        <Image alt='Logo' src={auditLogo} preview={false} className='logo-image' />
        <div className='signin'>
          <Form name='login' className='email-form' layout='vertical' onFinish={VerifyEmail}>
            <h2>Email Verification</h2>
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

            <Form.Item>
              <Button loading={loading} type='primary' htmlType='submit'>
                Verify
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default EmailVerification
