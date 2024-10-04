import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L, { LatLngExpression } from 'leaflet'
import './CustomMap.css'
import { CustomMooringPositionMapProps } from '../../Type/Components/MapTypes'
import {
  DefaultIcon,
  GearOffIcon,
  GearOnIcon,
  NeedInspectionIcon,
  NeedServiceIcon,
  NotInUseIcon,
} from './DefaultIcon'
import { MooringPayload, MooringWithGpsCoordinates } from '../../Type/ApiTypes'
import MooringMapModal from '../CustomComponent/MooringMapModal'
import { Toast } from 'primereact/toast'

const CustomMooringPositionMap: React.FC<CustomMooringPositionMapProps> = ({
  position,
  zoomLevel,
  style,
  moorings,
  mooringData,
  customerPage,
  dashboard,
  setLeftContainer,
  setRightContainer,
  leftContanerWidth,
  rightContanerWidth,
}) => {
  const [map, setMap] = useState<any>()
  const mapRef = useRef<any>(null)
  const [showMap, setShowMap] = useState(true)
  const toast = useRef<Toast>(null)
  const [isZoom, setZoom] = useState<boolean>(false)
  const parseCoordinates = (coordinates: string): [number, number] | null => {
    if (!coordinates) return null
    const [latitude, longitude] = coordinates?.split(' ').map(parseFloat)
    return isNaN(latitude) || isNaN(longitude) ? null : [latitude, longitude]
  }

  const handleOpenMap = () => {
    setZoom((prevZoom) => !prevZoom)
    if (leftContanerWidth && rightContanerWidth) {
      setLeftContainer(false)
      setRightContainer(false)
    } else {
      setLeftContainer(true)
      setRightContainer(true)
    }
  }

  const dotStyle = (color: any) => ({
    display: 'inline-block',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: color,
    marginRight: '10px',
  })

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: isZoom ? 'row' : 'column',
    alignItems: dashboard ? 'center' : 'flex-start',
    gap: dashboard ? '20px' : '2px',
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
  }, [rightContanerWidth, leftContanerWidth])

  return (
    <>
      <div style={{ position: 'relative' }}>
        <Toast ref={toast} />

        <div
          onClick={handleOpenMap}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            cursor: 'pointer',
            zIndex: 9999,
          }}>
          <img
            src="/assets/images/resize.png"
            alt="Resize Icon"
            style={{ width: '20px', height: '20px' }}
          />
        </div>

        {showMap ? (
          <MapContainer
            ref={setMap}
            style={{ ...style, flexGrow: 1 }}
            center={position}
            zoom={position ? zoomLevel : 4}
            scrollWheelZoom={false}
            worldCopyJump={true}
            attributionControl={false}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {moorings && customerPage
              ? moorings?.map((mooring: MooringPayload, index: number) => {
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
                })
              : moorings &&
                moorings?.map((mooring: MooringWithGpsCoordinates, index: number) => {
                  const coordinates = parseCoordinates(mooring.gpsCoordinates) || [
                    39.4926173, -117.5714859,
                  ]
                  const position: LatLngExpression = coordinates
                  const iconKey = mooring?.statusId as keyof typeof iconsByStatusId
                  const icon = iconsByStatusId[iconKey] || DefaultIcon
                  return (
                    <Marker key={index} position={position} icon={icon} ref={mapRef}>
                      <Popup>
                        <MooringMapModal
                          gpsValue={position}
                          mooringId={mooring?.mooringNumber}
                          selectedMooring={mooring}
                          mooringData={mooringData}
                          mooringPage={true}
                        />
                      </Popup>
                    </Marker>
                  )
                })}
          </MapContainer>
        ) : null}

        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
          <div style={{ width: isZoom ? ' 22vw ' : '10vw' }}>
            <h5 className="text-xs">Status</h5>
            <div className="mt-1">
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
                <div style={{ width: '5vw' }}>
                  <span style={dotStyle('#FFFF00')}></span> Need Service
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginRight: dashboard ? '300px' : '80px',
                }}>
                <div>
                  <span style={dotStyle('green')}></span> Gear On (in the water)
                </div>
                <div style={{ width: isZoom ? ' ' : '10vw' }}>
                  <span style={dotStyle('#808080')}></span> Not In Use
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

export default CustomMooringPositionMap
