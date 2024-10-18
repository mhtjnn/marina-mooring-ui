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
  city: string
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
export const chipValues = [
  'Mooring Number',
  'Harbor/Area',
  'GPS Coordinates',
  'Boat Name',
  'Boat Size',
  'Boat Weight',
  'Boat Type',
  'Boatyard',
  'Service Area',
  'Customer Id',
  'Customer First Name',
  'Customer Last Name',
  'Depth at Mean High Water',
  'Mooring Status',
  'Pendant Condition',
  'Size of Weight',
  'Type of Weight',
  'Top Chain Condition',
  'Install Top Chain Condition Date',
  'Bottom Chain Condition',
  'Install Bottom Chain Condition Date',
  'Condition of Eye',
  'Install Condition of Eye Date',
  'Shackle Swivel Condition',
  'Inspection Date',
  'Main Contact',
]
export const headerToPropertyMap: any = {
  'Mooring Number': 'mooringNumber',
  'Harbor/Area': 'harborOrArea',
  'GPS Coordinates': 'gpsCoordinates',
  'Boat Name': 'boatName',
  'Boat Size': 'boatSize',
  'Boat Weight': 'boatWeight',
  'Boat Type': 'boatType.boatType',
  Boatyard: 'boatyardResponseDto.boatyardName',
  'Service Area': 'serviceAreaResponseDto.serviceAreaName',
  'Customer First Name': 'customerResponseDto.firstName',
  'Customer Last Name': 'customerResponseDto.lastName',
  'Customer Id': 'customerResponseDto.customerId',
  'Depth at Mean High Water': 'depthAtMeanHighWater',
  'Bottom Chain Condition': 'bottomChainCondition.condition',
  'Condition of Eye': 'eyeCondition.condition',
  'Mooring Status': 'mooringStatus.status',
  'Pendant Condition': 'pendantCondition',
  'Size of Weight': 'sizeOfWeight',
  'Type of Weight': 'typeOfWeight.type',
  'Top Chain Condition': 'topChainCondition.condition',
  'Install Bottom Chain Condition Date': 'installBottomChainDate',
  'Install Top Chain Condition Date': 'installTopChainDate',
  'Install Condition of Eye Date': 'installConditionOfEyeDate',
  'Inspection Date': 'inspectionDate',
  'Shackle Swivel Condition': 'shackleSwivelCondition.condition',
  'Main Contact': 'mainContact',
}
export interface ValidationProps {
  firstName: string
  lastName: string
  checkedMooring: boolean
  mooringNumber?: string
  mooringStatus?: string
  validationRules: {
    NAME_REGEX: RegExp
  }
  setFieldErrors: (errors: { [key: string]: string }) => void
  setFirstErrorField: (field: string) => void
}
export interface ImageChangeProps {
  event: React.ChangeEvent<HTMLInputElement>
  toastRef: any
  setCustomerImages: React.Dispatch<React.SetStateAction<any>>
  setimageRequestDtoList: React.Dispatch<React.SetStateAction<any>>
}
export interface FormData {
  customerName?: string
  mooringNumber?: string
  mooringStatus?: string
}

export interface FieldErrors {
  [key: string]: string
}
