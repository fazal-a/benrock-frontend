import React, { useRef, useState, useCallback } from 'react'
import Webcam from 'react-webcam' // Assuming you are using a library for the Webcam component
import { FiDownload } from 'react-icons/fi'
import { IoCameraReverseOutline, IoArrowBack } from 'react-icons/io5'
import { useNavigate, useLocation } from 'react-router-dom'
import store from '../redux/store'

const VideoRecorder = () => {
  const [facingMode, setFacingMode] = useState('user')
  const [capturing, setCapturing] = useState(false)
  const [recordedChunks, setRecordedChunks] = useState([])
  const navigate = useNavigate()
  const webcamRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const location = useLocation()
  const tab = location.state?.tab || ''
  console.log({ tab })
  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true)
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: 'video/webm',
    })
    mediaRecorderRef.current.start()
    mediaRecorderRef.current.addEventListener('dataavailable', handleDataAvailable)
  }, [webcamRef, setCapturing, mediaRecorderRef])

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data))
      }
    },
    [setRecordedChunks],
  )

  const handleDownload = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: 'video/webm',
      })
      console.log({ blob })

      const fileName = 'socio-video.webm'

      const file = new File([blob], fileName, { type: 'video/webm' })

      console.log({ file })

      store.dispatch({
        type: 'SET_FILE',
        payload: file,
      })
      navigate('/profile', { state: { tab: tab } })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.style = 'display: none'
      a.href = url
      a.download = 'socio-video'
      a.click()
      window.URL.revokeObjectURL(url)
      console.log({ url })
      setRecordedChunks([])
    }
  }, [recordedChunks])

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop()

    handleDownload()
    setCapturing(false)
    console.log({ recordedChunks })
  }, [mediaRecorderRef, setCapturing, handleDownload])

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
    <div className='video-recorder'>
      <Webcam
        className='video-webcam'
        audio={true}
        ref={webcamRef}
        allow='camera; microphone;'
        muted
        videoConstraints={videoConstraints}
        allowFullScreen
      />
      {capturing ? (
        <button className='videoBTN Rec' onClick={handleStopCaptureClick}>
          Stop Capture
        </button>
      ) : (
        <button className='videoBTN notRec' onClick={handleStartCaptureClick}>
          Start Capture
        </button>
      )}
      {recordedChunks.length > 0 && (
        <div className='downloadBTN' onClick={handleDownload}>
          <FiDownload style={{ fontSize: '30px' }} />
        </div>
      )}
      <div onClick={toggleFacingMode} className='cameraRotateBTN'>
        {facingMode === 'user' ? '' : ''}
        <IoCameraReverseOutline style={{ fontSize: '30px', color: '#fff' }} />
      </div>
      <div onClick={backNavigate} className='cameraBackBTN'>
        <IoArrowBack style={{ fontSize: '30px', color: '#fff' }} />
      </div>
    </div>
  )
}

export default VideoRecorder
