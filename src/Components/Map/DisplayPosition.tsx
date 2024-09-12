import { useCallback, useEffect, useState } from 'react'
import L from 'leaflet'
import './CustomMap.css'
import { DisplayPositionProps } from '../../Type/Components/MapTypes'
import { DefaultIcon } from './DefaultIcon'

const DisplayPosition: React.FC<DisplayPositionProps> = ({ map, onPositionChange }) => {
  const onMove = useCallback(() => {
    const newPosition = map.getCenter()

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

  return null
}

L.Marker.prototype.options.icon = DefaultIcon

export default DisplayPosition
