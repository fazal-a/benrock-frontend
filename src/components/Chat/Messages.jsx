import { Avatar, Badge, Button, Dropdown, Image, Input, Space } from 'antd'

import React, { useEffect, useRef, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { IoMdArrowBack } from 'react-icons/io'
import { IoSend } from 'react-icons/io5'
import { SiSendinblue } from 'react-icons/si'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { imageBaseUrl } from '../../config/constants'
import { getSingleChat, sendMessage } from '../../services/chat'

import moment from 'moment'
import { MdAddPhotoAlternate } from 'react-icons/md'
import { SET_CHAT_MESSAGES } from '../../redux/types/chatTypes'
import ChatImageModal from './ChatImageModal'

const Messages = ({ chatId, handleBackClick, chatUser }) => {
  console.log('chatId from CHAT: ', chatId)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const chatSelector = useSelector((state) => state.chat)
  const [isModalVisible, setModalVisible] = useState(false)
  const [uploadedFile, setUploadedFile] = useState([])
  const [uploadLoading, setUploadLoading] = useState(false)
  useEffect(() => {
    console.log('Messages changed')
  }, [chatSelector?.chat?.messages])

  const [input, setInput] = useState('')

  const chatContainerRef = useRef(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [])

  // const chatMessagesItems = [
  //   {
  //     label: <span onClick={() => navigate('/profile')}>Profile</span>,
  //     key: '0',
  //   },
  //   {
  //     label: 'Archive',
  //     key: '1',
  //   },
  //   {
  //     label: 'Muted',
  //     key: '3',
  //   },
  //   {
  //     label: 'Deleted',
  //     key: '4',
  //   },
  // ]

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessageHandler()
    }
  }

  const sendMessageHandler = async () => {
    setInput('')
    let paylod = {
      message: input,
      chatId: chatId,
      messageType: 'text',
    }
    let newMessage = {
      chat: chatId,
      message: input,
      sending: true,
      createdAt: new Date().toISOString(),
      sender: { _id: localStorage.getItem('userId') },
    }
    let previous = chatSelector?.chat?.messages
    previous.push(newMessage)
    dispatch({
      type: SET_CHAT_MESSAGES,
      payload: previous,
    })

    await sendMessage(paylod, () => {})
    await getSingleChat(chatSelector?.chat?.chatId)
  }

  const handleModal = () => {
    setModalVisible(true)
  }
  const handleModalCancel = () => {
    setUploadedFile([])
    setModalVisible(false)
  }
  const handleModalOk = async () => {
    console.log({ uploadedFile })
    if (uploadedFile.length !== 0) {
      const formData = new FormData()
      formData.append('messageType', 'photo')
      formData.append('message', '-')
      formData.append('chatId', chatId)
      uploadedFile.forEach((file, index) => {
        formData.append(`file`, file)
      })

      try {
        const image = await sendMessage(formData, setUploadLoading)
        console.log({ image })
        handleModalCancel()
        await getSingleChat(chatSelector?.chat?.chatId)
      } catch (e) {
        console.log({ e })
      }
    } else {
      console.log('No FILES')
    }
  }

  // components

  const Message = ({ data }) => {
    let length = data?.attachments?.length
    if (data?.attachments?.length > 0) {
      if (length > 1) {
        return data?.attachments?.map((value, index) => {
          return (
            <Image
              key={index}
              src={`${imageBaseUrl}/${value}`}
              style={{ width: 100, height: 100, objectFit: 'contain', marginBottom: '10px' }}
            />
          )
        })
      } else {
        return (
          <Image
            src={`${imageBaseUrl}/${data?.attachments[0]}`}
            style={{ width: 100, height: 100, objectFit: 'contain', marginBottom: '10px' }}
          />
        )
      }
    } else return <strong>{data?.message}</strong>
  }

  return (
    <div className='borderBox chatContacts chatMessages '>
      <header>
        <div className='personDetails'>
          <div className='left'>
            <IoMdArrowBack onClick={handleBackClick} className='showIcon' />
            <Avatar
              style={{ outline: '1px solid gray', width: '2rem', height: '2rem' }}
              src={
                <img
                  src={chatUser?.[0]?.photo ? `${imageBaseUrl}/${chatUser?.[0]?.photo}` : logo}
                  alt='avatar'
                />
              }
            />
            <div className='availiblity'>
              <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                <h4>{chatUser?.[0]?.name}</h4>
                {/* <Badge color='#2ab57d' style={{ width: '20px', height: '20px' }} /> */}
              </div>
              {/* <div style={{ display: 'flex', alignItems: 'start', gap: '5px' }}>
                <p>Online</p>
              </div> */}
            </div>
          </div>
          <div className='right'>
            {/* <div>
              <Dropdown
                menu={{
                  items: chatMessagesItems,
                }}
                trigger={['click']}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    <BsThreeDots style={{ color: 'var(--textColor)', fontSize: '1.2rem' }} />
                  </Space>
                </a>
              </Dropdown>
            </div> */}
          </div>
        </div>
      </header>
      <div className='messageFeild' ref={chatContainerRef}>
        {chatSelector?.chat &&
          chatSelector?.chat?.messages?.map((item, i) => {
            return (
              <div
                key={i}
                className={item?.sender?._id == user?.user?._id ? 'message_left' : 'message_right'}
              >
                <div
                  className={
                    item?.sender?._id == user?.user?._id ? 'message_leftBox' : 'message_rightBox'
                  }
                >
                  <Message data={item} />

                  <p className='time' style={{ color: 'var(--lightBGColor)' }}>
                    {moment(item?.createdAt).format('hh:mm a')}{' '}
                    {item?.sending && <SiSendinblue size={10} color={'var(--lightBGColor)'} />}
                  </p>
                </div>
              </div>
            )
          })}
        <div />
      </div>
      <div className='chatBox'>
        <div className='input-btn'>
          <div className='form'>
            <Button
              icon={<MdAddPhotoAlternate size={30} />}
              className='photovideoBTN'
              onClick={handleModal}
            />

            <Input
              type='text'
              value={input}
              className='chatInput'
              onKeyDown={handleKeyDown}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Enter Message...'
            />

            <div
              onClick={sendMessageHandler}
              style={{ padding: '.7rem 1rem', gap: '1rem' }}
              className='primaryBTN'
              type='submit' // Ensure the button triggers the form submission
            >
              <p className='txt'>Send</p>
              <IoSend />
            </div>
          </div>
        </div>
      </div>
      <ChatImageModal
        title='Send Photos'
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
        setFiles={setUploadedFile}
        okText='Send'
        cancelText='Cancel'
        loadingState={uploadLoading}
      />
    </div>
  )
}

export default Messages
