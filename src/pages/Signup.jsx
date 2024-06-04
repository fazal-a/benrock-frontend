import { useEffect, useState } from 'react'
import { Form, Input, Button, Image, Checkbox, message } from 'antd'
import { useDispatch } from 'react-redux'
import { useNavigate, Navigate, Link } from 'react-router-dom'

import { authSignup } from '../redux'
import auditLogo from '../assets/logosidbar.png'
// import auditLogo from '../../public/logo.jpeg'

import { getUserLocation } from '../constants/getCurrentLocation'

const Signup = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [setLocation, setSetLocation] = useState(true)
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')

  const validatePassword = (_, value) => {
    // Password must contain at least one uppercase letter, one lowercase letter, and one special character
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/

    if (!regex.test(value)) {
      return Promise.reject(
        'Password must contain at least one uppercase letter, one lowercase letter, and one special character.',
      )
    }

    return Promise.resolve()
  }
  // const handleLocationChange = async (e) => {
  //   try {
  //     const location = await getUserLocation()
  //     console.log('Location in YourComponent:', location)
  //     setSetLocation(e.target.checked)

  //     setLatitude(location.latitude)
  //     setLongitude(location.longitude)
  //   } catch (error) {
  //     message.error({ content: error?.message + ' Turn on Location', duration: 3 })
  //     console.error('Error in YourComponent:', error.message)
  //   }
  // }
  // useEffect(() => {
  //   if (setLocation) {
  //     handleLocationChange({ target: { checked: true } })
  //   }
  // }, [setLocation])
  const onFinish = async (values) => {
    setLoading(true)
    const val = {
      ...values,
      role: 'user',
    }
    console.log({ val })
    await dispatch(authSignup(val, navigate))

    setLoading(false)
  }

  if (localStorage.getItem('token') != undefined) {
    return <Navigate to='/' />
  } else {
    return (
      <div className='signup'>
        <div className='signup-heading'>
          <Image alt='Logo' src={auditLogo} preview={false} className='logo-image' />
          <div className='signin'>
            <Form name='login' className='signup-form' layout='vertical' onFinish={onFinish}>
              <h2>Register</h2>

              <div style={{ lineHeight: 0 }}>
                <label>NAME</label>
                <Form.Item
                  style={{ backgroundColor: '#fff !important' }}
                  name='name'
                  rules={[
                    {
                      type: 'name',
                      message: 'Please enter your name',
                    },
                    {
                      required: true,
                      message: 'Name is Required',
                    },
                  ]}
                >
                  <Input
                    //  autoComplete='off'
                    placeholder='Name'
                    type='text'
                  />
                </Form.Item>
              </div>
              <div style={{ lineHeight: 0 }}>
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
              <div>
                <div className='passLabel-forgotPass'>
                  <label>PASSWORD</label>
                </div>
                <Form.Item
                  name='password'
                  hasFeedback
                  rules={[
                    {
                      type: 'password',
                      message: 'required field',
                    },
                    {
                      required: true,
                      message: 'Password is required',
                    },
                    {
                      validator: validatePassword,
                    },
                  ]}
                >
                  <Input.Password placeholder='Password' />
                </Form.Item>
              </div>
              <div>
                <div className='passLabel-forgotPass'>
                  <label>CONFIRM PASSWORD</label>
                </div>
                <Form.Item
                  name='confirmPassword'
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: 'Please confirm your password!',
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(
                          new Error('The new password that you entered do not match!'),
                        )
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder='Confirm Password' />
                </Form.Item>
              </div>
              {/* <Checkbox checked={setLocation} onChange={handleLocationChange}>
                Set Location
              </Checkbox> */}
              <Form.Item>
                <Button loading={loading} type='primary' htmlType='submit'>
                  Sign up
                </Button>
                <div className='signup-info'>
                  <p className='Pointer mv-5' onClick={() => navigate('/login')}>
                    {'Already have an account?'}{' '}
                    <Link style={{ textDecoration: 'none', color: 'var(--primary)' }}>Login</Link>
                  </p>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

export default Signup
