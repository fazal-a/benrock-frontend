import { useEffect, useState } from 'react'
import { Form, Input, Button, Image, Checkbox, message } from 'antd'
import { useDispatch } from 'react-redux'
import { useNavigate, Navigate, Link } from 'react-router-dom'

import { authLogin } from '../redux'
// import auditLogo from '../assets/social-media.png'
import auditLogo from '../assets/logosidbar.png'

import { getUserLocation } from '../constants/getCurrentLocation'
import { duration } from 'moment'
import { LOGIN } from '../redux/types/authTypes'
import { fetchAddress } from '../constants/getAddress'
// import { login } from '../services/auth'

const SignIn = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [setLocation, setSetLocation] = useState(false)
  const [latitude, setLatitude] = useState('40.7128')
  const [longitude, setLongitude] = useState('-74.0060')

  const onFinish = async (values) => {
    console.log({ latitude, longitude })
    const address = await fetchAddress(latitude, longitude)
    console.log({ address })
    const val = {
      ...values,
      email: values?.email.toLowerCase(),
      latitude: latitude,
      longitude: longitude,
    }
    setLoading(true)

    await dispatch(authLogin(val, navigate)), setLoading(false)
  }
  useEffect(() => {
    const askForLocation = async () => {
      try {
        const location = await getUserLocation()
        setLatitude(location.latitude)
        setLongitude(location.longitude)
        setSetLocation(true)
      } catch (error) {
        // message.error('Unable to retrieve location. Defaulting to NY City.');
        setSetLocation(false)
      }
    }

    askForLocation()
  }, [])
  // if (localStorage.getItem('token')) {
  //   return <Navigate to='/' />
  // } else {
  return (
    <div className='login'>
      <div className='login-heading'>
        <Image alt='Logo' src={auditLogo} preview={false} className='logo-image' />
        <div className='signin'>
          <Form name='login' className='login-form' layout='vertical' onFinish={onFinish}>
            <h2>Log in</h2>
            <p>Enter your email and password below</p>
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
                rules={[
                  {
                    type: 'password',
                    message: 'required field',
                  },
                ]}
              >
                <Input.Password placeholder='Password' />
              </Form.Item>
              {/* <Checkbox checked={setLocation} onChange={handleLocationChange}>
                Set Location
              </Checkbox> */}
              <div className='d-flex justify-end'>
                <p
                  className='pointer'
                  onClick={() => navigate('/forgetPassword')}
                  style={{ color: 'var(--gray300)' }}
                >
                  Forgot Password?
                </p>
              </div>
            </div>

            <Form.Item>
              <Button loading={loading} type='primary' htmlType='submit'>
                Log In
              </Button>
              <div className='login-info'>
                <p className='Pointer mv-5' onClick={() => navigate('/register')}>
                  {"Don't have an account?"}{' '}
                  <Link style={{ textDecoration: 'none', color: 'var(--primary)' }}>Register</Link>
                </p>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
  // }
}

export default SignIn
