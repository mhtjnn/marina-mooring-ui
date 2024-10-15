import { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, Marker, TileLayer, ZoomControl } from 'react-leaflet'
import L from 'leaflet'
import './CustomMap.css'
import DisplayPosition from './DisplayPosition'
import { CustomSelectPositionMapProps } from '../../Type/Components/MapTypes'
import { DefaultIcon } from './DefaultIcon'
import { Toast } from 'primereact/toast'

const CustomSelectPositionMap: React.FC<CustomSelectPositionMapProps> = ({
  onPositionChange,
  center,
  zoomLevel,
}) => {
  const [map, setMap] = useState<any>()
  const markerRef = useRef(null)
  const toast = useRef<Toast>(null)

  useEffect(() => {
    if (map && center) {
      map?.setView(center)
    }
  }, [center, map])

  const displayMap = useMemo(() => {
    return (
      <>
        <MapContainer
          center={center}
          zoom={15}
          worldCopyJump={true}
          attributionControl={false}
          ref={setMap}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            ref={markerRef}
            position={center ? center : [30.6983149, 76.656095]}
            icon={DefaultIcon}></Marker>
        </MapContainer>
      </>
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
