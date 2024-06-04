import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'

import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Home from '../pages/Home'
import Profile from '../pages/Profile'
import VideoRecorder from '../pages/VideoRecorder'
import VideoUpload from '../pages/VIdeoUpload'
import Chat from '../pages/Chat'
import PrivateWrapper from './PrivateRoutes'
import PhotoCapture from '../pages/PhotoCapture'
import UploadModal from '../components/Upload Modal/UploadModal'
import Feed from '../pages/Feed'
import Map from '../pages/Map/Map'
import EmailVerification from '../pages/EmailVerification'
import ForgetPassword from '../pages/ForgetPassword'
import ResetPassword from '../pages/ResetPassword'

const Routers = () => {
  const isAuthenticated = localStorage.getItem('token')

  return (
    <BrowserRouter>
      <Routes>
        {/* Uncommit next line to apply token security */}

        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Signup />} />
        <Route path='/verifyEmail' element={<EmailVerification />} />
        <Route path='/forgetPassword' element={<ForgetPassword />} />
        <Route path='/resetPassword' element={<ResetPassword />} />

        <Route element={<PrivateWrapper />}>
          <Route path='/' element={<Home />} />
          <Route path='*' element={<Navigate to='/' />} />

          <Route path='/map' element={<Map />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/video' element={<VideoRecorder />} />
          <Route path='/videoUpload' element={<VideoUpload />} />
          <Route path='/photo-capture' element={<PhotoCapture />} />
          <Route path='/chat' element={<Chat />} />
          <Route path='/feed' element={<Feed />} />
          <Route path='/UploadModal' element={<UploadModal />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Routers
