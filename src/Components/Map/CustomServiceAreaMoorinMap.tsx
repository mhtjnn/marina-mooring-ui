import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L, { LatLngExpression } from 'leaflet'
import './CustomMap.css'
import { CustomServiceAreaMoorinMapProps } from '../../Type/Components/MapTypes'
import {
  DefaultIcon,
  EastIcon,
  GearOffIcon,
  GearOnIcon,
  NeedInspectionIcon,
  NeedServiceIcon,
  NotInUseIcon,
} from './DefaultIcon'
import { MooringPayload } from '../../Type/ApiTypes'
import MooringMapModal from '../CustomComponent/MooringMapModal'
import { Toast } from 'primereact/toast'

const CustomServiceAreaMoorinMap: React.FC<CustomServiceAreaMoorinMapProps> = ({
  position,
  zoomLevel,
  style,
  moorings,
  leftContanerWidth,
}) => {
  const [map, setMap] = useState<L.Map | null>(null)
  const [showMap, setShowMap] = useState(true)
  const mapRef = useRef<any>(null)
  const toast = useRef<Toast>(null)
  const parseCoordinates = (coordinates: string): [number, number] | null => {
    if (!coordinates) return null
    const [latitude, longitude] = coordinates?.split(' ').map(parseFloat)
    return isNaN(latitude) || isNaN(longitude) ? null : [latitude, longitude]
  }

  const dotStyle = (color: any): React.CSSProperties => ({
    display: 'inline-block',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: color,
    marginRight: '6px',
  })

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '2px',
    fontSize: '10px',
  }
  const iconsByStatusId = {
    1: GearOnIcon,
    2: GearOffIcon,
    3: NeedInspectionIcon,
    4: NotInUseIcon,
    5: NeedServiceIcon,
  }

  useEffect(() => {
    if (map && position) {
      map.setView(position)
    }
  }, [position, map])

  useEffect(() => {
    setShowMap(false)
    setTimeout(() => {
      setShowMap(true)
    }, 0)
  }, [leftContanerWidth])

  return (
    <>
      <Toast ref={toast} />
      <div style={{ position: 'relative' }}>
        <div>
          {showMap ? (
            <MapContainer
              ref={setMap}
              style={{ ...style, flexGrow: 1 }}
              center={position}
              zoom={position ? zoomLevel : 4}
              scrollWheelZoom={false}
              attributionControl={false}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {moorings &&
                moorings?.map((mooring: MooringPayload, index: number) => {
                  const coordinates = parseCoordinates(mooring.gpsCoordinates) || [
                    39.4926173, -117.5714859,
                  ]
                  const position: LatLngExpression = coordinates
                  const iconKey = mooring?.mooringStatus?.id as keyof typeof iconsByStatusId
                  const icon = iconsByStatusId[iconKey] || DefaultIcon

                  return (
                    <Marker key={index} position={position} icon={icon} ref={mapRef}>
                      <Popup>
                        <MooringMapModal
                          gpsValue={position}
                          mooringId={mooring?.mooringNumber}
                          mooringData={mooring}
                          selectedMooring={mooring}
                          boatId={mooring?.boatId}
                          boatName={mooring?.boatName}
                        />
                      </Popup>
                    </Marker>
                  )
                })}
            </MapContainer>
          ) : null}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '3px',
            left: '87%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
          <div style={{ width: '8vw' }}>
            <h5 className="text-xs">Status</h5>
            <div className="mt-0.5">
              <hr style={{ border: '1px solid #3F3F3F' }} />
            </div>
            <div style={containerStyle}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div>
                  <span style={dotStyle('red')}></span> Need Inspection
                </div>
                <div>
                  <span style={dotStyle('#9226ff')}></span> Gear Off (out of the water)
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginRight: '10px',
                }}>
                <div>
                  <span style={dotStyle('green')}></span> Gear On (in the water)
                </div>
                <div style={{ width: '5vw' }}>
                  <span style={dotStyle('#808080')}></span> Not In Use
                </div>
                <div style={{ width: '5vw' }}>
                  <span style={dotStyle('#FFFF00')}></span> Need Service
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

L.Marker.prototype.options.icon = DefaultIcon

export default CustomServiceAreaMoorinMap
