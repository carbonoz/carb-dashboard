import { Col, Row } from 'antd'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FC, useEffect, useMemo, useState } from 'react'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'

const defaultIcon = new L.Icon({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

type PositionType = [number, number]

interface MapClickHandlerProps {
  setPosition: (position: PositionType) => void
  updateFormValues: (lat: number, lng: number) => void
}

const MapClickHandler: FC<MapClickHandlerProps> = ({
  setPosition,
  updateFormValues,
}) => {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    const handleClick = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng
      setPosition([lat, lng])
      updateFormValues(lat, lng)
    }

    map.on('click', handleClick)

    return () => {
      map.off('click', handleClick)
    }
  }, [map, setPosition, updateFormValues])

  return null
}

interface LocationPickerProps {
  longitude: number | null
  latitude: number | null
  setLongitude: (longitude: number) => void
  setLatitude: (latitude: number) => void
}

const LocationPicker: FC<LocationPickerProps> = ({
  longitude,
  latitude,
  setLatitude,
  setLongitude,
}) => {
  const [position, setPosition] = useState<PositionType | null>(null)

  useEffect(() => {
    if (latitude && longitude) {
      setPosition([latitude, longitude])
    }
    if (!latitude && !longitude) {
      navigator.geolocation.getCurrentPosition((position) => {
        setPosition([position.coords.latitude, position.coords.longitude])
        setLatitude(position.coords.latitude)
        setLongitude(position.coords.longitude)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [longitude, latitude])

  const updateFormValues = (lat: number, lng: number) => {
    setLongitude(lng)
    setLatitude(lat)
    setPosition([lat, lng])
  }

  const center = useMemo(() => {
    return position
      ? { lat: position[0], lng: position[1] }
      : { lat: 0, lng: 0 }
  }, [position])

  if (!position) return <div>Loading map...</div>

  const handleMarkerDrag = (e: L.DragEndEvent) => {
    const marker = e.target
    const { lat, lng } = marker.getLatLng()
    setPosition([lat, lng])
    setLongitude(lng)
    setLatitude(lat)
    updateFormValues(lat, lng)
  }

  return (
    <div className='map-container' style={{ marginBottom: '20px' }}>
      <h3>Select Location on Map</h3>
      <p>Click on the map to set location or drag the marker to adjust</p>
      <MapContainer
        center={center}
        zoom={2}
        style={{ height: '400px', width: '100%', marginBottom: '15px' }}
      >
        <>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <MapClickHandler
            setPosition={setPosition}
            updateFormValues={updateFormValues}
          />
          <Marker
            position={center}
            draggable={true}
            icon={defaultIcon}
            eventHandlers={{
              dragend: handleMarkerDrag,
            }}
          />
        </>
      </MapContainer>
      <Row gutter={16}>
        <Col span={12}>
          <p>
            <strong>Current Latitude:</strong> {position[0].toFixed(6)}
          </p>
        </Col>
        <Col span={12}>
          <p>
            <strong>Current Longitude:</strong> {position[1].toFixed(6)}
          </p>
        </Col>
      </Row>
    </div>
  )
}

export default LocationPicker
