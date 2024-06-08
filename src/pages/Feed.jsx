/*eslint-disable*/
import { Avatar, Image, Modal, Skeleton } from 'antd'
import moment from 'moment'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MdOutlineWbIncandescent } from 'react-icons/md'
import { PiSlideshowBold } from 'react-icons/pi'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logoWhiteBG.png'
import { imageBaseUrl, privateAPI } from '../config/constants'
import Layout from '../layout/Layout'
import { addClick, toggleLike } from '../services/Attachments'
import { AiFillLike, AiOutlineLike } from 'react-icons/ai'
import { toggleLikeAction } from '../redux'

const Feed = () => {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState('Recent')

  const [videoModalVisible, setVideoModalVisible] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)

  const [likedAttachments, setLikedAttachments] = useState([])

  const [loading, setLoading] = useState(false)

  // States for managing and getting recent posts
  const [posts, setPosts] = useState([])
  const [popularPosts, setPopularPosts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    if (activeTab === 'Recent') {
      fetchRecentPosts(1, true)
    } else {
      fetchPopularPosts(1, true)
    }
  }, [activeTab])

  // useEffect(() => {
  //   if (activeTab === 'Recent' && page > 1) {
  //     fetchRecentPosts(page);
  //   } else if (activeTab === 'Popular' && page > 1) {
  //     fetchPopularPosts(page);
  //   }
  // }, [page]);

  const fetchRecentPosts = async (page, reset = false) => {
    console.log('Fetching recent posts', page, reset)
    setLoading(true)
    try {
      const response = await privateAPI.get(`/attachment/getRecentFeed?page=${page}`)
      const data = await response.data
      if (reset) {
        setPosts(data.data)
      } else {
        setPosts((prev) => [...prev, ...data.data])
      }
      setHasMore(page < data.pages)
    } catch (error) {
      console.error('Failed to load posts', error)
    }
    setLoading(false)
  }

  const fetchPopularPosts = async (page, reset = false) => {
    console.log('Fetching popular posts', page, reset)
    setLoading(true)
    try {
      const response = await privateAPI.get(`/attachment/getPopularAttachments?page=${page}`)
      const data = await response.data
      if (reset) {
        setPopularPosts(data.data)
      } else {
        setPopularPosts((prev) => [...prev, ...data.data])
      }
      setHasMore(page < data.pages)
    } catch (error) {
      console.error('Failed to load posts', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    setLikedAttachments(user?.user?.likes || [])
    return () => {
      setLikedAttachments([])
    }
  }, [user])

  // Function to handle click on video thumbnail
  const handleVideoThumbnailClick = (video) => {
    setSelectedVideo(video)
    setVideoModalVisible(true)
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
  const onLikeIconClick = async (post) => {
    try {
      if (likedAttachments.includes(post._id)) {
        setLikedAttachments((prevState) => prevState.filter((id) => id !== post._id))
      } else {
        setLikedAttachments((prevState) => [...prevState, post._id])
      }
      await dispatch(toggleLikeAction(post._id))
      await toggleLike(user, post._id) // Call the API to toggle like status
    } catch (err) {
      console.error('Error toggling like status:', err)
    }
  }
  const Card = ({ post, onClick }) => {
    if (loading) {
      return <Skeleton active avatar style={{ margin: 10 }} />
    }
    return (
      <div className='card'>
        <div className='card-header'>
          <div className='avatar-name-section'>
            <Avatar
              style={{ outline: '1px solid var(--gray300)', backgroundColor: 'white' }}
              src={post?.createdBy?.photo ? `${imageBaseUrl}/${post?.createdBy?.photo}` : logo}
              size={50}
            ></Avatar>

            <div className='name-date'>
              <h3 className='userName'>{post?.createdBy?.name}</h3>

              <div className='timeaGo'>
                {moment(post?.createdAt).isSame(moment(), 'day')
                  ? moment(post?.createdAt).fromNow()
                  : moment(post?.createdAt).format('DD MMM, YYYY')}
              </div>
            </div>
          </div>
          {likedAttachments.includes(post._id) ? (
            <div>
              <AiFillLike
                size={40}
                style={{ color: '#1890ff', cursor: 'pointer', paddingRight: 10 }}
                onClick={() => {
                  onClick()
                  onLikeIconClick(post)
                }}
              />
            </div>
          ) : (
            <div>
              <AiOutlineLike
                size={40}
                style={{ color: '#1890ff', cursor: 'pointer', paddingRight: 10 }}
                onClick={() => {
                  onClick()
                  onLikeIconClick(post)
                }}
              />
            </div>
          )}
        </div>

        <div className='card-content'>
          {post?.type === 'photo' ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Image
                src={`${imageBaseUrl}/${post?.path}`}
                width={'100%'}
                height={'300px'}
                style={{ objectFit: 'cover' }}
                onClick={() => onClick({ ...post, createdBy: { _id: post._id } })}
              />
            </div>
          ) : (
            <video
              className='feedVideos'
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
          <>
            {posts.length > 0 ? (
              <div className='leftFeedSection'>
                {posts.map((post) => (
                  <Card
                    post={post}
                    key={`${post.createdBy._id}${post._id}`}
                    onClick={onAttachmentClick}
                  />
                ))}
                {loading && <Skeleton active avatar style={{ margin: 10 }} />}
              </div>
            ) : (
              <div className='leftFeedSection'>
                <NoFeeds />
              </div>
            )}
          </>
        ) : (
          <>
            {popularPosts.length > 0 ? (
              <div className='leftFeedSection'>
                {popularPosts.map((popularPost) => (
                  <Card post={popularPost} key={popularPost._id} onClick={onAttachmentClick} />
                ))}
                {loading && <Skeleton active avatar style={{ margin: 10 }} />}
              </div>
            ) : (
              <div className='leftFeedSection'>
                <NoFeeds />
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}

export default Feed
