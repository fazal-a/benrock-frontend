/*eslint-disable*/
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
import { AiFillLike } from 'react-icons/ai'

const Feed = () => {
  const chatSelector = useSelector((state) => state.chat)
  // const [loading, setLoading] = useState(false)
  const [feed, setFeed] = useState([])
  const [popular, setPopular] = useState([])
  const user = useSelector((state) => state.auth.user)

  // Assuming you have a state to manage the visibility of the modal
  const [videoModalVisible, setVideoModalVisible] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)

  const [loading, setLoading] = useState(false)

  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const loader = useRef(null)
  useEffect(() => {
    fetchRecentPosts(page)
  }, [page])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1)
        }
      },
      { threshold: 1.0 },
    )

    if (loader.current) {
      observer.observe(loader.current)
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current)
      }
    }
  }, [loader, hasMore])

  const fetchRecentPosts = async () => {
    setLoading(true)
    try {
      const response = await privateAPI.get(
        `/attachment/getPaginatedAttachments?page=${page}&limit=3`,
      )
      const data = await response.data
      setPosts((prev) => [...prev, ...data?.data])
      setHasMore(data?.page < data?.pages)
    } catch (error) {
      console.error('Failed to load posts', error)
    }
    setLoading(false)
  }

  const [popularPosts, setPopularPosts] = useState([])
  const [popularPostsPage, setPopularPostsPage] = useState(1)
  const [hasMorePopularPosts, setHasMorePopularPosts] = useState(true)
  const popularPostsLoader = useRef(null)

  useEffect(() => {
    fetchPopularPosts(popularPostsPage)
  }, [popularPostsPage])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMorePopularPosts) {
          setPopularPostsPage((prevPage) => prevPage + 1)
        }
      },
      { threshold: 1.0 },
    )

    if (popularPostsLoader.current) {
      observer.observe(popularPostsLoader.current)
    }

    return () => {
      if (popularPostsLoader.current) {
        observer.unobserve(popularPostsLoader.current)
      }
    }
  }, [popularPostsLoader, hasMorePopularPosts])

  const fetchPopularPosts = async () => {
    setLoading(true)
    try {
      const response = await privateAPI.get(
        `/attachment/getPopularAttachments?page=${popularPostsPage}&limit=3`,
      )
      const data = await response.data
      setPopularPosts((prev) => [...prev, ...data?.data])
      setHasMorePopularPosts(data?.page < data?.pages)
    } catch (error) {
      console.error('Failed to load posts', error)
    }
    setLoading(false)
  }

  // useEffect(() => {
  //   const observer = new IntersectionObserver(handleObserver,
  //     {
  //       root: null,
  //       rootMargin: "20px",
  //       threshold: 1.0
  //     });
  //   if (loader.current){
  //     observer.observe(loader.current);
  //   }
  // }, []);

  //
  // const handleObserver = (entities) => {
  //   const target = entities[0];
  //   if (target.isIntersecting && hasMore) {
  //     setPage((prev) => prev + 1);
  //   }
  // };
  //
  // useEffect(() => {
  //   loadPosts();
  // }, [page]);

  // Function to handle click on video thumbnail
  const handleVideoThumbnailClick = (video) => {
    setSelectedVideo(video)
    setVideoModalVisible(true)
  }

  const [activeTab, setActiveTab] = useState('Recent')
  const navigate = useNavigate()

  // useEffect(() => {
  //   getContacts()
  //   getFeedData()
  // }, [])

  // useEffect(() => {
  //   if (activeTab === 'Recent') getFeedData()
  //   else getNearest()
  // }, [activeTab])

  // const getFeedData = async () => {
  //   setLoading(true)
  //   let response = await getRecentAttachments()
  //   // console.log({ response })
  //   if (response?.status === 200) {
  //     setLoading(false)
  //     setFeed(response?.data?.data)
  //   } else {
  //     setLoading(false)
  //   }
  // }

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
      <div className='card'>
        <div className='card-header'>
          <div>
            <Avatar
              style={{ outline: '1px solid var(--gray300)' }}
              src={post?.createdBy?.photo ? `${imageBaseUrl}/${post?.createdBy?.photo}` : logo}
              size={50}
            ></Avatar>

            <div className='name-date'>
              <h2 className='userName'>{post?.createdBy?.name}</h2>

              <div className='timeaGo'>
                {moment(post?.createdAt).isSame(moment(), 'day')
                  ? moment(post?.createdAt).fromNow()
                  : moment(post?.createdAt).format('DD MMM, YYYY')}
              </div>
            </div>
            <div>
              <AiFillLike
                style={{ color: '#1890ff', cursor: 'pointer', marginLeft: 10 }}
                onClick={onClick}
              />
            </div>
          </div>
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
                {posts?.map((post) => (
                  <Card post={post} key={post?._id} onClick={onAttachmentClick} />
                ))}
                {loading && <Skeleton active avatar style={{ margin: 10 }} />}
                <div ref={loader} style={{ height: '20px' }} />
              </div>
            ) : (
              <NoFeeds />
            )}
          </>
        ) : (
          <>
            {popularPosts.length > 0 ? (
              <div className='leftFeedSection'>
                {popularPosts?.map((popularPost) => (
                  <Card post={popularPost} key={popularPost?._id} onClick={onAttachmentClick} />
                ))}
                {loading && <Skeleton active avatar style={{ margin: 10 }} />}
                <div ref={popularPostsLoader} style={{ height: '20px' }} />
              </div>
            ) : (
              <NoFeeds />
            )}
          </>
        )}
      </div>
    </Layout>
  )
}

export default Feed
