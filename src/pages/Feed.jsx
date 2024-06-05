import { Avatar, Col, Divider, Image, Modal, Row, Skeleton } from 'antd'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { MdOutlineWbIncandescent } from 'react-icons/md'
import { PiSlideshowBold } from 'react-icons/pi'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { imageBaseUrl, privateAPI } from '../config/constants'
import Layout from '../layout/Layout'
import { addClick, getNearestAttachments, getRecentAttachments } from '../services/Attachments'
import { getContacts } from '../services/chat'

const Feed = () => {
  const chatSelector = useSelector((state) => state.chat)
  const [loading, setLoading] = useState(false)
  const [feed, setFeed] = useState([])
  const [popular, setPopular] = useState([])
  const user = useSelector((state) => state.auth.user)

  // Assuming you have a state to manage the visibility of the modal
  const [videoModalVisible, setVideoModalVisible] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver,
      {
        root: null,
        rootMargin: "20px",
        threshold: 1.0
      });
    if (loader.current){
      observer.observe(loader.current);
    }
  }, []);

  const loadPosts = async () => {
    const response = await privateAPI.get(`/attachment/getPaginatedAttachments?page=${page}&limit=3`);
    const data = await response.data;
    setPosts(prev => [...prev, ...data?.data]);
    setHasMore(data?.page < data?.pages);
  };
  const handleObserver = (entities) => {
    const target = entities[0];
    if (target.isIntersecting && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [page]);

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
  const Card = ({ post, onClick }) => {
    if (loading) {
      return <Skeleton active avatar style={{ margin: 10 }} />
    }

    return (
      <div className="card">
        <div className="card-header">
          <Avatar
            style={{ outline: '1px solid var(--gray300)' }}
            src={post?.createdBy?.photo ? `${imageBaseUrl}/${post?.createdBy?.photo}` : logo}
            size={50}
          ></Avatar>
          <div className="name-date">
            <h2 className="userName">{post?.createdBy?.name}</h2>
            <div className="timeaGo">
              {moment(post?.createdAt).isSame(moment(), 'day')
                ? moment(post?.createdAt).fromNow()
                : moment(post?.createdAt).format('DD MMM, YYYY')}
            </div>
          </div>
        </div>

        <div className="card-content">
          {post?.type === 'photo' ?
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Image
                src={`${imageBaseUrl}/${post?.path}`}
                width={'100%'}
                height={'300px'}
                style={{ objectFit: 'cover' }}
                onClick={() => onClick({ ...post, createdBy: { _id: post._id } })}
              />
            </div>

            :
            <video
              className="feedVideos"
              src={`${imageBaseUrl}/${post?.path}`}
              controls
              autoPlay
              loop
              muted
              onClick={() => {
                handleVideoThumbnailClick(post)
                onClick({ ...post, createdBy: { _id: post._id } })
              }}
            />
          }
          {/* Ant Design Modal for Videos */}
          <Modal
            title=""
            open={videoModalVisible}
            onCancel={() => setVideoModalVisible(false)}
            footer={null}
            centered
          >
            {selectedVideo && (
              <video controls width="100%" height="400px">
                <source src={`${imageBaseUrl}/${selectedVideo.path}`} />
                Your browser does not support the video tag.
              </video>
            )}
          </Modal>
        </div>
      </div>
    )

  }
  const SingleCard = ({ data, onClick }) => {
    if (loading) {
      return <Skeleton active avatar style={{ margin: 10 }} />
    }

    return (
      <div className="card single-card">
        <div className="card-header">
          <Avatar
            style={{ outline: '1px solid var(--gray300)' }}
            src={data?.createdBy?.photo ? `${imageBaseUrl}/${data?.createdBy?.photo}` : logo}
            size={50}
          ></Avatar>
          <div className="name-date">
            <h2 className="userName">{data?.createdBy?.name}</h2>
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
              </div>
            </>
          ) : (
            <>
              <div>
                <video
                  className='feedVideos'
                  src={`${imageBaseUrl}/${data?.path}`}
                  controls
                  autoPlay
                  loop
                  muted
                  onClick={() => {
                    handleVideoThumbnailClick(data)
                    onClick(data)
                  }}
                />
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
      <div className='Feed'>
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
            {activeTab === 'Recent' ? (
              <div className="leftFeedSection">
                {posts?.map((post) => (<Card post={post} key={post?.id} onClick={onAttachmentClick} />))}
                <div ref={loader} />
              </div>
            ) : (
              <div className='leftFeedSection'>
                {popular?.length > 0 ? (
                  popular?.map((value, index) => (
                    <SingleCard data={value} key={index} onClick={onAttachmentClick} />
                  ))
                ) : (
                  <NoFeeds />
                )
                }
              </div>
            )}
          {/*  <div className='rightFeedSection'>*/}
          {/*    <div className='profileCard'>*/}
          {/*      <div style={{ border: '1px solid var(--textColor)', borderRadius: '50%' }}>*/}
          {/*        <Avatar*/}
          {/*          src={user?.user?.photo ? `${imageBaseUrl}/${user?.user?.photo}` : logo}*/}
          {/*          size={80}*/}
          {/*        ></Avatar>*/}
          {/*      </div>*/}
          {/*      <div>*/}
          {/*        <h2 className='profileName'>{user?.user?.name}</h2>*/}
          {/*        <p className='profileEmail'>{user?.user?.email}</p>*/}
          {/*      </div>*/}
          {/*      <button onClick={() => navigate('/profile')}>*/}
          {/*        <span>Profile</span>*/}
          {/*      </button>*/}
          {/*    </div>*/}
          {/*     <div className='PROFILE_DIVIDER'>*/}
          {/*      <Divider />*/}
          {/*    </div>*/}
          {/*    <div className='feedChat'>*/}
          {/*      <h2>Chats</h2>*/}
          {/*      <Divider></Divider>*/}
          {/*      {chatSelector?.contacts?.map((contact, index) => {*/}
          {/*        return (*/}
          {/*          <div*/}
          {/*            key={index}*/}
          {/*            className='chatContent'*/}
          {/*            onClick={() => handleNavigateToChat({ ...contact, id: contact?._id })}*/}
          {/*          >*/}
          {/*            <div style={{ border: '1px solid var(--gray300)', borderRadius: '50%' }}>*/}
          {/*              <Avatar*/}
          {/*                src={*/}
          {/*                  <img*/}
          {/*                    src={contact?.photo ? `${imageBaseUrl}/${contact?.photo}` : logo}*/}
          {/*                    alt='avatar'*/}
          {/*                  />*/}
          {/*                }*/}
          {/*                size={30}*/}
          {/*              ></Avatar>*/}
          {/*            </div>*/}
          {/*            <p className='chatUser'>{contact?.name}</p>*/}
          {/*          </div>*/}
          {/*        )*/}
          {/*      })}*/}
          {/*    </div>*/}
          {/*  </div>*/}
      </div>
    </Layout>
  )
}

export default Feed
