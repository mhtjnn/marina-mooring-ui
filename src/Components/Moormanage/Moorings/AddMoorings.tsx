import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import InputComponent from '../../CommonComponent/InputComponent'
import {
  useAddMooringsMutation,
  useUpdateMooringsMutation,
} from '../../../Services/MoorManage/MoormanageApi'
import { Button } from 'primereact/button'
import { MetaData } from '../../../Type/CommonType'
import { AddMooringProps } from '../../../Type/ComponentBasedType'
import CustomSelectPositionMap from '../../Map/CustomSelectPositionMap'
import {
  BoatyardNameData,
  CustomersData,
  ServiceAreaData,
  TypeOfBoatType,
  TypeOfBottomChain,
  TypeOfChainCondition,
  TypeOfEye,
  TypeOfMooringStatus,
  TypeOfShackleSwivel,
  TypeOfSizeOfWeight,
  TypeOfWeightData,
} from '../../CommonComponent/MetaDataComponent/MetaDataApi'
import { useSelector } from 'react-redux'
import { selectCustomerId } from '../../../Store/Slice/userSlice'
import { CustomerResponse, ErrorResponse, MooringRowData } from '../../../Type/ApiTypes'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Calendar } from 'primereact/calendar'
import { Toast } from 'primereact/toast'
import { FaFileUpload } from 'react-icons/fa'
import { Dialog } from 'primereact/dialog'
import UploadImages from '../../CommonComponent/UploadImages'
import { debounce } from 'lodash'
import { formatGpsCoordinates, normalizeGpsCoordinates, validateFiles } from '../../Helper/Helper'

const AddMoorings: React.FC<AddMooringProps> = ({
  moorings,
  editMode,
  mooringRowData,
  isEditMooring,
  closeModal,
  getCustomer,
  getCustomerRecord,
  toastRef,
}) => {
  const selectedCustomerId = useSelector(selectCustomerId)
  const { getTypeOfBoatTypeData } = TypeOfBoatType()
  const { getTypeOfMooringStatusData } = TypeOfMooringStatus()
  const { getTypeOfWeightData } = TypeOfWeightData()
  const { getTypeOfChainData } = TypeOfChainCondition()
  const { getTypeOfEyeData } = TypeOfEye()
  const { getTypeOfBottomChainData } = TypeOfBottomChain()
  const { getTypeOfShackleSwivelData } = TypeOfShackleSwivel()
  const { getTypeOfSizeOfWeightData } = TypeOfSizeOfWeight()
  const { getCustomersData } = CustomersData(selectedCustomerId)
  const { getBoatYardNameData } = BoatyardNameData(selectedCustomerId)
  const { getServiceAreaData } = ServiceAreaData()

  const [type, setType] = useState<MetaData[]>([])
  const [mooringStatus, setMooringStatus] = useState<MetaData[]>([])
  const [weightData, setWeightData] = useState<MetaData[]>([])
  const [chainData, setChainData] = useState<MetaData[]>([])
  const [serviceArea, setServiceArea] = useState<MetaData[]>([])
  const [sizeOfWeight, setSizeOfWeight] = useState<MetaData[]>([])
  const [conditionOfEye, setConditionOfEye] = useState<MetaData[]>([])
  const [bottomChainCondition, setbottomChainCondition] = useState<MetaData[]>([])
  const [shackleSwivelData, setShackleSwivelData] = useState<MetaData[]>([])
  const [imageVisible, setImageVisible] = useState(false)
  const [customerName, setcustomerName] = useState<any[]>([])
  const [boatyardsName, setBoatYardsName] = useState<MetaData[]>([])
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})
  const [firstErrorField, setFirstErrorField] = useState('')
  const [gpsCoordinatesValue, setGpsCoordinatesValue] = useState<string>()
  const [isBoatyardDisabled, setIsBoatyardDisabled] = useState(false)
  const [mooringImages, setMooringImages] = useState<string[]>([])
  const [hoveredIndex, setHoveredIndex] = useState<null | number>(null)
  const [encodedImages, setEncodedImages] = useState<string[]>([])
  const [mapPositionChanged, setMapPositionChanged] = useState<boolean>(true)
  const [imageRequestDtoList, setimageRequestDtoList] = useState<
    { imageName: string; imageData: string; note: string }[]
  >([])
  const firstErrorRef = useRef<HTMLDivElement>(null)
  const [center, setCenter] = useState<any>(
    mooringRowData?.gpsCoordinates || gpsCoordinatesValue
      ? formatGpsCoordinates(mooringRowData?.gpsCoordinates || gpsCoordinatesValue)
      : [39.4926173, -117.5714859],
  )
  const [saveMoorings] = useAddMooringsMutation()
  const [updateMooring] = useUpdateMooringsMutation()
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState<any>({
    customerName: '',
    mooringNumber: '',
    harbor: '',
    waterDepth: '',
    gpsCoordinates: '',
    boatName: '',
    boatSize: '',
    boatWeight: '',
    sizeOfWeight: '',
    typeOfWeight: '',
    type: '',
    topChainCondition: '',
    conditionOfEye: '',
    bottomChainCondition: '',
    shackleSwivelCondition: '',
    pendantCondition: '',
    boatRegistration: '',
    boatType: '',
    depthAtMeanHighWater: '',
    boatYardName: '',
    note: '',
    bottomChainDate: '',
    topChainDate: '',
    conditionEyeDate: '',
    inspectionDate: '',
    serviceAreaId: '',
    imageNote: '',
    mooringStatus: '',
  })

  const fetchMetaData = useCallback(async () => {
    const { typeOfBoatTypeData } = await getTypeOfBoatTypeData()
    const { typeOfMooringStatusTypeData } = await getTypeOfMooringStatusData()
    const { typeOfWeightData } = await getTypeOfWeightData()
    const { typeOfChainData } = await getTypeOfChainData()
    const { TypeOfSizeOfWeightData } = await getTypeOfSizeOfWeightData()
    const { typeOfEyeData } = await getTypeOfEyeData()
    const { typeOfBottomChainData } = await getTypeOfBottomChainData()
    const { customersData } = await getCustomersData()
    const { boatYardName } = await getBoatYardNameData()
    const { serviceAreaData } = await getServiceAreaData()
    const { typeOfShackleSwivelData } = await getTypeOfShackleSwivelData()

    if (typeOfWeightData !== null) {
      setIsLoading(false)
      setWeightData(typeOfWeightData)
    }
    if (typeOfShackleSwivelData !== null) {
      setIsLoading(false)
      setShackleSwivelData(typeOfShackleSwivelData)
    }
    if (typeOfMooringStatusTypeData !== null) {
      setIsLoading(false)
      setMooringStatus(typeOfMooringStatusTypeData)
    }

    if (typeOfChainData !== null) {
      setIsLoading(false)
      setChainData(typeOfChainData)
    }
    if (TypeOfSizeOfWeightData !== null) {
      setIsLoading(false)
      setSizeOfWeight(TypeOfSizeOfWeightData)
    }
    if (typeOfEyeData !== null) {
      setIsLoading(false)
      setConditionOfEye(typeOfEyeData)
    }

    if (typeOfBottomChainData !== null) {
      setIsLoading(false)
      setbottomChainCondition(typeOfBottomChainData)
    }

    if (typeOfBoatTypeData !== null) {
      setIsLoading(false)
      setType(typeOfBoatTypeData)
    }

    if (customersData !== null) {
      setIsLoading(false)
      const firstLastName = customersData.map((item) => ({
        label: item.firstName + ' ' + item.lastName,
        value: item.id,
      }))
      setcustomerName(firstLastName)
    }

    if (boatYardName !== null) {
      setIsLoading(false)
      setBoatYardsName(boatYardName)
    }

    if (serviceAreaData !== null) {
      setIsLoading(false)
      setServiceArea(serviceAreaData)
    }
  }, [])

  const validateFields = () => {
    const alphanumericRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/
    const errors: { [key: string]: string } = {}
    let firstError = ''

    if (!formData?.customerName) {
      errors.customerName = 'Customer Name is required'
      if (!firstError) firstError = 'customerName'
    }

    if (!formData?.mooringNumber) {
      errors.mooringNumber = 'Mooring Number is required'
      if (!firstError) firstError = 'mooringNumber'
    } else if (!alphanumericRegex.test(formData?.mooringNumber)) {
      errors.mooringNumber = 'Mooring Number must be alphanumeric'
      if (!firstError) firstError = 'mooringNumber'
    }

    if (!formData?.mooringStatus) {
      errors.mooringStatus = 'Mooring Status id required'
      if (!firstError) firstError = 'mooringStatus'
    }
    setFirstErrorField(firstError)
    setFieldErrors(errors)

    return errors
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

  const handleInputChange = (field: string, value: any) => {
    const numberRegex = /^\d+$/

    if (field === 'boatSize') {
      if (value !== '' && !numberRegex.test(value)) {
        return
      }
    }
    if (field === 'sizeOfWeight') {
      if (value !== '' && !numberRegex.test(value)) {
        return
      }
    }
    if (field === 'boatWeight') {
      if (value !== '' && !numberRegex.test(value)) {
        return
      }
    }
    if (field === 'depthAtMeanHighWater') {
      if (value !== '' && !numberRegex.test(value)) {
        return
      }
    }
    setFormData({
      ...formData,
      [field]: value,
    })

    if (fieldErrors[field]) {
      setFieldErrors({
        ...fieldErrors,
        [field]: '',
      })
    }
  }

  const uploadImages = () => {
    setImageVisible(true)
  }

  const handleRemoveImage = (index: number) => {
    setMooringImages((prevImages) => prevImages.filter((_, i) => i !== index))
    setEncodedImages((prevEncoded) => prevEncoded.filter((_, i) => i !== index))
    setimageRequestDtoList((prevList: any[]) => prevList.filter((_, i) => i !== index))
  }

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target
    const files = Array.from(fileInput.files || [])
    if (files.length === 0) return
    const { validFiles, invalidTypeFiles, invalidSizeFiles } = validateFiles(files, toastRef, {
      min: 5120,
      max: 1048576,
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
          note: '', // Initialize with an empty note
        })
      } catch (error) {
        console.error('Error reading file:', error)
      }
    }

    setMooringImages((prevImages) => [...prevImages, ...newImageUrls])
    setEncodedImages((prevEncoded) => [...prevEncoded, ...newBase64Strings])
    setimageRequestDtoList((prevList: any) => [...prevList, ...newImageRequestDtoList])
  }

  const handleNoteChange = (index: number, note: string) => {
    setimageRequestDtoList((prevList: any[]) =>
      prevList?.map((item, i) => (i === index ? { ...item, note } : item)),
    )
  }

  const handleEditMode = () => {
    setGpsCoordinatesValue(mooringRowData?.gpsCoordinates || '')
    setFormData((prevState: any) => ({
      ...prevState,
      mooringNumber: mooringRowData?.mooringNumber || '',
      mooringName: mooringRowData?.mooringName || '',
      customerName:
        mooringRowData?.customerName ||
        mooringRowData?.customerResponseDto?.firstName +
          ' ' +
          mooringRowData?.customerResponseDto?.lastName ||
        '',
      harbor: mooringRowData?.harborOrArea || '',
      boatYardName:
        mooringRowData?.mooringStatus?.id === 1
          ? ' '
          : mooringRowData?.boatyardResponseDto?.boatyardName || '',
      boatName: mooringRowData?.boatName || '',
      boatSize: mooringRowData?.boatSize || '',
      boatType: mooringRowData?.boatType?.boatType || '',
      boatWeight: mooringRowData?.boatWeight || '',
      sizeOfWeight: mooringRowData?.sizeOfWeight || '',
      typeOfWeight: mooringRowData?.typeOfWeight?.type || '',
      conditionOfEye: mooringRowData?.eyeCondition?.condition || '',
      topChainCondition: mooringRowData?.topChainCondition?.condition || '',
      shackleSwivelCondition: mooringRowData?.shackleSwivelCondition?.condition || '',
      pendantCondition: mooringRowData?.pendantCondition || '',
      depthAtMeanHighWater: mooringRowData?.depthAtMeanHighWater || '',
      bottomChainCondition: mooringRowData?.bottomChainCondition?.condition || '',
      bottomChainDate: mooringRowData?.installBottomChainDate || '',
      topChainDate: mooringRowData?.installTopChainDate || '',
      inspectionDate: mooringRowData?.inspectionDate || '',
      conditionEyeDate: mooringRowData?.installConditionOfEyeDate || '',
      serviceAreaId: mooringRowData?.serviceAreaResponseDto?.serviceAreaName || '',
      mooringStatus: mooringRowData?.mooringStatus?.status || '',
    }))

    if (mooringRowData?.mooringStatus?.id !== 2) {
      setFormData((prevData: any) => ({
        ...prevData,
        boatYardName: '',
      }))
      setIsBoatyardDisabled(true)
    }
  }

  const SaveMoorings = async () => {
    const errors = validateFields()
    if (Object.keys(errors).length > 0) {
      if (firstErrorRef.current) {
        firstErrorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    try {
      setIsLoading(true)
      const payload = {
        customerId: formData?.customerName,
        mooringNumber: formData?.mooringNumber,
        harborOrArea: formData?.harbor,
        gpsCoordinates: gpsCoordinatesValue,
        installBottomChainDate: formData?.bottomChainDate,
        installTopChainDate: formData?.topChainDate,
        installConditionOfEyeDate: formData?.conditionEyeDate,
        boatyardId: formData?.boatYardName?.id,
        boatName: formData?.boatName,
        boatSize: formData?.boatSize,
        boatTypeId: formData?.boatType?.id,
        boatWeight: formData?.boatWeight,
        sizeOfWeight: formData?.sizeOfWeight,
        typeOfWeightId: formData?.typeOfWeight?.id,
        eyeConditionId: formData?.conditionOfEye?.id,
        topChainConditionId: formData?.topChainCondition?.id,
        bottomChainConditionId: formData?.bottomChainCondition?.id,
        shackleSwivelConditionId: formData?.shackleSwivelCondition?.id,
        pendantCondition: formData?.pendantCondition,
        depthAtMeanHighWater: formData?.depthAtMeanHighWater,
        statusId: formData?.mooringStatus?.id,
        inspectionDate: formData?.inspectionDate,
        imageRequestDtoList: imageRequestDtoList,
        serviceAreaId: formData?.serviceAreaId?.id,
      }

      const response = await saveMoorings(payload).unwrap()
      const { status, message } = response as CustomerResponse
      if (status === 200 || status === 201) {
        setIsLoading(false)
        toastRef?.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: message,
          life: 3000,
        })
        closeModal()
        getCustomer()
        if (getCustomerRecord) {
          getCustomerRecord()
        }
      } else {
        toastRef?.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        })
        setIsLoading(false)
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

  const UpdateMooring = async () => {
    try {
      setIsLoading(true)

      const createPayload = (formData: any, mooringRowData: any) => {
        const payload: Partial<MooringRowData> = {}

        if (formData?.harbor !== mooringRowData?.harborOrArea) {
          payload.harborOrArea = formData.harbor
        }
        if (formData?.boatYardName?.id !== mooringRowData?.boatyardResponseDto?.id) {
          payload.boatyardId = formData.boatYardName.id
        }
        if (formData?.boatName !== mooringRowData?.boatName) {
          payload.boatName = formData.boatName
        }
        if (formData?.boatSize !== mooringRowData?.boatSize) {
          payload.boatSize = formData.boatSize
        }
        if (formData?.boatType?.id !== mooringRowData?.boatType?.id) {
          payload.boatTypeId = formData.boatType.id
        }
        if (formData?.boatWeight !== mooringRowData?.boatWeight) {
          payload.boatWeight = formData.boatWeight
        }
        if (formData?.bottomChainDate !== mooringRowData?.installBottomChainDate) {
          payload.installBottomChainDate = formData.bottomChainDate
        }
        if (formData?.topChainDate !== mooringRowData?.installTopChainDate) {
          payload.installTopChainDate = formData.topChainDate
        }
        if (formData?.conditionEyeDate !== mooringRowData?.installConditionOfEyeDate) {
          payload.installConditionOfEyeDate = formData.conditionEyeDate
        }
        if (formData?.sizeOfWeight !== mooringRowData?.sizeOfWeight) {
          payload.sizeOfWeight = formData.sizeOfWeight
        }
        if (formData?.typeOfWeight?.id !== mooringRowData?.typeOfWeight?.id) {
          payload.typeOfWeightId = formData.typeOfWeight.id
        }
        if (formData?.conditionOfEye?.id !== mooringRowData?.eyeCondition?.id) {
          payload.eyeConditionId = formData.conditionOfEye.id
        }
        if (formData?.topChainCondition?.id !== mooringRowData?.topChainCondition?.id) {
          payload.topChainConditionId = formData.topChainCondition.id
        }
        if (formData?.bottomChainCondition?.id !== mooringRowData?.bottomChainCondition?.id) {
          payload.bottomChainConditionId = formData.bottomChainCondition.id
        }
        if (formData?.shackleSwivelCondition?.id !== mooringRowData?.shackleSwivelCondition?.id) {
          payload.shackleSwivelConditionId = formData.shackleSwivelCondition.id
        }
        if (formData?.pendantCondition !== mooringRowData?.pendantCondition) {
          payload.pendantCondition = formData.pendantCondition
        }
        if (formData?.depthAtMeanHighWater !== mooringRowData?.depthAtMeanHighWater) {
          payload.depthAtMeanHighWater = formData.depthAtMeanHighWater
        }
        if (formData?.inspectionDate !== mooringRowData?.inspectionDate) {
          payload.inspectionDate = formData.inspectionDate
        }
        if (formData?.serviceAreaId?.id !== mooringRowData?.serviceAreaResponseDto?.id) {
          payload.serviceAreaId = formData.serviceAreaId.id
        }
        if (formData?.mooringStatus?.id !== mooringRowData?.mooringStatus?.id) {
          payload.statusId = formData.mooringStatus.id
        }

        payload.gpsCoordinates = gpsCoordinatesValue
        payload.imageRequestDtoList = imageRequestDtoList
        payload.id = mooringRowData?.id
        payload.mooringNumber = mooringRowData?.mooringNumber
        payload.customerId = mooringRowData?.customerId || mooringRowData?.customerResponseDto?.id
        return payload
      }

      const editMooringPayload = createPayload(formData, mooringRowData)
      const response = await updateMooring({
        payload: editMooringPayload,
        id: mooringRowData?.id,
      }).unwrap()

      const { status, message } = response as CustomerResponse
      if (status === 200 || status === 201) {
        setIsLoading(false)
        toastRef?.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: message,
          life: 3000,
        })
        closeModal()
        getCustomer()
        if (getCustomerRecord) {
          getCustomerRecord()
        }
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

  const handlePositionChange = (lat: number, lng: number) => {
    setCenter([lat, lng])
    const formattedLat = lat.toFixed(
      (window as any).latDecimalCount
        ? (window as any).latDecimalCount > 7
          ? 7
          : (window as any).latDecimalCount
        : 7,
    )
    const formattedLng = lng.toFixed(
      (window as any).lngDecimalCount
        ? (window as any).lngDecimalCount > 7
          ? 7
          : (window as any).lngDecimalCount
        : 7,
    )
    const concatenatedValue = `${formattedLat} ${formattedLng}`
    if (mapPositionChanged) setGpsCoordinatesValue(concatenatedValue)
  }

  const handleClick = () => {
    if (editMode) {
      UpdateMooring()
    } else {
      SaveMoorings()
    }
  }

  const handleDropdownChange = (e: any) => {
    handleInputChange('mooringStatus', e.target.value)
    if (e.target.value?.id !== 2) {
      setFormData((prevData: any) => ({
        ...prevData,
        boatYardName: '',
      }))
      setIsBoatyardDisabled(true)
    } else if (e.target.value?.id === 2) {
      setIsBoatyardDisabled(false)
    }
  }

  useEffect(() => {
    fetchMetaData()
  }, [])

  useEffect(() => {
    if (editMode && moorings) {
      handleEditMode()
    }
  }, [editMode, moorings])

  useEffect(() => {
    if (gpsCoordinatesValue) {
      const coordinates = formatGpsCoordinates(gpsCoordinatesValue)
      setCenter(coordinates)
    }
  }, [gpsCoordinatesValue])

  return (
    <>
      <div className={isLoading ? 'blurred' : ''}>
        <Toast ref={toastRef} />

        <>
          {/* Row 1 */}
          <div className="flex gap-6 mt-3">
            {/* Customer Name */}
            <div>
              <span className="font-medium text-sm text-[#000000]">
                <div className="flex gap-1">
                  Customer Name
                  <p className="text-red-600">*</p>
                </div>
              </span>
              <div className="mt-2" ref={firstErrorField === 'customerName' ? firstErrorRef : null}>
                <Dropdown
                  value={formData?.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  options={customerName}
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select"
                  editable
                  disabled={isLoading || isEditMooring}
                  style={{
                    width: '230px',
                    height: '32px',
                    border: fieldErrors.customerName ? '1px solid red' : '1px solid #D5E1EA',
                    borderRadius: '0.50rem',
                    fontSize: '0.8rem',
                  }}
                />
                <p id="customerName">
                  {fieldErrors.customerName && (
                    <small className="p-error">{fieldErrors.customerName}</small>
                  )}
                </p>
              </div>
            </div>
            {/* Mooring Number */}
            <div>
              <span className="font-medium text-sm text-[#000000]">
                <div className="flex gap-1">
                  Mooring Number
                  <p className="text-red-600">*</p>
                </div>
              </span>
              <div
                className="mt-2"
                ref={firstErrorField === 'mooringNumber' ? firstErrorRef : null}>
                <InputComponent
                  value={formData?.mooringNumber}
                  onChange={(e) => handleInputChange('mooringNumber', e.target.value)}
                  disabled={isLoading || isEditMooring}
                  style={{
                    width: '230px',
                    height: '32px',
                    border: fieldErrors.mooringNumber ? '1px solid red' : '1px solid #D5E1EA',
                    borderRadius: '0.50rem',
                    fontSize: '0.8rem',
                    paddingLeft: '0.5rem',
                  }}
                />
                <p id="mooringNumber">
                  {fieldErrors.mooringNumber && (
                    <small className="p-error">{fieldErrors.mooringNumber}</small>
                  )}
                </p>
              </div>
            </div>
            {/* Mooring Status */}
            <div>
              <div>
                <span className="font-medium text-sm text-[#000000]">
                  <div className="flex gap-1">
                    Mooring Status <p className="text-red-600">*</p>
                  </div>
                </span>
              </div>
              <div className="mt-2">
                <Dropdown
                  value={formData?.mooringStatus}
                  onChange={handleDropdownChange}
                  options={mooringStatus}
                  optionLabel="status"
                  placeholder="Select"
                  editable
                  disabled={isLoading}
                  style={{
                    width: '230px',
                    height: '32px',
                    border: fieldErrors.mooringStatus ? '1px solid red' : '1px solid #D5E1EA',
                    borderRadius: '0.50rem',
                    fontSize: '0.8rem',
                  }}
                />
                <p id="mooringStatus">
                  {fieldErrors.mooringStatus && (
                    <small className="p-error">{fieldErrors.mooringStatus}</small>
                  )}
                </p>
              </div>
            </div>
          </div>
          {/* Row 2 */}
          <div className="flex gap-6 mt-3">
            {/* Service area */}
            <div>
              <span className="font-medium text-sm text-[#000000]">
                <div className="flex gap-1">Service Area</div>
              </span>
              <div className="mt-2">
                <Dropdown
                  value={formData?.serviceAreaId}
                  onChange={(e) => handleInputChange('serviceAreaId', e.value)}
                  options={serviceArea}
                  optionLabel="serviceAreaName"
                  placeholder="Select"
                  editable
                  disabled={isLoading}
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
            {/* Boatyard */}
            <div>
              <span className="font-medium text-sm text-[#000000]">
                <div className="flex gap-1">Boatyard</div>
              </span>
              <div className="mt-2">
                <Dropdown
                  value={formData?.boatYardName}
                  onChange={(e) => handleInputChange('boatYardName', e.target.value)}
                  options={boatyardsName}
                  optionLabel="boatyardName"
                  placeholder="Select"
                  editable
                  disabled={isLoading || isBoatyardDisabled}
                  style={{
                    width: '230px',
                    height: '32px',
                    border: '1px solid #D5E1EA',
                    borderRadius: '0.50rem',
                    fontSize: '0.8rem',
                    cursor: isBoatyardDisabled ? 'not-allowed' : 'pointer',
                  }}
                />
              </div>
            </div>
            {/* Images */}
            <div className="">
              <span className="font-medium text-sm text-[#000000]">
                <div className="flex gap-1"> Images</div>
              </span>
              <div className="mt-2">
                <div />
                <div
                  style={{
                    width: '230px',
                    height: '32px',
                    border: '1px solid #D5E1EA',
                    borderRadius: '0.50rem',
                    fontSize: '0.8rem',
                    paddingLeft: '0.5rem',
                    cursor: 'pointer',
                  }}>
                  <div onClick={uploadImages} className="flex gap-3 text-center">
                    <FaFileUpload
                      style={{ fontSize: '22px', color: '#0098FF', marginTop: '3px' }}
                    />
                    <div className="border-r-2 border-blue-100  h-[30px]"></div>
                    <span className="pl-4 mt-1"> Upload Image </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Row 3 */}
          <div className="flex gap-6 mt-3">
            {isLoading && (
              <ProgressSpinner
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '45%',
                  transform: 'translate(-50%, -50%)',
                  width: '50px',
                  height: '50px',
                  zIndex: 4,
                }}
                strokeWidth="4"
              />
            )}
            {/* Boat Name */}
            <div>
              <span className="font-medium text-sm text-[#000000]">
                <div className="flex gap-1">Boat Name</div>
              </span>
              <div className="mt-2">
                <InputComponent
                  value={formData?.boatName}
                  onChange={(e) => handleInputChange('boatName', e.target.value)}
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
            {/* G.P.S Coordinates */}
            <div>
              <span className="font-medium text-sm text-[#000000]">
                <div className="flex gap-1">G.P.S Coordinates</div>
              </span>
              <div className="mt-2">
                <InputComponent
                  {...(mapPositionChanged ? { value: gpsCoordinatesValue } : '')}
                  onFocus={() => setMapPositionChanged(false)}
                  onBlur={() => setMapPositionChanged(true)}
                  onChange={debounce((e) => {
                    let inputValue = e.target.value
                    inputValue = normalizeGpsCoordinates(inputValue)
                    setGpsCoordinatesValue(inputValue)
                    const coordinates = inputValue.trim().split(' ')
                    let latDecimalCount = 0
                    let lngDecimalCount = 0
                    if (coordinates.length === 2) {
                      const [lat, lng] = coordinates
                      latDecimalCount = (lat.split('.')[1] || '').length
                      lngDecimalCount = (lng.split('.')[1] || '').length
                    }
                    ;(window as any).latDecimalCount = latDecimalCount
                    ;(window as any).lngDecimalCount = lngDecimalCount
                    setFieldErrors((prevErrors) => ({ ...prevErrors, gpsCoordinatesValue: '' }))
                  })}
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
            {/* Boat Size */}
            <div>
              <span className="font-medium text-sm text-[#000000]">
                <div className="flex gap-1">Boat Size (in feet)</div>
              </span>
              <div className="mt-2">
                <InputText
                  type="text"
                  value={formData?.boatSize}
                  onChange={(e) => handleInputChange('boatSize', e.target.value)}
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
          </div>
          {/* Row 4 */}
          <div className="flex gap-6 mt-3">
            {/* Boat Type */}
            <div>
              <div>
                <span className="font-medium text-sm text-[#000000]">
                  <div className="flex gap-1">Boat Type</div>
                </span>
              </div>

              <div className="mt-2">
                <Dropdown
                  value={formData?.boatType}
                  onChange={(e) => handleInputChange('boatType', e.target.value)}
                  options={type}
                  optionLabel="boatType"
                  editable
                  disabled={isLoading}
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
            {/* Boat Weight */}
            <div>
              <span className="font-medium text-sm text-[#000000]">
                <div className="flex gap-1">Boat Weight</div>
              </span>
              <div className="mt-2">
                <InputComponent
                  value={formData?.boatWeight}
                  type="text"
                  onChange={(e) => handleInputChange('boatWeight', e.target.value)}
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
            {/* Inspection Date */}
            <div>
              <div>
                <span className="font-medium text-sm text-[#000000]">
                  <div className="flex gap-1">Inspection Date</div>
                </span>
              </div>

              <div className="mt-2">
                <Calendar
                  value={parseDate(formData.inspectionDate)}
                  onChange={(e) => handleInputChange('inspectionDate', formatDate(e.target.value))}
                  dateFormat="mm/dd/yy"
                  style={{
                    width: '230px',
                    height: '32px',
                    border: '1px solid #D5E1EA',
                    borderRadius: '0.50rem',
                    fontSize: '0.8rem',
                    padding: '0.5rem',
                  }}
                />
              </div>
            </div>
          </div>
          {/* Row 5 */}
          <div className="flex gap-6 mt-3">
            {/* Type of Weight */}
            <div>
              <div>
                <span className="font-medium text-sm text-[#000000]">
                  <div className="flex gap-1">Type of Weight</div>
                </span>
              </div>

              <div className="mt-2">
                <Dropdown
                  value={formData?.typeOfWeight}
                  onChange={(e) => handleInputChange('typeOfWeight', e.value)}
                  options={weightData}
                  optionLabel="type"
                  placeholder="Select"
                  editable
                  disabled={isLoading}
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
            {/* Size of Weight */}
            <div>
              <div>
                <span className="font-medium text-sm text-[#000000]">
                  <div className="flex gap-1">Size of Weight</div>
                </span>
              </div>

              <div className="mt-2">
                <InputComponent
                  value={formData?.sizeOfWeight}
                  onChange={(e) => handleInputChange('sizeOfWeight', e.target.value)}
                  type="text"
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
            {/* Depth at Mean High Water */}
            <div>
              <div>
                <span className="font-medium text-sm text-[#000000]">
                  <div className="flex gap-1">Depth at Mean High Water</div>
                </span>
              </div>

              <div className="mt-2">
                <InputText
                  value={formData?.depthAtMeanHighWater}
                  type="text"
                  onChange={(e) => handleInputChange('depthAtMeanHighWater', e.target.value)}
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
          </div>
          {/* Row 6 */}
          <div className="flex gap-6 mt-3">
            {/* Top Chain Condition */}
            <div>
              <div>
                <span className="font-medium text-sm text-[#000000]">
                  <div className="flex gap-1">Top Chain Condition</div>
                </span>
              </div>

              <div className="mt-2">
                <Dropdown
                  value={formData?.topChainCondition}
                  onChange={(e) => handleInputChange('topChainCondition', e.value)}
                  options={chainData}
                  optionLabel="condition"
                  placeholder="Select"
                  editable
                  disabled={isLoading}
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
            {/* Top Chain Condition Install Date */}
            <div>
              <div>
                <span className="font-medium text-sm text-[#000000]">
                  <div className="flex gap-1">
                    Top Chain Condition <span style={{ fontSize: '0.6rem' }}> (install date)</span>
                  </div>
                </span>
              </div>

              <div className="mt-2">
                <Calendar
                  value={parseDate(formData?.topChainDate)}
                  onChange={(e) => handleInputChange('topChainDate', formatDate(e.target.value))}
                  dateFormat="mm/dd/yy"
                  style={{
                    width: '230px',
                    height: '32px',
                    border: '1px solid #D5E1EA',
                    borderRadius: '0.50rem',
                    fontSize: '0.8rem',
                    padding: '0.5rem',
                  }}
                />
              </div>
            </div>
            {/* Bottom Chain Condition */}
            <div>
              <div>
                <span className="font-medium text-sm text-[#000000]">
                  <div className="flex gap-1">Bottom Chain Condition</div>
                </span>
              </div>

              <div className="mt-2">
                <Dropdown
                  value={formData?.bottomChainCondition}
                  onChange={(e) => handleInputChange('bottomChainCondition', e.value)}
                  options={bottomChainCondition}
                  optionLabel="condition"
                  placeholder="Select"
                  editable
                  disabled={isLoading}
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
          </div>
          {/* Row 7 */}
          <div className="flex gap-6 mt-3">
            {/* Bottom Chain Condition Install Date */}
            <div>
              <div>
                <span className="font-medium text-sm text-[#000000]">
                  <div className="flex gap-1">
                    Bottom Chain Condition
                    <span style={{ fontSize: '0.6rem' }}> (install date)</span>
                  </div>
                </span>
              </div>

              <div className="mt-2">
                <Calendar
                  value={parseDate(formData.bottomChainDate)}
                  onChange={(e) => handleInputChange('bottomChainDate', formatDate(e.target.value))}
                  dateFormat="mm/dd/yy"
                  style={{
                    width: '230px',
                    height: '32px',
                    border: '1px solid #D5E1EA',
                    borderRadius: '0.50rem',
                    fontSize: '0.8rem',
                    padding: '0.5rem',
                  }}
                />
              </div>
            </div>
            {/* Condition of Eye */}
            <div>
              <div>
                <span className="font-medium text-sm text-[#000000]">
                  <div className="flex gap-1">Condition of Eye</div>
                </span>
              </div>
              <div className="mt-2">
                <Dropdown
                  value={formData?.conditionOfEye}
                  onChange={(e) => handleInputChange('conditionOfEye', e.value)}
                  options={conditionOfEye}
                  optionLabel="condition"
                  placeholder="Select"
                  editable
                  disabled={isLoading}
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
            {/* Condition of Eye Install Date */}
            <div>
              <div>
                <span className="font-medium text-sm text-[#000000]">
                  <div className="flex gap-1">
                    Condition of Eye <span style={{ fontSize: '0.6rem' }}> (install date)</span>
                  </div>
                </span>
              </div>
              <div className="mt-2">
                <Calendar
                  value={parseDate(formData.conditionEyeDate)}
                  onChange={(e) =>
                    handleInputChange('conditionEyeDate', formatDate(e.target.value))
                  }
                  dateFormat="mm/dd/yy"
                  style={{
                    width: '230px',
                    height: '32px',
                    border: '1px solid #D5E1EA',
                    borderRadius: '0.50rem',
                    fontSize: '0.8rem',
                    padding: '0.5rem',
                  }}
                />
              </div>
            </div>
          </div>
          {/* Row 8 */}
          <div className="flex gap-6">
            <div>
              {/* Pendant Condition */}
              <div className="mt-3">
                <span className="font-medium text-sm text-[#000000]">
                  <div className="flex gap-1">Pendant Condition</div>
                </span>
                <div className="mt-2">
                  <InputComponent
                    value={formData?.pendantCondition}
                    onChange={(e) => handleInputChange('pendantCondition', e.target.value)}
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
              {/* Shackle, Swivel Condition */}
              <div className="mt-3">
                <span className="font-medium text-sm text-[#000000]">
                  <div className="flex gap-1">Shackle, Swivel Condition</div>
                </span>
                <div className="mt-2">
                  <Dropdown
                    value={formData?.shackleSwivelCondition}
                    onChange={(e) => handleInputChange('shackleSwivelCondition', e.value)}
                    options={shackleSwivelData}
                    optionLabel="condition"
                    placeholder="Select"
                    editable
                    disabled={isLoading}
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
            </div>

            <div className="mt-3">
              <div>
                <span className="font-medium text-sm text-[#000000]">Pin on Map</span>
              </div>
              <div
                className="mt-2"
                style={{
                  height: '300px',
                  width: '480px',
                  overflow: 'hidden',
                }}>
                <CustomSelectPositionMap
                  onPositionChange={handlePositionChange}
                  zoomLevel={15}
                  center={center}
                  mooringStatus={formData?.mooringStatus?.id || mooringRowData?.mooringStatus?.id}
                />
              </div>
            </div>
          </div>
        </>
      </div>
      <div
        className={`"flex gap-6 bottom-2 absolute left-6" ${isLoading ? 'blurred' : ''}`}
        style={{
          width: '100%',
          height: '80px',
          backgroundColor: 'white',
          padding: '0 12px',
          bottom: '0px',
        }}>
        <Button
          onClick={handleClick}
          label={'Save'}
          style={{
            width: '89px',
            height: '42px',
            backgroundColor: '#0098FF',
            cursor: 'pointer',
            fontWeight: 'bolder',
            fontSize: '1rem',
            boxShadow: 'none',
            color: 'white',
            borderRadius: '0.50rem',
            marginTop: '10px',
          }}
        />
        <Button
          onClick={closeModal}
          label={'Back'}
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
          height: '650px',
          minHeight: '650px',
          borderRadius: '1rem',
          fontWeight: '400',
          cursor: 'alias',
        }}
        draggable={false}
        visible={imageVisible}
        onHide={() => setImageVisible(false)}
        header={'Images'}>
        <UploadImages
          handleNoteChange={handleNoteChange}
          hoveredIndex={hoveredIndex}
          handleRemoveImage={handleRemoveImage}
          setHoveredIndex={setHoveredIndex}
          handleImageChange={handleImageChange}
          setImageVisible={setImageVisible}
          imageRequestDtoList={imageRequestDtoList}
          isLoading={isLoading}
          images={mooringImages}
        />
      </Dialog>
    </>
  )
}

export default AddMoorings
