import React, { useState, useEffect, useCallback, useRef } from 'react'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { IoIosAdd } from 'react-icons/io'
import { GrFormSubtract } from 'react-icons/gr'
import { Dialog } from 'primereact/dialog'
import { ErrorResponse, WorkOrderResponse } from '../../../Type/ApiTypes'
import {
  useAddEstimateMutation,
  useUpdateEstimateMutation,
} from '../../../Services/MoorServe/MoorserveApi'
import { Button } from 'primereact/button'
import { WorkOrderProps } from '../../../Type/ComponentBasedType'
import {
  GetBoatyardBasedOnMooringId,
  GetCustomerBasedOnMooringId,
  GetMooringBasedOnCustomerIdAndBoatyardId,
  GetMooringIds,
  GetMooringsBasedOnBoatyardId,
  GetMooringsBasedOnCustomerId,
  GetTechnicians,
  GetWorkOrderStatus,
} from '../../CommonComponent/MetaDataComponent/MoorserveMetaDataApi'
import { MetaData } from '../../../Type/CommonType'
import {
  BoatyardNameData,
  CustomersData,
  InventoryDetailsData,
  VendorData,
} from '../../CommonComponent/MetaDataComponent/MetaDataApi'
import { useSelector } from 'react-redux'
import { selectCustomerId } from '../../../Store/Slice/userSlice'
import { Calendar } from 'primereact/calendar'
import { Toast } from 'primereact/toast'
import { ProgressSpinner } from 'primereact/progressspinner'
import ShowImages from '../../CommonComponent/UploadImages'
import InputComponent from '../../CommonComponent/InputComponent'
import { InputText } from 'primereact/inputtext'

const AddEstimates: React.FC<WorkOrderProps> = ({
  workOrderData,
  editModeEstimate,
  editModeWorkOrder,
  setVisible,
  closeModal,
  isAccountRecievable,
  isInvoice,
  isTechnician,
  visible,
  setWorkOrderData,
}) => {
  const selectedCustomerId = useSelector(selectCustomerId)
  const [workOrder, setWorkOrder] = useState<any>({
    customerName: '',
    mooringId: '',
    boatyards: '',
    assignedTo: '',
    dueDate: '',
    scheduleDate: '',
    workOrderStatus: '',
    value: '',
    jobType: '',
    attachForm: '',
    viewAttachedForm: '',
    cost: '',
    vendor: '',
    quantity: '',
    inventory: '',
  })

  const [time, setTime] = useState({ minutes: 0, seconds: 0 })
  const [basedOnCustomerIdAndBoatyardId, setbasedOnCustomerIdAndBoatyardId] = useState<MetaData[]>()
  const [mooringsBasedOnBoatyardIdData, setMooringsBasedOnBoatyardIdData] = useState<MetaData[]>()
  const [mooringBasedOnCustomerId, setMooringBasedOnCustomerId] = useState<MetaData[]>()
  const [boatyardBasedOnMooringId, setBoatyardBasedOnMooringId] = useState<MetaData[]>()
  const [customerBasedOnMooringId, setCustomerBasedOnMooringId] = useState<any[]>()
  const [technicians, setTechnicians] = useState<any[]>()
  const [isDirty, setIsDirty] = useState<boolean>(false)
  const [moorings, setMoorings] = useState<MetaData[]>()
  const [workOrderStatusValue, setWorkOrderStatusValue] = useState<MetaData[]>()
  const [customerNameValue, setcustomerNameValue] = useState<any[]>()
  const [boatyardsName, setBoatYardsName] = useState<MetaData[]>([])
  const [vendorsName, setVendorsName] = useState<MetaData[]>([])
  const [inventory, setInventory] = useState<MetaData[]>([])
  const [editMode, setEditMode] = useState<boolean>(
    editModeWorkOrder ? editModeWorkOrder : false || editModeEstimate ? editModeEstimate : false,
  )
  const [statusChanged, setStatusChanged] = useState(
    workOrderData?.inventoryResponseDtoList?.length > 0 &&
      workOrderData?.workOrderStatusDto?.id === 10,
  )
  const [errorMessage, setErrorMessage] = useState<{ [key: string]: string }>({})
  const [lastChangedField, setLastChangedField] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredIndex, setHoveredIndex] = useState<null | number>(null)
  const [customerImages, setCustomerImages] = useState<string[]>([])
  const [vendorId, setVendorId] = useState<any>()
  const { getMooringBasedOnCustomerIdAndBoatyardIdData } = GetMooringBasedOnCustomerIdAndBoatyardId(
    workOrder?.customerName?.id && workOrder?.customerName?.id,
    workOrder?.boatyards?.id && workOrder?.boatyards?.id,
  )
  const { getMooringsBasedOnCustomerIdData } = GetMooringsBasedOnCustomerId(
    workOrder?.customerName?.id && workOrder?.customerName?.id,
  )
  const { getMooringsBasedOnBoatyardIdData } = GetMooringsBasedOnBoatyardId(
    workOrder?.boatyards?.id && workOrder?.boatyards?.id,
  )
  const { getBoatyardBasedOnMooringIdData } = GetBoatyardBasedOnMooringId(
    workOrder?.mooringId?.id && workOrder?.mooringId?.id,
  )
  const { getCustomerBasedOnMooringIdData } = GetCustomerBasedOnMooringId(
    workOrder?.mooringId?.id && workOrder?.mooringId?.id,
  )
  const { getCustomersData } = CustomersData(selectedCustomerId)
  const { getBoatYardNameData } = BoatyardNameData(selectedCustomerId)
  const { getVendorValue } = VendorData()
  const { getInventoryDetails } = InventoryDetailsData(vendorId)
  const { getTechniciansData } = GetTechnicians()
  const { getMooringIdsData } = GetMooringIds()
  const { getWorkOrderStatusData } = GetWorkOrderStatus()
  const [saveEstimation] = useAddEstimateMutation()
  const [updateEstimate] = useUpdateEstimateMutation()
  const toastRef = useRef<Toast>(null)
  const [imageVisible, setImageVisible] = useState(false)
  const [imageRequestDtoList, setimageRequestDtoList] = useState<any>()
  const boatyardsNameOptions = workOrder?.mooringId?.id ? boatyardBasedOnMooringId : boatyardsName
  const CustomerNameOptions = workOrder?.mooringId?.id
    ? customerBasedOnMooringId
    : customerNameValue

  const MooringNameOptions = (() => {
    if (workOrder?.customerName?.id && workOrder?.boatyards?.id) {
      return basedOnCustomerIdAndBoatyardId
    } else if (workOrder?.customerName?.id) {
      return mooringBasedOnCustomerId
    } else if (workOrder?.boatyards?.id) {
      return mooringsBasedOnBoatyardIdData
    } else {
      return moorings
    }
  })()

  const validateFields = () => {
    const errors: { [key: string]: string } = {}
    if (!workOrder.customerName) {
      errors.customerName = 'Customer Name is required'
    }
    if (!workOrder.workOrderStatus) {
      errors.workOrderStatus = 'Status is required'
    }
    if (!workOrder.assignedTo) {
      errors.assignedTo = 'Assigned To is required'
    }
    if (!workOrder.dueDate) {
      errors.dueDate = 'Due Date  is required'
    }
    if (!workOrder.scheduleDate) {
      errors.scheduleDate = 'Schedule Date is required'
    }
    if (!workOrder.boatyards) {
      errors.boatyards = 'Boatyard is required'
    }
    if (!workOrder.mooringId) {
      errors.mooringId = 'Mooring Number is required'
    }
    if (!workOrder.vendor && workOrder.workOrderStatus.id === 10) {
      errors.vendor = 'Vendor is required'
    }
    if (!workOrder.inventory && vendorId) {
      errors.inventory = 'Item Name is required'
    }
    setErrorMessage(errors)
    return errors
  }

  const handleNoteChange = (index: number, note: string) => {
    setimageRequestDtoList((prevList: any[]) =>
      prevList?.map((item, i) => (i === index ? { ...item, note } : item)),
    )
  }

  const handleInputChange = (field: string, value: any) => {
    const numberRegex = /^\d+$/

    if (field === 'cost') {
      if (value !== '' && !numberRegex.test(value)) {
        return
      }
    }
    if (field === 'quantity' && value !== '' && !/^\d*\.?\d*$/.test(value)) {
      return
    }
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

  const handleEditMode = () => {
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
    const parseTime = (timeString: any) => {
      const [hours, minutes, seconds] = timeString?.split(':')?.map(Number)
      return { minutes: hours * 60 + minutes, seconds }
    }
    const parsedTime = parseTime(workOrderData.time)
    setTime(parsedTime)
  }

  const handleIncrement = () => {
    let { minutes, seconds } = time
    if (seconds < 59) {
      seconds += 1
    } else {
      minutes += 1
      seconds = 0
    }
    setTime({ minutes, seconds })
    setErrorMessage((prevError) => ({ ...prevError, time: '' }))
  }

  const handleDecrement = () => {
    let { minutes, seconds } = time
    if (seconds > 0) {
      seconds -= 1
    } else if (minutes > 0) {
      minutes -= 1
      seconds = 59
    }
    setTime({ minutes, seconds })
    setErrorMessage((prevError) => ({ ...prevError, time: '' }))
  }

  const handleTimeChange = (event: { target: { value: any } }) => {
    const [min, sec] = event.target.value?.split(':').map(Number)
    if (!isNaN(min) && !isNaN(sec) && min >= 0 && sec >= 0 && sec < 60) {
      setTime({ minutes: min, seconds: sec })
      setErrorMessage((prevError) => ({ ...prevError, time: '' }))
    }
  }

  const formatTime = (minutes: number, seconds: number) => {
    const formattedMinutes = minutes.toString().padStart(2, '0')
    const formattedSeconds = seconds.toString().padStart(2, '0')
    return `${formattedMinutes}:${formattedSeconds}`
  }

  const formatDate = (date: any) => {
    if (!date) return null
    const d = new Date(date)
    const month = ('0' + (d.getMonth() + 1)).slice(-2)
    const day = ('0' + d.getDate()).slice(-2)
    const year = d.getFullYear()
    return `${month}/${day}/${year}`
  }

  const parseDate = (dateString: any) => {
    if (!dateString) return null
    const [month, day, year] = dateString?.split('/')
    return new Date(year, month - 1, day)
  }

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target
    const files = Array.from(fileInput.files || [])
    if (files.length === 0) return
    const validImageFiles = files.filter(
      (file) => file.type.startsWith('image/') && file.size >= 5120 && file.size <= 1048576,
    )
    const invalidTypeFiles = files.filter((file) => !file.type.startsWith('image/'))
    const invalidSizeFiles = files.filter((file) => file.size < 5120 || file.size > 1048576)
    if (invalidTypeFiles.length > 0 || invalidSizeFiles.length > 0) {
      let detailMessage = 'Only image files are allowed'
      if (invalidSizeFiles.length > 0) detailMessage = 'Images must be between 5 KB and 1 MB.'
      toastRef?.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: detailMessage,
        life: 3000,
      })
      return
    }
    const newBase64Strings: string[] = []
    const newImageUrls: string[] = []
    const imageRequestDtoList: { imageName: string; imageData: string }[] = []
    for (const file of validImageFiles) {
      try {
        const base64String = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result?.split(',')[1])
            } else {
              reject(new Error('FileReader result is not a string.'))
            }
          }
          reader.onerror = () => {
            reject(new Error('Error reading file.'))
          }
          reader.readAsDataURL(file)
        })
        newBase64Strings.push(base64String)
        newImageUrls.push(`data:image/png;base64,${base64String}`)
        imageRequestDtoList?.push({
          imageName: file.name,
          imageData: base64String,
        })
      } catch (error) {
        console.error('Error reading file:', error)
      }
    }
    setCustomerImages((prevImages) => [...prevImages, ...newImageUrls])
    setimageRequestDtoList(imageRequestDtoList)
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...customerImages]
    newImages.splice(index, 1)
    setCustomerImages(newImages)
  }

  const SaveEstimate = async () => {
    const errors = validateFields()
    if (Object.keys(errors).length > 0) {
      setErrorMessage(errors)
      return
    }
    const payload: any = {
      mooringId: workOrder?.mooringId?.id,
      customerId: workOrder?.customerName?.id,
      boatyardId: workOrder?.boatyards?.id,
      technicianId: workOrder?.assignedTo?.id,
      dueDate: formatDate(workOrder?.dueDate),
      scheduledDate: formatDate(workOrder?.scheduleDate),
      workOrderStatusId: workOrder?.workOrderStatus?.id,
      time: '00:' + formatTime(time.minutes, time.seconds),
      problem: workOrder?.value,
      cost: workOrder?.cost,
    }
    if (workOrder?.inventory) {
      payload.inventoryRequestDtoList = [
        {
          id: workOrder?.inventory?.id,
          quantity: workOrder?.quantity,
        },
      ]
    }
    try {
      const response = await saveEstimation(payload).unwrap()
      const { status, message } = response as WorkOrderResponse
      if (status === 200 || status === 201) {
        closeModal()
        toastRef?.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: message,
          life: 3000,
        })
        setIsLoading(false)
      } else {
        setIsLoading(false)
        toastRef?.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        })
      }
    } catch (error) {
      const { message } = error as ErrorResponse
      setIsLoading(false)
      toastRef?.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 3000,
      })
    }
  }

  const UpdateEstimate = async () => {
    const errors = validateFields()
    if (Object.keys(errors).length > 0) {
      return
    }

    try {
      setIsLoading(true)
      const editPayload: any = {}
      if (workOrder?.mooringId?.id !== workOrderData?.mooringResponseDto?.id) {
        editPayload.mooringId = workOrder?.mooringId?.id
      }
      if (workOrder?.customerName?.id !== workOrderData?.customerResponseDto?.id) {
        editPayload.customerId = workOrder?.customerName?.id
      }
      if (workOrder?.boatyards?.id !== workOrderData?.boatyardResponseDto?.id) {
        editPayload.boatyardId = workOrder?.boatyards?.id
      }
      if (workOrder?.assignedTo?.id !== workOrderData?.technicianUserResponseDto?.id) {
        editPayload.technicianId = workOrder?.assignedTo?.id
      }
      if (workOrder?.dueDate !== workOrderData?.dueDate) {
        editPayload.dueDate = workOrder?.dueDate
      }
      if (workOrder?.scheduleDate !== workOrderData?.scheduledDate) {
        editPayload.scheduledDate = workOrder?.scheduleDate
      }
      if (workOrder?.workOrderStatus?.id !== workOrderData?.workOrderStatusDto?.id) {
        editPayload.workOrderStatusId = workOrder?.workOrderStatus?.id
      }
      if (workOrder?.value !== workOrderData?.problem) {
        editPayload.problem = workOrder?.value
      }
      if (workOrder?.cost !== workOrderData?.cost) {
        editPayload.cost = workOrder?.cost
      }
      const formattedTime = '00:' + formatTime(time.minutes, time.seconds)
      if (formattedTime !== workOrderData?.time) {
        editPayload.time = formattedTime
      }
      if (workOrder?.inventory) {
        const inventoryId =
          workOrder?.inventory?.id || workOrderData?.inventoryResponseDtoList?.[0]?.id
        const quantity =
          workOrder?.quantity || workOrderData?.inventoryResponseDtoList?.[0]?.quantity

        const inventoryUpdated =
          inventoryId !== workOrderData?.inventoryResponseDtoList?.[0]?.id ||
          quantity !== workOrderData?.inventoryResponseDtoList?.[0]?.quantity

        if (inventoryUpdated) {
          editPayload.inventoryRequestDtoList = [
            {
              id: inventoryId,
              quantity: quantity,
            },
          ]
        }
      }
      if (Object.keys(editPayload).length > 0) {
        const response = await updateEstimate({
          payload: editPayload,
          id: workOrderData?.id,
        }).unwrap()
        const { status, message } = response as WorkOrderResponse
        setIsLoading(false)
        if (status === 200 || status === 201) {
          closeModal()
          toastRef?.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: message,
            life: 3000,
          })
        } else {
          toastRef?.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 3000,
          })
        }
      }
    } catch (error) {
      setIsLoading(false)
      const { message } = error as ErrorResponse
      toastRef?.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 3000,
      })
    }
  }

  const handleSave = () => {
    if (editModeEstimate) {
      UpdateEstimate()
    } else {
      SaveEstimate()
    }
  }

  const fetchDataAndUpdate = useCallback(async () => {
    const { getTechnicians } = await getTechniciansData()
    const { mooringIds } = await getMooringIdsData()
    const { WorkOrderStatus } = await getWorkOrderStatusData()
    const { customersData } = await getCustomersData()
    const { boatYardName } = await getBoatYardNameData()
    if (getTechnicians !== null) {
      const firstLastName = getTechnicians.map((item) => ({
        firstName: item.firstName + ' ' + item.lastName,
        id: item.id,
      }))
      setIsLoading(false)
      setTechnicians(firstLastName)
    }
    if (mooringIds !== null) {
      setIsLoading(false)
      setMoorings(mooringIds)
    }
    if (WorkOrderStatus !== null) {
      setIsLoading(false)
      setWorkOrderStatusValue(WorkOrderStatus)
    }
    if (customersData !== null) {
      const firstLastName = customersData.map((item) => ({
        firstName: item.firstName + ' ' + item.lastName,
        id: item.id,
      }))
      setIsLoading(false)
      setcustomerNameValue(firstLastName)
    }
    if (boatYardName !== null) {
      setIsLoading(false)
      setBoatYardsName(boatYardName)
    }
  }, [])

  const fetchVendorDataAndUpdate = async () => {
    const { vendorValue } = await getVendorValue()
    if (vendorValue !== null) {
      setIsLoading(false)
      setVendorsName(vendorValue)
      if (workOrderData?.inventoryResponseDtoList) {
        const vendorList = workOrderData?.inventoryResponseDtoList
          .map((item: any) => item.vendorResponseDto)
          .filter((vendor: any) => vendor !== null)
        setVendorsName((prevState) => [...prevState, ...vendorList])
      }
    }
  }

  const fetchInventoryDetails = async () => {
    const { inventoryDetails } = await getInventoryDetails()
    if (inventoryDetails !== null) {
      setIsLoading(false)
      setInventory(inventoryDetails)
      if (workOrderData?.inventoryResponseDtoList) {
        setInventory((prevState) => [...prevState, ...workOrderData?.inventoryResponseDtoList])
      }
    }
  }

  const fetchDataAndUpdateBasedOnCustomerId = useCallback(async () => {
    const { mooringsBasedOnCustomerId } = await getMooringsBasedOnCustomerIdData()
    if (mooringsBasedOnCustomerId !== null) {
      setIsLoading(false)
      setMooringBasedOnCustomerId(mooringsBasedOnCustomerId)
      if (mooringsBasedOnCustomerId?.length === 0) {
        toastRef.current?.show({
          severity: 'info',
          summary: 'Info',
          detail: 'No Mooring Associated with Selected Customer',
          life: 3000,
        })
      }
    }
  }, [workOrder?.customerName?.id])

  const fetchDataAndUpdateBasedOnMooringId = useCallback(async () => {
    const { boatyardBasedOnMooringId } = await getBoatyardBasedOnMooringIdData()
    const { customerBasedOnMooringId } = await getCustomerBasedOnMooringIdData()
    if (boatyardBasedOnMooringId !== null) {
      setIsLoading(false)
      setBoatyardBasedOnMooringId(boatyardBasedOnMooringId)
      if (boatyardBasedOnMooringId?.length === 0) {
        toastRef.current?.show({
          severity: 'info',
          summary: 'Info',
          detail: 'No Boatyard Associated with Selected Mooring',
          life: 3000,
        })
      }
    }

    if (customerBasedOnMooringId !== null) {
      if (customerBasedOnMooringId?.length === 0) {
        toastRef.current?.show({
          severity: 'info',
          summary: 'Info',
          detail: 'No Customer Associated with Selected Mooring',
          life: 3000,
        })
      } else {
        const firstLastName = customerBasedOnMooringId.map((item: any) => ({
          firstName: item.firstName + ' ' + item.lastName,
          id: item.id,
        }))
        setIsLoading(false)
        setCustomerBasedOnMooringId(firstLastName)
      }
    } else {
      toastRef.current?.show({
        severity: 'info',
        summary: 'Info',
        detail: 'No Customer Associated with Selected Mooring',
        life: 3000,
      })
    }
  }, [workOrder?.mooringId?.id])

  const fetchDataAndUpdateBasedOnBoatyardId = useCallback(async () => {
    const { mooringBasedOnBoatyardId } = await getMooringsBasedOnBoatyardIdData()
    if (mooringBasedOnBoatyardId !== null) {
      setMooringsBasedOnBoatyardIdData(mooringBasedOnBoatyardId)
      if (mooringBasedOnBoatyardId?.length === 0) {
        toastRef.current?.show({
          severity: 'info',
          summary: 'Info',
          detail: 'No Mooring Associated with Selected Boatyard',
          life: 3000,
        })
      }
    }
  }, [workOrder?.boatyards?.id])

  const fetchDataAndUpdateBasedOnCuatomerIdAndBoatyardId = useCallback(async () => {
    const { mooringbasedOnCustomerIdAndBoatyardId } =
      await getMooringBasedOnCustomerIdAndBoatyardIdData()
    if (mooringbasedOnCustomerIdAndBoatyardId !== null) {
      setbasedOnCustomerIdAndBoatyardId(mooringbasedOnCustomerIdAndBoatyardId)
      if (mooringbasedOnCustomerIdAndBoatyardId?.length === 0) {
        toastRef.current?.show({
          severity: 'info',
          summary: 'Info',
          detail: 'No Mooring Associated with Selected Customer and Boatyard',
          life: 3000,
        })
      }
    }
  }, [workOrder?.boatyards?.id, workOrder?.customerName?.id])

  useEffect(() => {
    if (workOrder?.workOrderStatus?.id === 10 || workOrderData?.inventoryResponseDtoList)
      fetchVendorDataAndUpdate()
  }, [workOrder?.workOrderStatus?.id === 10, workOrderData?.inventoryResponseDtoList])

  useEffect(() => {
    fetchDataAndUpdate()
  }, [])

  useEffect(() => {
    if (vendorId) {
      fetchInventoryDetails()
      if (
        (workOrderData?.inventoryResponseDtoList &&
          workOrderData?.inventoryResponseDtoList.length <= 0) ||
        (workOrder.inventory && editModeEstimate && isDirty) ||
        (workOrder.inventory && !editModeEstimate)
      ) {
        setWorkOrder({
          ...workOrder,
          inventory: '',
          quantity: '',
        })
      }
    }
  }, [vendorId])

  useEffect(() => {
    if (workOrder?.boatyards?.id) {
      fetchDataAndUpdateBasedOnBoatyardId()
    }
  }, [workOrder?.boatyards?.id])

  useEffect(() => {
    if (workOrder?.mooringId?.id) {
      fetchDataAndUpdateBasedOnMooringId()
    }
  }, [workOrder?.mooringId?.id])

  useEffect(() => {
    if (workOrder?.customerName?.id) {
      fetchDataAndUpdateBasedOnCustomerId()
    }
  }, [workOrder?.customerName?.id])

  useEffect(() => {
    if (workOrder?.customerName?.id && workOrder?.boatyards?.id) {
      fetchDataAndUpdateBasedOnCuatomerIdAndBoatyardId()
    }
  }, [workOrder?.customerName?.id, workOrder?.boatyards?.id])

  useEffect(() => {
    if (editModeEstimate) {
      handleEditMode()
    }
  }, [editModeEstimate])

  useEffect(() => {
    if (workOrder?.workOrderStatus?.id !== 10 && workOrder.vendor) {
      setStatusChanged(false)
      setVendorId('')
      setWorkOrder({
        ...workOrder,
        vendor: '',
        inventory: '',
        quantity: '',
      })
    }
  }, [workOrder.workOrderStatus?.id])

  useEffect(() => {
    if (workOrder?.inventory?.id) {
      setWorkOrder({
        ...workOrder,
        quantity: workOrder.inventory?.quantity,
      })
    }
  }, [workOrder.inventory?.id])

  useEffect(() => {
    if (setWorkOrderData && !visible && !editModeEstimate) {
      setWorkOrderData('')
      setWorkOrder('')
      setStatusChanged(false)
    }
  }, [visible])

  return (
    <>
      <Toast ref={toastRef} />

      <div className={`"w-full h-full mb-16 ml-4" ${isLoading ? 'blurred' : ''}`}>
        <div className="flex gap-6">
          {/* Customer Name */}
          <div>
            <span className="font-medium text-sm text-[#000000]">
              <div className="flex gap-1">
                Customer Name
                <p className="text-red-600">*</p>
              </div>
            </span>
            <div className="mt-1">
              <Dropdown
                value={workOrder.customerName?.firstName || workOrder.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                options={CustomerNameOptions}
                optionLabel="firstName"
                editable
                disabled={isLoading || isAccountRecievable || isTechnician}
                style={{
                  width: '230px',
                  height: '32px',
                  border: errorMessage.customerName ? '1px solid red' : '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.8rem',
                  paddingLeft: '0.5rem',
                }}
              />
            </div>
            <p>
              {errorMessage.customerName && (
                <small className="p-error">{errorMessage.customerName}</small>
              )}
            </p>
          </div>
          {/* Mooring Number */}
          <div>
            <span className="font-medium text-sm text-[#000000]">
              <div className="flex gap-1">
                Mooring Number
                <p className="text-red-600">*</p>
              </div>
            </span>
            <div className="mt-1">
              <Dropdown
                value={workOrder.mooringId?.mooringNumber || workOrder.mooringId}
                onChange={(e) => handleInputChange('mooringId', e.target.value)}
                options={MooringNameOptions}
                optionLabel="mooringNumber"
                editable
                disabled={isLoading || isAccountRecievable || isTechnician}
                style={{
                  width: '230px',
                  height: '32px',
                  border: errorMessage.mooringId ? '1px solid red' : '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.8rem',
                }}
              />
            </div>
            <p>
              {errorMessage.mooringId && (
                <small className="p-error">{errorMessage.mooringId}</small>
              )}
            </p>
          </div>
          {/* Boatyards */}
          <div>
            <span className="font-medium text-sm text-[#000000]">
              <div className="flex gap-1">
                Boatyard
                <p className="text-red-600">*</p>
              </div>
            </span>
            <div className="mt-1">
              <Dropdown
                value={workOrder.boatyards?.boatyardName || workOrder.boatyards}
                onChange={(e) => handleInputChange('boatyards', e.target.value)}
                options={boatyardsNameOptions}
                optionLabel="boatyardName"
                editable
                disabled={isLoading || isAccountRecievable || isTechnician}
                style={{
                  width: '230px',
                  height: '32px',
                  border: errorMessage.boatyards ? '1px solid red' : '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.8rem',
                  paddingLeft: '0.5rem',
                }}
              />
            </div>
            <p>
              {errorMessage.boatyards && (
                <small className="p-error">{errorMessage.boatyards}</small>
              )}
            </p>
          </div>
        </div>

        <div className="flex gap-6 mt-3">
          {/* Assigned to */}
          <div>
            <span className="font-medium text-sm text-[#000000]">
              <div className="flex gap-1">
                Assigned to
                <p className="text-red-600">*</p>
              </div>
            </span>
            <div className="mt-1">
              <Dropdown
                value={workOrder.assignedTo}
                onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                options={technicians}
                optionLabel="firstName"
                editable
                disabled={isLoading || isAccountRecievable || isTechnician}
                style={{
                  width: '230px',
                  height: '32px',
                  border: errorMessage.assignedTo ? '1px solid red' : '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.8rem',
                }}
              />
            </div>
            <p>
              {errorMessage.assignedTo && (
                <small className="p-error">{errorMessage.assignedTo}</small>
              )}
            </p>
          </div>

          {isLoading && (
            <ProgressSpinner
              style={{
                position: 'absolute',
                top: '45%',
                left: '45%',
                transform: 'translate(-50%, -50%)',
                width: '50px',
                height: '50px',
              }}
              strokeWidth="4"
            />
          )}

          {/* Due Date */}
          <div className="">
            <span className="font-medium text-sm text-[#000000]">
              <div className="flex gap-1">
                Due Date
                <p className="text-red-600">*</p>
              </div>
            </span>
            <div className="mt-1">
              <Calendar
                value={parseDate(workOrder.dueDate)}
                onChange={(e) => handleInputChange('dueDate', formatDate(e.target.value))}
                dateFormat="mm/dd/yy"
                disabled={isLoading || isAccountRecievable || isTechnician}
                style={{
                  width: '230px',
                  height: '32px',
                  border: errorMessage.dueDate ? '1px solid red' : '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.8rem',
                  paddingLeft: '0.5rem',
                  paddingRight: '0.5rem',
                }}
              />
            </div>
            <p>
              {errorMessage.dueDate && <small className="p-error">{errorMessage.dueDate}</small>}
            </p>
          </div>
          {/* Schedule Date */}
          <div>
            <span className="font-medium text-sm text-[#000000]">
              <div className="flex gap-1">
                Schedule Date
                <p className="text-red-600">*</p>
              </div>
            </span>
            <div className="mt-1">
              <Calendar
                value={parseDate(workOrder.scheduleDate)}
                onChange={(e) => handleInputChange('scheduleDate', formatDate(e.target.value))}
                dateFormat="mm/dd/yy"
                disabled={isLoading || isAccountRecievable || isTechnician}
                style={{
                  width: '230px',
                  height: '32px',
                  border: errorMessage.scheduleDate ? '1px solid red' : '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.8rem',
                  paddingLeft: '0.5rem',
                  paddingRight: '0.5rem',
                }}
              />
            </div>
            <p>
              {errorMessage.scheduleDate && (
                <small className="p-error">{errorMessage.scheduleDate}</small>
              )}
            </p>
          </div>
        </div>

        <div className="flex gap-6 mt-3">
          {/* Status */}
          <div>
            <span className="font-medium text-sm text-[#000000]">
              <div className="flex gap-1">
                Status
                <p className="text-red-600">*</p>
              </div>
            </span>
            <div className="mt-1">
              <Dropdown
                value={workOrder.workOrderStatus}
                onChange={(e) => {
                  handleInputChange('workOrderStatus', e.target.value)
                }}
                options={workOrderStatusValue}
                optionLabel="status"
                editable
                disabled={isLoading || isAccountRecievable || isTechnician}
                style={{
                  width: '230px',
                  height: '32px',
                  border: errorMessage.workOrderStatus ? '1px solid red' : '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.8rem',
                }}
              />
            </div>
            <p>
              {errorMessage.workOrderStatus && (
                <small className="p-error">{errorMessage.workOrderStatus}</small>
              )}
            </p>
          </div>
          {/* Cost */}
          <div>
            <span className="font-medium text-sm text-[#000000]">
              <div className="flex gap-1">Cost</div>
            </span>
            <div className="mt-1">
              <InputText
                type="text"
                value={workOrder.cost}
                onChange={(e: any) => handleInputChange('cost', e.target.value)}
                disabled={isLoading || isAccountRecievable || isTechnician}
                style={{
                  width: '230px',
                  height: '32px',
                  border: '1px solid #D5E1EA',
                  fontSize: '0.8rem',
                  padding: '0.5rem',
                }}
              />
            </div>
          </div>
          {/* Time (in minutes) */}
          <div className="card  ">
            <span>
              <div className="flex flex-wrap gap-1">
                <p className="font-medium text-sm text-[#000000]"> Time </p>
                <span style={{ fontSize: '0.8rem' }}>(in minutes)</span>
              </div>
            </span>
            <div
              style={{
                maxWidth: '100%',
                height: '32px',
                border: '1px solid #D5E1EA',
                borderRadius: '0.50rem',
              }}>
              <div className="flex justify-around text-center">
                <h1
                  className="mt-1 p-[0.1rem] ml-2 mr-2 bg-slate-300 rounded-md cursor-pointer"
                  onClick={() => {
                    !isTechnician && handleDecrement()
                  }}>
                  <GrFormSubtract />
                </h1>
                <input
                  type="text"
                  value={formatTime(time.minutes, time.seconds)}
                  onChange={handleTimeChange}
                  disabled={isLoading || isAccountRecievable || isTechnician}
                  className="text-center w-16"
                  style={{
                    boxShadow: 'none',
                  }}
                />
                <h1
                  className="mt-1 ml-2 mr-2 p-[0.1rem] bg-slate-300 rounded-md cursor-pointer"
                  onClick={() => {
                    !isTechnician && handleIncrement()
                  }}>
                  <IoIosAdd />
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Vendor */}
          {workOrder?.workOrderStatus?.id === 10 || statusChanged ? (
            <div className="mt-3">
              <span className="font-medium text-sm text-[#000000]">
                <div className="flex gap-1">
                  Vendor <p className="text-red-600">*</p>
                </div>
              </span>
              <div className="mt-1">
                <Dropdown
                  value={workOrder.vendor}
                  onChange={(e) => {
                    handleInputChange('vendor', e.target.value)
                    setVendorId(e.target.value.id)
                    setIsDirty(true)
                  }}
                  options={vendorsName}
                  optionLabel="vendorName"
                  editable
                  disabled={isLoading || isAccountRecievable || isTechnician}
                  style={{
                    width: '230px',
                    height: '32px',
                    border: errorMessage.vendor ? '1px solid red' : '1px solid #D5E1EA',
                    borderRadius: '0.50rem',
                    fontSize: '0.8rem',
                  }}
                  itemTemplate={(option) => (
                    <div className="flex justify-between items-center">
                      <span>{option.vendorName}</span>
                      {workOrderData?.inventoryResponseDtoList &&
                        workOrderData.inventoryResponseDtoList.some(
                          (item: any) => item?.vendorResponseDto.id === option.id,
                        ) && (
                          <i
                            className="pi pi-check-circle ml-2 hover:bg-gray-200 rounded-full"
                            style={{ color: 'green' }}></i>
                        )}
                    </div>
                  )}
                />
              </div>
              <p>
                {errorMessage.vendor && <small className="p-error">{errorMessage.vendor}</small>}
              </p>
            </div>
          ) : null}
          {/* Item Name */}
          {(workOrder?.workOrderStatus?.id === 10 && vendorId) || statusChanged ? (
            <div className="mt-3">
              <span className="font-medium text-sm text-[#000000]">
                <div className="flex gap-1">
                  Item <p className="text-red-600">*</p>
                </div>
              </span>
              <div className="mt-1">
                <Dropdown
                  value={workOrder.inventory}
                  onChange={(e) => {
                    handleInputChange('inventory', e.target.value)
                  }}
                  options={inventory}
                  optionLabel="itemName"
                  editable
                  disabled={isLoading || isAccountRecievable || isTechnician}
                  style={{
                    width: '230px',
                    height: '32px',
                    border: errorMessage.inventory ? '1px solid red' : '1px solid #D5E1EA',
                    borderRadius: '0.50rem',
                    fontSize: '0.8rem',
                  }}
                  itemTemplate={(option) => (
                    <div className="flex justify-between items-center">
                      <span>{option.itemName}</span>
                      {workOrderData?.inventoryResponseDtoList &&
                        workOrderData.inventoryResponseDtoList.some(
                          (item: any) => item.id === option.id,
                        ) && (
                          <i
                            className="pi pi-check-circle ml-2 hover:bg-gray-200 rounded-full"
                            style={{ color: 'green' }}></i>
                        )}
                    </div>
                  )}
                />
              </div>
              <p>
                {errorMessage.inventory && (
                  <small className="p-error">{errorMessage.inventory}</small>
                )}
              </p>
            </div>
          ) : null}
          {/* Quantity */}
          {(workOrder?.workOrderStatus?.id === 10 && workOrder?.inventory?.quantity) ||
          statusChanged ? (
            <div className="mt-3">
              <span className="font-medium text-sm text-[#000000]">
                <div className="flex gap-1">Quantity (Available)</div>
              </span>
              <div className="mt-1">
                <InputComponent
                  value={workOrder.quantity}
                  onChange={(e) => {
                    handleInputChange('quantity', e.target.value)
                  }}
                  type="number"
                  disabled={isLoading || isAccountRecievable || isTechnician}
                  style={{
                    width: '230px',
                    height: '32px',
                    border: '1px solid #D5E1EA',
                    borderRadius: '0.50rem',
                    fontSize: '0.8rem',
                    paddingLeft: '0.5rem',
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>

        {/* Report Problem */}
        <div className=" mt-4 mb-20">
          <span className="font-medium text-sm text-[#000000]">
            <div className="flex gap-1">Report Problem</div>
          </span>
          <div className="mt-1 text-[#000000]">
            <InputTextarea
              value={workOrder.value}
              rows={3}
              cols={30}
              disabled={isLoading || isAccountRecievable || isTechnician}
              onChange={(e) => handleInputChange('value', e.target.value)}
              style={{
                width: '740px',
                height: '66px',
                border: '1px solid #D5E1EA',
                borderRadius: '0.50rem',
                boxShadow: 'none',
                paddingLeft: '0.5rem',
                fontSize: '0.8rem',
                resize: 'none',
                cursor: isAccountRecievable ? 'disabled' : 'pointer',
              }}
            />
          </div>
        </div>
      </div>
      {/* Save and Back buttons */}
      <div
        className={`"flex gap-6 bottom-2 absolute left-7" ${isLoading ? 'blurred' : ''}`}
        style={{
          width: '100%',
          height: '80px',
          backgroundColor: 'white',
          padding: '0 12px',
          bottom: '0px',
        }}>
        <Button
          onClick={handleSave}
          disabled={isInvoice}
          label="Save"
          style={{
            width: '89px',
            height: '42px',
            backgroundColor: '#0098FF',
            cursor: isAccountRecievable ? 'disabled' : 'pointer',
            fontWeight: 'bolder',
            fontSize: '1rem',
            boxShadow: 'none',
            color: 'white',
            borderRadius: '0.50rem',
            marginTop: '10px',
          }}
        />
        <Button
          onClick={() => setVisible(false)}
          label="Back"
          text={true}
          style={{
            backgroundColor: 'white',
            color: '#000000',
            border: 'none',
            width: '89px',
            height: '42px',
            marginTop: '10px',
          }}
        />
      </div>

      <Dialog
        position="center"
        style={{
          width: '800px',
          minWidth: '800px',
          height: '580px',
          minHeight: '580px',
          borderRadius: '1rem',
          fontWeight: '400',
          cursor: 'alias',
        }}
        draggable={false}
        visible={imageVisible}
        onHide={() => setImageVisible(false)}
        header={'Images'}>
        <ShowImages
          handleNoteChange={handleNoteChange}
          hoveredIndex={hoveredIndex}
          handleRemoveImage={handleRemoveImage}
          setHoveredIndex={setHoveredIndex}
          handleImageChange={handleImageChange}
          setImageVisible={setImageVisible}
          imageRequestDtoList={imageRequestDtoList}
          isLoading={isLoading}
          images={customerImages}
        />
        <Toast ref={toastRef} />
      </Dialog>
    </>
  )
}

export default AddEstimates
