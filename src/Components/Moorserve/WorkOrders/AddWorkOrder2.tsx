import { useCallback, useEffect, useMemo, useRef, useState , useContext } from 'react'
import { FaClipboardList } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { IoMdSave } from "react-icons/io";
import { Dropdown } from 'primereact/dropdown'
import { InputTextarea } from 'primereact/inputtextarea'
import { IoIosAdd } from 'react-icons/io'
import { GrFormSubtract } from 'react-icons/gr'
import { FaFileUpload, FaLessThanEqual } from 'react-icons/fa'
import { Dialog } from 'primereact/dialog'

import {
  ErrorResponse,
  MooringResponse,
  ViewFormsResponse,
  WorkOrderResponse,
} from '../../../Type/ApiTypes'
import {
  useAddWorkOrderMutation,
  useGetViewFormMutation,
  useUpdateWorkOrderMutation,
} from '../../../Services/MoorServe/MoorserveApi'
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
import { MetaData, Params } from '../../../Type/CommonType'
import {
  AttachFormsTypesData,
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
import ReasonModal from '../../Moorpay/AccountReceivable/ReasonModal'
import ApproveModal from '../../Moorpay/AccountReceivable/ApproveModal'
import ShowImages from '../../CommonComponent/UploadImages'
import PDFEditor from '../Forms/PdfEditor'
import { FormDataContext } from '../../../Services/ContextApi/FormDataContext'
import { InputText } from 'primereact/inputtext'
import InputComponent from '../../CommonComponent/InputComponent'
import { MultiSelect } from 'primereact/multiselect'
import { useGetMooringByIdMutation } from '../../../Services/MoorManage/MoormanageApi'
import { validateFiles } from '../../Helper/Helper'

type Tab = 'General' | 'Employees' | 'Costs' | 'Comments' | 'Attachments' | 'Additional Information';

const AddWorkOrder2: React.FC<WorkOrderProps> = ({
  workOrderData,
  editModeEstimate,
  editModeWorkOrder,
  estimate,
  setVisible,
  closeModal,
  isAccountRecievable,
  getWorkOrderWithPendingPayApproval,
  getOutStandingInvoice,
  isInvoice,
  isTechnician,
  visible,
  setWorkOrderData,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('General');
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
  const selectedCustomerId = useSelector(selectCustomerId)
  const [time, setTime] = useState({ minutes: 0, seconds: 0 })
  const [basedOnCustomerIdAndBoatyardId, setbasedOnCustomerIdAndBoatyardId] = useState<MetaData[]>()
  const [mooringsBasedOnBoatyardIdData, setMooringsBasedOnBoatyardIdData] = useState<MetaData[]>()
  const [mooringBasedOnCustomerId, setMooringBasedOnCustomerId] = useState<MetaData[]>()
  const [boatyardBasedOnMooringId, setBoatyardBasedOnMooringId] = useState<MetaData[]>()
  const [customerBasedOnMooringId, setCustomerBasedOnMooringId] = useState<any[]>()
  const [technicians, setTechnicians] = useState<any[]>()
  const [mooringDetails, setmooringDetails] = useState<any>()
  const [moorings, setMoorings] = useState<MetaData[]>()
  const [viewPdf, setViewPdf] = useState<any>()
  const [workOrderStatusValue, setWorkOrderStatusValue] = useState<MetaData[]>()
  const [customerNameValue, setcustomerNameValue] = useState<any[]>()
  const [boatyardsName, setBoatYardsName] = useState<MetaData[]>([])
  const [vendorsName, setVendorsName] = useState<MetaData[]>([])
  const [inventory, setInventory] = useState<MetaData[]>([])
  const [editMode, setEditMode] = useState<boolean>(
    editModeWorkOrder ? editModeWorkOrder : false || editModeEstimate ? editModeEstimate : false,
  )
  const [errorMessage, setErrorMessage] = useState<{ [key: string]: string }>({})
  const [lastChangedField, setLastChangedField] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [denyModalOpen, setDenyModalOpen] = useState(false)
  const [statusChanged, setStatusChanged] = useState(
    workOrderData?.inventoryResponseDtoList?.length > 0 &&
      workOrderData?.workOrderStatusDto?.id === 10,
  )
  const [formsData, setFormsData] = useState<any[]>([])
  const { formData, setFormData } = useContext(FormDataContext)
  const [hoveredIndex, setHoveredIndex] = useState<null | number>(null)
  const [customerImages, setCustomerImages] = useState<string[]>([])
  const [vendorId, setVendorId] = useState<any>()
  const [isDirty, setIsDirty] = useState<boolean>(false)
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
  const { getAttachFormsTypeData } = AttachFormsTypesData()
  const { getVendorValue } = VendorData()
  const { getInventoryDetails } = InventoryDetailsData(vendorId)
  const { getTechniciansData } = GetTechnicians()
  const { getMooringIdsData } = GetMooringIds()
  const { getWorkOrderStatusData } = GetWorkOrderStatus()
  const [saveWorkOrder] = useAddWorkOrderMutation()
  const [updateWorkOrder] = useUpdateWorkOrderMutation()
  const [getViewForms] = useGetViewFormMutation()
  const [getMooringDetails] = useGetMooringByIdMutation()
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
    const { validFiles, invalidTypeFiles, invalidSizeFiles } = validateFiles(files, toastRef, {
      min: 5120,
      max: 5242880,
    })
    if (invalidTypeFiles.length > 0 || invalidSizeFiles.length > 0) {
      fileInput.value = ''
      return
    }
    const newBase64Strings: string[] = []
    const newImageUrls: string[] = []
    const imageRequestDtoList: { imageName: string; imageData: string }[] = []

    for (const file of validFiles) {
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
        imageRequestDtoList.push({
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

  const SaveWorkOrder = async () => {
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
      imageRequestDtoList: imageRequestDtoList,
    }
    if (workOrder?.attachForm) {
      payload.formRequestDtoList = [
        {
          id: workOrder.attachForm.id,
          formName: workOrder.attachForm.formName,
          fileName: workOrder.attachForm.fileName
            ? workOrder.attachForm.fileName
            : workOrder.attachForm.formName,
          encodedFormData: formData ? formData : workOrder.attachForm.formData,
          parentFormId: workOrder.attachform?.parentFormId,
        },
      ]
    }
    if (workOrder?.inventory) {
      payload.inventoryRequestDtoList = [
        {
          id: workOrder?.inventory?.id,
          quantity: workOrder?.quantity,
          parentInventoryId: workOrder?.parentInventoryId ? workOrder?.parentInventoryId : null,
        },
      ]
    }
    try {
      setIsLoading(true)
      const response = await saveWorkOrder(payload).unwrap()
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
      const { message, data } = error as ErrorResponse
      setIsLoading(false)

      toastRef?.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: message || data?.message,
        life: 3000,
      })
    }
  }

  const UpdateWorkOrder = async () => {
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
      editPayload.workOrderStatusId = workOrder?.workOrderStatus?.id
        ? workOrder?.workOrderStatus?.id
        : workOrderData?.workOrderStatusDto?.id

      if (workOrder?.value !== workOrderData?.problem) {
        editPayload.problem = workOrder?.value
      }
      if (imageRequestDtoList && imageRequestDtoList.length > 0) {
        editPayload.imageRequestDtoList = imageRequestDtoList
      }
      const formattedTime = '00:' + formatTime(time.minutes, time.seconds)
      if (formattedTime !== workOrderData?.time) {
        editPayload.time = formattedTime
      }

      if (workOrder?.attachForm || workOrderData?.formResponseDtoList) {
        const formRequestDtoList: any[] = []
        if (workOrderData?.formResponseDtoList?.length > 0) {
          workOrderData.formResponseDtoList.forEach((form: any) => {
            formRequestDtoList.push({
              id: form.id,
              formName: form.formName,
              fileName: form.fileName,
              encodedFormData: form.encodedFormData || null,
              parentFormId: form.parentFormId,
            })
          })
        }
        if (formData) {
          formRequestDtoList.push({
            id: workOrder.attachForm.id,
            formName: workOrder.attachForm.formName
              ? workOrder.attachForm.formName
              : workOrderData?.formResponseDtoList?.[0]?.formName,
            fileName: workOrder.attachForm.fileName
              ? workOrder.attachForm.fileName
              : workOrder.attachForm.formName
                ? workOrder.attachForm.formName
                : workOrderData?.formResponseDtoList?.[0]?.formName,
            encodedFormData: formData ? formData : workOrder.attachForm.formData,
            parentFormId: workOrder.attachForm?.parentFormId,
          })
        }

        if (formRequestDtoList.length > 0) {
          editPayload.formRequestDtoList = formRequestDtoList
        }
      }

      if (workOrder?.inventory) {
        if (workOrder?.inventory?.id || workOrderData?.inventoryResponseDtoList?.length > 0) {
          const inventoryRequestDtoList: any[] = []
          if (workOrderData?.inventoryResponseDtoList?.length > 0) {
            workOrderData.inventoryResponseDtoList.forEach((item: any, index: number) => {
              inventoryRequestDtoList.push({
                id: item.id,
                quantity: item.quantity,
                parentInventoryId: item.parentInventoryId,
              })
            })
          }
          if (workOrder?.inventory?.id) {
            inventoryRequestDtoList.push({
              id: workOrder?.inventory?.id,
              quantity: workOrder?.quantity,
              parentInventoryId: workOrder?.parentInventoryId ? workOrder?.parentInventoryId : null,
            })
          }
          if (inventoryRequestDtoList.length > 0) {
            editPayload.inventoryRequestDtoList = inventoryRequestDtoList
          }
        }
      }
      if (Object.keys(editPayload).length > 0) {
        const response = await updateWorkOrder({
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
      } else {
        setIsLoading(false)
        toastRef?.current?.show({
          severity: 'info',
          summary: 'No Changes',
          detail: 'No updates were made to the work order.',
          life: 3000,
        })
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




  const handleModalClose = () => {
    setDenyModalOpen(false)
    setApproveModalOpen(false)
  }


  const handleButtonClose = () => {
    setVisible(false)
    setEditMode(false)
  }


  const handleSave = () => {
    if (editModeWorkOrder) {
      UpdateWorkOrder()
    } else {
      SaveWorkOrder()
    }
  }

  const fetchDataAndUpdate = useCallback(async () => {
    const { getTechnicians } = await getTechniciansData()
    const { mooringIds } = await getMooringIdsData()
    const { WorkOrderStatus } = await getWorkOrderStatusData()
    const { customersData } = await getCustomersData()
    const { boatYardName } = await getBoatYardNameData()
    const { attachFormsTypeValue } = await getAttachFormsTypeData()

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
      const filteredMoorings = mooringIds?.filter((mooring) => mooring?.mooringNumber !== '')
      setMoorings(filteredMoorings)
    }
    if (WorkOrderStatus !== null) {
      setIsLoading(false)
      setWorkOrderStatusValue(WorkOrderStatus)
    }
    if (attachFormsTypeValue != null) {
      setIsLoading(false)
      setFormsData(attachFormsTypeValue)
      if (workOrderData?.formResponseDtoList) {
        setFormsData((prevState) => [...prevState, ...workOrderData?.formResponseDtoList])
      }
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

  const fetchVendorDataAndUpdate = async () => {
    const { vendorValue } = await getVendorValue()

    if (vendorValue !== null) {
      setIsLoading(false)
      const existingVendorIds = new Set(vendorsName.map((vendor) => vendor.id))
      vendorValue.forEach((vendor) => existingVendorIds.add(vendor.id))
      let vendorList = []
      if (workOrderData?.inventoryResponseDtoList) {
        vendorList = workOrderData.inventoryResponseDtoList
          .map((item: any) => item.vendorResponseDto)
          .filter((vendor: any) => vendor !== null)

        vendorList.forEach((vendor: any) => existingVendorIds.add(vendor.id))
      }
      const allVendors = [...vendorValue, ...vendorList]
      const uniqueVendors = Array.from(existingVendorIds)
        .map((id) => allVendors.find((vendor) => vendor.id === id))
        .filter(Boolean)
      setVendorsName(uniqueVendors)
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

  const viewFormsData = async (id: any) => {
    setIsLoading(true)
    try {
      const response = await getViewForms({ id: id }).unwrap()
      const { status, content, message } = response as ViewFormsResponse
      if (status === 200) {
        setIsLoading(false)
        setViewPdf(content)
        setFormData(content?.encodedData)
      } else {
        setViewPdf('')
        setFormData('')
        setIsLoading(false)
        toastRef?.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        })
      }
    } catch (error) {
      const { message, data } = error as ErrorResponse
      setIsLoading(false)
      toastRef?.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: message || data?.message,
        life: 3000,
      })
    }
  }

  const getMooringDataById = useCallback(
    async (id: any) => {
      setIsLoading(true)
      try {
        const params: Params = {}
        const response = await getMooringDetails({ id: id }).unwrap()
        const { status, content, message, totalSize } = response as MooringResponse
        if (status === 200) {
          setmooringDetails(content)
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
        const { message: msg } = error as ErrorResponse
        setIsLoading(false)
        console.error('Error occurred while fetching customer data:', msg)
      }
    },
    [workOrder.mooringId],
  )

  useEffect(() => {
    if (workOrder?.workOrderStatus?.id === 10 || workOrderData?.inventoryResponseDtoList)
      fetchVendorDataAndUpdate()
  }, [workOrder?.workOrderStatus?.id === 10, workOrderData?.inventoryResponseDtoList])

  useEffect(() => {
    fetchDataAndUpdate()
  }, [])

  useEffect(() => {
    if (workOrder.mooringId && workOrder.mooringId.id) getMooringDataById(workOrder.mooringId.id)
  }, [workOrder.mooringId])

  useEffect(() => {
    if (vendorId) {
      fetchInventoryDetails()
      if (
        (workOrderData?.inventoryResponseDtoList &&
          workOrderData?.inventoryResponseDtoList.length <= 0) ||
        (workOrder.inventory && editModeWorkOrder && isDirty) ||
        (workOrder.inventory && !editModeWorkOrder)
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
    if (editModeWorkOrder) {
      handleEditMode()
    }
  }, [editModeWorkOrder])

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
    if (setWorkOrderData && !visible && !editModeWorkOrder) {
      setWorkOrderData('')
      setWorkOrder('')
      setFormData('')
      setStatusChanged(false)
    }
  }, [visible])

 


  return(
    <>
    <Toast ref={toastRef} />
    <div className="bg-white min-h-screen flex flex-col">
      <div className="sticky top-0 z-20 w-full">
        <div className="bg-[#00426F] h-10 w-full flex items-center justify-between px-2">
          <h1 className="text-2xl font-bold text-white">Work Order</h1>
          <IoMdSave className="text-white text-2xl ml-auto mt-2" />
          <button className="text-4xl text-white hover:text-gray-300"
            onClick={handleButtonClose}>
            &times;
          </button>
        </div>
  
        <div className="bg-[#959697] h-14 w-full flex items-center justify-between px-2">
          <FaClipboardList className="text-white text-3xl" />
          <h1 className="text-white text-2xl font-bold mr-auto">Create Work Order</h1>
          <MdDashboard className="text-white text-2xl" />
        </div>
  
        <div className="bg-[#959697] w-full">
          <ul className="flex space-x-4 px-4 py-2">
            <li
              className={`cursor-pointer pb-2 border-b-2 ${
                activeTab === 'General' ? 'border-[#00426F] text-black' : 'border-transparent'
              }`}
              onClick={() => setActiveTab('General')}
            >
              General
            </li>
            <li
              className={`cursor-pointer pb-2 border-b-2 ${
                activeTab === 'Employees' ? 'border-[#00426F] text-black' : 'border-transparent'
              }`}
              onClick={() => setActiveTab('Employees')}
            >
              Employees
            </li>
            <li
              className={`cursor-pointer pb-2 border-b-2 ${
                activeTab === 'Costs' ? 'border-[#00426F] text-black' : 'border-transparent'
              }`}
              onClick={() => setActiveTab('Costs')}
            >
              Costs
            </li>
            <li
              className={`cursor-pointer pb-2 border-b-2 ${
                activeTab === 'Comments' ? 'border-[#00426F] text-black' : 'border-transparent'
              }`}
              onClick={() => setActiveTab('Comments')}
            >
              Comments
            </li>
            <li
              className={`cursor-pointer pb-2 border-b-2 ${
                activeTab === 'Attachments' ? 'border-[#00426F] text-black' : 'border-transparent'
              }`}
              onClick={() => setActiveTab('Attachments')}
            >
              Attachments
            </li>
            <li
              className={`cursor-pointer pb-2 border-b-2 ${
                activeTab === 'Additional Information' ? 'border-[#00426F] text-black' : 'border-transparent'
              }`}
              onClick={() => setActiveTab('Additional Information')}
            >
              Additional Information
            </li>
          </ul>
        </div>
      </div>
  
      <div className="flex-grow overflow-auto mt-1">
        {activeTab === 'General' && (
          <div className="p-4">
                  {/*  Customer Name     */}
            
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
                  width: '100%',
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
            
  

            {/* Mooring Input Field */}
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
                 width: '100%',
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

            {/* Description Input Field */}
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter a description"
              />
            </div>

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
                  width: '100%',
                  height: '34px',
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


          </div>
   )}
  










        {activeTab === 'Employees' && <div> employees content goes here</div>}







        {activeTab === 'Costs' && <div>Costs content goes here...</div>}






          {activeTab === 'Comments' && <div><div className="bg-white p-3 rounded-lg shadow-md border border-gray-300">
            {/* Comments Section */}
            <div className="mb-4">
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                Add Comment
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Worked on this order"
              ></textarea>
              <small className="block mt-1 text-sm text-gray-500">
                Comments are visible to all users
              </small>
            </div>
          </div></div>}






        {activeTab === 'Attachments' && <div>
        <div className="p-6 bg-gray-100 border border-gray-300 rounded-lg shadow-md">
  {/* Title for Image Upload */}
  <span className="font-medium text-sm text-black">
    <div className="flex gap-1">Image</div>
  </span>

  {/* Upload Area */}
  <div className="mt-4">
    <div
      className="border-2 border-dashed border-white rounded-lg h-32 w-full flex items-center justify-center cursor-pointer hover:bg-gray-50"
      onClick={() => {
        !isTechnician && setImageVisible(true)
      }}
    >
      <FaFileUpload className="text-4xl text-gray-500" />
      <p className="ml-2 text-gray-500">
        Drag and drop files here or <span className="text-blue-500">click</span>
      </p>
    </div>

    {/* Hidden File Input */}
    <input
      type="file"
      accept="image/*"
      id="file-upload"
      style={{ display: 'none' }}
    />
  </div>
</div>

          </div>}




















        {activeTab === 'Additional Information' && <div>Additional Information content goes here...</div>}
      </div>
    </div>
    </>
  )
}
export default AddWorkOrder2;
