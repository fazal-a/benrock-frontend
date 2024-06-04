import React from 'react'
import { Modal, Button, Upload, message } from 'antd'
const { Dragger } = Upload
import { GrGallery } from 'react-icons/gr'
import { IoSend } from 'react-icons/io5'

function ChatImageModal({
  title,
  visible,
  onCancel,
  onOk,
  okText,
  setFiles,
  cancelText,
  loadingState,
}) {
  const handleFileChange = (info) => {
    const { status, fileList: newFileList } = info
    console.log({ newFileList })
    const filesArray = newFileList.map((item) => item.originFileObj)
    console.log(filesArray)
    setFiles(filesArray)
    console.log({ status })
    if (status === 'done') {
      message.success(`${newFileList.name} file uploaded successfully.`)
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`)
    }
  }
  const props = {
    name: 'image',
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    accept: 'image/*',
    onChange: handleFileChange,
    onDrop(e) {},
  }
  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      footer={[
        <div key='footer-buttons'>
          <Button
            key='cancel'
            onClick={() => {
              onCancel()
            }}
          >
            {cancelText || 'Cancel'}
          </Button>

          <Button loading={loadingState} key='ok' type='primary' onClick={() => onOk()}>
            {okText || 'OK'}

            <IoSend size={10} style={{ marginLeft: 10 }} />
          </Button>
        </div>,
      ]}
      width={'600px'}
    >
      <Dragger {...props}>
        <div style={{ marginTop: 30 }}>
          <p className='ant-upload-drag-icon'>
            <GrGallery size={60} color='rgb(94, 94, 247)' />
          </p>
          <h3 style={{ color: 'var(--textColor)' }}>DROP IMAGES TO SEND</h3>
          <p className='ant-upload-text' style={{ color: 'var(--textColor)' }}>
            {' '}
            or <span style={{ color: 'steelblue' }}>Click</span> to this area to send
          </p>
        </div>
      </Dragger>
    </Modal>
  )
}

export default ChatImageModal
