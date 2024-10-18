import {
  IncrementProps,
  WorkOrderEditModeProps,
  WorkOrderInputChangeProps,
} from '../../Type/ComponentBasedType'
import { parseTime } from './CommonMethod'

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
      workOrderData?.technicianUserResponseDto &&
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
