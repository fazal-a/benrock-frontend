import { useChannel } from 'ably/react'
import { Avatar, Badge, Col, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import { PiChatsThin } from 'react-icons/pi'
import { TiContacts } from 'react-icons/ti'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { imageBaseUrl } from '../../config/constants'
import Layout from '../../layout/Layout'
import { LOGIN } from '../../redux/types/authTypes'
import { SET_CHAT, SET_CHAT_MESSAGES } from '../../redux/types/chatTypes'
import { createChat, getChats, getContacts, getSingleChat } from '../../services/chat'
import { getProfile } from '../../services/profile'
import Messages from './Messages'
import moment from 'moment'

const ChatApp = () => {
  const [activeTab, setActiveTab] = useState('Chat')
  const { state } = useLocation()
  const [selectedUser, setSelectedUser] = useState(state?.name)
  const [showMessages, setShowMessages] = useState(false)
  const [size, setSize] = useState() // State for window size
  const [selectedChatUser, setSelectedChatUser] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [filteredChats, setFilteredChats] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)

  const auth = useSelector((state) => state.auth)

  const chatSelector = useSelector((state) => state.chat)

  const { channel } = useChannel('chat', async (message) => {
    let currentUser = localStorage.getItem('userId')
    let { user, message: messageFromAbly } = message.data
    let messages = chatSelector?.chat?.messages

    if (user?._id == currentUser && messageFromAbly?.chat?._id === chatSelector?.chat?.chatId) {
      console.log('NOw update')
      messages.push(messageFromAbly?.newMessage)
      await getSingleChat(chatSelector?.chat?.chatId)
    }
  })

  useEffect(() => {
    if (activeTab?.toLowerCase() === 'chat') getChats()
    else getContacts()
  }, [activeTab])

  useEffect(() => {
    if (state && state?.openChatWith) {
      console.log('state?.openChatWith', state?.openChatWith)
      onContactClick({ ...state?.openChatWith, _id: state?.openChatWith?.id })
      getChats()
    }
  }, [state])

  // Functions
  const handleTabClick = (Chat) => {
    setActiveTab(Chat)
  }

  const onContactClick = async (item) => {
    console.log('item :', item)
    setShowMessages(false)
    dispatch({
      type: SET_CHAT,
      payload: {},
    })
    const payload = [user?.user?._id, item?._id]
    let response = await createChat(payload)
    let data = response?.data?.data

    fetchSingleChat(response?.status === 200 ? data?.chat?._id : data?.newChat?._id)
    setSelectedChatUser([item])
    setShowMessages(true)
    setActiveTab('Chat')
  }

  const fetchSingleChat = (chatId) => {
    getSingleChat(chatId)
    console.log({ chatId })
  }
  // let Temp
  const handleClick = (item) => {
    dispatch({
      type: SET_CHAT_MESSAGES,
      payload: [],
    })
    setShowMessages(true)
    let tempUser = item?.users?.filter((v) => v?._id !== user?.user?._id)
    setSelectedChatUser(tempUser)
    setSelectedUser(tempUser?.[0]?.name)
  }

  const handleBackClick = () => {
    setShowMessages(false)
  }

  useEffect(() => {
    function updateSize() {
      setSize(window.innerWidth < 768) // Update state with window width
    }
    window.addEventListener('resize', updateSize) // Add resize event listener
    updateSize() // Initial call to set initial size
    return () => window.removeEventListener('resize', updateSize) // Remove event listener on cleanup
  }, [])

  const handleSearch = (query) => {
    setSearchInput(query)
    console.log({ query })
    console.log(chatSelector?.chats, 'chats')
    const filteredChatList =
      chatSelector?.chats?.filter((chat) => {
        const tempUser = chat?.users?.filter((v) => v?._id !== user?.user?._id)
        return (
          tempUser?.[0]?.name.toLowerCase().includes(query.toLowerCase()) ||
          chat?.lastMessage?.message.toLowerCase().includes(query.toLowerCase())
        )
      }) || []
    console.log({ filteredChatList })
    setFilteredChats(filteredChatList)
    console.log(filteredChats)
    const filteredContactsList =
      chatSelector?.contacts?.filter((contact) =>
        contact?.name.toLowerCase().includes(query.toLowerCase()),
      ) || []
    console.log({ filteredContactsList })
    console.log(filteredContacts)
    setFilteredContacts(filteredContactsList)
  }
  const NoChat = () => {
    return (
      <div className='noChats'>
        <img src={require('../../assets/no-chat-found.png')} className='noChatImage' />
        <p>Oops! No Chats Found</p>
        <p style={{ color: 'var(--gray300)' }}>Click contacts to start a chat</p>
      </div>
    )
  }
  const NoMessages = () => {
    return (
      <div className='NoMessages'>
        <img src={require('../../assets/no-chat-found.png')} className='noMessageImage' />
        <p>Oops! No Chats Found</p>
        <p style={{ color: 'var(--gray300)' }}>Start a chat to see here!</p>
      </div>
    )
  }

  return (
    <Layout active={'chat'}>
      <div style={{ margin: '30px', paddingTop: '60px' }}>
        <Row gutter={[10, 10]}>
          {/* FOR SMALL SCREENS */}
          {size && !showMessages && (
            <Col xl={8} lg={8} md={8} sm={24} xs={24}>
              <div className='borderBox chatContacts'>
                <header>
                  <div className='personDetails'>
                    <div className='left'>
                      <Avatar
                        style={{ outline: '1px solid gray', width: '2rem', height: '2rem' }}
                        src={user?.user?.photo ? `${imageBaseUrl}/${user?.user?.photo}` : logo}
                        alt='avatar'
                      />

                      <div className='availiblity'>
                        <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                          <h4>{user?.user?.name}</h4>
                          <Badge color='#2ab57d' style={{ width: '20px', height: '20px' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </header>
                <div className='search'>
                  <div className='search-container'>
                    <BiSearch className='search-icon' />
                    <input
                      type='text'
                      className='search-input'
                      placeholder='Search'
                      value={searchInput}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className='chatBTNS'>
                  <span
                    className={`tablinks ${activeTab === 'Chat' ? 'active' : ''}`}
                    onClick={() => handleTabClick('Chat')}
                  >
                    <span className='desktop-icon'>Chat</span>
                    <span className='mobile-icon'>
                      <PiChatsThin />
                    </span>
                  </span>

                  <span
                    className={`tablinks ${activeTab === 'Contacts' ? 'active' : ''}`}
                    onClick={() => handleTabClick('Contacts')}
                  >
                    <span className='desktop-icon'>Contacts</span>
                    <span className='mobile-icon'>
                      <TiContacts />
                    </span>
                  </span>
                </div>
                {/*  <.......    for small screen active tab chat  ........> */}

                {activeTab === 'Chat' && (
                  <div className='chatContant Chat'>
                    <div className='chatLabel'>
                      <p>Recent</p>
                    </div>

                    {chatSelector?.chats?.length === 0 && <NoChat />}

                    <div className='tabsHeight' style={{ overflowY: 'auto' }}>
                      {(searchInput
                        ? filteredChats
                        : (chatSelector?.chats && chatSelector?.chats) || []
                      )?.map((item, index) => {
                        let tempUser = item?.users?.filter((v) => v?._id !== user?.user?._id)

                        return (
                          <section
                            className='contacts'
                            key={index}
                            onClick={() => {
                              fetchSingleChat(item?._id)
                            }}
                          >
                            <div
                              className='personDetails'
                              style={{
                                backgroundColor:
                                  selectedUser == tempUser?.[0]?.name
                                    ? 'var(--cardColor)'
                                    : 'transparent',
                              }}
                              onClick={() => handleClick(item)} // Show the chat window on click
                            >
                              <div className='left'>
                                <Avatar
                                  style={{
                                    outline: '1px solid gray',
                                    width: '2rem',
                                    height: '2rem',
                                  }}
                                  src={
                                    <img
                                      src={`${imageBaseUrl}/${tempUser?.[0]?.photo}`}
                                      alt='avatar'
                                    />
                                  }
                                />
                                <div className='availiblity'>
                                  <div
                                    style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}
                                  >
                                    <h4>{tempUser?.[0]?.name}</h4>
                                  </div>
                                  <p>{item?.lastMessage?.message}</p>
                                </div>
                              </div>
                              <div className='right time'>
                                <p
                                  style={{
                                    color: 'var(--textColor)',
                                    fontSize: '12px',
                                    opacity: '60%',
                                  }}
                                >
                                  {moment(item?.lastMessage?.createdAt).fromNow()}
                                </p>
                              </div>
                            </div>
                          </section>
                        )
                      })}
                    </div>
                  </div>
                )}
                {/*  <.......    for small screen active tab contact  ........> */}
                {activeTab === 'Contacts' && (
                  <div className='chatContant Contacts'>
                    <div className='chatLabel'>
                      <p>Contacts</p>
                    </div>
                    <div className='tabsHeight' style={{ maxHeight: '435px', overflowY: 'auto' }}>
                      {(searchInput ? filteredContacts : chatSelector?.contacts || [])?.map(
                        (contact, index) => {
                          return (
                            <section
                              className='contacts'
                              key={index}
                              onClick={() => onContactClick(contact)}
                            >
                              <div className='personDetails'>
                                <div className='left'>
                                  <Avatar
                                    style={{
                                      outline: '1px solid gray',
                                      width: '2rem',
                                      height: '2rem',
                                    }}
                                    src={
                                      <img src={`${imageBaseUrl}/${contact?.photo}`} alt='avatar' />
                                    }
                                  />
                                  <div className='availiblity'>
                                    <div
                                      style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}
                                    >
                                      <h4>{contact?.name}</h4>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </section>
                          )
                        },
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Col>
          )}

          {/* FOR SMALL SCREENS */}
          {size && showMessages && (
            <Col xl={16} lg={16} md={16} sm={24} xs={24}>
              <div className='messagesBox'>
                <Messages
                  chatId={chatSelector?.chat?.chatId}
                  chatUser={selectedChatUser}
                  handleBackClick={handleBackClick}
                />
              </div>
            </Col>
          )}

          {/* FOR BIG SCREENS */}
          {!size && (
            <Col xl={8} lg={8} md={8} sm={24} xs={24}>
              <div className='borderBox chatContacts'>
                <header>
                  <div className='personDetails'>
                    <div className='left'>
                      <Avatar
                        style={{ outline: '1px solid gray', width: '2rem', height: '2rem' }}
                        src={`${imageBaseUrl}/${user?.user?.photo}`}
                      />
                      <div className='availiblity'>
                        <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                          <h4>{user?.user?.name}</h4>
                          <Badge color='#2ab57d' style={{ width: '20px', height: '20px' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </header>
                <div className='search'>
                  <div className='search-container'>
                    <BiSearch className='search-icon' />
                    <input
                      type='text'
                      className='search-input'
                      placeholder='Search'
                      value={searchInput}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className='chatBTNS'>
                  <span
                    className={`tablinks ${activeTab === 'Chat' ? 'active' : ''}`}
                    onClick={() => handleTabClick('Chat')}
                  >
                    <span className='desktop-icon'>Chat</span>
                    <span className='mobile-icon'>
                      <PiChatsThin />
                    </span>
                  </span>
                  <span
                    className={`tablinks ${activeTab === 'Contacts' ? 'active' : ''}`}
                    onClick={() => handleTabClick('Contacts')}
                  >
                    <span className='desktop-icon'>Contacts</span>
                    <span className='mobile-icon'>
                      <TiContacts />
                    </span>
                  </span>
                </div>

                {activeTab === 'Chat' && (
                  <div className='chatContant Chat'>
                    <div className='chatLabel'>
                      <p>Recent</p>
                    </div>

                    <div className='tabsHeight' style={{ overflowY: 'auto' }}>
                      {chatSelector?.chats?.length === 0 && <NoChat />}
                      {(searchInput ? filteredChats : chatSelector?.chats || []).map(
                        (item, index) => {
                          let tempUser = item?.users?.filter((v) => v?._id !== user?.user?._id)
                          return (
                            <section
                              className='contacts'
                              key={index}
                              onClick={() => {
                                fetchSingleChat(item?._id)
                              }}
                            >
                              <div
                                className='personDetails'
                                style={{
                                  backgroundColor:
                                    selectedUser == tempUser?.[0]?.name
                                      ? 'var(--cardColor)'
                                      : 'transparent',
                                }}
                                onClick={() => handleClick(item)} // Show the chat window on click
                              >
                                <div className='left'>
                                  <Avatar
                                    style={{
                                      outline: '1px solid gray',
                                      width: '2rem',
                                      height: '2rem',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                    src={
                                      <img
                                        src={
                                          tempUser?.[0]?.photo
                                            ? `${imageBaseUrl}/${tempUser?.[0]?.photo}`
                                            : logo
                                        }
                                        alt='avatar'
                                      />
                                    }
                                  />
                                  <div className='availiblity'>
                                    <div
                                      style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}
                                    >
                                      <h4>{tempUser?.[0]?.name}</h4>
                                    </div>
                                    <p>{item?.lastMessage?.message}</p>
                                  </div>
                                </div>
                                <div className='right time'>
                                  <p
                                    style={{
                                      color: 'var(--textColor)',
                                      fontSize: '12px',
                                      opacity: '60%',
                                    }}
                                  >
                                    {moment(item?.lastMessage?.createdAt).fromNow()}
                                  </p>
                                </div>
                              </div>
                            </section>
                          )
                        },
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'Contacts' && (
                  <div className='chatContant Contacts'>
                    <div className='chatLabel'>
                      <p>Contacts</p>
                    </div>
                    <div className='tabsHeight' style={{ maxHeight: '435px', overflowY: 'auto' }}>
                      {(searchInput ? filteredContacts : chatSelector?.contacts || [])?.map(
                        (contact, index) => {
                          return (
                            <section
                              className='contacts'
                              key={index}
                              onClick={() => {
                                onContactClick(contact)
                              }}
                            >
                              <div className='personDetails'>
                                <div className='left'>
                                  <Avatar
                                    style={{
                                      outline: '1px solid gray',
                                      width: '2rem',
                                      height: '2rem',
                                    }}
                                    src={
                                      <img
                                        src={
                                          contact?.photo
                                            ? `${imageBaseUrl}/${contact?.photo}`
                                            : logo
                                        }
                                        alt='avatar'
                                      />
                                    }
                                  />
                                  <div className='availiblity'>
                                    <div
                                      style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}
                                    >
                                      <h4>{contact?.name}</h4>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </section>
                          )
                        },
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Col>
          )}

          {/* FOR BIG SCREENS */}

          {!size && showMessages ? (
            <Col xl={16} lg={16} md={16} sm={24} xs={24}>
              <div className='messagesBox'>
                <Messages
                  chatId={chatSelector?.chat?.chatId}
                  data={chatSelector?.chat?.messages}
                  chatUser={selectedChatUser}
                />
              </div>
            </Col>
          ) : !size ? (
            <NoMessages />
          ) : null}
        </Row>
      </div>
    </Layout>
  )
}

export default ChatApp
