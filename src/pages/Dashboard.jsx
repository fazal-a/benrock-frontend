import Layout from '../layout/Layout'
import React, { useEffect, useState } from 'react'
import Map from './Map/Map'

const Dashboard = () => {
  const [currentLocation, setCurrentLocation] = useState(null)

  useEffect(() => {
    // Use the Geolocation API to get the user's current position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setCurrentLocation({ lat: latitude, lng: longitude })
        },
        (error) => {
          console.error('Error getting current location:', error)
        },
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }, [])

  const userPositions = [
    { name: 'User1', location: 'Location1', lat: 51.505, lng: -0.09 },
    { name: 'User2', location: 'Location2', lat: 24.8636, lng: 67.0753 },
    // Add more user positions as needed
  ]
  console.log({ currentLocation })
  return (
    <Layout active={'map'}>
      <section className='leaflet-container'>
        {currentLocation !== null && (
          <Map userPositions={userPositions} defaultLocation={currentLocation} />
        )}
      </section>
    </Layout>
  )
}

export default Dashboard
