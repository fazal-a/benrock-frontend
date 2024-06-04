// PhotoModal.js

import React from 'react'
import { Modal } from 'antd'

const PhotoModal = ({ visible, onCancel, onOk, photo, loadingState }) => {
  return (
    <Modal
      title='Photo'
      open={visible}
      onCancel={onCancel}
      onOk={onOk}
      okText='Submit'
      cancelText='Cancel'
      footer={null}
      centered
    >
      {photo && (
        <img
          style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain' }}
          src={photo.url} // Assuming the photo object has a 'url' property
          alt={`selected-img`}
        />
      )}
      {/* Add additional content or actions related to the photo */}
    </Modal>
  )
}

export default PhotoModal
