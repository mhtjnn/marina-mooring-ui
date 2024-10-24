import React, { useState, useEffect, useCallback, useRef, useContext } from 'react'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { IoIosAdd } from 'react-icons/io'
import { GrFormSubtract } from 'react-icons/gr'
import { FaFileUpload } from 'react-icons/fa'
import { Dialog } from 'primereact/dialog'
import {
  ErrorResponse,
  MooringResponse,
  ViewFormsResponse,
  WorkOrderResponse,
} from '../../../Type/ApiTypes'
import { Button } from 'primereact/button'
import { WorkOrderProps } from '../../../Type/ComponentBasedType'
import {
  GetBoatyardBasedOnMooringId,
  GetCustomerBasedOnMooringId,
  GetMooringBasedOnCustomerIdAndBoatyardId,
  GetMooringsBasedOnBoatyardId,
  GetMooringsBasedOnCustomerId,
} from '../../CommonComponent/MetaDataComponent/MoorserveMetaDataApi'
import { MetaData, Params } from '../../../Type/CommonType'
import {
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
import { formatDate, formatTime, parseDate } from '../../Utils/CommonMethod'
import { handleEditMode } from '../../Utils/AddWorkOrderCustomMethods'
import { handleImageChange, validateFiles } from '../../Helper/Helper'
import { handleDecrement, handleIncrement } from '../../Utils/AddWorkOrderCustomMethods'
import {
  useAddWorkOrderMutation,
  useGetViewFormMutation,
  useUpdateWorkOrderMutation,
} from '../../../Services/MoorServe/MoorserveApi'
import { useGetMooringByIdMutation } from '../../../Services/MoorManage/MoormanageApi'
import useFetchDataAndUpdate from '../../Utils/UseFetchDataAndUpdate'
import { workOrderValidateFields } from '../../Utils/RegexUtils'
import PopUpCustomModal from '../../CustomComponent/PopUpCustomModal'
import UploadImages from '../../CommonComponent/UploadImages'

const AddWorkOrders: React.FC<WorkOrderProps> = ({
  workOrderData,
  editModeEstimate,
  editModeWorkOrder,
  setVisible,
  closeModal,
  isAccountRecievable,
  getWorkOrderWithPendingPayApproval,
  getOutStandingInvoice,
  getWorkOrderData,
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
  const [mooringDetails, setmooringDetails] = useState<any>()
  const [viewPdf, setViewPdf] = useState<any>()
  const [vendorsName, setVendorsName] = useState<MetaData[]>([])
  const [inventory, setInventory] = useState<MetaData[]>([])
  const [editMode, setEditMode] = useState<boolean>(
    editModeWorkOrder ? editModeWorkOrder : false || editModeEstimate ? editModeEstimate : false,
  )
  const [errorMessage, setErrorMessage] = useState<{ [key: string]: string }>({})
  const [lastChangedField, setLastChangedField] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [denyModalOpen, setDenyModalOpen] = useState(false)
  const [imageVisible, setImageVisible] = useState(false)
  const [imageRequestDtoList, setImageRequestDtoList] = useState<any[]>([])
  const [statusChanged, setStatusChanged] = useState(
    workOrderData?.inventoryResponseDtoList?.length > 0 &&
      workOrderData?.workOrderStatusDto?.id === 10,
  )
  const { formData, setFormData } = useContext(FormDataContext)
  const [hoveredIndex, setHoveredIndex] = useState<null | number>(null)
  const [images, setImages] = useState<string[]>([])
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
  const { getInventoryDetails } = InventoryDetailsData(vendorId)
  const { getVendorValue } = VendorData()
  const [saveWorkOrder] = useAddWorkOrderMutation()
  const [updateWorkOrder] = useUpdateWorkOrderMutation()
  const [getViewForms] = useGetViewFormMutation()
  const [getMooringDetails] = useGetMooringByIdMutation()
  const toastRef = useRef<Toast>(null)
  const {
    fetchDataAndUpdate,
    technicians,
    moorings,
    workOrderStatusValue,
    customerNameValue,
    boatyardsName,
    formsData,
    isLoader,
  } = useFetchDataAndUpdate(selectedCustomerId, workOrderData)
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
  const handleNoteChange = (index: number, note: string) => {
    setImageRequestDtoList((prevList: any[]) =>
      prevList.map((item, i) => (i === index ? { ...item, note } : item)),
    )
  }
  const handleInputChange = (field: string, value: any) => {
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

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    toastRef: any,
    setImages: React.Dispatch<React.SetStateAction<any>>,
    setImageRequestDtoList: React.Dispatch<React.SetStateAction<any>>,
  ) => {
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
    const newImageRequestDtoList: { imageName: string; imageData: string; note: string }[] = []

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
        newImageRequestDtoList.push({
          imageName: file.name,
          imageData: base64String,
          note: '',
        })
      } catch (error) {
        console.error('Error reading file:', error)
      }
    }
    setImages((prevImages: any) => [...prevImages, ...newImageUrls])
    setImageRequestDtoList((prevList: any) => [...prevList, ...newImageRequestDtoList])
  }

  const handleTimeChange = (event: { target: { value: any } }) => {
    const [min, sec] = event.target.value?.split(':').map(Number)
    if (!isNaN(min) && !isNaN(sec) && min >= 0 && sec >= 0 && sec < 60) {
      setTime({ minutes: min, seconds: sec })
      setErrorMessage((prevError) => ({ ...prevError, time: '' }))
    }
  }
  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index))
    setImageRequestDtoList((prevList: any[]) => prevList.filter((_, i) => i !== index))
  }
  const SaveWorkOrder = async () => {
    const errors = workOrderValidateFields({
      workOrder,
      setErrorMessage,
    })
    if (Object.keys(errors).length > 0) {
      setErrorMessage(errors)
      return
    }
    setIsLoading(true)
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
      cost: Number(workOrder?.cost),
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
      const { status, message, error } = response as WorkOrderResponse
      if (status === 200 || status === 201) {
        closeModal()
        if (getWorkOrderData) getWorkOrderData()
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
          detail: message || error,
          life: 3000,
        })
      }
    } catch (error) {
      const { message, data } = error as ErrorResponse
      setIsLoading(false)
      toastRef?.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: message || data?.message || data?.error,
        life: 3000,
      })
    }
  }
  const UpdateWorkOrder = async () => {
    const errors = workOrderValidateFields({
      workOrder,
      setErrorMessage,
    })
    if (Object.keys(errors).length > 0) return
    try {
      setIsLoading(true)
      const editPayload: any = {}
      if (workOrderData?.mooringResponseDto?.id) {
        if (workOrder?.mooringId?.id) {
          editPayload.mooringId = workOrder?.mooringId?.id
        } else {
          editPayload.mooringId = workOrderData?.mooringResponseDto?.id
        }
      } else if (workOrder?.mooringId?.id) {
        editPayload.mooringId = workOrder?.mooringId?.id
      }
      if (workOrderData?.boatyardResponseDto?.id) {
        if (workOrder?.boatyards?.id) {
          editPayload.boatyardId = workOrder?.boatyards?.id
        } else {
          editPayload.boatyardId = workOrderData?.boatyardResponseDto?.id
        }
      } else if (workOrder?.boatyards?.id) {
        editPayload.boatyardId = workOrder?.boatyards?.id
      }
      if (workOrder?.customerName?.id !== workOrderData?.customerResponseDto?.id) {
        editPayload.customerId = workOrder?.customerName?.id
      }
      if (workOrder?.assignedTo?.id !== workOrderData?.technicianUserResponseDto?.id) {
        editPayload.technicianId = workOrder?.assignedTo?.id
      }
      if (workOrder?.dueDate !== workOrderData?.dueDate) {
        editPayload.dueDate = workOrder?.dueDate
      }
      if (workOrder?.cost !== workOrderData?.cost) {
        editPayload.cost = Number(workOrder?.cost)
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
                id: item?.id,
                quantity: item?.quantity,
                parentInventoryId: item?.parentInventoryId,
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
          if (getWorkOrderData) getWorkOrderData()
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
  const handleSave = () => {
    if (editModeWorkOrder) {
      UpdateWorkOrder()
    } else {
      SaveWorkOrder()
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

  const fetchVendorDataAndUpdate = async () => {
    const { vendorValue } = await getVendorValue()

    if (vendorValue !== null) {
      setIsLoading(false)
      const existingVendorIds = new Set(vendorsName.map((vendor) => vendor.id))
      vendorValue.forEach((vendor) => existingVendorIds.add(vendor.id))
      let vendorList = []
      if (workOrderData?.inventoryResponseDtoList) {
        vendorList = workOrderData.inventoryResponseDtoList
          .map((item: any) => item?.vendorResponseDto)
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
    }
  }, [workOrder?.customerName?.id])

  const fetchDataAndUpdateBasedOnMooringId = useCallback(async () => {
    const { boatyardBasedOnMooringId } = await getBoatyardBasedOnMooringIdData()
    const { customerBasedOnMooringId } = await getCustomerBasedOnMooringIdData()

    if (boatyardBasedOnMooringId !== null) {
      setIsLoading(false)
      setBoatyardBasedOnMooringId(boatyardBasedOnMooringId)
    }

    if (customerBasedOnMooringId !== null) {
      const firstLastName = customerBasedOnMooringId.map((item: any) => ({
        firstName: item?.firstName + ' ' + item?.lastName,
        id: item?.id,
      }))
      setIsLoading(false)
      setCustomerBasedOnMooringId(firstLastName)
    }
  }, [workOrder?.mooringId?.id])

  const fetchDataAndUpdateBasedOnBoatyardId = useCallback(async () => {
    const { mooringBasedOnBoatyardId } = await getMooringsBasedOnBoatyardIdData()

    if (mooringBasedOnBoatyardId !== null) {
      setMooringsBasedOnBoatyardIdData(mooringBasedOnBoatyardId)
    }
  }, [workOrder?.boatyards?.id])

  const fetchDataAndUpdateBasedOnCuatomerIdAndBoatyardId = useCallback(async () => {
    const { mooringbasedOnCustomerIdAndBoatyardId } =
      await getMooringBasedOnCustomerIdAndBoatyardIdData()

    if (mooringbasedOnCustomerIdAndBoatyardId !== null) {
      setbasedOnCustomerIdAndBoatyardId(mooringbasedOnCustomerIdAndBoatyardId)
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
      handleEditMode({ setWorkOrder, workOrderData, setVendorId, setTime })
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

  return (
    <>
      <Toast ref={toastRef} />

      <div className={`"w-full h-full mb-20 ml-4" ${isLoader ? 'blurred' : ''}`}>
        {/* Customer Name */}
        <div className="flex gap-6">
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
                disabled={isLoader || isAccountRecievable || isTechnician}
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
              <div className="flex gap-1">Mooring Number</div>
            </span>
            <div className="mt-1">
              <Dropdown
                value={workOrder.mooringId?.mooringNumber || workOrder.mooringId}
                onChange={(e) => handleInputChange('mooringId', e.target.value)}
                options={MooringNameOptions}
                optionLabel="mooringNumber"
                editable
                disabled={isLoader || isAccountRecievable || isTechnician}
                style={{
                  width: '230px',
                  height: '32px',
                  border: '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.8rem',
                }}
              />
            </div>
          </div>

          {/* Images */}
          <div className="">
            <span className="font-medium text-sm text-[#000000]">
              <div className="flex gap-1">Image</div>
            </span>
            <div className="mt-1">
              <div />
              <div
                style={{
                  width: '230px',
                  height: '32px',
                  border: '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.8rem',
                  paddingLeft: '0.5rem',
                  cursor: isTechnician ? 'disabled' : 'pointer',
                }}>
                <div
                  onClick={() => {
                    !isTechnician && setImageVisible(true)
                  }}
                  className="flex gap-3 text-center">
                  <FaFileUpload style={{ fontSize: '22px', color: '#0098FF', marginTop: '3px' }} />
                  <div className="border-r-2 border-blue-100  h-[30px]"></div>
                  <span className="pl-4 mt-1"> Upload Image </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Boatyards */}
        <div className="flex gap-6 mt-3">
          <div>
            <span className="font-medium text-sm text-[#000000]">
              <div className="flex gap-1">Boatyard</div>
            </span>
            <div className="mt-1">
              <Dropdown
                value={workOrder.boatyards?.boatyardName || workOrder.boatyards}
                onChange={(e) => handleInputChange('boatyards', e.target.value)}
                options={boatyardsNameOptions}
                optionLabel="boatyardName"
                editable
                disabled={isLoader || isAccountRecievable || isTechnician}
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

          {/* Assigned to */}
          <div>
            <span className="font-medium text-sm text-[#000000]">
              <div className="flex gap-1">Assigned to</div>
            </span>
            <div className="mt-1">
              <Dropdown
                value={workOrder.assignedTo}
                onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                options={technicians}
                optionLabel="firstName"
                editable
                disabled={isLoader || isAccountRecievable || isTechnician}
                style={{
                  width: '230px',
                  height: '32px',
                  border: '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.8rem',
                }}
              />
            </div>
          </div>

          {isLoader && (
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
              <div className="flex gap-1">Due Date</div>
            </span>
            <div className="mt-1">
              <Calendar
                value={parseDate(workOrder.dueDate)}
                onChange={(e) => handleInputChange('dueDate', formatDate(e.target.value))}
                dateFormat="mm/dd/yy"
                disabled={isLoader || isAccountRecievable || isTechnician}
                style={{
                  width: '230px',
                  height: '32px',
                  border: '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.8rem',
                  paddingLeft: '0.5rem',
                  paddingRight: '0.5rem',
                }}
              />
            </div>
          </div>
        </div>

        {/* Schedule Date */}
        <div className="flex gap-6 mt-3">
          <div>
            <span className="font-medium text-sm text-[#000000]">
              <div className="flex gap-1">Schedule Date</div>
            </span>
            <div className="mt-1">
              <Calendar
                value={parseDate(workOrder.scheduleDate)}
                onChange={(e) => handleInputChange('scheduleDate', formatDate(e.target.value))}
                dateFormat="mm/dd/yy"
                disabled={isLoader || isAccountRecievable || isTechnician}
                style={{
                  width: '230px',
                  height: '32px',
                  border: '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.8rem',
                  paddingLeft: '0.5rem',
                  paddingRight: '0.5rem',
                }}
              />
            </div>
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
                disabled={isLoader || isAccountRecievable || isTechnician}
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
                    !isTechnician && handleDecrement({ time, setTime, setErrorMessage })
                  }}>
                  <GrFormSubtract />
                </h1>
                <input
                  type="text"
                  value={formatTime(time.minutes, time.seconds)}
                  onChange={handleTimeChange}
                  disabled={isLoader || isAccountRecievable || isTechnician}
                  className="text-center w-16"
                  style={{
                    boxShadow: 'none',
                  }}
                />
                <h1
                  className="mt-1 ml-2 mr-2 p-[0.1rem] bg-slate-300 rounded-md cursor-pointer"
                  onClick={() => {
                    !isTechnician && handleIncrement({ time, setTime, setErrorMessage })
                  }}>
                  <IoIosAdd />
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Attach Form */}
          <div className="mt-3">
            <span className="font-medium text-sm text-[#000000]">
              <div className="flex gap-1 items-center">
                Attach Form
                {(workOrder.attachForm?.id || workOrderData?.formResponseDtoList) && (
                  <i
                    className="pi pi-eye cursor-pointer ml-2 hover:bg-gray-200 rounded-full"
                    style={{ color: '#007bff' }}
                    onClick={() => {
                      if (formData) {
                        setViewPdf(formData)
                      } else {
                        viewFormsData(
                          workOrderData?.formResponseDtoList &&
                            workOrderData?.formResponseDtoList?.[0]?.id,
                        )
                      }
                    }}></i>
                )}
              </div>
            </span>
            <div className="mt-1">
              <Dropdown
                value={workOrder.attachForm}
                onChange={(e) => {
                  handleInputChange('attachForm', e.target.value)
                  viewFormsData(e.value.id)
                  setFormData('')
                }}
                options={formsData}
                optionLabel="formName"
                editable
                disabled={isLoader || isAccountRecievable || isTechnician}
                style={{
                  width: '230px',
                  height: '32px',
                  border: '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.8rem',
                }}
                itemTemplate={(option) => (
                  <div className="flex justify-between items-center">
                    <span>{option.formName}</span>
                    {workOrderData?.formResponseDtoList &&
                      workOrderData?.formResponseDtoList?.some(
                        (form: any) => form.id === option.id,
                      ) && (
                        <i
                          className="pi pi-check-circle ml-2 hover:bg-gray-200 rounded-full"
                          style={{ color: 'green' }}></i>
                      )}
                  </div>
                )}
              />
            </div>
          </div>
          {/* Cost */}
          <div className="mt-3">
            <span className="font-medium text-sm text-[#000000]">
              <div className="flex gap-1">Cost</div>
            </span>
            <div className="mt-1">
              <InputText
                type="text"
                value={workOrder.cost}
                onChange={(e: any) => handleInputChange('cost', e.target.value)}
                disabled={isLoader || isAccountRecievable || isTechnician}
                style={{
                  width: '230px',
                  height: '32px',
                  border: '1px solid #D5E1EA',
                  fontSize: '0.8rem',
                  padding: '0.5rem',
                  borderRadius: '0.50rem',
                }}
              />
            </div>
          </div>
          {/* Vendor */}
          {workOrder?.workOrderStatus?.id === 10 || statusChanged ? (
            <div className="mt-3">
              <span className="font-medium text-sm text-[#000000]">
                <div className="flex gap-1">Vendor</div>
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
                  disabled={isLoader || isAccountRecievable || isTechnician}
                  style={{
                    width: '230px',
                    height: '32px',
                    border: '1px solid #D5E1EA',
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
            </div>
          ) : null}
        </div>
        <div className="flex gap-6">
          {/* Item Name */}
          {(workOrder?.workOrderStatus?.id === 10 && vendorId) || statusChanged ? (
            <div className="mt-3">
              <span className="font-medium text-sm text-[#000000]">
                <div className="flex gap-1">Item</div>
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
                  disabled={isLoader || isAccountRecievable || isTechnician}
                  style={{
                    width: '230px',
                    height: '32px',
                    border: '1px solid #D5E1EA',
                    borderRadius: '0.50rem',
                    fontSize: '0.8rem',
                  }}
                  itemTemplate={(option) => (
                    <div className="flex justify-between items-center">
                      <span>{option.itemName}</span>
                      {workOrderData?.inventoryResponseDtoList &&
                        workOrderData.inventoryResponseDtoList.some(
                          (item: any) => item?.id === option.id,
                        ) && (
                          <i
                            className="pi pi-check-circle ml-2 hover:bg-gray-200 rounded-full"
                            style={{ color: 'green' }}></i>
                        )}
                    </div>
                  )}
                />
              </div>
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
                  disabled={isLoader || isAccountRecievable || isTechnician}
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
              disabled={isLoader || isAccountRecievable || isTechnician}
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
        className={`"flex gap-6 bottom-2 absolute left-7" ${isLoader ? 'blurred' : ''}`}
        style={{
          width: '100%',
          height: '80px',
          backgroundColor: 'white',
          padding: '0 12px',
          bottom: '0px',
        }}>
        {isAccountRecievable && !isInvoice ? (
          <>
            <Button
              onClick={() => {
                setApproveModalOpen(true)
              }}
              label="Approve"
              style={{
                width: '89px',
                height: '42px',
                backgroundColor: 'green',
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
              onClick={() => {
                setDenyModalOpen(true)
              }}
              label="Deny"
              text={true}
              style={{
                width: '89px',
                height: '42px',
                backgroundColor: 'red',
                cursor: isAccountRecievable ? 'disabled' : 'pointer',
                fontWeight: 'bolder',
                fontSize: '1rem',
                boxShadow: 'none',
                color: 'white',
                borderRadius: '0.50rem',
                marginTop: '10px',
                marginLeft: '8px',
              }}
            />
          </>
        ) : (
          <>
            {!isTechnician && (
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
            )}
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
          </>
        )}
      </div>
      {/* Approve Modal */}
      <PopUpCustomModal
        style={{
          width: '520px',
          minWidth: '520px',
          height: '260px',
          minHeight: '260px',
        }}
        visible={approveModalOpen}
        header="Approve"
        onHide={handleModalClose}
        children={
          <ApproveModal
            id={workOrderData?.id}
            amountValue={workOrderData?.cost}
            toast={toastRef}
            setVisible={() => {
              setApproveModalOpen(false)
            }}
            getWorkOrderWithPendingPayApproval={() => {
              if (getWorkOrderWithPendingPayApproval) {
                getWorkOrderWithPendingPayApproval()
              }
            }}
            getOutStandingInvoice={() => {
              if (getOutStandingInvoice) {
                getOutStandingInvoice()
              }
            }}
            closeModal={() => {
              closeModal()
              handleModalClose()
            }}
          />
        }></PopUpCustomModal>
      {/* Deny Modal */}
      <PopUpCustomModal
        style={{
          width: '520px',
          minWidth: '520px',
          height: '260px',
          minHeight: '260px',
        }}
        visible={denyModalOpen}
        header="Deny"
        onHide={handleModalClose}
        children={
          <ReasonModal
            getWorkOrderWithPendingPayApproval={() => {
              if (getWorkOrderWithPendingPayApproval) {
                getWorkOrderWithPendingPayApproval()
              }
            }}
            toast={toastRef}
            getOutStandingInvoice={() => {
              if (getOutStandingInvoice) {
                getOutStandingInvoice()
              }
            }}
            selectedRowData={workOrderData?.id}
            setVisible={() => {
              setDenyModalOpen(false)
            }}
            closeModal={() => {
              closeModal()
              handleModalClose()
            }}
          />
        }></PopUpCustomModal>
      {/* Show Image */}
      <PopUpCustomModal
        style={{
          width: '800px',
          minWidth: '800px',
          height: '580px',
          minHeight: '580px',
        }}
        visible={imageVisible}
        header="Images"
        onHide={() => setImageVisible(false)}
        children={
          <UploadImages
            handleNoteChange={handleNoteChange}
            hoveredIndex={hoveredIndex}
            handleRemoveImage={handleRemoveImage}
            setHoveredIndex={setHoveredIndex}
            handleImageChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handleImageChange(event, toastRef, setImages, setImageRequestDtoList)
            }
            setImageVisible={setImageVisible}
            imageRequestDtoList={imageRequestDtoList}
            isLoading={isLoading}
            images={images}
            toastRef={toastRef}
          />
        }></PopUpCustomModal>
      {viewPdf && (
        <PDFEditor
          fileData={formData ? formData : viewPdf?.encodedFormData}
          fileName={viewPdf?.formName ? viewPdf?.formName : viewPdf?.fileName}
          onClose={() => setViewPdf(null)}
          mooringResponse={mooringDetails || workOrderData?.mooringResponseDto}
        />
      )}
    </>
  )
}
export default AddWorkOrders
