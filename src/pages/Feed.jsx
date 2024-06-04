import { Avatar, Col, Divider, Image, Modal, Row, Skeleton } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { MdOutlineWbIncandescent } from 'react-icons/md'
import { PiSlideshowBold } from 'react-icons/pi'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { imageBaseUrl } from '../config/constants'
import Layout from '../layout/Layout'
import { addClick, getNearestAttachments, getRecentAttachments } from '../services/Attachments'
import { getContacts } from '../services/chat'

const Feed = () => {
  const chatSelector = useSelector((state) => state.chat)
  const [loading, setLoading] = useState(false)
  const [feed, setFeed] = useState([])
  const [popular, setPopular] = useState([])
  const user = useSelector((state) => state.auth.user)
  console.log('user :', user)

  // Assuming you have a state to manage the visibility of the modal
  const [videoModalVisible, setVideoModalVisible] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)

  // Function to handle click on video thumbnail
  const handleVideoThumbnailClick = (video) => {
    setSelectedVideo(video)
    setVideoModalVisible(true)
  }

  const [activeTab, setActiveTab] = useState('Recent')
  const navigate = useNavigate()

  useEffect(() => {
    getContacts()
    getFeedData()
  }, [])

  useEffect(() => {
    if (activeTab === 'Recent') getFeedData()
    else getNearest()
  }, [activeTab])

  const getFeedData = async () => {
    setLoading(true)
    let response = await getRecentAttachments()
    // console.log({ response })
    if (response?.status === 200) {
      setLoading(false)
      setFeed(response?.data?.data)
    } else {
      setLoading(false)
    }
  }

  const getNearest = async () => {
    setLoading(true)
    let response = await getNearestAttachments()
    if (response?.status === 200) {
      setLoading(false)
      setPopular(response?.data)
    } else {
      setLoading(false)
    }
  }

  const handleNavigateToChat = (item) => {
    navigate(`/chat`, {
      state: {
        openChatWith: item,
      },
    })
  }
  const NoFeeds = () => {
    return (
      <div className='noFeeds'>
        <p>No Feeds Found</p>
      </div>
    )
  }

  const handleTabClick = (value) => {
    setActiveTab(value)
  }

  const onAttachmentClick = async (attachment) => {
    if (attachment?.createdBy) {
      if (localStorage.getItem('userId') !== attachment?.createdBy?._id) {
        await addClick(attachment?._id)
      }
    }
  }

  // components
  const Card = ({ data, onClick }) => {
    if (loading.length) {
      return <Skeleton active avatar style={{ margin: 10 }} />
    }

    if (data?.attachments?.length > 0)
      return (
        <div className='card'>
          <div className='card-header'>
            <div style={{ border: '1px solid var(--gray300)', borderRadius: '50%' }}>
              <Avatar
                src={data?.photo ? `${imageBaseUrl}/${data?.photo}` : logo}
                size={50}
              ></Avatar>
            </div>
            <div className='name-date'>
              <h2 className='userName'>{data?.name}</h2>
              {/* <p className='cardDate'>
                {moment(data?.attachments?.createdAt).format('DD MMM, YYYY')}
              </p> */}
            </div>
          </div>
          <div className='card-content'>
            {data?.attachments?.map((value, index) => {
              if (value?.type == 'photo') {
                return (
                  <div key={index} style={{ flex: 1 }}>
                    <Image
                      src={`${imageBaseUrl}/${value?.path}`}
                      key={index}
                      width={'100%'}
                      height={'300px'}
                      style={{ objectFit: 'cover' }}
                      // style={{ width: '100%', height: '300px', objectFit: 'fill' }}

                      onClick={() => onClick({ ...value, createdBy: { _id: value._id } })}
                    />
                    <div style={{ display: 'flex', paddingTop: '5px' }}>
                      <p style={{ fontWeight: 'bold' }} className='timeaGo'>
                        {moment(value?.createdAt).isSame(moment(), 'day')
                          ? moment(value?.createdAt).fromNow()
                          : moment(value?.createdAt).format('DD MMM, YYYY')}
                      </p>
                    </div>
                  </div>
                )
              } else if (value?.type == 'video') {
                return (
                  <>
                    <div style={{ flex: 1 }}>
                      <video
                        className='feedVideos'
                        src={`${imageBaseUrl}/${value?.path}`}
                        key={index}
                        controls
                        onClick={() => {
                          // handleVideoThumbnailClick(value)
                          onClick({ ...value, createdBy: { _id: value._id } })
                        }}
                      />
                      <div style={{ display: 'flex', paddingTop: '5px' }}>
                        <p style={{ fontWeight: 'bold' }} className='timeaGo'>
                          {moment(value?.createdAt).isSame(moment(), 'day')
                            ? moment(value?.createdAt).fromNow()
                            : moment(value?.createdAt).format('DD MMM, YYYY')}
                        </p>
                      </div>
                    </div>

                    {/* <p className='cardDate'>
                      {moment(value?.createdAt).format('DD MMM, YYYY')}
                    </p> */}
                  </>
                )
              }
              return null
            })}
            {/* Ant Design Modal for Videos */}
            <Modal
              title=''
              open={videoModalVisible}
              onCancel={() => setVideoModalVisible(false)}
              footer={null}
              centered
            >
              {selectedVideo && (
                <video controls width='100%' height='400px'>
                  <source src={`${imageBaseUrl}/${selectedVideo.path}`} />
                  Your browser does not support the video tag.
                </video>
              )}
            </Modal>
          </div>
        </div>
      )
    else return null
  }
  const SingleCard = ({ data, onClick }) => {
    console.log({ data })
    if (loading) {
      return <Skeleton active avatar style={{ margin: 10 }} />
    }

    return (
      <div className='card single-card'>
        <div className='card-header'>
          <Avatar
            style={{ outline: '1px solid var(--gray300)' }}
            src={data?.createdBy?.photo ? `${imageBaseUrl}/${data?.createdBy?.photo}` : logo}
            size={50}
          ></Avatar>
          <div className='name-date'>
            <h2 className='userName'>{data?.createdBy?.name}</h2>
            {/* <p className='cardDate'>
              {moment(data?.attachments?.createdAt).format('DD MMM, YYYY')}
            </p> */}
            <div className='timeaGo'>
              {moment(data?.createdAt).isSame(moment(), 'day')
                ? moment(data?.createdAt).fromNow()
                : moment(data?.createdAt).format('DD MMM, YYYY')}
            </div>
          </div>
        </div>
        <div className='card-content'>
          {data?.type == 'photo' ? (
            <>
              <div>
                <Image
                  src={`${imageBaseUrl}/${data?.path}`}
                  width={'100%'}
                  height={'500px'}
                  style={{ objectFit: 'cover' }}
                  onClick={() => onClick(data)}
                />
                {/* <div style={{ display: 'flex', paddingTop: '5px' }}>
                  <p style={{ fontWeight: 'bold' }} className='timeaGo'>
                    {moment(data?.createdAt).isSame(moment(), 'day')
                      ? moment(data?.createdAt).fromNow()
                      : moment(data?.createdAt).format('DD MMM, YYYY')}
                  </p>
                </div> */}
              </div>
            </>
          ) : (
            <>
              <div>
                <video
                  className='feedVideos'
                  src={`${imageBaseUrl}/${data?.path}`}
                  controls
                  onClick={() => {
                    // handleVideoThumbnailClick(data)
                    onClick(data)
                  }}
                />
                <div className='timeaGo'>
                  {moment(data?.createdAt).isSame(moment(), 'day')
                    ? moment(data?.createdAt).fromNow()
                    : moment(data?.createdAt).format('DD MMM, YYYY')}
                </div>
              </div>
            </>
          )}

          {/* Ant Design Modal for Videos */}
          <Modal
            title=''
            open={videoModalVisible}
            onCancel={() => setVideoModalVisible(false)}
            footer={null}
            centered
          >
            {selectedVideo && (
              <video controls width='100%' height='400px'>
                <source src={`${imageBaseUrl}/${selectedVideo.path}`} />
                Your browser does not support the video tag.
              </video>
            )}
          </Modal>
        </div>
      </div>
    )
  }

  return (
    <Layout active={'feed'}>
      <div className='Feed' style={{ paddingTop: '60px' }}>
        <div className='chatBTNS'>
          <span
            className={`tablinks ${activeTab === 'Recent' ? 'active' : ''}`}
            onClick={() => handleTabClick('Recent')}
          >
            <span className='desktop-icon'>Recent</span>
            <span className='mobile-icon'>
              <MdOutlineWbIncandescent />
            </span>
          </span>

          <span
            className={`tablinks ${activeTab === 'Popular' ? 'active' : ''}`}
            onClick={() => handleTabClick('Popular')}
          >
            <span className='desktop-icon'>Popular</span>
            <span className='mobile-icon'>
              <PiSlideshowBold />
            </span>
          </span>
        </div>
        <Row gutter={[20, 20]}>
          <Col xl={18} lg={18} md={24} sm={24} xs={24}>
            {activeTab === 'Recent' ? (
              <div className='leftFeedSection'>
                {loading ? (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(1, 1fr)',
                      gap: '5px',
                    }}
                  >
                    {Array.from({ length: 4 }, (_, index) => (
                      <Skeleton.Avatar
                        key={index}
                        active
                        style={{
                          height: '400px',
                          width: '100%',
                          marginTop: '20px',
                          backgroundColor: 'var(--borderColor)',
                          borderRadius: '5px',
                        }}
                      />
                    ))}{' '}
                  </div>
                ) : feed?.length > 0 ? (
                  feed?.map((value, index) => (
                    <Card data={value} key={index} onClick={onAttachmentClick} />
                  ))
                ) : (
                  <NoFeeds />
                )}
              </div>
            ) : (
              <div className='leftFeedSection'>
                {loading ? (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(1, 1fr)',
                      gap: '5px',
                    }}
                  >
                    {Array.from({ length: 4 }, (_, index) => (
                      <Skeleton.Avatar
                        key={index}
                        active
                        style={{
                          height: '400px',
                          width: '100%',
                          marginTop: '20px',
                          backgroundColor: 'var(--borderColor)',
                          borderRadius: '5px',
                        }}
                      />
                    ))}
                  </div>
                ) : popular?.length > 0 ? (
                  popular?.map((value, index) => (
                    <SingleCard data={value} key={index} onClick={onAttachmentClick} />
                  ))
                ) : (
                  <NoFeeds />
                )}
              </div>
            )}
          </Col>
          <Col xl={6} lg={6} md={24} sm={24} xs={24}>
            <div className='rightFeedSection'>
              <div className='profileCard'>
                <div style={{ border: '1px solid var(--textColor)', borderRadius: '50%' }}>
                  <Avatar
                    src={user?.user?.photo ? `${imageBaseUrl}/${user?.user?.photo}` : logo}
                    size={80}
                  ></Avatar>
                </div>
                <div>
                  <h2 className='profileName'>{user?.user?.name}</h2>
                  <p className='profileEmail'>{user?.user?.email}</p>
                </div>
                <button onClick={() => navigate('/profile')}>
                  <span>Profile</span>
                </button>
              </div>
              {/* <div className='PROFILE_DIVIDER'>
                <Divider />
              </div> */}
              <div className='feedChat'>
                <h2>Chats</h2>
                {/* <Divider></Divider> */}
                {chatSelector?.contacts?.map((contact, index) => {
                  return (
                    <div
                      key={index}
                      className='chatContent'
                      onClick={() => handleNavigateToChat({ ...contact, id: contact?._id })}
                    >
                      <div style={{ border: '1px solid var(--gray300)', borderRadius: '50%' }}>
                        <Avatar
                          src={
                            <img
                              src={contact?.photo ? `${imageBaseUrl}/${contact?.photo}` : logo}
                              alt='avatar'
                            />
                          }
                          size={30}
                        ></Avatar>
                      </div>
                      <p className='chatUser'>{contact?.name}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Layout>
  )
}

export default Feed
