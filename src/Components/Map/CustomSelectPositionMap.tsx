import { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import './CustomMap.css'
import DisplayPosition from './DisplayPosition'
import { CustomSelectPositionMapProps } from '../../Type/Components/MapTypes'
import { DefaultIcon, MooringIcon } from './DefaultIcon'
import { Toast } from 'primereact/toast'

const CustomSelectPositionMap: React.FC<CustomSelectPositionMapProps> = ({
  onPositionChange,
  center,
  zoomLevel,
  defaultIcon,
}) => {
  const [map, setMap] = useState<any>()
  const markerRef = useRef(null)
  const toast = useRef<Toast>(null)

  useEffect(() => {
    if (map && center) {
      map.setView(center)
    }
  }, [center, map])

  const displayMap = useMemo(() => {
    return (
      <MapContainer center={center} zoom={zoomLevel} attributionControl={false} ref={setMap}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker
          ref={markerRef}
          position={center ? center : [30.6983149, 76.656095]}
          icon={defaultIcon ? DefaultIcon : MooringIcon}></Marker>
      </MapContainer>
    )
  }, [center, zoomLevel])

  return (
    <div>
      <Toast ref={toast} />
      {map && <DisplayPosition map={map} onPositionChange={onPositionChange} />}
      {displayMap}
    </div>
  )
}

L.Marker.prototype.options.icon = DefaultIcon

export default CustomSelectPositionMap
