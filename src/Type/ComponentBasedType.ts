import { MooringPayload, VendorPayload, WorkOrderPayload } from './ApiTypes'

export interface CustomerDataProps {
  customer: any
  editMode: boolean
  closeModal: () => void
  getCustomer: () => void
}
export interface BoatYardProps {
  customerData: any
  editMode: boolean
  gpsCoordinates? : string
  closeModal: () => void
  boatYardData: () => void
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
  Label: string
  typeEmail: string
  typePass: string
  showSinUp: boolean
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
}

export interface MoorPayProps {
  invoice: string
  mooringid: string
  name: string
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
  workOrderData: WorkOrderPayload
  editMode: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
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
  customerData: any
  editMode: boolean
  customerAdminId? : string
  closeModal: () => void
  getCustomer: () => void
}