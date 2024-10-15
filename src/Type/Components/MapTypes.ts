import { LatLngExpression } from 'leaflet'

type MarkerPosition = [number, number]

export interface MarkerData {
  position: MarkerPosition
  popupContent: string
}

export interface CustomSelectPositionMapProps {
  onPositionChange:any
  center: LatLngExpression | undefined
  zoomLevel: number
  defaultIcon?: boolean
  mooringStatus?: any
}

export interface DisplayPositionProps {
  map: any
  onPositionChange: (lat: number, lng: number) => void
}

export interface DisplayMapProps {
  center: LatLngExpression
  zoomLevel?: number
}

export interface CustomDisplayPositionMapProps {
  style?: React.CSSProperties
  position: LatLngExpression | any | []
  markerPostion?: LatLngExpression
  zoomLevel?: number
  popUpMessage?: string
}

export interface LatLngExpressionValue {
  lat: number
  lng: number
}

export interface Mooring {
  position: any[]
  status: string
}

export interface CustomMooringPositionMapProps extends CustomDisplayPositionMapProps {
  iconsByStatus?: { [key: string]: L.Icon }
  moorings?: any
  mooringData?: any
  dashboard?: boolean
  customerPage?: boolean
  setRightContainer: React.Dispatch<React.SetStateAction<boolean>>
  setLeftContainer: React.Dispatch<React.SetStateAction<boolean>>
  rightContanerWidth?: any
  leftContanerWidth?: any
}

export type PositionType = LatLngExpression

export interface TimeLineProps {
  gpsValue: any
  mooringId: any
  viewEditClick?: any
  mooringData?: any
  boatId?: any
  boatName?: any
  mooringPage?: boolean
  showMapModal?: boolean
  selectedMooring?: any
  setShowMapModal?: React.Dispatch<React.SetStateAction<boolean>>
}

export interface CustomServiceAreaMoorinMapProps extends CustomDisplayPositionMapProps {
  iconsByStatus?: { [key: string]: L.Icon }
  moorings?: any
  mooringData?: any
  leftContanerWidth?: any
}
