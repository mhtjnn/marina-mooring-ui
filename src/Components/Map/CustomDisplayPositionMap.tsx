import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import './CustomMap.css'
import { CustomDisplayPositionMapProps } from '../../Type/Components/MapTypes'
import { useEffect, useRef, useState } from 'react'
import { DefaultIcon } from './DefaultIcon'
import { Toast } from 'primereact/toast'

const CustomDisplayPositionMap: React.FC<CustomDisplayPositionMapProps> = ({
  position,
  zoomLevel,
  style,
}) => {
  const [map, setMap] = useState<any>()
  const markerRef = useRef(null)
  const toast = useRef<Toast>(null)

  useEffect(() => {
    if (map && position) {
      map.setView(position)
    }
  }, [position, map])

  return (
    <>
      <Toast ref={toast} />
      <MapContainer
        style={style}
        center={position}
        zoom={zoomLevel}
        scrollWheelZoom={false}
        attributionControl={false}
        ref={setMap}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position} ref={markerRef}></Marker>
      </MapContainer>
    </>
  )
}

L.Marker.prototype.options.icon = DefaultIcon

export default CustomDisplayPositionMap
