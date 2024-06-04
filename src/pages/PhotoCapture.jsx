import React, { useRef, useState } from 'react'
import { FaRegCircle } from 'react-icons/fa'
import Webcam from 'react-webcam'
import { useNavigate, useLocation } from 'react-router-dom'
import { IoArrowBack, IoCameraReverseOutline } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import store from '../redux/store'
import { uploadProfile } from '../services/profile'
import UploadModal from '../components/Upload Modal/UploadModal'

const PhotoCapture = () => {
  const [facingMode, setFacingMode] = useState('user')
  const [imageSrc, setImageSrc] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const location = useLocation()
  const tab = location.state?.tab || ''

  console.log({ tab })
  const navigate = useNavigate()
  const webcamRef = useRef(null)
  const dispatch = useDispatch()
  const file = useSelector((state) => state.attachment.file)
  console.log({ file })

  const base64ToBlob = (base64String, mimeType) => {
    // Remove data URL prefix if present
    const base64WithoutPrefix = base64String.replace(/^data:image\/\w+;base64,/, '')

    // Pad the base64 string if needed
    const paddedBase64 = base64WithoutPrefix.padEnd(
      base64WithoutPrefix.length + ((4 - (base64WithoutPrefix.length % 4)) % 4),
      '=',
    )

    // Convert Base64 to Blob
    const byteCharacters = atob(paddedBase64)
    const byteArrays = []

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512)

      const byteNumbers = new Array(slice.length)
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      byteArrays.push(byteArray)
    }
    return new Blob(byteArrays, { type: mimeType })
  }

  const capture = () => {
    const newImageSrc = webcamRef.current.getScreenshot()
    setImageSrc(newImageSrc)
    console.log({ newImageSrc })
    if (newImageSrc) {
      // Convert Base64 to Blob
      const blob = base64ToBlob(newImageSrc, 'image/jpeg')

      // Create a File object from the Blob
      const file = new File([blob], 'captured_image.jpg', { type: 'image/jpeg' })

      // Set the File object
      setImageFile(file)
      store.dispatch({
        type: 'SET_FILE',
        payload: file,
      })
      //  navigate('/profile')

      navigate('/profile', { state: { tab: tab } })
      console.log('file', file)
    }
  }

  const toggleFacingMode = () => {
    // Toggle between "user" and "environment" facing modes
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user'
    setFacingMode(newFacingMode)
  }
  const videoConstraints = {
    facingMode: { exact: facingMode },
  }
  const backNavigate = () => {
    navigate('/profile')
  }
  return (
    <div className='photoCapture'>
      <Webcam
        audio={false}
        // height={"100%"}
        ref={webcamRef}
        screenshotFormat='image/jpeg'
        // width={'100%'}
        className='photo-webcam'
        videoConstraints={videoConstraints}
        // style={{ width: '100%', height: '100%' }}
      />
      <span className='captureBTN'>
        <FaRegCircle className='circle' onClick={capture} />
      </span>
      <div onClick={toggleFacingMode} className='photoCameraRotateBTN'>
        {facingMode === 'user' ? '' : ''}
        <IoCameraReverseOutline style={{ fontSize: '30px', color: '#fff' }} />
      </div>
      <div onClick={backNavigate} className='photoCameraBackBTN'>
        <IoArrowBack style={{ fontSize: '30px', color: '#fff' }} />
      </div>
      {imageSrc && <img src={imageSrc} alt='Captured' />}
    </div>
  )
}

const videoConstraints = {
  width: '100%',
  height: '100%',
  facingMode: 'user',
}

export default PhotoCapture
