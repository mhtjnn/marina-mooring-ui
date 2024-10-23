import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L, { LatLngExpression } from 'leaflet'
import './CustomMap.css'
import { CustomMooringPositionMapProps } from '../../Type/Components/MapTypes'
import {
  DefaultIcon,
  EastIcon,
  GearOffIcon,
  GearOnIcon,
  NeedInspectionIcon,
  NeedServiceIcon,
  NorthIcon,
  NotInUseIcon,
  WestIcon,
} from './DefaultIcon'
import { MooringPayload, MooringWithGpsCoordinates } from '../../Type/ApiTypes'
import MooringMapModal from '../CustomComponent/MooringMapModal'
import { Toast } from 'primereact/toast'

const CustomDashboardMooringMap: React.FC<CustomMooringPositionMapProps> = ({
  position,
  zoomLevel,
  style,
  moorings,
  leftContanerWidth,
  setLeftContainer,
}) => {
  const [isToggled, setIsToggled] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [map, setMap] = useState<any>()
  const mapRef = useRef<any>(null)
  const [showMap, setShowMap] = useState(false)
  const toast = useRef<Toast>(null)
  const [isZoom, setZoom] = useState<boolean>(false)
  const [checked, setChecked] = useState(false)
  const parseCoordinates = (coordinates: string): [number, number] | null => {
    if (!coordinates) return null
    const [latitude, longitude] = coordinates?.split(' ').map(parseFloat)
    return isNaN(latitude) || isNaN(longitude) ? null : [latitude, longitude]
  }

  const handleOpenMap = () => {
    setZoom((prevZoom) => !prevZoom)
    if (leftContanerWidth) {
      setLeftContainer(false)
    } else {
      setLeftContainer(true)
    }
  }

  const handleToggle = () => {
    setIsToggled(!isToggled)
  }

  const handleCheckboxChange = () => {
    setChecked(!checked)
  }

  const boxStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '10px',
    width: '20vw',
    padding: '10px',
    marginBottom: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'absolute' as 'absolute',
    bottom: '10px',
    left: '50%',
    fontSize: '10px',
    transform: 'translateX(-50%)',
    zIndex: 1000,
  }

  const dotStyle = (color: any): React.CSSProperties => ({
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
    alignItems: 'flex-start',
    gap: '10px',
    marginTop: '5px',
  }

  const iconsByStatusId = {
    1: GearOnIcon,
    2: GearOffIcon,
    3: NeedInspectionIcon,
    4: NotInUseIcon,
    5: NeedServiceIcon,
  }

  const iconsByServiceAreaName = {
    East: EastIcon,
    North: NorthIcon,
    West: WestIcon,
    east: EastIcon,
    north: NorthIcon,
    west: WestIcon,
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
        <div
          onClick={() => {
            handleOpenMap()
          }}
          className="p-2 h-8 w-9 mr-20"
          style={{
            cursor: 'pointer',
            position: 'absolute',
            left: isZoom ? '96%' : '90%',
            top: 0,
            zIndex: 999,
          }}>
          <img src="/assets/images/resize.png" alt="Key Icon" className="p-clickable" />
        </div>
        <div>
          {showMap ? (
            <MapContainer
              ref={setMap}
              style={{
                ...style,
                flexGrow: 1,
              }}
              center={position}
              zoom={position ? zoomLevel : 4}
              scrollWheelZoom={false}
              worldCopyJump={true}
              attributionControl={false}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {moorings &&
                moorings.map((mooring: MooringPayload, index: number) => {
                  const coordinates = parseCoordinates(mooring.gpsCoordinates) || [
                    39.4926173, -117.5714859,
                  ]
                  const position: LatLngExpression = coordinates
                  const iconKey = mooring?.mooringStatus?.id as keyof typeof iconsByStatusId
                  const icon = iconsByStatusId[iconKey] || DefaultIcon
                  const serviceAreaName = mooring?.serviceAreaResponseDto
                    ?.serviceAreaName as keyof typeof iconsByServiceAreaName
                  const iconSeviceType = iconsByServiceAreaName[serviceAreaName] || DefaultIcon

                  return (
                    <Marker
                      key={index}
                      position={position}
                      icon={checked ? iconSeviceType : icon}
                      ref={mapRef}>
                      <Popup>
                        <MooringMapModal
                          gpsValue={position}
                          mooringId={mooring?.mooringNumber}
                          mooringData={mooring}
                          selectedMooring={mooring}
                        />
                      </Popup>
                    </Marker>
                  )
                })}
            </MapContainer>
          ) : null}
        </div>

        <div style={boxStyle}>
          <div className="flex justify-between h-8">
            <h2 className="text-sm">Status</h2>
          </div>
          <hr style={{ border: '1px solid #3F3F3F' }} />
          {checked ? (
            <div style={containerStyle}>
              <div>
                <div>
                  <span style={dotStyle('#d82bbd')}></span> North
                </div>
                <div>
                  <span style={dotStyle('#0ba7f1')}></span> East
                </div>
              </div>

              <div>
                <div>
                  <span style={dotStyle('#fe7515')}></span> West
                </div>
              </div>
            </div>
          ) : (
            <div style={containerStyle}>
              <div>
                <div>
                  <span style={dotStyle('#ED4C3E')}></span> Need Inspection
                </div>
                <div>
                  <span style={dotStyle('#3BB15E')}></span> Gear On (in the water)
                </div>
                <div>
                  <span style={dotStyle('#FFFF00')}></span> Need Service
                </div>
              </div>
              <div>
                <div>
                  <span style={dotStyle('#8C0DD1')}></span> Gear Off (out of the water)
                </div>
                <div>
                  <span style={dotStyle('#808080')}></span> Not In Use
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

L.Marker.prototype.options.icon = DefaultIcon

export default CustomDashboardMooringMap
