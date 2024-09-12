import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import './CustomMap.css'
import { DisplayMapProps } from '../../Type/Components/MapTypes'

const DisplayMap: React.FC<DisplayMapProps> = ({ center, zoomLevel = 13 }) => {
  return (
    <MapContainer center={center} zoom={zoomLevel} scrollWheelZoom={false}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={center} />
    </MapContainer>
  )
}

export default DisplayMap
