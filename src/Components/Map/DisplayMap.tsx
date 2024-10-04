import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import './CustomMap.css'
import { DisplayMapProps } from '../../Type/Components/MapTypes'
import { Toast } from 'primereact/toast'
import { useRef } from 'react'

const DisplayMap: React.FC<DisplayMapProps> = ({ center, zoomLevel = 10 }) => {
  const toast = useRef<Toast>(null)

  return (
    <>
      <Toast ref={toast} />
      <MapContainer center={center} zoom={zoomLevel} worldCopyJump={true} scrollWheelZoom={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={center} />
      </MapContainer>
    </>
  )
}

export default DisplayMap
