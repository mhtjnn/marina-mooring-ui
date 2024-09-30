import React, { useCallback, useEffect, useRef, useState } from 'react'
import InputComponent from '../../CommonComponent/InputComponent'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import {
  useAddCustomerMutation,
  useUpdateCustomerMutation,
  useUpdateMooringsMutation,
} from '../../../Services/MoorManage/MoormanageApi'
import { Button } from 'primereact/button'
import { CustomerDataProps } from '../../../Type/ComponentBasedType'
import { Country, MetaData, State } from '../../../Type/CommonType'
import { CustomerResponse, ErrorResponse, MooringRowData } from '../../../Type/ApiTypes'
import {
  CountriesData,
  StatesData,
  TypeOfBoatType,
  TypeOfWeightData,
  TypeOfChainCondition,
  TypeOfEye,
  TypeOfBottomChain,
  TypeOfShackleSwivel,
  BoatyardNameData,
  CustomersType,
  ServiceAreaData,
  TypeOfMooringStatus,
} from '../../CommonComponent/MetaDataComponent/MetaDataApi'
import { useSelector } from 'react-redux'
import { selectCustomerId } from '../../../Store/Slice/userSlice'
import CustomSelectPositionMap from '../../Map/CustomSelectPositionMap'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Calendar } from 'primereact/calendar'
import { InputTextarea } from 'primereact/inputtextarea'
import { Toast } from 'primereact/toast'
import { FaFileUpload } from 'react-icons/fa'
import { Dialog } from 'primereact/dialog'
import { AiOutlineDelete } from 'react-icons/ai'
import { NAME_REGEX, NUMBER_REGEX } from '../../Utils/RegexUtils'
import UploadImages from '../../CommonComponent/UploadImages'
import { debounce } from 'lodash'
import { validateFiles } from '../../Helper/Helper'

const AddCustomer: React.FC<CustomerDataProps> = ({
  customer,
  mooringRowData,
  editMode,
  editCustomerMode,
  editMooringMode,
  closeModal,
  getCustomer,
  // toastRef,
  getCustomerRecord,
}) => {
  const selectedCustomerId = useSelector(selectCustomerId)
  const [country, setCountry] = useState<any>()
  const [state, setState] = useState<any>()
  const [selectedCustomerType, setSelectedCustomerType] = useState<any>()
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [pinCode, setPinCode] = useState<string>('')
  const [countriesData, setCountriesData] = useState<Country[]>()
  const [statesData, setStatesData] = useState<State[]>()
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [type, setType] = useState<MetaData[]>([])
  const [weightData, setWeightData] = useState<MetaData[]>([])
  const [chainData, setChainData] = useState<MetaData[]>([])
  const [serviceArea, setServiceArea] = useState<MetaData[]>([])
  const [conditionOfEye, setConditionOfEye] = useState<MetaData[]>([])
  const [customerType, setCustomerType] = useState<MetaData[]>([])
  const [bottomChainCondition, setBottomChainCondition] = useState<MetaData[]>([])
  const [shackleSwivelData, setShackleSwivelData] = useState<MetaData[]>([])
  const [boatyardName, setBoatyardName] = useState<MetaData[]>([])
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})
  const [gpsCoordinatesValue, setGpsCoordinatesValue] = useState<string>()
  const [checkedMooring, setCheckedMooring] = useState(false)
  const [checkedDock, setCheckedDock] = useState(false)
  const [customerImageVisible, setCustomerImageVisible] = useState(false)
  const [mooringImageVisible, setMooringImageVisible] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<null | number>(null)
  const [mooringStatus, setMooringStatus] = useState<MetaData[]>([])
  const [mapPositionChanged, setMapPositionChanged] = useState<boolean>(true)

  const getFormattedCoordinate = (gpsCoordinatesValue: any) => {
    try {
      gpsCoordinatesValue = gpsCoordinatesValue.replaceAll(',', ' ').replace(/\s+/g, ' ').trim()

      let coordinates = gpsCoordinatesValue?.split(' ')

      if (coordinates.length !== 2) {
        coordinates = coordinates.filter((coordinate: any) => coordinate)
      }

      let [lat, long]: any = coordinates

      if (lat?.split('.').length > 2) {
        const [degree, minute, second]: any = lat?.split('.').map((num: any) => parseInt(num))
        lat = degree + minute / 60 + second / 3600
      }

      if (long?.split('.').length > 2) {
        const [degree, minute, second]: any = long?.split('.').map((num: any) => parseInt(num))
        long = degree + minute / 60 + second / 3600
      }

      if (!(isNaN(lat) || isNaN(long))) {
        return [+lat, +long]
      }
    } catch (error) {
      console.log('Error In Setting Center', error)
      return [39.4926173, -117.5714859]
    }
  }

  const [center, setCenter] = useState<any>(
    mooringRowData?.gpsCoordinates || gpsCoordinatesValue
      ? getFormattedCoordinate(mooringRowData?.gpsCoordinates || gpsCoordinatesValue)
      : [39.4926173, -117.5714859],
  )
  const [firstErrorField, setFirstErrorField] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [customerImages, setCustomerImages] = useState<string[]>([])
  const [encodedCustomerImages, setEncodedCustomerImages] = useState<string[]>([])
  const [customerImageRequestDtoList, setCustomerImageRequestDtoList] = useState<any[]>([])

  const [mooringImages, setMooringImages] = useState<string[]>([])
  const [encodedMooringImages, setEncodedMooringImages] = useState<string[]>([])
  const [mooringImageRequestDtoList, setMooringImageRequestDtoList] = useState<any[]>([])
  const [isBoatyardDisabled, setIsBoatyardDisabled] = useState(false)
  const [formData, setFormData] = useState<any>({
    mooringNumber: '',
    mooringName: '',
    customerName: '',
    harbor: '',
    waterDepth: '',
    gpsCoordinates: '',
    boatyardName: '',
    boatName: '',
    boatSize: '',
    boatType: '',
    boatWeight: '',
    sizeOfWeight: '',
    typeOfWeight: '',
    conditionOfEye: '',
    topChainCondition: '',
    bottomChainCondition: '',
    shackleSwivelCondition: '',
    pendantCondition: '',
    boatRegistration: '',
    depthAtMeanHighWater: '',
    status: 0,
    note: '',
    inspectionDate: '',
    serviceAreaId: '',
    imagesNote: '',
    mooringStatus: '',
  })

  const { getStatesData } = StatesData(country?.id || customer?.countryResponseDto?.id)
  const { getTypeOfBoatTypeData } = TypeOfBoatType()
  const { getTypeOfWeightData } = TypeOfWeightData()
  const { getTypeOfChainData } = TypeOfChainCondition()
  const { getTypeOfEyeData } = TypeOfEye()
  const { getTypeOfBottomChainData } = TypeOfBottomChain()
  const { getTypeOfShackleSwivelData } = TypeOfShackleSwivel()
  const { getBoatYardNameData } = BoatyardNameData(selectedCustomerId)
  const { getServiceAreaData } = ServiceAreaData()
  const { getCountriesData } = CountriesData()
  const { getCustomersType } = CustomersType()
  const [addCustomer] = useAddCustomerMutation()
  const [updateCustomer] = useUpdateCustomerMutation()
  const [updateMooring] = useUpdateMooringsMutation()
  const { getTypeOfMooringStatusData } = TypeOfMooringStatus()

  const toastRef = useRef<Toast>(null)

  const handlePositionChange = (lat: number, lng: number) => {
    setCenter([lat, lng])
    const formattedLat = lat.toFixed(6)
    const formattedLng = lng.toFixed(6)
    const concatenatedValue = `${formattedLat} ${formattedLng}`
    setGpsCoordinatesValue(concatenatedValue)
  }

  const handleFocus = () => {
    const errorFields = document.querySelectorAll('.error')
    if (errorFields.length > 0) {
      errorFields[0].scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      const passwordMessage = document.getElementById('mooring')
      if (passwordMessage) {
        passwordMessage.style.display = 'block'
        passwordMessage.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setImages: React.Dispatch<React.SetStateAction<string[]>>,
    setEncodedImages: React.Dispatch<React.SetStateAction<string[]>>,
    setImageRequestDtoList: React.Dispatch<React.SetStateAction<any[]>>,
    toastRef: any,
  ) => {
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
              resolve(reader.result.split(',')[1])
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
    setImages((prevImages) => [...prevImages, ...newImageUrls])
    setEncodedImages((prevEncoded) => [...prevEncoded, ...newBase64Strings])
    setImageRequestDtoList((prevList) => [...prevList, ...newImageRequestDtoList])
  }

  const handleCustomerImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleImageChange(
      event,
      setCustomerImages,
      setEncodedCustomerImages,
      setCustomerImageRequestDtoList,
      toastRef,
    )
  }

  const handleMooringImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleImageChange(
      event,
      setMooringImages,
      setEncodedMooringImages,
      setMooringImageRequestDtoList,
      toastRef,
    )
  }

  const handleRemoveCustomerImage = (index: number) => {
    setCustomerImages((prevImages) => prevImages.filter((_, i) => i !== index))
    setEncodedCustomerImages((prevEncoded) => prevEncoded.filter((_, i) => i !== index))
    setCustomerImageRequestDtoList((prevList: any[]) => prevList.filter((_, i) => i !== index))
  }

  const handleRemoveMooringImage = (index: number) => {
    setMooringImages((prevImages) => prevImages.filter((_, i) => i !== index))
    setEncodedMooringImages((prevEncoded) => prevEncoded.filter((_, i) => i !== index))
    setMooringImageRequestDtoList((prevList: any[]) => prevList.filter((_, i) => i !== index))
  }

  const handleCustomerNoteChange = (index: number, note: string) => {
    setCustomerImageRequestDtoList((prevList: any[]) =>
      prevList.map((item, i) => (i === index ? { ...item, note } : item)),
    )
  }

  const handleMooringNoteChange = (index: number, note: string) => {
    setMooringImageRequestDtoList((prevList: any[]) =>
      prevList.map((item, i) => (i === index ? { ...item, note } : item)),
    )
  }

  const validateFields = () => {
    const errors: { [key: string]: string } = {}
    let firstError = ''
    if (!firstName) {
      errors.firstName = 'First name is required'
      firstError = 'firstName'
    } else if (!NAME_REGEX.test(firstName)) {
      errors.firstName = 'First name must only contain letters'
      firstError = 'firstName'
    } else if (firstName.length < 3) {
      errors.firstName = 'First name must be at least 3 characters long'
      firstError = 'firstName'
    }
    if (!lastName) {
      errors.lastName = 'Last name is required'
      if (!firstError) firstError = 'lastName'
    } else if (!NAME_REGEX.test(lastName)) {
      errors.lastName = 'Last name must only contain letters'
      firstError = 'lastName'
    } else if (lastName.length < 3) {
      errors.lastName = 'Last name must be at least 3 characters long'
      firstError = 'lastName'
    }
    if (checkedMooring) {
      if (!formData?.mooringNumber) {
        errors.mooringNumber = 'Mooring Number is required'
      }
      if (!formData?.mooringStatus) {
        errors.mooringStatus = 'Mooring Status is required'
      }
    }

    setFirstErrorField(firstError)
    setFieldErrors(errors)
    return errors
  }

  const parseDate = (dateString: any) => {
    if (!dateString) return null
    const [month, day, year] = dateString?.split('/')
    return new Date(year, month - 1, day)
  }

  const formatDate = (date: any) => {
    if (!date) return null
    const d = new Date(date)
    const month = ('0' + (d.getMonth() + 1)).slice(-2)
    const day = ('0' + d.getDate()).slice(-2)
    const year = d.getFullYear()
    return `${month}/${day}/${year}`
  }

  const handleInputChange = (field: string, value: any) => {
    if (
      field === 'boatSize' ||
      field === 'sizeOfWeight' ||
      field === 'boatWeight' ||
      field === 'depthAtMeanHighWater'
    ) {
      if (value !== '' && !NUMBER_REGEX.test(value)) {
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

  const handleInputChangeCustomer = (fieldName: string, value: any) => {
    if (fieldName === 'phone') {
      value = value.replace(/[^0-9+]/g, '')
    }
    switch (fieldName) {
      case 'firstName':
        setFirstName(value)
        break
      case 'lastName':
        setLastName(value)
        break
      case 'phone':
        setPhone(value)
        break
      case 'email':
        setEmail(value)
        break
      case 'address':
        setAddress(value)
        break
      case 'city':
        setCity(value)
        break
      case 'pinCode':
        setPinCode(value)
        break
      case 'state':
        setState(value)
        break
      case 'country':
        setCountry(value)
        break
      case 'CustomerType':
        setSelectedCustomerType(value)
        break
      default:
        setFormData({ ...formData, [fieldName]: value })
        break
    }
    setFieldErrors((prevErrors) => ({ ...prevErrors, [fieldName]: '' }))
  }

  const handleEditMode = () => {
    setFirstName(customer?.firstName || '')
    setLastName(customer?.lastName || '')
    setPhone(customer?.phone || '')
    setEmail(customer?.emailAddress || '')
    setAddress(customer?.address || '')
    setCity(customer?.city || '')
    setPinCode(customer?.zipCode || '')
    setSelectedCustomerType(customer?.customerTypeDto?.type)
    setState(customer?.stateResponseDto?.name || undefined)
    setCountry(customer?.countryResponseDto?.name || undefined)
    setGpsCoordinatesValue(mooringRowData?.gpsCoordinates || '')
    setCheckedDock(selectedCustomerType === 'Dock')
    setFormData((prevState: any) => ({
      ...prevState,
      mooringNumber: mooringRowData?.mooringNumber || '',
      mooringName: mooringRowData?.mooringName || '',
      harbor: mooringRowData?.harborOrArea || '',
      boatYardName: mooringRowData?.boatyardResponseDto?.boatyardName || '',
      boatName: mooringRowData?.boatName || '',
      boatSize: mooringRowData?.boatSize || '',
      type: mooringRowData?.boatType?.boatType || '',
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
      conditionEyeDate: mooringRowData?.installConditionOfEyeDate || '',
      inspectionDate: mooringRowData?.inspectionDate || '',
      serviceAreaId: mooringRowData?.serviceAreaResponseDto?.serviceAreaName || '',
      note: customer?.notes || '',
      mooringStatus: mooringRowData?.mooringStatus?.status || '',
    }))
  }

  const SaveCustomer = async () => {
    const errors = validateFields()
    if (Object.keys(errors).length > 0) {
      setCheckedMooring(false)
      return
    }
    let payload
    setIsLoading(true)
    if (checkedMooring) {
      payload = {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        address: address,
        city: city,
        notes: formData.note,
        stateId: state?.id,
        countryId: country?.id,
        imageRequestDtoList: customerImageRequestDtoList,
        customerTypeId: selectedCustomerType === 'Dock' ? 5 : selectedCustomerType?.id,
        ...(email && { emailAddress: email }),
        ...(pinCode && { zipCode: pinCode }),
        mooringRequestDtoList: [
          {
            customerId: formData?.customerName,
            addDock: checkedDock,
            mooringNumber: formData?.mooringNumber,
            harborOrArea: formData?.harbor,
            gpsCoordinates: gpsCoordinatesValue,
            installBottomChainDate: formData?.bottomChainDate,
            installTopChainDate: formData?.topChainDate,
            installConditionOfEyeDate: formData?.conditionEyeDate,
            boatyardId: formData?.boatYardName?.id,
            boatName: formData?.boatName,
            boatSize: formData?.boatSize,
            boatTypeId: formData?.type,
            boatWeight: formData?.boatWeight,
            sizeOfWeight: formData?.sizeOfWeight,
            typeOfWeightId: formData?.typeOfWeight?.id,
            eyeConditionId: formData?.conditionOfEye?.id,
            topChainConditionId: formData?.topChainCondition?.id,
            bottomChainConditionId: formData?.bottomChainCondition?.id,
            shackleSwivelConditionId: formData?.shackleSwivelCondition?.id,
            pendantConditionId: formData?.pendantCondition,
            depthAtMeanHighWater: formData?.depthAtMeanHighWater,
            imageRequestDtoList: mooringImageRequestDtoList,
            statusId: formData?.mooringStatus?.id,
          },
        ],
      }
    } else {
      payload = {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        address: address,
        city: city,
        notes: formData.note,
        stateId: state?.id,
        countryId: country?.id,
        imageRequestDtoList: customerImageRequestDtoList,
        customerTypeId: selectedCustomerType === 'Dock' ? 5 : selectedCustomerType?.id,
        ...(email && { emailAddress: email }),
        ...(pinCode && { zipCode: pinCode }),
      }
    }

    try {
      const response = await addCustomer(payload).unwrap()
      const { status, message } = response as CustomerResponse
      if (status === 200 || status === 201) {
        closeModal()
        getCustomer()
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
      const { data, message } = error as ErrorResponse
      setIsLoading(false)
      toastRef?.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: data?.message,
        life: 3000,
      })
    }
  }

  const UpdateCustomer = async () => {
    const errors = validateFields()
    if (Object.keys(errors).length > 0) {
      return
    }
    try {
      setIsLoading(true)
      const editCustomerPayload = {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        address: address,
        city: city,
        stateId: state?.id,
        countryId: country?.id,
        imageRequestDtoList: customerImageRequestDtoList,
        customerOwnerId: selectedCustomerId,
        customerTypeId: selectedCustomerType === 'Dock' ? 5 : selectedCustomerType?.id,
        notes: formData?.note,
        ...(email && { emailAddress: email }),
        ...(pinCode && { zipCode: pinCode }),
      }
      const response = await updateCustomer({
        payload: editCustomerPayload,
        id: customer?.id,
      }).unwrap()
      const { status, message } = response as CustomerResponse
      if (status === 200 || status === 201) {
        setIsLoading(false)
        closeModal()
        getCustomer()
        if (getCustomerRecord) {
          getCustomerRecord()
        }
        toastRef?.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: message,
          life: 3000,
        })
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
      setIsLoading(false)
      const { data } = error as ErrorResponse
      toastRef?.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: data.message,
        life: 3000,
      })
    }
  }

  const UpdateMooring = async () => {
    const errors = validateFields()
    if (Object.keys(errors).length > 0) {
      return
    }
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
        if (formData?.type?.id !== mooringRowData?.boatType?.id) {
          payload.boatTypeId = formData.type.id
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
        payload.imageRequestDtoList = mooringImageRequestDtoList
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

  const fetchDataAndUpdate = useCallback(async () => {
    if (editCustomerMode || !editMode) {
      const { countriesData } = await getCountriesData()
      const { customersType } = await getCustomersType()
      if (countriesData !== null) {
        setIsLoading(false)
        setCountriesData(countriesData)
      }
      if (customersType !== null) {
        setIsLoading(false)
        setCustomerType(customersType)
      }
    }

    if (editMooringMode || !editMode) {
      const { typeOfBoatTypeData } = await getTypeOfBoatTypeData()
      const { typeOfWeightData } = await getTypeOfWeightData()
      const { typeOfChainData } = await getTypeOfChainData()
      const { typeOfEyeData } = await getTypeOfEyeData()
      const { typeOfBottomChainData } = await getTypeOfBottomChainData()
      const { typeOfShackleSwivelData } = await getTypeOfShackleSwivelData()
      const { boatYardName } = await getBoatYardNameData()
      const { serviceAreaData } = await getServiceAreaData()
      const { typeOfMooringStatusTypeData } = await getTypeOfMooringStatusData()

      if (typeOfBoatTypeData !== null) {
        setIsLoading(false)
        setType(typeOfBoatTypeData)
      }
      if (typeOfWeightData !== null) {
        setIsLoading(false)
        setWeightData(typeOfWeightData)
      }
      if (typeOfChainData !== null) {
        setIsLoading(false)
        setChainData(typeOfChainData)
      }
      if (serviceAreaData !== null) {
        setIsLoading(false)
        setServiceArea(serviceAreaData)
      }
      if (typeOfEyeData !== null) {
        setIsLoading(false)
        setConditionOfEye(typeOfEyeData)
      }

      if (typeOfBottomChainData !== null) {
        setIsLoading(false)
        setBottomChainCondition(typeOfBottomChainData)
      }

      if (typeOfShackleSwivelData !== null) {
        setIsLoading(false)
        setShackleSwivelData(typeOfShackleSwivelData)
      }

      if (boatYardName !== null) {
        setIsLoading(false)
        setBoatyardName(boatYardName)
      }
      if (typeOfMooringStatusTypeData !== null) {
        setIsLoading(false)
        setMooringStatus(typeOfMooringStatusTypeData)
      }
    }
  }, [])

  const fetchStateDataAndUpdate = useCallback(async () => {
    const { statesData } = await getStatesData()
    if (statesData !== null) {
      setIsLoading(false)
      setStatesData(statesData)
    } else {
      setState('')
      setStatesData([])
    }
  }, [country])

  const handleClick = () => {
    if (editCustomerMode) {
      UpdateCustomer()
    } else if (editMooringMode) {
      UpdateMooring()
    } else {
      SaveCustomer()
    }
  }

  const AddDock = () => {
    return (
      <>
        <div className={`flex gap-4 mt-1 ${editCustomerMode && '!mb-14'}`}>
          <span>
            <label className="custom-checkbox-container">
              <input
                type="checkbox"
                onChange={(e: any) => {
                  setCheckedDock(e.target.checked ?? false)
                }}
                checked={checkedDock}
                style={{
                  border: '1px solid #D5E1EA',
                  height: '22px',
                  width: '22px',
                  borderRadius: '5px',
                }}
                className="custom-checkbox-input"
              />
              <span className="custom-checkbox"></span>
            </label>
          </span>
          <p className="font-medium text-lg text-[#000000] mt-5 ml-[14px]">Add Dock</p>
        </div>
      </>
    )
  }

  const AddMooring = () => {
    return (
      <>
        <div className="flex gap-4 mt-1">
          <span>
            <label className="custom-checkbox-container">
              <input
                type="checkbox"
                onChange={(e: any) => {
                  setCheckedMooring(e.target.checked ?? false)
                }}
                checked={checkedMooring}
                style={{
                  border: '1px solid #D5E1EA',
                  height: '22px',
                  width: '22px',
                  borderRadius: '5px',
                }}
                className="custom-checkbox-input"
              />
              <span className="custom-checkbox"></span>
            </label>
          </span>
          <p className="font-medium text-lg text-[#000000] mt-5 ml-4">Mooring Information</p>
        </div>
      </>
    )
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
    handleFocus()
  }, [checkedMooring])

  useEffect(() => {
    fetchDataAndUpdate()
  }, [])

  useEffect(() => {
    if (country) fetchStateDataAndUpdate()
  }, [country])

  useEffect(() => {
    if (editMode && customer) handleEditMode()
  }, [editMode, customer])

  useEffect(() => {
    if (gpsCoordinatesValue) {
      const coordinates = getFormattedCoordinate(gpsCoordinatesValue)
      setCenter(coordinates)
    }
  }, [gpsCoordinatesValue])

  useEffect(() => {
    if (checkedDock === true) {
      setSelectedCustomerType(customerType.find((item: any) => item.id === 5)?.type)
    } else if (checkedDock === false && !editCustomerMode) {
      setSelectedCustomerType('')
    }
  }, [])

  useEffect(() => {
    if (
      selectedCustomerType &&
      (selectedCustomerType?.id === 5 || selectedCustomerType === 'Dock')
    ) {
      setCheckedMooring(true)
      setCheckedDock(true)
    }
  }, [selectedCustomerType])

  useEffect(() => {
    if (
      checkedDock === false &&
      (selectedCustomerType?.id === 5 || selectedCustomerType === 'Dock')
    ) {
      setSelectedCustomerType(undefined)
    }
  }, [checkedDock])

  return (
    <>
      <Toast ref={toastRef} />

      <div className={isLoading ? 'blurred' : ''}>
        {/* Add Customer */}
        {!editMooringMode && (
          <>
            <div className="">
              <div className="flex gap-6">
                <div>
                  <span className="font-medium text-sm text-[#000000]">
                    <div className="flex gap-1">
                      First Name
                      <p className="text-red-600">*</p>
                    </div>
                  </span>
                  <div className="mt-2">
                    <InputComponent
                      value={firstName}
                      onChange={(e) => handleInputChangeCustomer('firstName', e.target.value)}
                      style={{
                        width: '230px',
                        height: '32px',
                        border: fieldErrors.firstName ? '1px solid red' : '1px solid #D5E1EA',
                        borderRadius: '0.50rem',
                        fontSize: '0.8rem',
                        paddingLeft: '0.5rem',
                      }}
                    />
                    <p className="" id="firstName">
                      {fieldErrors.firstName && (
                        <small className="p-error">{fieldErrors.firstName}</small>
                      )}
                    </p>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-sm text-[#000000]">
                    <div className="flex gap-1">
                      Last Name
                      <p className="text-red-600">*</p>
                    </div>
                  </span>
                  <div className="mt-2">
                    <InputComponent
                      value={lastName}
                      onChange={(e) => handleInputChangeCustomer('lastName', e.target.value)}
                      style={{
                        width: '230px',
                        height: '32px',
                        border: fieldErrors.lastName ? '1px solid red' : '1px solid #D5E1EA',
                        borderRadius: '0.50rem',
                        fontSize: '0.8rem',
                        paddingLeft: '0.5rem',
                      }}
                    />
                    <p>
                      <p className="" id="lastName">
                        {fieldErrors.lastName && (
                          <small className="p-error">{fieldErrors.lastName}</small>
                        )}
                      </p>
                    </p>
                  </div>
                </div>

                <div className="">
                  <span className="font-medium text-sm text-[#000000]">
                    <div className="flex gap-1">Phone</div>
                  </span>
                  <div className="mt-2">
                    <InputComponent
                      value={phone}
                      onChange={(e) => handleInputChangeCustomer('phone', e.target.value)}
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

              <div className="flex gap-6">
                <div className="mt-3">
                  <div>
                    <div>
                      <span className="font-medium text-sm text-[#000000]">
                        <div className="flex gap-1">Email Address</div>
                      </span>
                    </div>
                    <div className="mt-2">
                      <InputComponent
                        value={email}
                        onChange={(e) => handleInputChangeCustomer('email', e.target.value)}
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
                  <span className="font-medium text-sm text-[#000000]">
                    <div className="flex gap-1">Country</div>
                  </span>
                  <div className="mt-2">
                    <Dropdown
                      id="country"
                      value={country}
                      onChange={(e) => handleInputChangeCustomer('country', e.target.value)}
                      options={countriesData}
                      optionLabel="name"
                      editable
                      // placeholder="Country"
                      disabled={isLoading}
                      className=""
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

                <div className="mt-3">
                  <span className="font-medium text-sm text-[#000000]">
                    <div className="flex gap-1">Address</div>
                  </span>
                  <div className="mt-2">
                    <InputText
                      id="pinCode"
                      value={address}
                      onChange={(e) => handleInputChangeCustomer('address', e.target.value)}
                      placeholder="Address"
                      style={{
                        width: '230px',
                        height: '32px',
                        border: fieldErrors.address ? '1px solid red' : '1px solid #D5E1EA',
                        borderRadius: '0.50rem',
                        fontSize: '0.8rem',
                        paddingLeft: '0.5rem',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            {isLoading && (
              <ProgressSpinner
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '45%',
                  transform: 'translate(-50%, -50%)',
                  width: '50px',
                  height: '50px',
                }}
                strokeWidth="4"
              />
            )}
            <div className="mt-3">
              <div className="flex gap-6 mt-2 ">
                <div>
                  <div>
                    <div>
                      <span className="font-medium text-sm text-[#000000]">
                        <div className="flex gap-1">City</div>
                      </span>
                    </div>

                    <div className="mt-2">
                      <InputText
                        id="pinCode"
                        value={city}
                        onChange={(e) => handleInputChangeCustomer('city', e.target.value)}
                        placeholder="City"
                        style={{
                          width: '230px',
                          height: '32px',
                          border: fieldErrors.city ? '1px solid red' : '1px solid #D5E1EA',
                          borderRadius: '0.50rem',
                          fontSize: '0.8rem',
                          paddingLeft: '0.5rem',
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div>
                    <div>
                      <span className="font-medium text-sm text-[#000000]">
                        <div className="flex gap-1">State</div>
                      </span>
                    </div>

                    <div className="mt-2">
                      <Dropdown
                        id="state"
                        value={state}
                        options={statesData}
                        onChange={(e) => handleInputChangeCustomer('state', e.target.value)}
                        optionLabel="name"
                        editable
                        // placeholder="State"
                        disabled={isLoading}
                        style={{
                          width: '230px',
                          height: '32px',
                          border: '1px solid #D5E1EA',
                          borderRadius: '0.50rem',
                          color: 'black',
                          fontSize: '0.8rem',
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div>
                    <div>
                      <span className="font-medium text-sm text-[#000000]">
                        <div className="flex gap-1">Zip Code</div>
                      </span>
                    </div>

                    <div className="mt-2">
                      <InputText
                        id="pinCode"
                        value={pinCode}
                        onChange={(e) => handleInputChangeCustomer('pinCode', e.target.value)}
                        // placeholder="Zip Code"
                        style={{
                          width: '230px',
                          height: '32px',
                          border: fieldErrors.pinCode ? '1px solid red' : '1px solid #D5E1EA',
                          borderRadius: '0.50rem',
                          fontSize: '0.8rem',
                          paddingLeft: '0.5rem',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="mt-3">
                <div>
                  <span className="font-medium text-sm text-[#000000]">
                    <div className="gap-1">Customer Type</div>
                  </span>
                </div>
                <div className="mt-2">
                  <Dropdown
                    id="CustomerType"
                    value={selectedCustomerType}
                    options={customerType}
                    onChange={(e) => handleInputChangeCustomer('CustomerType', e.target.value)}
                    optionLabel="type"
                    editable
                    placeholder="Customer Type"
                    disabled={isLoading}
                    style={{
                      width: '230px',
                      height: '32px',
                      border: '1px solid #D5E1EA',
                      borderRadius: '0.50rem',
                      color: 'black',
                      cursor: country?.id == 13 ? 'not-allowed' : 'pointer',
                    }}
                  />
                </div>
              </div>
              {/* <div className="mt-3"> */}

              <div className="mt-3">
                <span className="font-medium text-sm text-[#000000]">
                  <div className="flex gap-1">Image</div>
                </span>
                <div className="mt-2">
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
                    <div
                      onClick={() => setCustomerImageVisible(true)}
                      className="flex gap-3 text-center ">
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

            <div
              className={`mt-3 
    ${selectedCustomerType?.id === 5 || selectedCustomerType === 'Dock' ? 'mb-2' : editCustomerMode ? 'mb-20' || 'blur' : ''} `}>
              <div className="">
                <span style={{ fontWeight: '400', fontSize: '14px', color: '#000000' }}>
                  <div className="flex gap-1 font-medium text-sm text-[#000000]">Notes</div>
                </span>
              </div>
              <div className="mt-2">
                <InputTextarea
                  value={formData.note}
                  onChange={(e) => handleInputChange('note', e.target.value)}
                  style={{
                    width: '98%',
                    height: '50px',
                    border: '1px solid #D5E1EA',
                    borderRadius: '0.50rem',
                    fontSize: '0.8rem',
                    boxShadow: 'none',
                    paddingLeft: '0.5rem',
                    color: 'black',
                    resize: 'none',
                  }}
                />
              </div>
            </div>
          </>
        )}

        {/* Add Mooring */}

        {(editCustomerMode && selectedCustomerType === 'Dock') ||
        (editCustomerMode && selectedCustomerType?.id === 5) ? (
          AddDock()
        ) : (
          <></>
        )}

        {!editCustomerMode && (
          <>
            {!editMooringMode && (
              <div className="flex gap-[7rem] text-xl text-black font-bold mb-12">
                {AddMooring()}
                {selectedCustomerType?.id === 5 && AddDock()}
              </div>
            )}

            {(checkedMooring === true || editMooringMode) && (
              <div id="mooring" className="mt-4">
                {/* Row1 */}
                <div className="flex gap-6">
                  {/* Mooring Number */}
                  <div>
                    <span className="font-medium text-sm text-[#000000]">
                      <div className="flex gap-1">
                        Mooring Number <p className="text-red-600">*</p>
                      </div>
                    </span>
                    <div className="mt-2">
                      <InputComponent
                        value={formData?.mooringNumber}
                        onChange={(e) => handleInputChange('mooringNumber', e.target.value)}
                        disabled={editMooringMode}
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
                  {/* Service Area */}
                  <div>
                    <div>
                      <span className="font-medium text-sm text-[#000000]">
                        <div className="flex gap-1">Service Area</div>
                      </span>
                    </div>
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
                </div>
                {/* Row 2 */}
                <div className="flex gap-6 mt-3">
                  {/* Boatyard */}
                  <div>
                    <span className="font-medium text-sm text-[#000000]">
                      <div className="flex gap-1">Boatyard</div>
                    </span>
                    <div className="mt-2">
                      <Dropdown
                        value={formData?.boatYardName}
                        onChange={(e) => handleInputChange('boatYardName', e.target.value)}
                        options={boatyardName}
                        optionLabel="boatyardName"
                        disabled={isBoatyardDisabled}
                        editable
                        placeholder="Select"
                        style={{
                          width: '230px',
                          height: '32px',
                          border: fieldErrors.boatYardName ? '1px solid red' : '1px solid #D5E1EA',
                          borderRadius: '0.50rem',
                          fontSize: '0.8rem',
                        }}
                      />
                      <p id="boatYardName">
                        {fieldErrors.boatYardName && (
                          <small className="p-error">{fieldErrors.boatYardName}</small>
                        )}
                      </p>
                    </div>
                  </div>
                  {/* Images */}
                  <div>
                    <span className="font-medium text-sm text-[#000000]">
                      <div className="flex gap-1">Images</div>
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
                        <div
                          onClick={() => setMooringImageVisible(true)}
                          className="flex gap-3 text-center">
                          <FaFileUpload
                            style={{ fontSize: '22px', color: '#0098FF', marginTop: '3px' }}
                          />
                          <div className="border-r-2 border-blue-100  h-[30px]"></div>
                          <span className="pl-4 mt-1"> Upload Image </span>
                        </div>
                      </div>
                    </div>
                  </div>
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
                          border: fieldErrors.boatName ? '1px solid red' : '1px solid #D5E1EA',
                          borderRadius: '0.50rem',
                          fontSize: '0.8rem',
                          paddingLeft: '0.5rem',
                        }}
                      />
                      <p id="boatName">
                        {fieldErrors.boatName && (
                          <small className="p-error">{fieldErrors.boatName}</small>
                        )}
                      </p>
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
                      }}
                      strokeWidth="4"
                    />
                  )}
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
                        defaultValue={mooringRowData?.gpsCoordinates}
                        onChange={debounce((e) => {
                          setGpsCoordinatesValue(e.target.value)
                          setFieldErrors((prevErrors) => ({
                            ...prevErrors,
                            gpsCoordinatesValue: '',
                          }))
                        })}
                        style={{
                          width: '230px',
                          height: '32px',
                          border: fieldErrors.gpsCoordinatesValue
                            ? '1px solid red'
                            : '1px solid #D5E1EA',
                          borderRadius: '0.50rem',
                          fontSize: '0.8rem',
                          paddingLeft: '0.5rem',
                        }}
                      />
                      <p id="waterDepth">
                        {fieldErrors.gpsCoordinatesValue && (
                          <small className="p-error">{fieldErrors.gpsCoordinatesValue}</small>
                        )}
                      </p>
                    </div>
                  </div>
                  {/* Boat Size */}
                  <div>
                    <span className="font-medium text-sm text-[#000000]">
                      <div className="flex gap-1">Boat Size (in feet)</div>
                    </span>
                    <div className="mt-2">
                      <InputComponent
                        value={formData?.boatSize}
                        onChange={(e) => handleInputChange('boatSize', e.target.value)}
                        style={{
                          width: '230px',
                          height: '32px',
                          border: fieldErrors.boatSize ? '1px solid red' : '1px solid #D5E1EA',
                          borderRadius: '0.50rem',
                          fontSize: '0.8rem',
                          paddingLeft: '0.5rem',
                        }}
                      />
                      <p id="boatName">
                        {fieldErrors.boatSize && (
                          <small className="p-error">{fieldErrors.boatSize}</small>
                        )}
                      </p>
                    </div>
                  </div>
                  {/* Boat Type */}
                  <div>
                    <div>
                      <span className="font-medium text-sm text-[#000000]">
                        <div className="flex gap-1">Boat Type</div>
                      </span>
                    </div>

                    <div className="mt-2">
                      <Dropdown
                        value={formData?.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        options={type}
                        optionLabel="boatType"
                        editable
                        placeholder="Select"
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
                {/* Row 4 */}
                <div className="flex gap-6 mt-3">
                  {/* Boat Weight */}
                  <div>
                    <span className="font-medium text-sm text-[#000000]">
                      <div className="flex gap-1">Boat Weight</div>
                    </span>
                    <div className="mt-2">
                      <InputComponent
                        value={formData?.boatWeight}
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
                        onChange={(e) =>
                          handleInputChange('inspectionDate', formatDate(e.target.value))
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
                        editable
                        placeholder="Select"
                        style={{
                          width: '230px',
                          height: '32px',
                          border: fieldErrors.typeOfWeight ? '1px solid red' : '1px solid #D5E1EA',
                          borderRadius: '0.50rem',
                          fontSize: '0.8rem',
                        }}
                      />
                      <p id="typeOfWeight">
                        {fieldErrors.typeOfWeight && (
                          <small className="p-error">{fieldErrors.typeOfWeight}</small>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Row 5 */}
                <div className="flex gap-6 mt-3">
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
                        style={{
                          width: '230px',
                          height: '32px',
                          border: fieldErrors.sizeOfWeight ? '1px solid red' : '1px solid #D5E1EA',
                          borderRadius: '0.50rem',
                          fontSize: '0.8rem',
                          paddingLeft: '0.5rem',
                        }}
                      />
                      <p id="sizeOfWeight">
                        {fieldErrors.sizeOfWeight && (
                          <small className="p-error">{fieldErrors.sizeOfWeight}</small>
                        )}
                      </p>
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
                        onChange={(e) => handleInputChange('depthAtMeanHighWater', e.target.value)}
                        style={{
                          width: '230px',
                          height: '32px',
                          border: fieldErrors.depthAtMeanHighWater
                            ? '1px solid red'
                            : '1px solid #D5E1EA',
                          borderRadius: '0.50rem',
                          fontSize: '0.8rem',
                          paddingLeft: '0.5rem',
                        }}
                      />
                      <p id="depthAtMeanHighWater">
                        {fieldErrors.depthAtMeanHighWater && (
                          <small className="p-error">{fieldErrors.depthAtMeanHighWater}</small>
                        )}
                      </p>
                    </div>
                  </div>
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
                        editable
                        placeholder="Select"
                        style={{
                          width: '230px',
                          height: '32px',
                          border: fieldErrors.topChainCondition
                            ? '1px solid red'
                            : '1px solid #D5E1EA',
                          borderRadius: '0.50rem',
                          fontSize: '0.8rem',
                        }}
                      />
                      <p id="typeOfWeight">
                        {fieldErrors.topChainCondition && (
                          <small className="p-error">{fieldErrors.topChainCondition}</small>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Row 6 */}
                <div className="flex gap-6 mt-3">
                  {/* Top Chain Condition Install Date */}
                  <div>
                    <div>
                      <span className="font-medium text-sm text-[#000000]">
                        <div className="flex gap-1">
                          Top Chain Condition{' '}
                          <span style={{ fontSize: '0.6rem' }}> (install date)</span>
                        </div>
                      </span>
                    </div>

                    <div className="mt-2">
                      <Calendar
                        value={parseDate(formData?.topChainDate)}
                        placeholder="mm/dd/yy"
                        onChange={(e) =>
                          handleInputChange('topChainDate', formatDate(e.target.value))
                        }
                        dateFormat="mm/dd/yy"
                        style={{
                          width: '230px',
                          height: '32px',
                          border: fieldErrors.topChainDate ? '1px solid red' : '1px solid #D5E1EA',
                          borderRadius: '0.50rem',
                          fontSize: '0.8rem',
                          padding: '0.5rem',
                        }}
                      />
                      <p>
                        {fieldErrors.topChainDate && (
                          <small className="p-error">{fieldErrors.topChainDate}</small>
                        )}
                      </p>
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
                        editable
                        placeholder="Select"
                        style={{
                          width: '230px',
                          height: '32px',
                          border: fieldErrors.bottomChainCondition
                            ? '1px solid red'
                            : '1px solid #D5E1EA',
                          borderRadius: '0.50rem',
                          fontSize: '0.8rem',
                        }}
                      />
                      <p id="bottomChainCondition">
                        {fieldErrors.bottomChainCondition && (
                          <small className="p-error">{fieldErrors.bottomChainCondition}</small>
                        )}
                      </p>
                    </div>
                  </div>
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
                        onChange={(e) =>
                          handleInputChange('bottomChainDate', formatDate(e.target.value))
                        }
                        dateFormat="mm/dd/yy"
                        placeholder="mm/dd/yy"
                        style={{
                          width: '230px',
                          height: '32px',
                          border: fieldErrors.bottomChainDate
                            ? '1px solid red'
                            : '1px solid #D5E1EA',
                          borderRadius: '0.50rem',
                          fontSize: '0.8rem',
                          padding: '0.5rem',
                        }}
                      />
                      <p>
                        {fieldErrors.bottomChainDate && (
                          <small className="p-error">{fieldErrors.bottomChainDate}</small>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Row 7 */}
                <div className="flex gap-6 mt-3">
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
                        editable
                        placeholder="Select"
                        style={{
                          width: '230px',
                          height: '32px',
                          border: fieldErrors.conditionOfEye
                            ? '1px solid red'
                            : '1px solid #D5E1EA',
                          borderRadius: '0.50rem',
                          fontSize: '0.8rem',
                        }}
                      />
                      <p id="conditionOfEye">
                        {fieldErrors.conditionOfEye && (
                          <small className="p-error">{fieldErrors.conditionOfEye}</small>
                        )}
                      </p>
                    </div>
                  </div>
                  {/* Condition of Eye Install Date */}
                  <div>
                    <div>
                      <span className="font-medium text-sm text-[#000000]">
                        <div className="flex gap-1">
                          Condition of Eye{' '}
                          <span style={{ fontSize: '0.6rem' }}> (install date)</span>
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
                        placeholder="mm/dd/yy"
                        style={{
                          width: '230px',
                          height: '32px',
                          border: fieldErrors.conditionEyeDate
                            ? '1px solid red'
                            : '1px solid #D5E1EA',
                          borderRadius: '0.50rem',
                          fontSize: '0.8rem',
                          padding: '0.5rem',
                        }}
                      />
                      <p id="conditionOfEye">
                        {fieldErrors.conditionEyeDate && (
                          <small className="p-error">{fieldErrors.conditionEyeDate}</small>
                        )}
                      </p>
                    </div>
                  </div>
                  {/* Pendant Condition */}
                  <div className="mt-3">
                    <div>
                      <span className="font-medium text-sm text-[#000000]">
                        <div className="flex gap-1">Pendant Condition</div>
                      </span>
                    </div>

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
                          paddingLeft: '0.5rem',
                        }}
                      />
                    </div>
                  </div>
                </div>
                {/* Row 8 */}
                <div className="flex gap-6">
                  <div>
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
                        mooringStatus={
                          formData?.mooringStatus?.id || mooringRowData?.mooringStatus?.id
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div
        className={`"flex gap-6 bottom-2 absolute left-6"  ${isLoading ? 'blurred' : ''}`}
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
            fontSize: '14px',
            boxShadow: 'none',
            color: 'white',
            borderRadius: '0.50rem',
            marginTop: '1rem',
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
            fontSize: '14px',
            height: '42px',
            fontWeight: '500',
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
        visible={customerImageVisible}
        onHide={() => setCustomerImageVisible(false)}
        header={'Images'}>
        <UploadImages
          handleNoteChange={handleCustomerNoteChange}
          hoveredIndex={hoveredIndex}
          handleRemoveImage={handleRemoveCustomerImage}
          setHoveredIndex={setHoveredIndex}
          handleImageChange={handleCustomerImageChange}
          setImageVisible={setCustomerImageVisible}
          imageRequestDtoList={customerImageRequestDtoList}
          isLoading={isLoading}
          images={customerImages}
          toastRef={toastRef}
        />
      </Dialog>
      {/* Upload Mooring Image */}
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
        visible={mooringImageVisible}
        onHide={() => setMooringImageVisible(false)}
        header={'Mooring Images'}>
        <UploadImages
          handleNoteChange={handleMooringNoteChange}
          hoveredIndex={hoveredIndex}
          handleRemoveImage={handleRemoveMooringImage}
          setHoveredIndex={setHoveredIndex}
          handleImageChange={handleMooringImageChange}
          setImageVisible={setMooringImageVisible}
          imageRequestDtoList={mooringImageRequestDtoList}
          isLoading={isLoading}
          images={mooringImages}
          toastRef={toastRef}
        />
      </Dialog>
    </>
  )
}

export default AddCustomer
