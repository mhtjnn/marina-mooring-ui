import {
  GearOffIcon,
  GearOnIcon,
  NeedInspectionIcon,
  NotInUseIcon,
} from '../Components/Map/DefaultIcon'
import { BoatYardData, UserData } from './ApiTypes'

export interface CityProps {
  name: string
  code: string
  // id:number
}

export interface DataProps {
  moorings: BoatYardData[]
}

export interface CustomerData {
  id: string
  name: string
  email: string
  phone: number
}

export interface CustomerProps {
  id: string
  name: string
  phone: string
  email: string
  address: string
  city:string
}

export interface BillsData {
  id: number
  technician: string
  techniciansName: string
  dueDate: string
}
export interface SidebarState {
  isOpen: boolean
}

export interface InitialState {
  token: string
  userData: UserData | null
  isOpen: boolean
  sidebar: SidebarState
  customerId: string
  customerName: string
}

export interface FormFieldsProps {
  label: string
  value?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
}

export type NullableDateArray = (Date | null)[] | null

export interface Role {
  id: number
  name: string
  description: string
}

export interface Country {
  id: number
  name: string
  label: string
}

export interface State {
  id: number
  name: string
  label: string
}

export interface ServiceAreaType {
  id: number
  name: string
  label: string
}

export interface MetaData {
  type: any
  id: number
  name: string
  label: string
  mooringId: string
  mooringNumber: string
  status: string
  description: string
  technicianName: string
  jobLocation: string
  firstName: string
  lastName: string
  boatyardName: string
  serviceAreaName: string
  customer: {
    customerTypeDto: {
      id: number
      type: string
      description: string
    }
  }
}

export interface MetaDataTechnician {
  id: number
  name: string
  email: string
  phoneNumber: string
  customerOwnerId: number
  roleResponseDto: Role
  stateResponseDto: State
  countryResponseDto: Country
  street: string
  apt: string
  zipCode: string
  companyName: string
}

export interface MetaDataCustomer {
  id: number
  firstName: string
  lastName: string
}

export interface Customer {
  id: number
  customerName: string
}

export interface Params {
  showCompletedWorkOrders?: string
  pageSizeTwo?: number
  pageNumberTwo?: number
  pageNumber?: number
  pageSize?: number
  sortBy?: string
  sortDir?: string
  searchText?: string
  customerOwnerId?: number
  invoiceAmount?: number
  reportProblem?: string
}

export interface DropdownCellProps {
  value: string
  options?: any
  onChange: (e: any) => void
  rowId?: string
}

export interface ImageDataProps {
  imageData: any
  entityId: number
  entity: string
  closeModal: () => void
  getCustomersWithMooring: () => void
}

export interface DropdownValue {
  id: number
  label: string
}
export interface viewImageProp {
  handleZoomOut: () => void
  handleZoomIn: () => void
  scale: number
  showImage: {
    imageData: string
  }
}

export const iconsByStatus = {
  GearOn: GearOnIcon,
  GearOff: GearOffIcon,
  NeedInspection: NeedInspectionIcon,
  NotInUse: NotInUseIcon,
}
