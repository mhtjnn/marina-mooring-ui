export interface UserLoginPayload {
  name: string
  email: string
  phoneNumber: string
  password: string
  userID: string
  customerAdminId: string
  role: string
  state: string
  country: string
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
}

export interface RoleData {
  id: string
  creationDate: string
  lastModifiedDate: string
  name: string
  description: string
}

export interface LoginResponse {
  status: number
  message: string
  user: UserData
  token: string
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
  data: string
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

export interface CustomerPayload {
  id: number
  creationDate: string
  createdBy: string
  lastModifiedDate: string
  lastModifiedBy: string
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
  errorList: []
  time: string
  content: {
    CustomerPayload: CustomerPayload
  }
}

export interface MooringPayload {
  id: number
  mooringNumber: string
  customerName: string
  harbor: string
  waterDepth: string
  gpsCoordinates: string
  boatName: string
  boatSize: string
  boatType: string
  boatWeight: string
  conditionOfEye: string
  bottomChainCondition: string
  topChainCondition: string
  shackleSwivelCondition: string
  pennantCondition: string
  sizeOfWeight: string
  typeOfWeight: string
  deptAtMeanHighWater: string
}

export interface MooringResponse {
  message: string
  status: number
  errorList: []
  time: string
  content: {
    MooringPayload: MooringPayload
  }
}

export interface VendorPayload {
  id: number
  companyName: string
  companyPhoneNumber: string
  website: string
  street: string
  aptSuite: string
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
  primarySalesRep: boolean
}

export interface VendorResponse {
  message: string
  status: number
  errorList: []
  time: string
  content: {
    VendorPayload: VendorPayload
  }
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

export interface BoatYardPayload {
  id: number
  boatyardId: string
  mooringName: string
  ownerName: string
  emailAddress: string
  phone: string
}

export interface BoatYardResponse {
  status: number
  message: string
  errorList: []
  time: string
  content: {
    BoatYardPayload: BoatYardPayload
  }
}

export interface TechnicianPayload {
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
  errorList: null
  time: string
  content: {
    FormsPayload: FormsPayload
  }
}

export interface UploadPayload {
  file: string
  customerName: string
  customerId: string
}

export interface WorkOrderPayload {
  id: number
  creationDate: string
  createdBy: string
  lastModifiedDate: string
  lastModifiedBy: string
  customerName: string
  customerId: string
  mooringNumber: string
  boatYard: string
  assignedTo: string
  dueDate: string
  scheduleDate: string
  status: string
  time: string
  reportProblem: string
}

export interface WorkOrderResponse {
  message: string
  status: number
  errorList: []
  time: string
  content: {
    WorkOrderPayload: WorkOrderPayload
  }
}

export interface ContentData {
  name: string
  id: number
  label: undefined
}

export interface Content {
  data: ContentData
}

export interface MetaDataResponse {
  message: string
  status: number
  errorList: []
  time: number
  content: Content
}
