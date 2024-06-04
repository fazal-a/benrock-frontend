import React, { useRef, useState } from 'react'
import Webcam from 'react-webcam'

const MediaRecorder = ({ influencerId, onRecordingComplete }) => {
  const [recording, setRecording] = useState(false)
  const [mediaBlobUrl, setMediaBlobUrl] = useState(null)

  const mediaRecorder = useRef(null)
  const webcamRef = useRef(null)
  const chunks = useRef([])

  const startRecording = () => {
    const videoConstraints = {
      width: 980,
      height: 520,
      facingMode: 'user', // or 'environment' for rear camera
    }

    mediaRecorder.current = new MediaRecorder(webcamRef.current.stream)

    mediaRecorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.current.push(event.data)
      }
    }

    mediaRecorder.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: 'video/webm' })
      const url = URL.createObjectURL(blob)
      setMediaBlobUrl(url)
      chunks.current = []
    }

    mediaRecorder.current.start()
    setRecording(true)
  }

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop()
      setRecording(false)
    }
  }

  const handleLeaveReview = () => {
    if (mediaBlobUrl) {
      onRecordingComplete(mediaBlobUrl)
      setRecording(false)
      setMediaBlobUrl(null)
    }
  }
  return (
    <div>
      {recording ? (
        <button onClick={stopRecording}>Stop Recording</button>
      ) : (
        <button onClick={startRecording}>Start Recording</button>
      )}

      <Webcam ref={webcamRef} />

      {mediaBlobUrl && (
        <div>
          <video src={mediaBlobUrl} controls />
          <button onClick={handleLeaveReview}>Leave Review</button>
        </div>
      )}
    </div>
  )
}

export default MediaRecorder
