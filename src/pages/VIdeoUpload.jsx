import React, { useState } from 'react'
import { Upload, Input, Button, Form, message, Card, Row, Col } from 'antd'
import { UploadOutlined, VideoCameraOutlined } from '@ant-design/icons'
import Layout from '../layout/Layout'

const VideoUpload = () => {
  const [videoFile, setVideoFile] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleVideoUpload = () => {
    // Simulate video upload logic here
    // For demonstration, just log the values
    console.log('Video File:', videoFile)
    console.log('Title:', title)
    console.log('Description:', description)
    message.success('Video uploaded successfully!')
    // Reset state after successful upload
    setVideoFile(null)
    setTitle('')
    setDescription('')
  }
  // const [videoUrls, setVideoUrls] = useState([]);
  // const onFinish = (values) => {
  //     const fileList = values.video.fileList.map(file => file.originFileObj);
  //     if (fileList.length > 0 && fileList.every(file => file)) {
  //         console.log({ fileList })
  //         const uploadedUrls = fileList.map((file) => URL.createObjectURL(file));
  //         console.log('Uploaded URLs:', uploadedUrls);
  //         setVideoUrls(uploadedUrls);
  //         message.success('Videos uploaded successfully!');

  //     }

  // };

  // const onFinishFailed = (errorInfo) => {
  //     console.log('Failed:', errorInfo);
  // };

  return (
    <Layout>
      <div className='container'>
        <h2 className='h2'>Upload Your Video</h2>
        <Col>
          <Row
            justify='center'
            align='middle'
            style={{ height: '60vh', border: '1px solid black' }}
          >
            <Col span={12}>
              <Upload
                beforeUpload={(file) => {
                  setVideoFile(file)
                  return false // Prevent automatic upload
                }}
                maxCount={1}
                listType='text'
                mult
              >
                <Button icon={<UploadOutlined />}>Upload or Drag Video</Button>
              </Upload>
            </Col>
          </Row>
          <Row justify='center'>
            <Col span={12}>
              <Form
                onFinish={handleVideoUpload}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
                className='form-container'
              >
                <Form.Item label='Title' name='title' initialValue={title}>
                  <Input onChange={(e) => setTitle(e.target.value)} />
                </Form.Item>

                <Form.Item label='Description' name='description' initialValue={description}>
                  <Input.TextArea onChange={(e) => setDescription(e.target.value)} />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                  <Button type='primary' htmlType='submit'>
                    Upload Video
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Col>
      </div>
    </Layout>
  )
}

export default VideoUpload
