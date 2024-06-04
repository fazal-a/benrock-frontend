import {
  FloatButton,
  Modal,
  Popconfirm,
  Rate,
  Upload,
  message,
  notification,
  Avatar,
  Skeleton,
  Input,
  Button,
} from 'antd'
import React, { createRef, useCallback, useEffect, useRef, useState } from 'react'
import { CiVideoOn } from 'react-icons/ci'
import { GoCodeReview } from 'react-icons/go'
import { IoMdPhotos } from 'react-icons/io'
import { PiAirplaneTiltFill } from 'react-icons/pi'
import Layout from '../layout/Layout'

import { UploadOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons'
import { BiLoader, BiUpload, BiVideo } from 'react-icons/bi'
import { GrClose, GrGallery } from 'react-icons/gr'
import { MdDeleteOutline, MdOutlineAccountCircle, MdPersonOutline } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { FaVideo, FaImages, FaStar, FaUser } from 'react-icons/fa'

import { useLocation } from 'react-router-dom'
import defaultProfilePicUrl from '../assets/logo.png'
import UploadModal from '../components/Upload Modal/UploadModal'
import { imageBaseUrl } from '../config/constants'
import { fetchAddress } from '../constants/getAddress'
import store from '../redux/store'
import { LOGIN } from '../redux/types/authTypes'
import { getAttachments, uploadAttachments } from '../services/Attachments'
import { deleteProfilePicture, getProfile, updateProfile, uploadProfile } from '../services/profile'
import { getReviews } from '../services/Reviews'
import LocationModal from '../components/Location Modal/LocationModal'
import moment from 'moment'

const ProfilePreviewModal = ({ visible, imageUrl, onClose }) => {
  return (
    <Modal visible={visible} onCancel={onClose} footer={null}>
      <img src={imageUrl} alt='Profile Preview' style={{ width: '100%', height: 'auto' }} />
    </Modal>
  )
}

const Profile = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const files = useSelector((state) => state.attachment.files)
  const location = useLocation()

  const tab = location.state?.tab || ''
  // console.log({ tab })
  const auth = useSelector((state) => state.auth)
  console.log({ auth })
  const [previewVisible, setPreviewVisible] = useState(false)
  const [photosMedia, setPhotosMedia] = useState([])
  const [videosMedia, setVideosMedia] = useState([])
  const [previewModalVisible, setPreviewModalVisible] = useState(false)

  const [previewImage, setPreviewImage] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [address, setAddress] = useState('')
  // console.log('address :', address)
  const [photoKey, setPhotoKey] = useState('')
  const [photoURL, setPhotoURL] = useState('')
  const [isModalVisible, setModalVisible] = useState(false)
  const [isVideoModalVisible, setVideoModalVisible] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [attachmentType, setAttachmentType] = useState('')
  const [userReviews, setReviews] = useState([])
  const [loactionModal, setLocationModal] = useState(false)
  const [userLocation, setLocation] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [showButtons, setShowButtons] = useState(false)
  const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false)
  const [profileLoader, setProfileLoader] = useState(false)
  const fileInputRef = useRef(null)
  console.log('address', address)
  const [fileList, setFileList] = useState([
    {
      uid: '-1',
      name: 'Profile Picture',
      status: 'done',
      url: user?.photo ? `${imageBaseUrl}/${user?.photo}` : defaultProfilePicUrl,
    },
  ])

  const [formData, setFormData] = useState({
    name: 'name',
    email: 'email',
    bio: 'bio',
  })
  const [currentVideo, setCurrentVideo] = useState(null)

  useEffect(() => {
    fetchAttchments()
  }, [activeTab])

  useEffect(() => {
    if (user !== null) {
      if (user?.user?.photo)
        setFileList([
          {
            uid: '-1',
            name: 'Profile Picture',
            status: 'done',
            url: `${imageBaseUrl}/${user?.user?.photo}`,
          },
        ])
      setFormData({
        name: user?.user?.name || '',
        email: user?.user?.email || '',
        bio: user?.user?.description || '',
      })

      let latitude = user?.user?.location?.coordinates[1]
      let longitude = user?.user?.location?.coordinates[0]

      if (latitude && longitude) {
        const fetchdata = async () => {
          const currentAddress = await fetchAddress(latitude, longitude)
          setAddress(currentAddress)
        }
        fetchdata()
      }
    }
  }, [user])

  useEffect(() => {
    handleTabSubmit()
  }, [tab])

  const fetchAttchments = async () => {
    setLoading(true)
    try {
      const attachments = await getAttachments()
      if (attachments) {
        const photoAttachments = attachments.data.filter(
          (attachment) => attachment.type === 'photo',
        )
        console.log('photoAttachments :', photoAttachments)
        // console.log(photoAttachments)
        setPhotosMedia(photoAttachments)
        setLoading(false)
        const videoAttachments = attachments.data.filter(
          (attachment) => attachment.type === 'video',
        )
        // console.log(videoAttachments)
        setVideosMedia(videoAttachments)
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching profile data:', error)
    }
  }

  const playVideo = (url) => {
    setCurrentVideo(url)
  }
  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (user !== null) {
      if (formData) {
        setProfileLoading(true)
        try {
          const updatedData = await updateProfile({
            id: user?.user?._id,
            name: formData.name,
            email: formData.email.toLowerCase(),
            description: formData.bio,
            photo: user?.user?.photo,
          })

          dispatch({
            type: LOGIN,
            payload: { ...auth, user: { ...auth?.user, user: updatedData } },
          })
          setProfileLoading(false)
          notification.success({
            message: 'Profile updated successfully',
            duration: 3,
            style: { marginTop: '50px' },
          })
        } catch (error) {
          setProfileLoading(false)
          console.error('Update Profile Error:', error)

          notification.error({
            message: `${error}`,
            duration: 3,
            style: { marginTop: '50px' },
          })
        }
      }
    }
  }
  const reviews = [
    { id: 1, rating: 4, comment: 'Great user! Very satisfied with their service.' },
    { id: 2, rating: 5, comment: 'Excellent experience! Would recommend.' },
  ]
  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0

  const handlePreview = async (file) => {
    // uploadProfileImg()
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    setPreviewImage(file.url || file.preview)

    setPreviewVisible(true)
  }
  const handlePreviewPhoto = () => {
    // if (user?.user?.photo && user?.user?.photo !== null) {
    setPreviewModalVisible(true)
    // }
  }
  const handlePreviewModalClose = () => {
    setPreviewModalVisible(false)
  }
  // const handleChange = ({ fileList }) => {
  //   setFileList(fileList)
  //   uploadProfileImg(fileList)
  // }
  const handleFileChange = async (event) => {
    console.log(event.target.files[0])
    setSelectedImage(event.target.files[0])
    await uploadProfileImg(event.target.files[0])
    setIsUpdatingPhoto(false)
  }
  const handleUpdateClick = () => {
    setIsUpdatingPhoto(true)

    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  const handleDeleteProfilePhoto = async () => {
    const data = await deleteProfilePicture()
    console.log({ data })
    setIsUpdatingPhoto(false)

    setSelectedImage(null)
  }
  const uploadProfileImg = async (files) => {
    // let file
    // files.map((val) => {
    //   file = val.originFileObj
    // })
    setProfileLoader(true)
    console.log({ files })
    if (files) {
      const data = await uploadProfile(files)
      console.log({ data })
      const keyPhoto = data?.photo
      // await fetchProfile()
      setPhotoKey(keyPhoto)
      setPhotoURL(`${imageBaseUrl}/${photoKey}`)
      try {
        const updatedData = await updateProfile({
          id: user?.user?._id,
          photo: keyPhoto,
        })

        dispatch({
          type: LOGIN,
          payload: { ...auth, user: { ...auth?.user, updatedData } },
        })
        setProfileLoader(false)
        notification.success({
          message: 'profile updated successfully',
          duration: 3,
          style: { marginTop: '50px' },
        })
      } catch (error) {
        notification.error({
          message: error,
          duration: 3,
          style: { marginTop: '50px' },
        })
        setProfileLoader(false)
      }
    }
  }

  const handleCancelPreview = () => {
    setPreviewVisible(false)
  }
  const handleOk = () => {
    setPreviewVisible(false)
  }

  // Upload Modal Functions
  const handleUploadImages = () => {
    setAttachmentType('photo')
    setModalVisible(true)
  }
  const handleModalCancel = () => {
    setModalVisible(false)
    setVideoModalVisible(false)
    store.dispatch({
      type: 'SET_FILE',
      payload: null,
    })
  }
  const handleModalOk = async (files, type) => {
    console.log({ files })

    const onSubmit = async () => {
      try {
        let combinedFiles = []

        if (files.uploadedFiles && files.uploadedFiles.length > 0) {
          combinedFiles = [...combinedFiles, ...files.uploadedFiles]
        }
        if (files.capturedFile) {
          combinedFiles.push(files.capturedFile)
        }
        if (combinedFiles.length > 0) {
          const data = await uploadAttachments(combinedFiles, type, setUploadLoading)
          console.log('data :', data)
        } else {
          console.log('No files to upload.')
        }
      } catch (error) {
        console.error('Error updating profile:', error)
      }
    }

    await onSubmit()
    setModalVisible(false)
    setVideoModalVisible(false)
    fetchAttchments()
  }
  const handleUploadVideos = () => {
    setAttachmentType('video')
    setVideoModalVisible(true)
  }
  const handleTabSubmit = async () => {
    if (tab !== '') {
      setActiveTab(tab)

      if (tab === 'pictures') {
        setModalVisible(false)
        handleUploadImages()
      }
      if (tab === 'videos') {
        setVideoModalVisible(false)
        handleUploadVideos()
      }
    } else {
      setActiveTab('profile')
    }
  }

  const handleOpenVideoModal = (video) => {
    setSelectedVideo(video)
    setShowVideoModal(true)
  }

  const handleCloseVideoModal = () => {
    setShowVideoModal(false)
  }

  const handleOpenPhotoModal = (photo) => {
    setSelectedPhoto(photo)
    setShowPhotoModal(true)
  }

  const handleClosePhotoModal = () => {
    setShowPhotoModal(false)
  }

  const handleDeletePhoto = () => {
    setShowPhotoModal(false)
  }

  // components
  const NoImagesFound = ({ type = 'photo' }) => {
    return (
      <div className='noPhotoContainer'>
        {type === 'photo' ? (
          <p className='uploadPhoto'>Upload Photos to see here.</p>
        ) : (
          <p className='uploadPhoto'>Upload Videos to see here.</p>
        )}
      </div>
    )
  }
  useEffect(() => {
    if (activeTab === 'reviews' && user) {
      getReview()
    }
  }, [activeTab])

  const getReview = async (id) => {
    try {
      // setLoading(true)
      const getReview = await getReviews()
      console.log({ getReview })
      setReviews(getReview)
      // setLoading(false)
    } catch (e) {
      console.log({ e })
    }
  }

  const handleSetLocation = () => {
    setLocationModal(true)
  }

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation)
  }

  const handlelocationModalOK = async () => {
    setLocationModal(false)
    console.log({ userLocation })
    const [latitude, longitude] = userLocation.map(String)
    console.log({ latitude, longitude })
    try {
      const updatedData = await updateProfile({
        id: user?.user?._id,
        latitude: latitude,
        longitude: longitude,
      })

      dispatch({
        type: LOGIN,
        payload: { ...auth, user: { ...auth?.user, updatedData } },
      })
      notification.success({
        message: 'Location updated successfully',
        duration: 3,
        style: { marginTop: '50px' },
      })
      // await fetchProfile()
      const currentAddress = await fetchAddress(latitude, longitude)

      setAddress(currentAddress)
    } catch (error) {
      notification.error({
        message: error,
        duration: 3,
        style: { marginTop: '50px' },
      })
    }
  }

  const handleCloseModal = () => {
    setLocationModal(false)
  }
  console.log({ user })

  return (
    <Layout active={'profile'}>
      <div className='profile-container'>
        <span className='span'>
          <MdPersonOutline size={20} style={{ marginRight: '5px' }} />
          <h3>My Profile </h3>
        </span>
        <div className='profile-header'>
          <div className='leftsection'>
            <div className='custom-tabs'>
              <div className='tabRow' onClick={() => handleTabClick('profile')}>
                <FaUser
                  size={20}
                  className={activeTab === 'profile' ? 'iconColo-active' : 'iconColor'}
                  color={activeTab === 'profile' ? 'rgb(94, 94, 247)' : '#9FE2BF'}
                />
                <button className={activeTab === 'profile' ? 'active' : ''}>Profile</button>
              </div>
              <div className='tabRow' onClick={() => handleTabClick('pictures')}>
                <FaImages
                  size={20}
                  className={activeTab === 'pictures' ? 'iconColo-active' : 'iconColor'}
                  color={activeTab === 'pictures' ? 'rgb(94, 94, 247)' : 'purple'}
                />
                <button className={activeTab === 'pictures' ? 'active' : ''}>Pictures</button>
              </div>
              <div className='tabRow' onClick={() => handleTabClick('videos')}>
                <FaVideo
                  className={activeTab === 'videos' ? 'iconColo-active' : 'iconColor'}
                  size={20}
                  // style={{ marginLeft: '10px' }}
                  color={activeTab === 'videos' ? 'rgb(94, 94, 247)' : '#808000'}
                />
                <button className={activeTab === 'videos' ? 'active' : ''}>Videos</button>
              </div>
              <div className='tabRow' onClick={() => handleTabClick('reviews')}>
                <FaStar
                  size={20}
                  className={activeTab === 'reviews' ? 'iconColo-active' : 'iconColor'}
                  // style={{ marginLeft: '10px' }}
                  color={activeTab === 'reviews' ? 'rgb(94, 94, 247)' : '#50C878'}
                />
                <button className={activeTab === 'reviews' ? 'active' : ''}>Reviews</button>
              </div>
            </div>
          </div>

          <div className='rightsection'>
            {activeTab === 'profile' && (
              <>
                <span></span>

                <div className='profileBorder'>
                  <div className='avatar-section'>
                    <div className='address'>
                      {profileLoader ? (
                        <div className='loader-container'>
                          <div className='loader'></div>
                        </div>
                      ) : (
                        <div
                          style={{
                            position: 'relative',
                            display: 'inline-block',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={() => setShowButtons(true)}
                          onMouseLeave={() => setShowButtons(false)}
                        >
                          <img
                            src={
                              user?.user?.photo && user?.user?.photo !== null
                                ? `${imageBaseUrl}/${user?.user?.photo}`
                                : defaultProfilePicUrl
                            }
                            alt='Profile'
                            style={{
                              width: '100px',
                              height: '100px',
                              borderRadius: '50%',
                              cursor: 'pointer',
                              outline: '1px solid gray',
                              objectFit: 'contain',
                              marginTop: '30px',
                            }}
                          />

                          {showButtons && (
                            <div
                              style={{
                                position: 'absolute',
                                bottom: 0,
                                left: '25%',
                                transform: 'translateX(-30%)',
                                display: 'grid',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '20%',
                                marginTop: '5px',
                              }}
                            >
                              <button
                                onClick={handlePreviewPhoto}
                                style={{
                                  backgroundColor: 'purple',
                                  color: 'white',
                                  marginBottom:
                                    user?.user?.photo && user?.user?.photo !== null
                                      ? '10px'
                                      : '20px',
                                  border: 'none',
                                  borderRadius: '10px',
                                  cursor: 'pointer',
                                }}
                              >
                                View
                              </button>
                              <button
                                onClick={handleUpdateClick}
                                style={{
                                  backgroundColor: 'purple',
                                  color: 'white',
                                  marginBottom:
                                    user?.user?.photo && user?.user?.photo !== null
                                      ? '10px'
                                      : '20px',
                                  border: 'none',
                                  borderRadius: '10px',
                                  cursor: 'pointer',
                                  position: 'relative',
                                }}
                              >
                                <Input
                                  type='file'
                                  name='myImage'
                                  accept='image/*'
                                  style={{
                                    opacity: 0,
                                    position: 'absolute',
                                    width: '50px',
                                    height: '15px',
                                  }}
                                  onChange={handleFileChange}
                                />
                                Update
                              </button>
                              {user?.user?.photo && user?.user?.photo !== null && (
                                <button
                                  onClick={handleDeleteProfilePhoto}
                                  style={{
                                    backgroundColor: 'purple',
                                    color: 'white',
                                    marginBottom: '15px',
                                    border: 'none',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                  }}
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      <br />

                      {user?.user?.photo && user?.user?.photo === null ? (
                        <label
                          className='custom-file-input'
                          ref={fileInputRef}
                          style={{ display: isUpdatingPhoto ? 'none' : 'flex' }}
                        >
                          <UploadOutlined size={50} />
                          <Input
                            type='file'
                            name='myImage'
                            accept='image/*'
                            style={{ visibility: 'hidden' }}
                            onChange={handleFileChange}
                          />
                        </label>
                      ) : null}
                    </div>
                    {/* <Upload
                        beforeUpload={() => false}
                        listType='picture-circle'
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                      >
                        {fileList.length >= 1 ? null : <UploadOutlined />}
                      </Upload>
                    
                      {fileList.length >= 1 ? (
                        <div className='icon-container'>
                          <EyeOutlined size={30} style={{ color: 'white', paddingRight: '10px' }} />
                          <DeleteOutlined
                            size={30}
                            style={{ color: 'white', paddingRight: '15px' }}
                          />
                        </div>
                      ) : null} */}

                    <div className='form'>
                      <form onSubmit={handleSubmit}>
                        <div className='field-group'>
                          <input
                            type='text'
                            id='name'
                            autoComplete='off'
                            value={formData.name}
                            onChange={handleInputChange}
                            className='input-field'
                          />
                          <label htmlFor='name' className='input-label'>
                            Name :
                          </label>
                        </div>
                        <div className='field-group'>
                          <input
                            type='text'
                            id='email'
                            autoComplete='off'
                            value={formData.email}
                            onChange={handleInputChange}
                            className='input-field'
                          />
                          <label htmlFor='name' className='input-label'>
                            Email :
                          </label>
                        </div>

                        <div className='field-group'>
                          <LocationModal
                            isOpen={loactionModal}
                            onRequestClose={handleCloseModal}
                            onLocationChange={handleLocationChange}
                            onOk={handlelocationModalOK}
                          />

                          <label htmlFor='location' className='location-label'>
                            Location :
                          </label>
                          <div className='location-field'>
                            <div className='location-label-field'>
                              <p className='profileLocattion'>{address}</p>
                            </div>
                            <button className='editBTN' type='button' onClick={handleSetLocation}>
                              <PiAirplaneTiltFill className='locationIcon' />{' '}
                              <p className='loactionBTNText'>Add Location</p>
                            </button>
                          </div>
                        </div>

                        <div className='field-group'>
                          <textarea
                            id='bio'
                            autoComplete='off'
                            value={formData.bio}
                            onChange={handleInputChange}
                            className='input-field bio-input-field'
                          />
                          <label htmlFor='name' className='input-label'>
                            Bio :
                          </label>
                        </div>
                        <div className='buttons'>
                          <button type='submit' className='saveBTN'>
                            {profileLoading ? (
                              <>
                                <BiLoader /> Save
                              </>
                            ) : (
                              'Save'
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </>
            )}
            {activeTab === 'pictures' && (
              <>
                <FloatButton.Group
                  trigger='click'
                  type='primary'
                  className='FLOATING_BTN'
                  closeIcon={<GrClose />}
                  style={{
                    right: 100,
                    marginBottom: '3rem',
                  }}
                  icon={<BiUpload color='white' size={20} />}
                >
                  <FloatButton
                    type='primary'
                    icon={<GrGallery size={20} />}
                    style={{ right: 24 }}
                    onClick={handleUploadImages}
                  />
                </FloatButton.Group>

                <div className='pictureHeaderRow'>
                  {/* 
                  <button onClick={handleUploadImages} className='uploadBtn'>
                    Add Photos <IoMdAdd size={20} />
                  </button> */}
                </div>

                <div>
                  {photosMedia?.length === 0 ? (
                    <NoImagesFound type='photo' />
                  ) : (
                    <>
                      {loading ? (
                        <div className='images-container'>
                          {photosMedia?.map((v, i) => (
                            <div
                              key={i}
                              style={{
                                height: '300px',
                                width: '100%',
                                borderRadius: '5px',
                                background: 'var(--cardColor)',
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className='images-container'>
                          {photosMedia.map((item, index) => (
                            <div
                              key={index}
                              style={{ position: 'relative', marginTop: '13px' }}
                              onClick={() => handleOpenPhotoModal(item)}
                            >
                              <img
                                style={{ width: '100%', height: '300px', objectFit: 'fill' }}
                                src={`${imageBaseUrl}/${item.path}`}
                                alt={`img-${index}`}
                              />
                              {photosMedia?.length !== 0 && (
                                <div style={{ display: 'flex', paddingTop: '5px' }}>
                                  <p style={{ fontWeight: 'bold', color: 'white' }}>
                                    {moment(item?.createdAt).isSame(moment(), 'day')
                                      ? moment(item?.createdAt).fromNow()
                                      : moment(item?.createdAt).format('DD MMM, YYYY')}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  <Modal
                    title=''
                    open={showPhotoModal}
                    onCancel={handleClosePhotoModal}
                    footer={null}
                    centered
                  >
                    {selectedPhoto && (
                      <div>
                        <img
                          style={{
                            width: '100%',
                            maxHeight: '70vh',
                            objectFit: 'contain',
                            '@media screen and(max-width: 600px)': {
                              width: '80%',
                            },
                          }}
                          src={`${imageBaseUrl}/${selectedPhoto.path}`}
                          alt={`selected-img`}
                        />
                        {/* <Popconfirm
                          title='Delete the Photo'
                          description='Are you sure to delete this Photo?'
                          onConfirm={handleDeletePhoto}
                          onCancel={handleDeletePhoto}
                          okText='Yes'
                          cancelText='No'
                        >
                          <MdDeleteOutline
                            style={{
                              color: 'red',
                              fontSize: '20px',
                              position: 'absolute',
                              bottom: '1rem',
                              right: '1rem',
                              cursor: 'pointer',
                              '& @media (max-width: 500px)': {
                                bottom: '2rem',
                                right: '2rem',
                              },
                            }}
                          />
                        </Popconfirm> */}
                      </div>
                    )}
                  </Modal>
                </div>
              </>
            )}
            {activeTab === 'videos' && (
              <>
                <FloatButton.Group
                  trigger='click'
                  type='primary'
                  className='FLOATING_BTN'
                  closeIcon={<GrClose />}
                  style={{
                    right: 100,
                    marginBottom: '3rem',
                  }}
                  icon={<BiUpload color='white' size={20} />}
                >
                  <FloatButton
                    type='primary'
                    icon={<BiVideo size={20} />}
                    style={{ right: 24 }}
                    onClick={handleUploadVideos}
                  />
                </FloatButton.Group>
                <div className='pictureHeaderRow'></div>

                <div>
                  {videosMedia?.length === 0 ? (
                    <NoImagesFound type='video' />
                  ) : (
                    <>
                      {loading ? (
                        <div className='videos-container'>
                          {videosMedia?.map((v, i) => (
                            <div
                              key={i}
                              style={{
                                height: '300px',
                                width: '80%',
                                borderRadius: '5px',
                                background: 'var(--cardColor)',
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <>
                          <div className='videos-container'>
                            {videosMedia.map((item, index) => (
                              <div
                                key={index}
                                className='video-item'
                                onClick={() => handleOpenVideoModal(item)}
                              >
                                <video controls width='100%' height='300px' className='videoCSS'>
                                  <source src={`${imageBaseUrl}/${item.path}`} />
                                  Your browser does not support the video tag.
                                </video>

                                <div style={{ display: 'flex', paddingTop: '5px' }}>
                                  <p style={{ fontWeight: 'bold', color: 'white' }}>
                                    {moment(item?.createdAt).isSame(moment(), 'day')
                                      ? moment(item?.createdAt).fromNow()
                                      : moment(item?.createdAt).format('DD MMM, YYYY')}
                                  </p>
                                </div>
                              </div>
                            ))}
                            {/* {videosData.map((item, index) => (
                    <div key={index} className='video-item'>
                      {currentVideo === item.url ? (
                        <video controls width='300' height='200' autoPlay>
                          <source src={item.url} type='video/mp4' />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <div>
                          <img
                            src={item.thumbnailUrl}
                            alt={item.title}
                            style={{ width: '300px', height: '200px', position: 'relative' }}
                          />
                          <FaCirclePlay
                            size={35}
                            color='white'
                            onClick={() => playVideo(item.url)}
                            style={{ position: 'absolute', top: '20%', left: '45%' }}
                          />
                        </div>
                      )}
                      <div className='video-info'>
                        <h4 className='video-title'>{item.title}</h4>
                        <p className='video-description'>{item.description}</p>
                      </div>
                    </div>
                  ))} */}
                          </div>
                        </>
                      )}
                    </>
                  )}

                  <Modal
                    title='Video'
                    open={showVideoModal}
                    onCancel={handleCloseVideoModal}
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
              </>
            )}
            {activeTab === 'reviews' && (
              <>
                {userReviews?.length === 0 && (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: ' 100%',
                        height: ' 100px',
                        marginTop: '20%',
                      }}
                    >
                      <img src={require('../assets/n-reviews-found.png')} width={100} />

                      <p className='noReview'>No Reviews Found</p>
                    </div>
                  </>
                )}

                <div className='reviewsTab'>
                  {userReviews.map((review) => (
                    <>
                      <div className='review-container'>
                        <img
                          src={
                            review?.givenBy?.photo
                              ? `${imageBaseUrl}/${review?.givenBy?.photo}`
                              : defaultProfilePicUrl
                          }
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            outline: '1px solid gray',
                            objectFit: 'contain',
                          }}
                        />

                        <div className='reviewCOl'>
                          <h3 className='reviewer'>{review?.givenBy?.name}</h3>
                          <p className='email'>{review?.givenBy?.email}</p>

                          <div key={review._id} style={{ margin: '15px' }}>
                            {/* <Rate disabled allowHalf defaultValue={review?.rating} /> */}

                            <p className='reviewComment'>{review?.comments}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <ProfilePreviewModal
        visible={previewModalVisible}
        imageUrl={user?.user?.photo ? `${imageBaseUrl}/${user?.user?.photo}` : defaultProfilePicUrl}
        onClose={handlePreviewModalClose}
      />

      <Modal open={previewVisible} onOk={handleOk} onCancel={handleCancelPreview} footer={null}>
        <img alt='Preview' style={{ width: '100%' }} src={previewImage} />
      </Modal>
      {attachmentType === 'photo' && (
        <UploadModal
          title='Add Photos'
          visible={isModalVisible}
          onCancel={handleModalCancel}
          onOk={handleModalOk}
          // onOk={() => {
          //   handleModalOk();
          //   handleModalCancel(); // Close the photo modal
          // }}
          okText='Submit'
          cancelText='Cancel'
          type={attachmentType}
          tab={activeTab}
          loadingState={uploadLoading}
        />
      )}
      {attachmentType === 'video' && (
        <UploadModal
          title='Add Video'
          visible={isVideoModalVisible}
          onCancel={handleModalCancel}
          onOk={handleModalOk}
          okText='Submit'
          cancelText='Cancel'
          type={attachmentType}
          tab={activeTab}
          loadingState={uploadLoading}
        ></UploadModal>
      )}
    </Layout>
  )
}

export default Profile
