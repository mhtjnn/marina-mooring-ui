import { useCallback, useEffect, useMemo, useRef, useState, useContext } from 'react'
import DataTableComponent from '../../CommonComponent/Table/DataTableComponent'
import { properties } from '../../Utils/MeassageProperties'
import { FaClipboardList } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { IoMdSave } from "react-icons/io";
import { Dropdown } from 'primereact/dropdown'
import { InputTextarea } from 'primereact/inputtextarea'
import { IoIosAdd } from 'react-icons/io'
import { GrFormSubtract } from 'react-icons/gr'
import { FaFileUpload, FaLessThanEqual } from 'react-icons/fa'
import { FaRedo, FaEllipsisV } from 'react-icons/fa';
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

type Tab = 'General' | 'Technicians' | 'Costs' | 'Comments' | 'Attachments' | 'Modifications';

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
  const [showAddHours, setShowAddHours] = useState(false)
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [workOrderStatus, setWorkOrderStatus] = useState("");
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

  //my code starts here 


  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]); // Deselect all rows
    } else {
      const allRowIds = modificationsData.map((row, index) => index); // Select all rows
      setSelectedRows(allRowIds);
    }
    setSelectAll(!selectAll); // Toggle select all state
  };

  const handleCheckboxClick = (index: number) => {
    const isSelected = selectedRows.includes(index);
    const updatedSelectedRows = isSelected
      ? selectedRows.filter((id) => id !== index)
      : [...selectedRows, index];
    setSelectedRows(updatedSelectedRows);
  };


  const modificationsData = useMemo(() => [
    {
      id: 1,
      employee: 'abc',
      time: '2024-10-21 14:00',
      field: 'Comments',
      from: 'bye',
      to: 'hello',
    },
    {
      id: 2,
      employee: 'xyz',
      time: '2024-10-21 14:30',
      field: 'Hours',
      from: 'code',
      to: 'marina',
    },
    {
      id: 3,
      employee: 'Alex',
      time: '2024-10-21 15:00',
      field: 'Status',
      from: 'Open',
      to: 'Complete',
    },
  ], []);


  const columns = [
    {
      id: "checkbox",
      field: "checkbox",
      body: () => (
        <input
          type="checkbox"
          className="w-4 h-4"
        />
      ),
    },
    { id: "employee", field: "employee", header: "Modification: Employee" },
    { id: "time", field: "time", header: "Modification: Time" },
    { id: "field", field: "field", header: "Modification: Field" },
    { id: "from", field: "from", header: "Modification: From" },
    { id: "to", field: "to", header: "Modification: To" },
  ];



  return (
    <>
      <Toast ref={toastRef} />
      <div className="bg-white min-h-screen flex flex-col">
        <div className="sticky top-0 z-20 w-full">
          <div className="bg-[#00426F] h-10 w-full flex items-center justify-between px-2">
            <h1 className="text-2xl font-bold text-white">Work Order</h1>
            <button
              onClick={handleSave}
              disabled={isInvoice}
              className={`text-white text-2xl ml-auto mt-2 ${isInvoice ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <IoMdSave />
            </button>
            <button className="text-4xl text-white hover:text-gray-300"
              onClick={handleButtonClose}>
              &times;
            </button>
          </div>

          <div className="bg-gray-200 h-14 w-full flex items-center justify-between px-2">
            <FaClipboardList className="text-white text-3xl" />
            <h1 className="text-gray-700 ml-5 text-2xl font-bold mr-auto">Create Work Order</h1>
            <MdDashboard className="text-white text-2xl" />
          </div>

          <div className="bg-gray-200  w-full">
            <ul className="flex ml-8 space-x-4 px-4 py-2">
              <li
                className={`cursor-pointer pb-2 border-b-2 ${activeTab === 'General' ? 'border-[#00426F] text-black' : 'border-transparent'
                  }`}
                onClick={() => setActiveTab('General')}
              >
                General
              </li>
              <li
                className={`cursor-pointer pb-2 border-b-2 ${activeTab === 'Technicians' ? 'border-[#00426F] text-black' : 'border-transparent'
                  }`}
                onClick={() => setActiveTab('Technicians')}
              >
                Technicians
              </li>
              <li
                className={`cursor-pointer pb-2 border-b-2 ${activeTab === 'Costs' ? 'border-[#00426F] text-black' : 'border-transparent'
                  }`}
                onClick={() => setActiveTab('Costs')}
              >
                Costs
              </li>
              <li
                className={`cursor-pointer pb-2 border-b-2 ${activeTab === 'Comments' ? 'border-[#00426F] text-black' : 'border-transparent'
                  }`}
                onClick={() => setActiveTab('Comments')}
              >
                Comments
              </li>
              <li
                className={`cursor-pointer pb-2 border-b-2 ${activeTab === 'Attachments' ? 'border-[#00426F] text-black' : 'border-transparent'
                  }`}
                onClick={() => setActiveTab('Attachments')}
              >
                Attachments
              </li>
              <li
                className={`cursor-pointer pb-2 border-b-2 ${activeTab === 'Modifications' ? 'border-[#00426F] text-black' : 'border-transparent'
                  }`}
                onClick={() => setActiveTab('Modifications')}
              >
                Modifications
              </li>
            </ul>
          </div>
        </div>

        <div className="flex-grow  mt-1">
          {activeTab === 'General' && (
            <div className="px-4 ">
              <div className="p-4">
                {/* Customer Name */}
                <div className="mb-4 mx-4">
                  <span className="block text-sm font-medium text-black">
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
                      className="w-full h-9 border border-gray-300 rounded-md text-sm px-2 focus:outline-none focus:border-gray-300"
                    />
                  </div>
                  {errorMessage.customerName && (
                    <small className="text-red-600">{errorMessage.customerName}</small>
                  )}
                </div>

                {/* Mooring Number */}
                <div className="mb-4 mx-4">
                  <span className="block text-sm font-medium text-black">
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
                      className="w-full h-9 border border-gray-300 rounded-md text-sm px-2 focus:outline-none focus:border-gray-300"
                    />
                  </div>
                  {errorMessage.mooringId && (
                    <small className="text-red-600">{errorMessage.mooringId}</small>
                  )}
                </div>

                {/* Description */}
                <div className="mb-4 mx-4">
                  <label className="block text-sm font-medium text-black">Description</label>
                  <input
                    type="text"
                    id="description"
                    className="block w-full h-9 border border-gray-300 rounded-md text-sm px-2 focus:outline-none focus:border-gray-300"
                   
                  />
                </div>

                {/* Type */}
                <div className="mb-4 mx-4">
                  <label className="block text-sm font-medium text-black">Type</label>
                  <Dropdown
                    options={[]}
                    optionLabel="label"
                    className="w-full h-9 border border-gray-300 rounded-md text-sm px-2 focus:outline-none focus:border-gray-300"
                    
                  />
                </div>

                {/* Status */}
                <div className="mb-4 mx-4">
                  <label className="block text-sm font-medium text-black">
                    Status <span className="text-red-600">*</span>
                  </label>
                  <Dropdown
                    value={workOrder.workOrderStatus}
                    onChange={(e) => handleInputChange('workOrderStatus', e.target.value)}
                    options={workOrderStatusValue}
                    optionLabel="status"
                    className="w-full h-9 border border-gray-300 rounded-md text-sm px-2 focus:outline-none focus:border-gray-300"
                    
                  />
                  {errorMessage.workOrderStatus && (
                    <small className="text-red-600">{errorMessage.workOrderStatus}</small>
                  )}
                </div>

                {/* Notes */}
                {workOrder?.workOrderStatus?.id === 7 || statusChanged ? (
                  <div className="mb-4 mx-4">
                    <label className="block text-sm font-medium text-black">
                      Notes <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="notes"
                      className="block w-full h-9 border border-gray-300 rounded-md text-sm px-2 focus:outline-none focus:border-gray-300"
                      
                    />
                  </div>
                ) : null}

                {/* Priority */}
                <div className="mb-4 mx-4">
                  <span className="block text-sm font-medium text-black">
                    <div className="flex gap-1">
                      Priority
                      <p className="text-red-600">*</p>
                    </div>
                  </span>
                  <div className="mt-1">
                    <Dropdown
                      options={[
                        <h2>Emergency</h2>,
                        <h2>High</h2>,
                        <h2>Medium</h2>,
                        <h2>Low</h2>,
                      ]}
                      optionLabel="priority"
                      className="w-full h-9 border border-gray-300 rounded-md text-sm px-2 focus:outline-none focus:border-gray-300"
                      
                    />
                  </div>
                </div>

                {/* Speciality */}
                <div className="mb-4 mx-4">
                  <label className="block text-sm font-medium text-black">Speciality</label>
                  <input
                    type="text"
                    id="speciality"
                    className="block w-full h-9 border border-gray-300 rounded-md text-sm px-2 focus:outline-none focus:border-gray-300"
                    
                  />
                </div>

                {/* Due Date */}
                <div className="mb-4 mx-4">
                  <span className="block text-sm font-medium text-black">
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
                      className="w-1/2 h-9 border border-gray-300 rounded-md text-sm px-2 focus:outline-none focus:border-gray-300"
                      
                    />
                  </div>
                  {errorMessage.dueDate && (
                    <small className="text-red-600">{errorMessage.dueDate}</small>
                  )}
                </div>
              </div>
            </div>
          )}











          {activeTab === 'Technicians' && <div className="p-4 px-12 space-y-3">
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
                  className="w-full h-9 border border-gray-300 rounded-md text-sm px-2 focus:outline-none focus:border-gray-300"
                />
              </div>
              {errorMessage.assignedTo && (
                <small className="text-red-600">{errorMessage.assignedTo}</small>
              )}
            </div>

            {/* Estimated Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Estimated Hours
              </label>
              <input
                type="text"
                id="estimatedHours"
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter estimated hours"
              />
            </div>

            {/* Add Hours Button */}
            <div className="flex space-x-4">
              <button
                onClick={() => setShowAddHours(true)}
                className="w-40px  bg-gray-200 p-2 rounded-lg hover:bg-gray-300"
              >
                + Add Hours (Manually)
              </button>
            </div>

            {/* Add Hours Box */}
            {showAddHours && (
              <div className="mt-4 p-4 border rounded-lg shadow-md relative">
                {/* Close Button */}
                <button
                  onClick={() => setShowAddHours(false)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                >
                  &times;
                </button>

                <div className="mb-4 flex space-x-4">
                  {/* Date Field */}
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00426F] focus:border-[#00426F]sm:text-sm"
                    />
                  </div>

                  {/* Time Field */}
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Time
                    </label>
                    <input
                      type="time"
                      className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-100 focus:border-green-100 sm:text-sm selection:bg-green-100 selection:text-green-900"
                      defaultValue={new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    />
                  </div>
                </div>

                {/* Duration (hh:mm) */}
                <div className="card space-y-2"> {/* Added spacing between elements */}
                  <span>
                    <div className="flex flex-wrap gap-1">
                      <p className="font-medium text-sm text-[#000000]"> Duration </p>
                      <span style={{ fontSize: '0.8rem' }}>(in HH:MM)</span>
                    </div>
                  </span>
                  <div
                    style={{
                      maxWidth: '44%',
                      height: '32px',
                      border: '1px solid #D5E1EA',
                      borderRadius: '0.50rem',
                    }}
                  >
                    <div className="flex justify-around text-center">
                      <h1
                        className="mt-1 p-[0.1rem] ml-2 mr-2 bg-slate-300 rounded-md cursor-pointer"
                        onClick={() => {
                          !isTechnician && handleDecrement()
                        }}
                      >
                        <GrFormSubtract />
                      </h1>
                      <input
                        type="text"
                        value={formatTime(time.minutes, time.seconds)}
                        onChange={handleTimeChange}
                        disabled={isLoading || isAccountRecievable || isTechnician}
                        className="text-center w-16 focus:outline-none"
                        style={{
                          boxShadow: 'none',
                        }}
                      />
                      <h1
                        className="mt-1 ml-2 mr-2 p-[0.1rem] bg-slate-300 rounded-md cursor-pointer"
                        onClick={() => {
                          !isTechnician && handleIncrement()
                        }}
                      >
                        <IoIosAdd />
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div> }





          {activeTab === 'Costs' && <div className='px-12'>
            <div className="p-4  bg-gray-50">
              {/* Add Material Section */}
              <div className="bg-white w-full shadow-md rounded-lg p-1 mb-6 border border-gray-100">
                <button
                  onClick={() => setShowMaterialForm(!showMaterialForm)}
                  className="w-full  bg-gray-200 p-2 rounded-lg hover:bg-gray-300"
                >
                  + ADD MATERIALS
                </button>



                {showMaterialForm && (
                  <div className="mt-4">

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
                              width: '100%',
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
                                    (item: any) => item?.vendorResponseDto?.id === option.id,
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
                              width: '100%',
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






                    <div className="grid grid-cols-2 gap-4">
                      {/* Quantity */}
                      {(workOrder?.workOrderStatus?.id === 10 && workOrder?.inventory?.quantity) ||
                        statusChanged ? (
                        <div>
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
                                height: '42px',
                                border: '1px solid #D5E1EA',
                                borderRadius: '0.50rem',
                                fontSize: '0.8rem',
                                paddingLeft: '0.5rem',
                              }}
                            />
                          </div>
                        </div>
                      ) : null}



                      <div>
                        <label className="block text-sm font-medium text-gray-700">Cost</label>
                        <input
                          type="text"
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                          placeholder="$0.00"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>}





































          {activeTab === 'Comments' && <div className='px-10 '>
            <div className="bg-gray-100 p-3 rounded-lg shadow-md border border-gray-300">
              {/* Comments Section */}
              <div className="mb-4">
                <label className="block text-lg font-semibold text-gray-900 mb-2">
                  Add Comment
                </label>
                <p>Worked on This Order</p>
                <textarea
                  className="w-full overflow-hidden p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none resize-none"
                ></textarea>
                <small className="block mt-1 text-sm text-gray-500">
                  Comments are visible to all users
                </small>
              </div>
            </div>
          </div>}













          {activeTab === 'Attachments' && <div className="px-12">
            <div className="p-6  bg-gray-100 border border-gray-100 rounded-lg shadow-md">
              {/* Upload Area */}
              <div className="mt-1">
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
              </div>
            </div>

          </div>}




















          {activeTab === 'Modifications' && <div className='px-12'>

            <div className="w-full ">
              {/* Header Section with Title and Icons */}
              <div className="w-full flex justify-between items-center bg-gray-100 px-4 py-3 border-b border-gray-300">
                <h2 className="font-semibold text-lg">Modifications</h2>
                <div className="flex space-x-4">
                  <FaRedo className="text-gray-500 cursor-pointer" />
                  <FaEllipsisV className="text-gray-500 cursor-pointer" />
                </div>
              </div>

              {/* Table Section */}
              <div className="overflow-x-hidden">
                <thead className='w-full'>
                  <tr className=" bg-gray-100">
                    <th><input className=" ml-3 w-4 h-5" type="checkbox" /></th>
                    <th className=" border-gray-300 px-4 py-2 text-left">Modification: Employee</th>
                    <th className=" border-gray-300 px-4 py-2 text-left">Modification: Time</th>
                    <th className=" border-gray-300 px-4 py-2 text-left">Modification: Field</th>
                    <th className=" border-gray-300 px-4 py-2 text-left">Modification: From</th>
                    <th className=" border-gray-300 px-4 py-2 text-left">Modification: To</th>
                  </tr>
                </thead>
                <DataTableComponent 
                  tableStyle={{
                  
                    fontSize: '10px',
                    color: '#000000',
                    fontWeight: 600,
                    backgroundColor: '#F9FAFB',
                  }}
                  data={modificationsData}
                  columns={columns}
                  style={{  fontWeight: '400' }}
                  emptyMessage={
                    <div className="text-center mt-28">
                      <img
                        src="/assets/images/empty.png"
                        alt="Empty Data"
                        className="w-28 mx-auto mb-4"
                      />
                      <p className="text-gray-500 font-[600] text-lg">No data available</p>
                    </div>
                  }
                />
              </div>
            </div>
          </div>}













        </div>

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
          toastRef={toastRef}
        />
        {/* <Toast ref={toastRef} /> */}
      </Dialog>
    </>
  )
}
export default AddWorkOrder2;
