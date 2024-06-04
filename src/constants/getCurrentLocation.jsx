import { useState, useEffect } from 'react'

export const getUserLocation = async () => {
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
      )
    })

    const { latitude, longitude } = position.coords
    console.log('User location:', { latitude, longitude })

    // You can return the location or use it for further processing
    return { latitude, longitude }
  } catch (error) {
    console.error('Error getting current location:', error.message)
    // Handle error as needed
    throw error // Re-throw the error if you want the calling component to handle it
  }
}
