import { Country, MetaData, MetaDataCustomer, Role, State } from './CommonType'

export interface UserLoginPayload {
  name: string
  email: string
  phoneNumber: string
  password: string
  userID: string
  customerOwnerId: string
  roleResponseDto: Role
  stateResponseDto: State
  countryResponseDto: Country
}
export interface UserResponse {
  id: number
  name: string
  email: string
  phoneNumber: string
  customerOwnerId: string
  roleResponseDto: Role
  stateResponseDto: State
  countryResponseDto: Country
  street: string
  apt: string
  zipCode: string
  companyName: string
}

export interface GetUserResponse {
  message: string
  status: number
  errorList: [string]
  time: string
  content: UserResponse
  currentSize: number
  totalSize: number
}

export interface DeleteUserResponse {
  message: string
  status: number
  errorList: []
  time: number
  content: number
}

export interface AddUserPayload {
  name: string
  email: string
  phoneNumber: string
  password: string
  userID: string
  role: string
  state: string
  country: string
  street: string
  apt: string
  zipCode: string
  confirmPassword: string
}
export interface SaveUserResponse {
  message: string
  status: number
  errorList: [string]
  time: string
  content: {}
}
export interface LoginPayload {
  username: string
  password: string
}

export interface SignUpPayload {
  firstname: string
  lastname: string
  phoneNumber: string
  email: string
  password: string
}

export interface ResetPasswordPayload {
  newPassword: string
  confirmPassword: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface UserData {
  id: string
  firstname: string
  lastname: string
  email: string
  password: string
  creationDate: string
  lastModifiedDate: string
  phoneNumber: string
  role: RoleData
}

export interface RoleData {
  id: number
  creationDate?: string
  lastModifiedDate?: string
  name: string
  description?: string
}

export interface LoginResponse {
  status: number
  message: string
  user: UserData
  token: string
  refreshToken: string
  role: RoleData
}

export type SignUpResponse = {
  data: {
    status: number
    message: string
    data: UserData
  }
}

export interface ResetPasswordResponse {
  status: number
  message: string
  errorList: string[]
  time: string
  content: Record<string, any>
}

export interface ForgotPasswordResponse {
  status: number
  message: string
  data: any
}

export interface AuthenticationData {
  token: string
  data: UserData
}

export interface ErrorResponse {
  status: number
  message: string
  error: any
  data: {
    content: string
    message: string
    status: number
    error: any
  }
}

export type ErrorResponseForgotPassword = {
  data: {
    response: string
  }
}

export interface validateEmailResponse {
  response: string
  status: number
  success: boolean
}

export interface ImageDtoList {
  id: number
  imageData: string
  imageName: string
  note: string
}

export interface QuickbookCustomerResponseDto {
  id: number
  quickbookCustomerName: string
  quickbookCustomerId: string
  userId: number
}

export interface CustomerPayload {
  id: number
  creationDate: string
  createdBy: string
  lastModifiedDate: string
  lastModifiedBy: string
  firstName: string
  lastName: string
  customerName: string
  customerId: string
  phone: string
  emailAddress: string
  streetHouse: string
  aptSuite: string
  state: string
  country: string
  zipCode: string
  customerTypeDto: MetaDataResponse
  imageDtoList: ImageDtoList
  quickbookCustomerResponseDto: QuickbookCustomerResponseDto
}

export interface UpdateMooringPayload {
  id: number
  mooringId: string
  customerId: number
  harbor: string
  waterDepth: string
  gpsCoordinates: '9number                                                                                  152'
  boatyardId: number
  boatName: string
  boatSize: string
  boatTypeId: number
  boatWeight: string
  sizeOfWeightId: number
  typeOfWeightId: number
  eyeConditionId: number
  topChainConditionId: number
  bottomChainConditionId: number
  shackleSwivelConditionId: number
  pendantConditionId: number
  depthAtMeanHighWater: number
  statusId: number
}

export interface AddCustomerPayload {
  id: number
  customerName: string
  customerId: string
  phone: string
  emailAddress: string
  streetHouse: string
  aptSuite: string
  state: string
  country: string
  zipCode: string
}

export interface CustomerResponse {
  message: string
  status: number
  currentSize: number
  totalSize: number
  errorList: []
  time: string
  content: { CustomerPayload: CustomerPayload }
}

export interface CustomerImage {
  message: string
  status: number
  currentSize: number
  totalSize: number
  errorList: []
  time: string
  content: {}
}

export interface DeleteCustomerResponse {
  message: string
  status: number
  errorList: []
  time: string
}

export interface customerResponseDto {
  customerResponseDto: {
    id: number
    mooringNumber: string
    customerName: string
    customerId: string
    phone: string
    emailAddress: string
    streetHouse: string
    aptSuite: string
    state: string
    country: string
    zipCode: string
    mooringResponseDtoList: MooringResponseDtoList
    imageDtoList: ImageDtoList
  }
  boatyardNames: []
}

export interface CustomersWithMooringResponse {
  message: string
  status: number
  currentSize: number
  totalSize: number
  errorList: []
  time: number
  content: customerResponseDto
}

export interface MooringMetaDataTypes {
  id: number
  condition: string
  description: string
  weight: string
  unitType: string
  boatType: string
  type: string
}

export interface ServiceAreaList {
  address: any
  countryResponseDto: any
  gpsCoordinates: string
  id: number
  mooringInventoried: any
  notes: string
  serviceAreaName: string
  serviceAreaTypeDto: any
  stateResponseDto: any
  userId: any
  zipCode: any
}
export interface MooringPayload {
  id: number
  mooringNumber: string
  mooringId: string
  customerName: string
  firstName: string
  lastName: string
  harborOrArea: string
  waterDepth: string
  gpsCoordinates: string
  boatyardName: string
  boatName: string
  boatSize: string
  boatId: any
  boatType: MooringMetaDataTypes
  boatWeight: string
  eyeCondition: MooringMetaDataTypes
  bottomChainCondition: MooringMetaDataTypes
  topChainCondition: MooringMetaDataTypes
  shackleSwivelCondition: MooringMetaDataTypes
  pendantCondition: string
  sizeOfWeight: string
  typeOfWeight: MooringMetaDataTypes
  depthAtMeanHighWater: number
  statusId: number
  mooringStatus: MooringStatus
  mooringDueServiceStatusDto: MooringStatus
  customerResponseDto: customerResponseDto
  imageDtoList: ImageDtoList
  serviceAreaResponseDto: ServiceAreaList
}

export type MooringRowData = {
  id: number
  mooringNumber: string
  customerId: number
  customerResponseDto?: { id: number }
  harborOrArea: string
  gpsCoordinates: string
  boatyardId?: { id: number }
  boatName: string
  boatSize: string
  boatTypeId?: { id: number }
  boatWeight: string
  installBottomChainDate: string
  installTopChainDate: string
  installConditionOfEyeDate: string
  sizeOfWeight: string
  typeOfWeightId?: { id: number }
  eyeConditionId?: { id: number }
  topChainConditionId?: { id: number }
  bottomChainConditionId?: { id: number }
  shackleSwivelConditionId?: { id: number }
  pendantCondition: string
  depthAtMeanHighWater: string
  inspectionDate: string
  serviceAreaId?: { id: number }
  statusId?: number
  imageRequestDtoList?: any
}

export interface ImageData {
  id: string
  imageData: string
}
export interface MooringStatus {
  id: number
  creationDate: string
  createdBy: string
  lastModifiedDate: string
  lastModifiedBy: string
  status: string
  description: string
}

export interface MooringResponseDtoList {
  id: number
  installBottomChainDate: string
  installTopChainDate: string
  installConditionOfEyeDate: string
  inspectionDate: string
  mooringNumber: string
  mooringName: string
  customerName: string
  harbor: string
  waterDepth: string
  gpsCoordinates: string
  boatyardName: string
  boatName: string
  boatSize: string
  boatType: MooringMetaDataTypes
  boatWeight: string
  eyeCondition: MooringMetaDataTypes
  bottomChainCondition: MooringMetaDataTypes
  topChainCondition: MooringMetaDataTypes
  shackleSwivelCondition: MooringMetaDataTypes
  pendantCondition: MooringMetaDataTypes
  sizeOfWeight: MooringMetaDataTypes
  typeOfWeight: MooringMetaDataTypes
  serviceAreaResponseDto: MooringMetaDataTypes
  depthAtMeanHighWater: number
  mainContact: string
  mooringStatus: MooringStatus
  customerId: number | string
  userId: number
  statusId: number
  imageDtoList: [ImageDtoList]
}
export interface MooringWithGpsCoordinates {
  id: number
  mooringId: string
  mooringNumber: string
  gpsCoordinates: string
  statusId: number
}
export interface MooringResponse {
  message: string
  status: number
  currentSize: number
  totalSize: number
  errorList: []
  time: string
  content: {
    mooringResponseDtoList: MooringPayload
    mooringWithGPSCoordinateResponseList: MooringWithGpsCoordinates
    MooringPayload: MooringPayload
    imageDtoList: ImageDtoList
  }
}

export interface MooringResp {
  id: number
  mooringNumber: string
  harborOrArea: string
  gpsCoordinates: string
  installBottomChainDate: string | null
  installTopChainDate: string | null
  installConditionOfEyeDate: string | null
  inspectionDate: string | null
  boatName: string
  boatSize: string
  boatType: {
    id: number
    creationDate: string | null
    boatType: string
  }
  boatWeight: string
  boatyardResponseDto: any | null
  bottomChainCondition: {
    id: number
    creationDate: string | null
    condition: string
  }
  customerId: number | null
  customerName: string | null
  depthAtMeanHighWater: number
  eyeCondition: {
    id: number
    creationDate: string | null
    condition: string
  }
  imageDtoList: any | null
  mooringStatus: {
    id: number
    creationDate: string | null
    status: string
  }
  pendantCondition: string
  serviceAreaResponseDto: any | null
  shackleSwivelCondition: {
    id: number
    creationDate: string | null
    condition: string
  }
  sizeOfWeight: number
  topChainCondition: {
    id: number
    creationDate: string | null
    condition: string
  }
  typeOfWeight: {
    id: number
    creationDate: string | null
    type: string
  }
  userId: number | null
}

export interface MooringAndWorkOrderResponse {
  message: string
  status: number
  currentSize: number
  totalSize: number
  errorList: []
  time: string
  content: {
    workOrderResponseDtoList: WorkOrderPayload[]
    mooringDueServiceResponseDtoList: MooringPayload[]
  }
}

export interface VendorPayload {
  id: number
  companyName: string
  vendorName: string
  companyPhoneNumber: string
  address: string
  remitAddress: string
  website: string
  state: string
  country: string
  zipCode: number
  companyEmail: string
  accountNumber: string
  firstName: string
  lastName: string
  salesRepPhoneNumber: string
  salesRepEmail: string
  salesRepNote: string
  stateResponseDto: MetaData
  countryResponseDto: MetaData
  remitStateResponseDto: MetaData
  remitCountryResponseDto: MetaData
  remitZipCode: string
  remitEmailAddress: string
  userId: number
}

export interface VendorResponse {
  message: string
  status: number
  currentSize: number
  totalSize: number
  errorList: []
  time: string
  content: {
    VendorPayload: VendorPayload
  }
}

export interface GetVendorResponse {
  message: string
  status: number
  errorList: []
  time: string
  content: VendorPayload
}

export interface GetInventoryResponse {
  message: string
  status: number
  errorList: []
  time: number
  content: [
    {
      id: number
      itemName: string
      cost: number
      salePrice: number
      taxable: boolean
      inventoryType: {
        id: number
        creationDate: number
        createdBy: string
        lastModifiedDate: number
        lastModifiedBy: string
        type: string
        description: string
      }
      vendorResponseDto: {
        id: number
        companyName: string
        companyPhoneNumber: string
        website: string
        street: string
        aptSuite: string
        stateResponseDto: string
        countryResponseDto: string
        zipCode: string
        companyEmail: string
        accountNumber: string
        remitStreet: string
        remitApt: string
        remitStateResponseDto: string
        remitCountryResponseDto: string
        remitZipCode: string
        remitEmailAddress: string
        firstName: string
        lastName: string
        salesRepPhoneNumber: string
        salesRepEmail: string
        salesRepNote: string
        userId: string
        inventoryItems: string
      }
    },
  ]
}

export type BoatYardData = {
  id: string
  moorings: string
  boatyards: number
  name: string
  phoneNumber: string
  email: string
  boatyardDetails: {
    id: number
    name: string
    address: string
    phone: string
    mooring: number
    mooringDetails: {
      id: string
      mainContact: string
      mooringNumber: string
      boatName: string
    }[]
  }[]
}

export type ServiceAreaData = {
  id: string
  moorings: string
  boatyards: number
  name: string
  phoneNumber: string
  email: string
  boatyardDetails: {
    id: number
    name: string
    address: string
    phone: string
    mooring: number
    mooringDetails: {
      id: string
      mainContact: string
      mooringNumber: string
      boatName: string
    }[]
  }[]
}
export interface ServiceAreaPayload {
  id: number
  serviceAreaName: string
  serviceAreaTypeId: number
  streetHouse: string
  zipCode: string
  aptSuite: string
  stateId: number
  countryId: number
  notes: string
  gpsCoordinates: string
}

export interface RowExpansionServiceAreaData {
  Response: [
    {
      id: number
      boatyardId: string
      serviceAreaName: string
      emailAddress: string
      phone: string
      street: string
      apt: string
      state: string
      country: string
      zipCode: string
      notes: string
      gpsCoordinates: string
      mooringInventoried: number
    },
  ]
}

export interface BoatYardPayload {
  id: number
  boatyardId: string
  boatyardName: string
  emailAddress: string
  phone: string
  street: string
  apt: string
  state: string
  country: string
  zipCode: string
  mainContact: string
  gpsCoordinates: string
  mooringInventoried: number
  mooringResponseDtoList: []
}

export interface RowExpansionBoatYardData {
  Response: [
    {
      id: number
      boatyardId: string
      boatyardName: string
      emailAddress: string
      phone: string
      street: string
      apt: string
      state: string
      country: string
      zipCode: string
      mainContact: string
      gpsCoordinates: string
      mooringInventoried: number
    },
  ]
}

export interface BoatYardResponse {
  status: number
  message: string
  currentSize: number
  totalSize: number
  errorList: []
  time: string
  content: BoatYardPayload
}

export interface ServiceAreaResponse {
  status: number
  message: string
  currentSize: number
  totalSize: number
  errorList: []
  time: string
  content: ServiceAreaPayload
}

export interface MooringWithBoatYardContent {
  id: 1
  mooringName: string
  mooringId: string
  customerName: string
  mooringNumber: number
  harbor: string
  waterDepth: string
  gpsCoordinates: string
  boatyardName: string
  boatName: string
  boatSize: string
  boatType: MooringMetaDataTypes
  boatWeight: string
  eyeCondition: MooringMetaDataTypes
  bottomChainCondition: MooringMetaDataTypes
  topChainCondition: MooringMetaDataTypes
  shackleSwivelCondition: MooringMetaDataTypes
  pendantCondition: MooringMetaDataTypes
  sizeOfWeight: MooringMetaDataTypes
  typeOfWeight: MooringMetaDataTypes
  depthAtMeanHighWater: number
  status: string
  boatyardNames: string
  customerId: string
}

export interface MooringWithBoatYardResponse {
  message: string
  status: number
  currentSize: number
  totalSize: number
  errorList: []
  time: number
  content: MooringWithBoatYardContent
}

export interface MooringWithServiceAreaResponse {
  message: string
  status: number
  currentSize: number
  totalSize: number
  errorList: []
  time: number
  content: MooringWithBoatYardContent
}

export interface TechnicianPayload {
  openWorkOrder: any
  id: number
  technicianName: string
  technicianId: string
  emailAddress: string
  phone: string
  streetHouse: string
  sectorBlock: string
  state: string
  country: string
  pincode: string
  note: string
}

export interface TechnicianResponse {
  status: number
  message: string
  currentSize: number
  totalSize: number
  errorList: []
  time: string
  content: {
    TechnicianPayload: TechnicianPayload
  }
}

export interface FormsPayload {
  id: number
  submittedBy: string
  formName: string
  submittedDate: string
  downloadUrl: string
}

export interface FormsResponse {
  message: string
  status: number
  errorList: any
  time: string
  currentSize: number
  totalSize: number
  content: {
    FormsPayload: FormsPayload
  }
}

export interface ViewFormsResponse {
  message: string
  status: number
  errorList: any
  time: string
  currentSize: number
  totalSize: number
  content: {
    id: number
    submittedDate: string
    submittedBy: string
    formName: string
    fileName: string
    formData: string
    encodedData: string
    userResponseDto: {
      id: number
      firstName: string
      lastName: string
      email: string
      phoneNumber: string
      customerOwnerId: number
      roleResponseDto: any
      stateResponseDto: any
      countryResponseDto: any
      address: string
      zipCode: string
      companyName: string
    }
  }
}

export interface UploadPayload {
  file: string
  customerName: string
  customerId: string
}

export interface PaymentPayload {
  paymentTypeId: number
  amount: number
}

export interface WorkOrderPayload {
  customerResponseDto: any
  mooringResponseDto: any
  boatyardResponseDto: any
  technicianUserResponseDto: any
  workOrderStatusDto: any
  customerId: number
  mooringId: number
  boatyardId: number
  technicianId: number
  workOrderStatusId: number
  dueDate: string
  scheduledDate: string
  time: string
  problem: string
}

export interface CustomerResponseDto {
  id: 1
  firstName: 'Kira'
  lastName: 'More'
  customerId: '1'
  phone: '9876554321'
  emailAddress: 'cust1@gmail.com'
  streetHouse: 'Test'
  aptSuite: 'Test'
  stateResponseDto: any
  countryResponseDto: any
  zipCode: '64937'
  userId: any
  mooringResponseDtoList: any
}

export interface BoatYardResponseDto {
  id: number
  boatyardId: string
  boatyardName: string
  emailAddress: string
  phone: string
  street: string
  apt: string
  stateResponseDto: State
  countryResponseDto: Country
  zipCode: string
  mainContact: string
  gpsCoordinates: string
  mooringInventoried: number
  userId: number
}
export interface ServiceAreaResponseDto {
  id: number
  serviceAreaName: string
  emailAddress: string
  phone: string
  street: string
  apt: string
  stateResponseDto: State
  countryResponseDto: Country
  zipCode: string
  notes: string
  gpsCoordinates: string
  mooringInventoried: number
  userId: number
}

export interface TechnicianUserResponseDto {
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

export interface CustomerOwnerUserResponseDto {
  id: number
  name: string
  email: string
  phoneNumber: string
  customerOwnerId: any
  roleResponseDto: Role
  stateResponseDto: State
  countryResponseDto: Country
  street: string
  apt: string
  zipCode: string
  companyName: string
}

export interface WorkOrderStatusDto {
  id: number
  creationDate: string
  createdBy: string
  lastModifiedDate: string
  lastModifiedBy: string
  status: string
  description: string
}

export interface WorkOrderResponse {
  message: string
  status: number
  currentSize: number
  totalSize: number
  errorList: []
  error: any
  time: string
  content: {
    id: number
    dueDate: number
    scheduledDate: string
    time: string
    problem: string
    customerResponseDto: CustomerResponseDto
    mooringResponseDto: MooringResponseDtoList
    boatyardResponseDto: BoatYardResponseDto
    technicianUserResponseDto: TechnicianUserResponseDto
    customerOwnerUserResponseDto: CustomerOwnerUserResponseDto
    workOrderStatusDto: WorkOrderStatusDto
  }
}

export interface WorkOrderResponseStatusDto {
  id: number
  dueDate: number
  scheduledDate: string
  time: string
  problem: string
  customerResponseDto: CustomerResponseDto
  mooringResponseDto: MooringResponseDtoList
  boatyardResponseDto: BoatYardResponseDto
  technicianUserResponseDto: TechnicianUserResponseDto
  customerOwnerUserResponseDto: CustomerOwnerUserResponseDto
  workOrderStatusDto: WorkOrderStatusDto
  imageDtoList: ImageDtoList
}
export interface WorkOrderInvoiceResponse {
  message: string
  status: number
  currentSize: number
  totalSize: number
  errorList: []
  time: string
  content: {
    id: number
    invoiceDate: string
    lastContactTime: string
    workOrderInvoiceStatusDto: {
      id: number
      creationDate: string
      createdBy: string
      lastModifiedDate: string
      lastModifiedBy: string
      status: string
      description: string
    }
    workOrderResponseStatusDto: WorkOrderResponseStatusDto
  }
}

export interface ContentData {
  name: string
  customerName: string
  id: number
  label: undefined
}

export interface Content {
  content: any
  data: ContentData
}

export interface MetaDataResponse {
  message: string
  status: number
  errorList: []
  time: number
  content: Content
  id: number
  creationDate: string
  createdBy: string
  lastModifiedDate: string
  lastModifiedBy: string
  type: string
  description: string
}

export interface MetaDataCustomerResponse {
  message: string
  status: number
  errorList: []
  time: number
  content: MetaDataCustomer
}

export interface InventoryPayload {
  id: number
  inventoryTypeId: number
  itemName: string
  cost: number
  salePrice: number
  taxable: boolean
}

export interface ImagePayload {
  imageName: string
  note: string
  imageData: string
}

export interface formUpload {
  status: number
  message: string
  currentSize: number
  totalSize: number
  errorList: []
  time: string
  content: BoatYardPayload
}

export interface UserProfile {
  message: string
  status: number
  errorList: string[]
  time: string
  currentSize: number
  totalSize: number
  content: any
}

export interface imageDataPayload {
  imageName: string
  note: string
  imageData: string
}
