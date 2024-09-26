import L, { IconOptions } from 'leaflet'

const defaultIconOptions: IconOptions = {
  iconUrl: '/assets/images/marker-icon.png',
  iconSize: [40, 50],
}

export const DefaultIcon = L.icon(defaultIconOptions)

const mooringIconOptions: IconOptions = {
  iconUrl: '/assets/images/east.png',
  iconSize: [90, 100],
}

export const MooringIcon = L.icon(mooringIconOptions)

const gearOnIconOptions: IconOptions = {
  iconUrl: '/assets/images/GearOn.png',
  iconSize: [40, 50],
}

export const GearOnIcon = L.icon(gearOnIconOptions)

const gearOffIconOptions: IconOptions = {
  iconUrl: '/assets/images/GearOff.png',
  iconSize: [40, 50],
}

export const GearOffIcon = L.icon(gearOffIconOptions)

const needServiceIconOptions: IconOptions = {
  iconUrl: '/assets/images/NeedService.png',
  iconSize: [120, 150],
}

export const NeedServiceIcon = L.icon(needServiceIconOptions)

const notInUseIconOptions: IconOptions = {
  iconUrl: '/assets/images/NotInUse.png',
  iconSize: [60, 80],
}

export const NotInUseIcon = L.icon(notInUseIconOptions)

const needInspectionIconOptions: IconOptions = {
  iconUrl: '/assets/images/NeedInspection.png',
  iconSize: [40, 50],
}

export const NeedInspectionIcon = L.icon(needInspectionIconOptions)

const northIconOptions: IconOptions = {
  iconUrl: '/assets/images/north.png',
  iconSize: [90, 100],
}

export const NorthIcon = L.icon(northIconOptions)

const eastIconOptions: IconOptions = {
  iconUrl: '/assets/images/east.png',
  iconSize: [90, 100],
}

export const EastIcon = L.icon(eastIconOptions)

const westIconOptions: IconOptions = {
  iconUrl: '/assets/images/west.png',
  iconSize: [90, 100],
}

export const WestIcon = L.icon(westIconOptions)
