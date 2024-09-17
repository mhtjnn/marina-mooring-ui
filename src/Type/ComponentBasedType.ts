import { Dispatch, SetStateAction } from 'react'
import { MooringPayload, VendorPayload, WorkOrderPayload, WorkOrderResponse } from './ApiTypes'
import { ButtonProps } from 'primereact/button'
import { IconType } from 'primereact/utils'

export interface CustomerDataProps {
  customer: any
  mooringRowData?: any
  editMode: boolean
  editCustomerMode?: boolean
  editMooringMode?: boolean
  closeModal: () => void
  getCustomer: () => void
  getCustomerRecord?: () => void
  toastRef?: any
  setCustomerData?: any
}
export interface BoatYardProps {
  customerData: any
  editMode: boolean
  toastRef?: any
  gpsCoordinates?: string
  closeModal: () => void
  boatYardData: () => void
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export interface ServiceAreaProps {
  customerData: any
  editMode: boolean
  toastRef?: any
  gpsCoordinates?: string
  closeModal: () => void
  serviceAreaData: () => void
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export interface BoatData {
  id: string
  customerName: string
  mooringId?: string
  mooringServiceDate: string
  mooringLocation: string
}

export interface BillsData {
  workOrderNo: string
  customerName: string
  assignedTo: string
  date: string
}

export interface LoginFormProps {
  admin?: boolean
}

export interface MooringDetail {
  id: string
  mainContact: string
  mooringNumber: string
  boatName: string
}

export interface RowExpansionProps {
  mooringDetails: MooringDetail[]
}

export interface AddMooringProps {
  moorings: MooringPayload
  editMode: boolean
  editCustomerMode?: boolean
  isEditMooring?: boolean
  mooringRowData: any
  toastRef?: React.RefObject<any>
  closeModal: () => void
  getCustomer: () => void
  getCustomerRecord?: () => void
}

export interface Technician_Data {
  id: string
  techniciansName: string
  openWorkOrders: string
  completedJobs: string
}

export interface AddVendorProps {
  vendors: VendorPayload
  editMode: boolean
  closeModal: () => void
  getVendor: () => void
  toastRef?: any
}

export interface AddInventoryProps {
  id: any
  closeModal: () => void
  getInventoryHandler: () => void
  toastRef?: any
  editMode: boolean
  selectedInventory: any
}

export interface MoorPayProps {
  invoice: string
  mooringId: string
  customerName: string
  technicianName: string
  services: string
  time: string
  amount: string
}

export interface EstimateProps {
  customerId: string
  customerName: string
  mooringId: string
  boatyard: string
  assigned: string
  duedate: string
}

export interface TimeCardsProps {
  id: string
  boatName: string
  name: string
  date: string
  measurement: string
  place: string
}

export interface WorkOrderProps {
  workOrderData: any
  editModeWorkOrder?: boolean
  editModeEstimate?: boolean
  estimate?: boolean
  isAccountRecievable?: boolean
  isInvoice?: boolean
  isTechnician?: boolean
  visible?: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  setWorkOrderData?: React.Dispatch<React.SetStateAction<any>>
  toastRef?: any
  closeModal: () => void
  getWorkOrderWithPendingPayApproval?: () => void
  getOutStandingInvoice?: () => void
}

export interface WorkOrderValue {
  report?: boolean
}

export interface ReasonModalProps {
  selectedRowData: any
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  closeModal: () => void
  getWorkOrderWithPendingPayApproval: () => void
  getOutStandingInvoice: () => void
}

export interface PermissionData {
  id: string
  email: string
  name: string
  phone: string
  role: string
}

export type StatCardProps = {
  items: {
    title: string
    percentage: number
    count: number
  }[]
}

export interface CustomerAdminDataProps {
  customerData?: any
  editMode: boolean
  isVisible?: boolean
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
  setIsCustomerUpdated?: React.Dispatch<React.SetStateAction<boolean>>
  customerAdminId?: string
  closeModal: () => void
  getUser: () => void
  getCustomerUser?: () => void
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
  onFocus?: (e: FocusEvent) => void
  onBlur?: (e: FocusEvent) => void
  customerUsers?: any
  permission?: boolean
  passWordDisplay?: boolean
  toastRef?: any
  editCustomerMode?: boolean
  setEditCustomer?: Dispatch<SetStateAction<any>>
  setSelectedCustomerUser: Dispatch<SetStateAction<any>>
  setSelectedCustomer: Dispatch<SetStateAction<any>>
  setSelectedCustomerUsers?: Dispatch<SetStateAction<any>>
}

export interface HeaderProps {
  header?: string
  customer?: boolean
}

export interface CustomModalProps {
  button?: boolean
  buttonText?: string
  headerText?: string | JSX.Element
  icon?: IconType<ButtonProps> | undefined
  children: React.ReactNode
  dialogProps?: {
    [key: string]: any
  }
  visible: boolean
  onClick?: () => void
  onHide: () => void
  buttonStyle?: React.CSSProperties | undefined
  dialogStyle?: React.CSSProperties
  footerContent?: React.ReactNode
}

export interface inputHeader {
  header?: string
  iconStyle?: React.CSSProperties
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  headerStyle?: React.CSSProperties
  inputTextStyle?: React.CSSProperties
  value?: string | undefined
  borderBottom?: React.CSSProperties
}

export interface PaymentModalProps {
  visible?: boolean
  onHide?: any
  workOrderInvoiceId: number
  onSavePayment: (paymentDetails: { amount: string; type: string }) => void
}
export interface ContactModalProps {
  visible?: boolean
  onHide?: any
  onSendEmail: (emailDetails: { recipient: string; subject: string; message: string }) => void
}

export interface ApproveModalProps {
  id: number
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  closeModal: () => void
  getWorkOrderWithPendingPayApproval: () => void
  getOutStandingInvoice: () => void
}

export interface ViewImageProps {
  imageVisible: boolean
  setImageVisible: React.Dispatch<React.SetStateAction<boolean>>
  showImage: any
}

export interface EditImageProps {
  imageEditVisible: any
  setImageEditVisible: React.Dispatch<React.SetStateAction<boolean>>
  imageData: any
  customerId: number
  entity: string
  handleModalClose: () => void
  getCustomersWithMooring: () => void
}

export interface FormDataProps {
  closeModal: () => void
  getFormsData: () => void
  toastRef?: any
}
export interface FormFillProps {
  formOpen: () => void
}
export interface ShowImagesProps {
  handleNoteChange: (index: number, value: string) => void
  hoveredIndex: number | null
  handleRemoveImage: (index: number) => void
  setHoveredIndex: (index: number | null) => void
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  setImageVisible: (visible: boolean) => void
  imageRequestDtoList: { note: string }[]
  isLoading: boolean
  images: string[]
}

export interface ResetModalProps {
  isResetModalOpen: () => void
  customerId: any
  isLoggedInUser?: boolean
}

export interface PreviewProps {
  fileData: string
  fileName?: any
  onClose: () => void
}
