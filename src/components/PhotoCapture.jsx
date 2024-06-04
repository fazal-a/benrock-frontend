import React, { useRef, useState } from 'react'
import Webcam from 'react-webcam'

const WebcamCapture = () => {
  const webcamRef = useRef(null)
  const [imageSrc, setImageSrc] = useState(null)

  const capture = () => {
    const newImageSrc = webcamRef.current.getScreenshot()
    setImageSrc(newImageSrc)
  }

  return (
    <>
      <Webcam
        audio={false}
        height={720}
        ref={webcamRef}
        screenshotFormat='image/jpeg'
        width={1280}
        videoConstraints={videoConstraints}
      />
      <button onClick={capture}>Capture photo</button>
      {imageSrc && <img src={imageSrc} alt='Captured' />}
    </>
  )
}

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: 'user',
}

export default WebcamCapture
