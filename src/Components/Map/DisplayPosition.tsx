import { useCallback, useEffect, useState } from 'react'
import L from 'leaflet'
import './CustomMap.css'
import DefaultIcon from './DefaultIcon'
import { DisplayPositionProps } from '../../Type/Components/MapTypes'

const DisplayPosition: React.FC<DisplayPositionProps> = ({ map, onPositionChange }) => {
  const [position, setPosition] = useState(() => map.getCenter())

  const onMove = useCallback(() => {
    const newPosition = map.getCenter()
    setPosition(newPosition)
    if (onPositionChange) {
      onPositionChange(newPosition.lat, newPosition.lng)
    }
  }, [map, onPositionChange])

  useEffect(() => {
    map.on('move', onMove)
    return () => {
      map.off('move', onMove)
    }
  }, [map, onMove])

  return <></>
}

L.Marker.prototype.options.icon = DefaultIcon

export default DisplayPosition
