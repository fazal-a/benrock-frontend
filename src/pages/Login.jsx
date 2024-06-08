import { useEffect, useState } from 'react'
import { Form, Input, Button, Image, message } from 'antd'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { authLogin } from '../redux'
import auditLogo from '../assets/logosidbar.png'
import { getUserLocation } from '../constants/getCurrentLocation'
import { fetchAddress } from '../constants/getAddress'

const defaultLatitude = '40.7128'
const defaultLongitude = '-74.0060'

const SignIn = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [latitude, setLatitude] = useState(defaultLatitude)
  const [longitude, setLongitude] = useState(defaultLongitude)
  const [locationAccessGranted, setLocationAccessGranted] = useState(false)

  useEffect(() => {
    const askForLocation = async () => {
      try {
        const location = await getUserLocation()
        setLatitude(location.latitude)
        setLongitude(location.longitude)
        setLocationAccessGranted(true)
        console.log('Location access granted. Current location:', location)
      } catch (error) {
        setLocationAccessGranted(false)
        console.error('Unable to retrieve location. Defaulting to NY City.', error)
      }
    }

    askForLocation()
  }, [])

  const onFinish = async (values) => {
    const val = {
      ...values,
      email: values?.email.toLowerCase(),
      latitude: latitude,
      longitude: longitude,
    }
    setLoading(true)

    await dispatch(authLogin(val, navigate, locationAccessGranted))
    setLoading(false)
  }

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
                <Input placeholder='Email' />
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
                    required: true,
                    message: 'Password is required',
                  },
                ]}
              >
                <Input.Password placeholder='Password' />
              </Form.Item>
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
}

export default SignIn
