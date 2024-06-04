import {
  Circle,
  // FeatureGroup,
  LayerGroup,
  LayersControl,
  Marker,
  Popup,
  // Rectangle,
  useMapEvents,
} from 'react-leaflet'
import React, { useState } from 'react'
import L from 'leaflet'

// import { Avatar } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons'

const LocationMarker = ({ index, user }) => {
  const [position, setPosition] = useState(null)
  const map = useMapEvents({
    click() {
      map.locate()
    },
    locationfound(e) {
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
    },
  })
  const customIcon = L.icon({
    iconUrl: '../../../assets/mark.png',
    iconSize: [32, 32], // adjust the size of the icon as needed
    iconAnchor: [16, 32], // adjust the anchor point of the icon
    popupAnchor: [0, -32], // adjust the position of the popup relative to the icon
  })

  const center = [user.lat, user.lng]

  return position === null ? null : (
    <>
      <LayersControl position='topright'>
        <LayersControl.Overlay name='Marker with popup'>
          <Marker key={index} position={position} icon={<EnvironmentOutlined />}>
            <Popup>
              <div>
                <EnvironmentOutlined size={50} />
                {/* <Avatar src={'../../../assets/mark.png'} size={50} /> */}
                <strong>{user.name}</strong>
              </div>
              <div>{user.location}</div>
            </Popup>
          </Marker>
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name='Layer group with circles'>
          <LayerGroup>
            <Circle center={position} pathOptions={{ fillColor: 'blue' }} radius={200} />
            <Circle
              center={center}
              pathOptions={{ fillColor: 'red' }}
              radius={100}
              stroke={false}
            />
            <LayerGroup>
              <Circle
                center={[24.8387, 67.1209]}
                pathOptions={{ color: 'green', fillColor: 'green' }}
                radius={100}
              />
            </LayerGroup>
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>
    </>
  )
}

export default LocationMarker
