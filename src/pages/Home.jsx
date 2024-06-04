import { Avatar, BackTop, Button, Tooltip } from 'antd'
import { UpOutlined } from '@ant-design/icons'

import L from 'leaflet'
import ReactDOM from 'react-dom'
import React, { useEffect, useRef, useState } from 'react'
import { IoChatbubblesOutline } from 'react-icons/io5'
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  LayerGroup,
  SVGOverlay,
  Circle,
} from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { imageBaseUrl } from '../config/constants'
import Layout from '../layout/Layout'
import { addReview, getALLusers, getReviews } from '../services/Reviews'
import Reviews from '../components/Reviews'
import { getAttachmentsByUserID } from '../services/Attachments'
import { FaArrowUp } from 'react-icons/fa'

const Home = () => {
  const mapRef = useRef(null)
  const [influencers, setInfluencers] = useState([])
  const [currentLocation, setCurrentLocation] = useState(null)
  const [reviews, setReviews] = useState([])
  const [selectedInfluencer, setSelectedInfluencer] = useState(null)
  const [allUsers, setAllUsers] = useState([])
  const [newReview, setNewReview] = useState('')
  const [loading, setLoading] = useState(false)
  const [photosMedia, setPhotosMedia] = useState([])
  const [videosMedia, setVideosMedia] = useState([])
  const [showScrollButton, setShowScrollButton] = useState(false)

  const navigate = useNavigate()
  const ref = useRef()

  const handleNavigateToChat = (item) => {
    navigate(`/chat`, {
      state: {
        openChatWith: item,
      },
    })
  }
  const getReview = async (id) => {
    try {
      setLoading(true)
      const getReview = await getReviews(id)
      console.log({ getReview })
      setReviews(getReview)
      setLoading(false)
    } catch (e) {
      console.log({ e })
    }
  }
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
      await getReview(id)
    } catch (error) {
      console.error('Error adding review:', error)
    }
  }

  const clearReviews = () => {
    setReviews([])
    setSelectedInfluencer({})
  }
  const handleToggleReviews = async (influencer) => {
    setSelectedInfluencer((prevInfluencer) =>
      prevInfluencer && prevInfluencer.id === influencer.id ? null : influencer,
    )

    ref?.current?.open()
    await getReview(influencer?.id)
    await fetchAttchments(influencer?.id)
  }
  const fetchAttchments = async (id) => {
    try {
      const attachments = await getAttachmentsByUserID(id)
      console.log({ attachments })
      if (attachments) {
        const photoAttachments = attachments.data.filter(
          (attachment) => attachment.type === 'photo',
        )
        console.log('photoAttachments :', photoAttachments)
        setPhotosMedia(photoAttachments)
        const videoAttachments = attachments.data.filter(
          (attachment) => attachment.type === 'video',
        )
        setVideosMedia(videoAttachments)
      }
    } catch (error) {
      console.error('Error fetching profile data:', error)
    }
  }
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          console.error('Error getting current location:', error.message)
        },
      )
    } else {
      console.error('Geolocation is not supported by your browser')
    }
  }
  const currentLocationIcon = new L.Icon({
    iconUrl:
      'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })

  const influencerIcon = (profileImage) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<img src="${profileImage}" alt="Profile" style="width: 60px; height: 60px; border-radius: 50%;border: 3px solid rgb(18, 38, 71);">`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30],
    })
  }
  const getUsers = async () => {
    try {
      const data = await getALLusers()
      console.log('🚀 ~ file: Home.jsx:138 ~ getUsers ~ data:', data)
      setAllUsers(data)
    } catch (e) {
      console.log({ e })
    }
  }
  const AllUsers = () => {
    const Influencers = allUsers
      .filter((item) => item?.location?.coordinates)
      .map((item, i) => ({
        id: item?._id,
        name: item?.name,
        email: item?.email,
        bio: item?.description,
        location: {
          latitude: item?.location.coordinates[1],
          longitude: item?.location.coordinates[0],
        },
        profileImage: item?.photo ? `${imageBaseUrl}/${item?.photo}` : logo,
        reviews: reviews,
      }))

    setInfluencers(Influencers.filter((val) => val?.id !== localStorage.getItem('userId')))
  }

  useEffect(() => {
    getUsers()
  }, [])

  useEffect(() => {
    AllUsers()
  }, [allUsers, reviews])

  useEffect(() => {
    if (!mapRef.current && influencers.length) {
      const map = L.map('map', {
        minZoom: 3,
        maxZoom: 12,
        zoomControl: false,
        zoomAnimation: true,
        fadeAnimation: true,
        markerZoomAnimation: true,
        zoomSnap: 0.06,
      }).setView([-0.09, 51.505], 3)

      mapRef.current = map

      L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current)

      L.tileLayer(
        // 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        // 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        // 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        // 'https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png',
        // 'https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        },
      ).addTo(mapRef.current)

      const points = influencers.map((influencer) => [
        influencer?.location?.latitude,
        influencer?.location?.longitude,
      ])

      const heat = new L.heatLayer(points, {
        maxZoom: 9,
        max: 10000000,
        radius: 50,
        blur: 75,
        animate: true, // Enable animation for smoother transitions
      })

      heat.setOptions({ max: 0.0001 })

      heat.addTo(mapRef.current)

      // Handle map events
      // mapRef.current.on('zoomstart', () => {
      //   // Update heatmap options on zoom
      //   const zoom = mapRef.current.getZoom()
      //   heat.setLatLngs(points);
      //   heat.setOptions({
      //     radius:   50,
      //     blur:   75,
      //   })
      // })
      mapRef.current.on('zoom', () => {
        // Update heatmap options on zoom
        const zoom = mapRef.current.getZoom()
        heat.setLatLngs(points)
        heat.setOptions({
          radius: 50,
          blur: 75,
        })
      })

      mapRef.current.on('dragstart', () => {
        // Update heatmap options on map move
        const zoom = mapRef.current.getZoom()
        heat.setLatLngs(points)
        heat.setOptions({
          radius: 50,
          blur: 75,
        })
      })

      if (currentLocation) {
        L.marker([currentLocation.latitude, currentLocation.longitude], {
          icon: currentLocationIcon,
        })
          .addTo(mapRef.current)
          .bindPopup('Your Current Location')
      }

      influencers.forEach((influencer, index) => {
        const marker = L.marker([influencer?.location?.latitude, influencer?.location?.longitude], {
          icon: influencerIcon(influencer?.profileImage),
        })

        const popupContent = document.createElement('div')
        ReactDOM.render(
          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar src={influencer?.profileImage ? influencer?.profileImage : logo} />

              <h3 className='name' style={{ paddingLeft: '5px' }}>
                {influencer?.name}

                {/* <Tooltip
                  color='var(--primary)'
                  placement='rightTop'
                  title={`Chat with ${influencer?.name}`}
                 
                > */}
                <IoChatbubblesOutline
                  onClick={() => handleNavigateToChat(influencer)}
                  style={{
                    color: 'hotpink',
                    marginLeft: '10px',
                    cursor: 'pointer',
                  }}
                  size={20}
                />
                {/* </Tooltip> */}
              </h3>
            </div>

            <div
              style={{
                marginTop: 10,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                justifyContent: 'space-between',
              }}
            >
              <Button
                style={{
                  background: 'linear-gradient(to right,rgb(211, 96, 115), pink)',
                  color: 'white',
                  width: '100%',
                }}
                onClick={() => handleToggleReviews(influencer, influencer?.email, influencer?.bio)}
              >
                Profile
              </Button>
            </div>
          </div>,

          popupContent,
        )
        marker.bindPopup(popupContent)
        marker.addTo(mapRef.current)
      })
    }
  }, [influencers, influencerIcon, currentLocation])

  // const handleScrollToTop = () => {
  //   window.scrollTo({
  //     top: 0,
  //     behavior: 'smooth',
  //   })
  // }

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setShowScrollButton(window.scrollY > 100)
  //   }

  //   window.addEventListener('scroll', handleScroll)

  //   return () => {
  //     window.removeEventListener('scroll', handleScroll)
  //   }
  // }, [])
  return (
    <Layout active={'map'}>
      <section className='map-container'>
        <div id='map' style={{ height: '100vh' }}></div>
        {/* <div
          style={{
            padding: '25px',
            backgroundColor: 'var(--grey500)',
          }}
          className='ScrollBtn'
        >
          {showScrollButton && (
            <Button
              // type='primary'
              shape='round'
              icon={<FaArrowUp color='white' />}
              size='medium'
              style={{
                position: 'fixed',
                // top: '10px',
                bottom: '10px',
                // right: '40%',
                paddingBottom: '10px',
                backgroundColor: 'hotpink',
                borderColor: 'hotpink',
              }}
              onClick={handleScrollToTop}
            ></Button>
          )}
        </div> */}

        <Reviews
          selectedInfluencer={selectedInfluencer}
          _getReviews={getReview}
          reviews={reviews}
          clearReviews={clearReviews}
          photos={photosMedia}
          videos={videosMedia}
          loading={loading}
          ref={ref}
        />
      </section>
    </Layout>
  )
}

export default Home
