import { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import './CustomMap.css'
import DisplayPosition from './DisplayPosition'
import { CustomSelectPositionMapProps } from '../../Type/Components/MapTypes'
import {
  DefaultIcon,
  GearOffIcon,
  GearOnIcon,
  MooringIcon,
  NeedInspectionIcon,
  NeedServiceIcon,
  NotInUseIcon,
} from './DefaultIcon'
import { Toast } from 'primereact/toast'

const CustomSelectPositionMap: React.FC<CustomSelectPositionMapProps> = ({
  onPositionChange,
  center,
  zoomLevel,
  defaultIcon,
  mooringStatus,
}) => {
  const [map, setMap] = useState<any>()
  const markerRef = useRef(null)
  const toast = useRef<Toast>(null)

  const iconsByStatusId = {
    1: GearOnIcon,
    2: GearOffIcon,
    3: NeedInspectionIcon,
    4: NotInUseIcon,
    5: NeedServiceIcon,
  }

  const icon = useMemo(() => {
    return (
      iconsByStatusId[mooringStatus as keyof typeof iconsByStatusId] || defaultIcon || MooringIcon
    )
  }, [mooringStatus, defaultIcon])

  useEffect(() => {
    if (map && center) {
      map.setView(center)
    }
  }, [center, map])

  return (
    <div>
      <Toast ref={toast} />
      {map && <DisplayPosition map={map} onPositionChange={onPositionChange} />}
      <MapContainer
        center={center}
        zoom={zoomLevel}
        worldCopyJump={true}
        attributionControl={false}
        ref={setMap}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker
          key={mooringStatus} // Use the icon as a key to force re-render
          ref={markerRef}
          position={center ? center : [30.6983149, 76.656095]}
          icon={icon}
        />
      </MapContainer>
    </div>
  )
}

L.Marker.prototype.options.icon = DefaultIcon

export default CustomSelectPositionMap

// import { useEffect, useMemo, useRef, useState } from 'react'
// import { MapContainer, Marker, TileLayer } from 'react-leaflet'
// import L from 'leaflet'
// import './CustomMap.css'
// import DisplayPosition from './DisplayPosition'
// import { CustomSelectPositionMapProps } from '../../Type/Components/MapTypes'
// import {
//   DefaultIcon,
//   GearOffIcon,
//   GearOnIcon,
//   MooringIcon,
//   NeedInspectionIcon,
//   NeedServiceIcon,
//   NotInUseIcon,
// } from './DefaultIcon'
// import { Toast } from 'primereact/toast'

// const CustomSelectPositionMap: React.FC<CustomSelectPositionMapProps> = ({
//   onPositionChange,
//   center,
//   zoomLevel,
//   defaultIcon,
//   mooringStatus,
// }) => {
//   const [map, setMap] = useState<L.Map | null>(null)
//   const markerRef = useRef<L.Marker | null>(null)
//   const toast = useRef<Toast>(null)

//   const iconsByStatusId = {
//     1: GearOnIcon,
//     2: GearOffIcon,
//     3: NeedInspectionIcon,
//     4: NotInUseIcon,
//     5: NeedServiceIcon,
//   }

//   const icon = useMemo(() => {
//     return (
//       iconsByStatusId[mooringStatus as keyof typeof iconsByStatusId] || defaultIcon || MooringIcon
//     )
//   }, [mooringStatus, defaultIcon])

//   const normalizeBounds = (bounds: L.LatLngBounds) => {
//     return {
//       southWest: {
//         lat: Math.max(-90, Math.min(90, bounds.getSouthWest().lat)),
//         lng: Math.max(-180, Math.min(180, bounds.getSouthWest().lng)),
//       },
//       northEast: {
//         lat: Math.max(-90, Math.min(90, bounds.getNorthEast().lat)),
//         lng: Math.max(-180, Math.min(180, bounds.getNorthEast().lng)),
//       },
//     }
//   }
//   const mapRef = useRef<any>(null)

//   useEffect(() => {
//     if (mapRef.current) {
//       setMap(mapRef.current)
//     }
//   }, [mapRef])

//   useEffect(() => {
//     if (map && center) {
//       map.setView(center)
//     }
//   }, [center, map])

//   useEffect(() => {
//     if (map) {
//       const bounds = map.getBounds()
//       const normalizedBounds = normalizeBounds(bounds)
//       console.log('Normalized Bounds:', normalizedBounds)
//     }
//   }, [map])

//   return (
//     <div>
//       <Toast ref={toast} />
//       {map && <DisplayPosition map={map} onPositionChange={onPositionChange} />}
//       <MapContainer
//         center={center}
//         zoom={zoomLevel}
//         worldCopyJump={true}
//         attributionControl={false}>
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />
//         <Marker
//           key={mooringStatus} // Use the icon as a key to force re-render
//           ref={markerRef}
//           position={center ? center : [30.6983149, 76.656095]}
//           icon={icon}
//         />
//       </MapContainer>
//     </div>
//   )
// }

// L.Marker.prototype.options.icon = DefaultIcon

// export default CustomSelectPositionMap
