import { Avatar, Button, Drawer, Space, Row, Col, Rate, Modal } from 'antd'
import React, { useImperativeHandle, useState, forwardRef, useEffect } from 'react'
import { GrClose } from 'react-icons/gr'
import logo from '../../assets/logo.png'
import { addReview } from '../../services/Reviews'
import { imageBaseUrl } from '../../config/constants'
import { IoIosSend, IoMdPhotos } from 'react-icons/io'
import moment from 'moment'
import { CiVideoOn } from 'react-icons/ci'
import { useSelector } from 'react-redux'
import { getAttachments, getAttachmentsByUserID } from '../../services/Attachments'
import { FaVideo, FaImages } from 'react-icons/fa'

const Reviews = forwardRef(
  ({ clearReviews, selectedInfluencer, _getReviews, loading, reviews, photos, videos }, ref) => {
    // console.log('reviews :', reviews)

    // console.log('selectedInfluencer.id', selectedInfluencer.id)
    useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
    }))

    const [newReview, setNewReview] = useState('')
    const [open, setOpen] = useState(false)

    const [modalPhotoVisible, setModalPhotoVisible] = useState(false)
    const [currentImage, setCurrentImage] = useState(null)

    const [modalVideoVisible, setModalVisible] = useState(false)
    const [currentVideo, setCurrentVideo] = useState(null)
    const [allimgesModal, setAllImagesModal] = useState(false)

    const [allvideosModal, setAllVideosModal] = useState(false)
    const user = useSelector((state) => state.auth.user)

    const onClose = () => {
      setOpen(false)
      clearReviews()
    }

    //   functions

    const handleAddReview = async (e, id) => {
      e.preventDefault()
      console.log({ id })
      const val = {
        givenTo: id,
        comments: newReview,
        rating: 5,
      }
      try {
        const add = await addReview(val)
        console.log({ add })

        setNewReview('')
        await _getReviews(id)
      } catch (error) {
        console.error('Error adding review:', error)
      }
    }

    //   components

    const NoReviewsFound = () => {
      return (
        <div className='noReivewContainer'>
          <img src={require('../../assets/n-reviews-found.png')} width={100} />

          <p className='noReview' style={{ color: 'var(--textColor)' }}>
            No Reviews Found
          </p>
        </div>
      )
    }

    // No image found components
    const NoImagesFound = ({ type = 'photo' }) => {
      return (
        <div className='noPhotoContainer'>
          {type === 'photo' ? (
            <p className='uploadPhoto' style={{ textAlign: 'center', color: 'var(--textColor)' }}>
              No content found
            </p>
          ) : (
            <p className='uploadPhoto' style={{ textAlign: 'center', color: 'var(--textColor)' }}>
              No content found
            </p>
          )}
        </div>
      )
    }
    const allImages = () => {
      setAllImagesModal(true)
    }
    const handlecloseAllImages = () => {
      setAllImagesModal(false)
    }
    const allVideos = () => {
      setAllVideosModal(true)
    }
    const handlecloseAllVideos = () => {
      setAllVideosModal(false)
    }
    // Modals handle functions

    const handleOpenPhotoModal = (item) => {
      setCurrentImage(item)
      setModalPhotoVisible(true)
    }

    const handleClosePhotoModal = () => {
      setModalPhotoVisible(false)
    }

    const handleOpenVideoModal = (item) => {
      setCurrentVideo(item)
      setModalVisible(true)
    }

    const handleCloseVideoModal = () => {
      setModalVisible(false)
    }
    console.log({ selectedInfluencer })
    return (
      <Drawer
        className='my-drawer'
        title='Profile'
        placement={'bottom'}
        closable={false}
        onClose={onClose}
        open={open}
        height={'89%'}
        extra={
          <Space>
            <Button type='primary' onClick={onClose}>
              <GrClose />
            </Button>
          </Space>
        }
      >
        <Row>
          <Col xl={12} lg={12} md={12} sm={24} xs={24}>
            {selectedInfluencer && (
              <section className='influencer-details'>
                <div className='child-Scroll'>
                  <div className='influencer-header'>
                    <div className='avatar-box'>
                      <Avatar
                        src={
                          selectedInfluencer?.profileImage ? selectedInfluencer?.profileImage : logo
                        }
                        alt=''
                        style={{ outline: '1px solid var(--gray300)' }}
                        size={50}
                      />
                    </div>
                    <div className='user-info'>
                      <h2>{selectedInfluencer?.name}</h2>
                      <p className='email'>{selectedInfluencer?.email}</p>
                      <p className='bio'>{selectedInfluencer?.bio}</p>
                    </div>
                  </div>

                  {reviews?.length === 0 ? (
                    <NoReviewsFound />
                  ) : loading ? (
                    <>
                      <div className='skeleton-loading'>
                        <Avatar />
                        <div className='sekeletenCol'>
                          <div className='skeleton-text'></div>
                          <div className='skeleton-text'></div>
                        </div>
                      </div>
                      <div className='skeleton-loading'>
                        <Avatar />
                        <div className='sekeletenCol'>
                          <div className='skeleton-text'></div>
                          <div className='skeleton-text'></div>
                        </div>
                      </div>
                      <div className='skeleton-loading'>
                        <Avatar />
                        <div className='sekeletenCol'>
                          <div className='skeleton-text'></div>
                          <div className='skeleton-text'></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className='reviews-container'>
                      {reviews?.map((review, reviewIndex) => (
                        <div key={reviewIndex} className='review-item'>
                          <Avatar
                            src={`${imageBaseUrl}/${review?.givenBy?.photo}`}
                            alt={`img-${reviewIndex}`}
                            size={50}
                          />
                          <div className='reviewCol'>
                            <div className='rating-label-container'>
                              <div>
                                <h4 className='reviewName'>{review?.givenBy?.name}</h4>
                                <label className='reviewDate'>
                                  {moment(review?.createdAt).format('DD MMM, YYYY')}
                                </label>
                              </div>
                              {/* <div>
                              <Rate disabled value={review?.rating} />
                            </div> */}
                            </div>
                            <p className='comment'>{review?.comments}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <form
                  className='add-review'
                  onSubmit={(e) => handleAddReview(e, selectedInfluencer?.id)}
                >
                  <div className='group'>
                    {reviews && (
                      <Avatar
                        key={0} // Use a constant key since you're rendering only one Avatar
                        // src={`${imageBaseUrl}/${reviews[0]?.givenBy?.photo}`}
                        src={user?.user?.photo ? `${imageBaseUrl}/${user?.user?.photo}` : logo}
                        alt=''
                        size={50}
                      />
                    )}
                    <textarea
                      id='Review'
                      autoComplete='off'
                      value={newReview}
                      onChange={(e) => setNewReview(e.target.value)}
                      className='field'
                      placeholder='Write a new review'
                    />
                    <span>
                      <button type='submit' className='reviewBtn'>
                        <IoIosSend className='sendReviewIcon' />
                      </button>
                    </span>
                  </div>
                </form>
              </section>
            )}
          </Col>
          <Col xl={12} lg={12} md={12} sm={24} xs={24}>
            <div
              className='photo-video-section'
              style={{
                height: '100vh',
                display: 'flex',

                flexDirection: 'column',
                justifyContent: 'start',
              }}
            >
              {selectedInfluencer && (
                <>
                  <div className='reviewPhotos'>
                    <div className='reviewHeading'>
                      <div className='reviewlabel'>
                        <FaImages color='hotpink' fontSize={20} />
                        <h2 style={{ paddingLeft: '5px' }}>Photos</h2>
                      </div>
                      {photos.length > 3 && (
                        <p className='viewAllBTN' onClick={allImages}>
                          View All Images
                        </p>
                      )}
                    </div>

                    <div>
                      {photos?.length === 0 && <NoImagesFound type='photo' />}
                      <div className='reviewPhotoContainer'>
                        {photos.slice(0, 3).map((item, index) => (
                          <div key={index} onClick={() => handleOpenPhotoModal(item)}>
                            <img
                              style={{ width: '100%', height: '250px', objectFit: 'fill' }}
                              src={`${imageBaseUrl}/${item.path}`}
                              alt={`img-${index}`}
                            />
                          </div>
                        ))}
                      </div>
                      <Modal
                        open={allimgesModal}
                        onCancel={handlecloseAllImages}
                        footer={null}
                        width={900} // Set the width as per your requirement
                        // centered
                      >
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                          {photos.map((item, index) => (
                            <div key={index} onClick={() => handleOpenPhotoModal(item)}>
                              <img
                                style={{
                                  objectFit: 'fill',
                                  width: '100%',
                                  height: '150px',
                                  borderRadius: '5px',
                                }}
                                src={`${imageBaseUrl}/${item.path}`}
                                alt={`img-${index}`}
                              />
                            </div>
                          ))}
                        </div>
                      </Modal>
                      {/* Ant Design Modal */}
                      <Modal
                        open={modalPhotoVisible}
                        onCancel={handleClosePhotoModal}
                        footer={null}
                        width={800} // Set the width as per your requirement
                        centered
                      >
                        {currentImage && (
                          <img
                            style={{ width: '100%', maxHeight: '70vh', objectFit: 'fill' }}
                            src={`${imageBaseUrl}/${currentImage.path}`}
                            alt={`img-modal`}
                          />
                        )}
                      </Modal>
                    </div>
                  </div>

                  <div className='reviewVideos'>
                    <div className='reviewHeading'>
                      <div className='reviewlabel'>
                        <FaVideo color='hotpink' fontSize={20} />
                        <h2 style={{ paddingLeft: '5px' }}>Videos</h2>
                      </div>
                      {videos?.length > 3 && (
                        <p className='viewAllBTN' onClick={allVideos}>
                          View All Videos
                        </p>
                      )}
                    </div>

                    <div>
                      {videos?.length === 0 && <NoImagesFound type='video' />}
                      <div className='reviewVideoContainer'>
                        {videos.slice(0, 3).map((item, index) => (
                          <div
                            key={index}
                            className='reviewVideo'
                            onClick={() => handleOpenVideoModal(item)}
                          >
                            <video controls width='100%' height='200px' className='reviewVideo'>
                              <source src={`${imageBaseUrl}/${item.path}`} />
                            </video>
                          </div>
                        ))}
                      </div>
                      <Modal
                        open={allvideosModal}
                        onCancel={handlecloseAllVideos}
                        footer={null}
                        width={900} // Set the width as per your requirement
                        // centered
                      >
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                          {videos.map((item, index) => (
                            <div key={index} onClick={() => handleOpenPhotoModal(item)}>
                              <video controls width='100%' height='200px' className='reviewVideo'>
                                <source src={`${imageBaseUrl}/${item.path}`} />
                              </video>
                            </div>
                          ))}
                        </div>
                      </Modal>
                      {/* Ant Design Modal */}
                      <Modal
                        open={modalVideoVisible}
                        onCancel={handleCloseVideoModal}
                        footer={null}
                        centered
                        width={800} // Set the width as per your requirement
                      >
                        {currentVideo && (
                          <video controls width='100%' height='400px' className='reviewVideo'>
                            <source src={`${imageBaseUrl}/${currentVideo.path}`} />
                          </video>
                        )}
                      </Modal>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Col>
        </Row>
      </Drawer>
    )
  },
)
Reviews.displayName = 'Reviews'

export default Reviews
