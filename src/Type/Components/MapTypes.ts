type MarkerPosition = [number, number]

export interface MarkerData {
    position: MarkerPosition
    popupContent: string
}

export interface CustomSelectPositionMapProps {
    onPositionChange: (lat: number, lng: number) => void
    center?: MarkerPosition
    zoomLevel?: number
}

export interface DisplayPositionProps {
    map: any
    onPositionChange: (lat: number, lng: number) => void
}

export interface DisplayMapProps {
    center: MarkerPosition
    zoomLevel?: number
}

export interface CustomDisplayPositionMapProps {
    position: MarkerPosition
    zoomLevel?: number
    popUpMessage?: string
}
