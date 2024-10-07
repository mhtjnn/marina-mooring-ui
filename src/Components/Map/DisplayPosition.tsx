import { useCallback, useEffect, useState } from 'react'
import L from 'leaflet'
import './CustomMap.css'
import { DisplayPositionProps } from '../../Type/Components/MapTypes'
import { DefaultIcon } from './DefaultIcon'

const DisplayPosition: React.FC<DisplayPositionProps> = ({ map, onPositionChange }) => {
  const onMove = useCallback(() => {
    console.log('it is working')
    const newPosition = map.getCenter()
    if (onPositionChange) {
      console.log('it is working')
      onPositionChange(newPosition.lat, newPosition.lng)
      console.log('newPosition', newPosition)
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
