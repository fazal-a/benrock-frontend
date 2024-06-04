import React, { useState } from 'react'
import { Modal, Button, Upload, message } from 'antd'
import { UploadOutlined, InboxOutlined } from '@ant-design/icons'
const { Dragger } = Upload
import { GrGallery } from 'react-icons/gr'
import { uploadAttachments } from '../../services/Attachments'
import { imageBaseUrl } from '../../config/constants'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function UploadModal({
  title,
  visible,
  onCancel,
  onOk,
  okText,
  cancelText,
  type,
  tab,
  loadingState,
}) {
  const [fileList, setFileList] = useState([])
  const [files, setFiles] = useState([])
  const navigate = useNavigate()
  const file = useSelector((state) => state.attachment.file)
  const props = {
    name: 'image',
    multiple: true,
    // action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    accept: 'image/*', // Specify accepted image file types
    onChange(info) {
      const { status, fileList: newFileList } = info
      setFileList(newFileList)
      console.log({ newFileList })

      const filesArray = newFileList.map((item) => item.originFileObj)
      setFiles(filesArray)
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    onDrop(e) {
      // console.log('Dropped files', e.dataTransfer.files)
    },
  }
  const videoProps = {
    name: 'video',

    multiple: true,
    // accept: 'video/webm', // Specify accepted video file types
    accept: 'video/*', // Specify accepted video file types
    // action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    onChange(info) {
      const { status, fileList: newFileList, response } = info
      setFileList(newFileList)
      console.log({ newFileList })
      const filesArray = newFileList.map((item) => item.originFileObj)
      setFiles(filesArray)

      if (status === 'done') {
        message.success(`${info.file.name} video uploaded successfully.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} video upload failed.`)
      }
    },
    onDrop(e) {
      // console.log('Dropped files', e.dataTransfer.files)
    },
  }
  const makeVideosPictures = () => {
    if (type === 'photo') {
      navigate('/photo-capture', { state: { tab: tab } })
    }
    if (type === 'video') {
      navigate('/video', { state: { tab: tab } })
    }
  }
  const handleCancel = () => {
    setFileList([])
  }

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      className='custom-modal'
      footer={[
        <div key='footer-buttons' style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button key='makeVideo&Picture' type='primary' onClick={makeVideosPictures}>
            {type === 'photo' ? 'Capture image' : 'Make Video'}
          </Button>
          ,
          <div>
            <Button
              key='cancel'
              onClick={() => {
                onCancel(), handleCancel()
              }}
            >
              {cancelText || 'Cancel'}
            </Button>
            <Button
              disabled={fileList.length === 0 && file === null}
              loading={loadingState}
              key='ok'
              type='primary'
              onClick={() => {
                onOk({ uploadedFiles: files, capturedFile: file }, type), handleCancel()
              }}
            >
              {okText || 'OK'}
            </Button>
          </div>
        </div>,
      ]}
      width={'600px'}
    >
      {type === 'photo' && (
        <>
          <Dragger {...props}>
            <div style={{ marginTop: 30, color: 'var(--textColor)' }}>
              <p className='ant-upload-drag-icon'>
                <GrGallery size={60} color='rgb(94, 94, 247)' />
              </p>
              <h3>DROP IMAGES TO UPLOAD</h3>
              <p className='ant-upload-text' style={{ color: 'var(--textColor)' }}>
                {' '}
                or <span style={{ color: 'steelblue' }}>Click</span> to this area to upload
              </p>
            </div>
          </Dragger>
          {fileList.map((file, index) => (
            <div key={index} style={{ color: 'var(--textColor)' }}>
              <img
                key={file.uid}
                src={URL.createObjectURL(file.originFileObj)}
                alt={file.name}
                style={{ maxWidth: '100%', maxHeight: '100px', marginBottom: '10px' }}
              />
            </div>
          ))}
          {file !== null && (
            <div>
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                style={{ maxWidth: '100%', maxHeight: '100px', marginBottom: '10px' }}
              />
            </div>
          )}
        </>
      )}
      {type === 'video' && (
        <>
          <Dragger {...videoProps}>
            <div style={{ marginTop: 30, color: 'var(--textColor)' }}>
              <p className='ant-upload-drag-icon'>
                <GrGallery size={60} color='rgb(94, 94, 247)' />
              </p>
              <h3>DROP VIDEO TO UPLOAD</h3>
              <p className='ant-upload-text' style={{ color: 'var(--textColor)' }}>
                {' '}
                or <span style={{ color: 'steelblue' }}>Click</span> to this area to upload videos
              </p>
            </div>
          </Dragger>
          {file !== null && (
            <div style={{ color: 'var(--textColor)' }}>
              <video controls width='50%' height='200px'>
                <source src={URL.createObjectURL(file)} />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </>
      )}
    </Modal>
  )
}

export default UploadModal
