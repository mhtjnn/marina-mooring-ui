import { useGetMooringByIdMutation } from '../../Services/MoorManage/MoormanageApi'
import {
  useAddWorkOrderMutation,
  useGetViewFormMutation,
  useUpdateWorkOrderMutation,
} from '../../Services/MoorServe/MoorserveApi'
import {
  IncrementProps,
  WorkOrderEditModeProps,
  WorkOrderInputChangeProps,
  WorkOrderValidationProps,
} from '../../Type/ComponentBasedType'
import { AttachFormsTypesData, VendorData } from '../CommonComponent/MetaDataComponent/MetaDataApi'
import {
  GetMooringIds,
  GetTechnicians,
  GetWorkOrderStatus,
} from '../CommonComponent/MetaDataComponent/MoorserveMetaDataApi'
import { parseTime } from './CommonMethod'

export const { getVendorValue } = VendorData()
export const { getTechniciansData } = GetTechnicians()
export const { getMooringIdsData } = GetMooringIds()
export const { getWorkOrderStatusData } = GetWorkOrderStatus()
export const [saveWorkOrder] = useAddWorkOrderMutation()
export const [updateWorkOrder] = useUpdateWorkOrderMutation()
export const [getViewForms] = useGetViewFormMutation()
export const [getMooringDetails] = useGetMooringByIdMutation()
export const { getAttachFormsTypeData } = AttachFormsTypesData()
export const workOrderValidateFields = ({
  workOrder,
  vendorId,
  setErrorMessage,
}: WorkOrderValidationProps) => {
  const errors: { [key: string]: string } = {}
  if (!workOrder.customerName) {
    errors.customerName = 'Customer Name is required'
  }
  if (!workOrder.workOrderStatus) {
    errors.workOrderStatus = 'Status is required'
  }
  if (!workOrder.vendor && workOrder?.workOrderStatus?.id === 10) {
    errors.vendor = 'Vendor is required'
  }
  if (!workOrder.inventory && vendorId) {
    errors.inventory = 'Item Name is required'
  }
  setErrorMessage(errors)
  return errors
}

export const handleIncrement = ({ time, setTime, setErrorMessage }: IncrementProps) => {
  let { minutes, seconds } = time
  if (seconds < 59) {
    seconds += 1
  } else {
    minutes += 1
    seconds = 0
  }
  setTime({ minutes, seconds })
  setErrorMessage((prevError: any) => ({ ...prevError, time: '' }))
}
export const handleDecrement = ({ time, setTime, setErrorMessage }: IncrementProps) => {
  let { minutes, seconds } = time
  if (seconds > 0) {
    seconds -= 1
  } else if (minutes > 0) {
    minutes -= 1
    seconds = 59
  }
  setTime({ minutes, seconds })
  setErrorMessage((prevError: any) => ({ ...prevError, time: '' }))
}
export const WorkOderHandleInputChange = ({
  field,
  value,
  workOrder,
  setWorkOrder,
  editMode,
  setEditMode,
  lastChangedField,
  setLastChangedField,
  errorMessage,
  setErrorMessage,
}: WorkOrderInputChangeProps) => {
  const costRegex = /^\d*\.?\d*$/
  if (field === 'cost') {
    if (value !== '' && !costRegex.test(value)) return
  }
  if (field === 'quantity' && value !== '' && !/^\d*\.?\d*$/.test(value)) return
  let updatedWorkOrder = { ...workOrder, [field]: value }
  if (editMode) {
    if (field === 'mooringId') {
      updatedWorkOrder = {
        ...updatedWorkOrder,
        mooringId: value,
        customerName: lastChangedField === 'customerName' ? updatedWorkOrder.customerName : '',
        boatyards: lastChangedField === 'boatyards' ? updatedWorkOrder.boatyards : '',
      }
    } else if (field === 'customerName') {
      updatedWorkOrder = {
        ...updatedWorkOrder,
        customerName: value,
        mooringId: lastChangedField === 'mooringId' ? updatedWorkOrder.mooringId : '',
        boatyards: lastChangedField === 'boatyards' ? updatedWorkOrder.boatyards : '',
      }
    } else if (field === 'boatyards') {
      updatedWorkOrder = {
        ...updatedWorkOrder,
        boatyards: value,
        customerName: lastChangedField === 'customerName' ? updatedWorkOrder.customerName : '',
        mooringId: lastChangedField === 'mooringId' ? updatedWorkOrder.mooringId : '',
      }
    }
    setLastChangedField(field)
    setEditMode(false)
  }
  setWorkOrder(updatedWorkOrder)
  if (errorMessage[field]) {
    setErrorMessage({
      ...errorMessage,
      [field]: '',
    })
  }
}
export const handleEditMode = ({
  setWorkOrder,
  workOrderData,
  setVendorId,
  setTime,
}: WorkOrderEditModeProps) => {
  setWorkOrder((prevState: any) => ({
    ...prevState,
    mooringId: workOrderData?.mooringResponseDto?.mooringNumber,
    customerName:
      workOrderData?.customerResponseDto?.firstName +
      ' ' +
      workOrderData?.customerResponseDto?.lastName,
    boatyards: workOrderData?.boatyardResponseDto?.boatyardName,
    assignedTo:
      workOrderData?.technicianUserResponseDto?.firstName +
      ' ' +
      workOrderData?.technicianUserResponseDto?.lastName,
    dueDate: workOrderData?.dueDate,
    scheduleDate: workOrderData?.scheduledDate,
    workOrderStatus: workOrderData?.workOrderStatusDto?.status,
    value: workOrderData?.problem,
    cost: workOrderData?.cost,
    attachForm:
      workOrderData?.formResponseDtoList && workOrderData?.formResponseDtoList?.[0]?.formName,
    vendor:
      workOrderData?.workOrderStatusDto?.id === 10 &&
      workOrderData?.inventoryResponseDtoList &&
      workOrderData?.inventoryResponseDtoList?.[0]?.vendorResponseDto?.vendorName,
    inventory:
      workOrderData?.workOrderStatusDto?.id === 10 &&
      workOrderData?.inventoryResponseDtoList &&
      workOrderData?.inventoryResponseDtoList?.[0]?.itemName,
    quantity:
      workOrderData?.workOrderStatusDto?.id === 10 &&
      workOrderData?.inventoryResponseDtoList &&
      workOrderData?.inventoryResponseDtoList?.[0]?.quantity,
  }))
  setVendorId(
    workOrderData?.workOrderStatusDto?.id === 10 &&
      workOrderData?.inventoryResponseDtoList &&
      workOrderData?.inventoryResponseDtoList?.[0]?.vendorResponseDto?.id,
  )
  const parsedTime = parseTime(workOrderData?.time)
  setTime(parsedTime)
}
