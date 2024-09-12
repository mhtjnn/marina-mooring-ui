import { useMemo, useState } from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import './CustomMap.css'
import DisplayPosition from './DisplayPosition'
import DefaultIcon from './DefaultIcon'
import { CustomSelectPositionMapProps } from '../../Type/Components/MapTypes'

const CustomSelectPositionMap: React.FC<CustomSelectPositionMapProps> = ({
  onPositionChange,
  center = [31.63398, 74.87226],
  zoomLevel = 13,
}) => {
  const [map, setMap] = useState()

  const displayMap = useMemo(
    () => (
      <MapContainer
        center={center}
        zoom={zoomLevel}
        scrollWheelZoom={false}
        attributionControl={false}
        zoomControl={false}
        ref={setMap}>
        <TileLayer url="/assets/images/map.png" noWrap={true} />
        <Marker position={center} />
      </MapContainer>
    ),
    [],
  )
  return (
    <div>
      {map ? <DisplayPosition map={map} onPositionChange={onPositionChange} /> : null}
      {displayMap}
    </div>
  )
}

L.Marker.prototype.options.icon = DefaultIcon

export default CustomSelectPositionMap
