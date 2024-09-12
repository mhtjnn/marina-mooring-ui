import InputComponent from '../../CommonComponent/InputComponent'
import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import {
  useAddBoatyardsMutation,
  useUpdateBoatyardsMutation,
} from '../../../Services/MoorManage/MoormanageApi'
import { BoatYardProps } from '../../../Type/ComponentBasedType'
import { Country, State } from '../../../Type/CommonType'
import { BoatYardResponse, ErrorResponse } from '../../../Type/ApiTypes'
import CustomSelectPositionMap from '../../Map/CustomSelectPositionMap'
import { CountriesData, StatesData } from '../../CommonComponent/MetaDataComponent/MetaDataApi'
import { ProgressSpinner } from 'primereact/progressspinner'
import { useSelector } from 'react-redux'
import { selectCustomerId } from '../../../Store/Slice/userSlice'
import { Toast } from 'primereact/toast'
import { IoMdAdd, IoMdClose } from 'react-icons/io'
import { InputText } from 'primereact/inputtext'
import { debounce } from 'lodash'

const AddBoatyards: React.FC<BoatYardProps> = ({
  closeModal,
  boatYardData,
  setModalVisible,
  customerData,
  editMode,
}) => {
  const selectedCustomerId = useSelector(selectCustomerId)
  const [boatyardName, setBoatyardName] = useState('')
  const [address, setAddress] = useState('')
  const [state, setState] = useState<any>()
  const [country, setCountry] = useState<any>()
  const [zipCode, setZipCode] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})
  const [mainContact, setMainContact] = useState('')
  const [gpsCoordinatesValue, setGpsCoordinatesValue] = useState('')
  const [countriesData, setCountriesData] = useState<Country[]>()
  const [statesData, setStatesData] = useState<State[]>()
  const [errorMessage, setErrorMessage] = useState<{ [key: string]: string }>({})
  const toastRef = useRef<Toast>(null)
  const [storage, setStorage] = useState('')
  const [storageList, setStorageList] = useState<string[]>([])
  const [mapPositionChanged, setMapPositionChanged] = useState<boolean>(true)
  const getFormattedCoordinate = (coordinates: any) => {
    try {
      let [lat, long] = coordinates?.split(/[ ,]+/)

      const convertToDecimal = (coordinate: any) => {
        if (coordinate?.split('.').length > 2) {
          const [degree, minute, second] = coordinate?.split('.').map((num: any) => parseFloat(num))
          return degree + minute / 60 + second / 3600
        }
        return parseFloat(coordinate)
      }

      lat = convertToDecimal(lat)
      long = convertToDecimal(long)

      if (!isNaN(lat) && !isNaN(long)) {
        return [lat, long]
      } else {
        throw new Error('Parsed coordinates are NaN')
      }
    } catch (error) {
      console.error('Error In Setting Center:', error)
      return [39.4926173, -117.5714859]
    }
  }

  const [center, setCenter] = useState<any>(
    customerData?.gpsCoordinates || gpsCoordinatesValue
      ? getFormattedCoordinate(customerData?.gpsCoordinates || gpsCoordinatesValue)
      : [39.4926173, -117.5714859],
  )
  const [isLoading, setIsLoading] = useState(true)
  const [addBoatyard] = useAddBoatyardsMutation()
  const [updateBoatyard] = useUpdateBoatyardsMutation()
  const { getStatesData } = StatesData(country?.id || customerData?.countryResponseDto?.id)
  const { getCountriesData } = CountriesData()

  const validateFields = () => {
    const nameRegex = /^[a-zA-Z ]+$/
    const errors: { [key: string]: string } = {}
    if (!boatyardName) {
      errors.name = 'Boatyard is required'
    } else if (!nameRegex.test(boatyardName)) {
      errors.name = 'Name must only contain letters'
    }
    if (!gpsCoordinatesValue) {
      errors.gpsCoordinatesValue = 'GPS Coordinates is required'
    }
    if (!mainContact) errors.mainContact = 'Main contact is required'
    return errors
  }

  const handlePositionChange = (lat: number, lng: number) => {
    setCenter([lat, lng])
    const formattedLat = lat.toFixed(3)
    const formattedLng = lng.toFixed(3)
    const concatenatedValue = `${formattedLat} ${formattedLng}`
    setGpsCoordinatesValue(concatenatedValue)
    setErrorMessage((prev) => ({ ...prev, gpsCoordinatesValue: '' }))
  }

  const handleEditMode = () => {
    setBoatyardName(customerData?.boatyardName || '')
    setStorageList(customerData?.storageAreas)
    setAddress(customerData?.address || '')
    setZipCode(customerData?.zipCode || '')
    setState(customerData?.stateResponseDto?.name || undefined)
    setMainContact(customerData?.mainContact || '')
    setCountry(customerData?.countryResponseDto?.name || undefined)
    setGpsCoordinatesValue(customerData?.gpsCoordinates || '')
  }

  const saveBoatyards = async () => {
    const errors = validateFields()

    if (Object.keys(errors).length > 0) {
      setErrorMessage(errors)
      return
    }
    setIsLoading(true)

    try {
      const payload = {
        boatyardName: boatyardName,
        address: address,
        zipCode: zipCode,
        contact: mainContact,
        stateId: state?.id,
        countryId: country?.id,
        mainContact: mainContact,
        gpsCoordinates: gpsCoordinatesValue,
        customerOwnerId: selectedCustomerId,
        storageAreas: storageList,
      }
      const response = await addBoatyard(payload).unwrap()
      const { status, message } = response as BoatYardResponse

      if (status === 200 || status === 201) {
        closeModal()
        boatYardData()
        setIsLoading(false)
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

  const updateBoatyards = async () => {
    const errors = validateFields()
    if (Object.keys(errors).length > 0) {
      setErrorMessage(errors)
      return
    }
    setIsLoading(true)

    try {
      setIsLoading(true)
      const editBoatYardPayload = {
        boatyardName: boatyardName,
        address: address,
        zipCode: zipCode,
        contact: mainContact,
        stateId: state?.id,
        countryId: country?.id,
        mainContact: mainContact,
        gpsCoordinates: gpsCoordinatesValue,
        customerOwnerId: selectedCustomerId,
        storageAreas: storageList,
      }
      const response = await updateBoatyard({
        payload: editBoatYardPayload,
        id: customerData?.id,
      }).unwrap()
      const { status, message } = response as BoatYardResponse

      if (status === 200 || status === 201) {
        setIsLoading(false)
        closeModal()
        boatYardData()
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

  const handleSave: any = () => {
    if (editMode) {
      updateBoatyards()
    } else {
      saveBoatyards()
    }
  }

  const handleBack = () => {
    setModalVisible(false)
  }

  const handleAddStorage = () => {
    setStorageList([...storageList, storage])
    setStorage('')
  }

  const handleDeleteStorage = (index: number) => {
    const newList = [...storageList]
    newList.splice(index, 1)
    setStorageList(newList)
  }

  const fetchDataAndUpdate = useCallback(async () => {
    const { countriesData } = await getCountriesData()
    if (countriesData !== null) {
      setIsLoading(false)
      setCountriesData(countriesData)
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

  useEffect(() => {
    fetchDataAndUpdate()
  }, [fetchDataAndUpdate])

  useEffect(() => {
    if (country) fetchStateDataAndUpdate()
  }, [country])

  useEffect(() => {
    if (editMode && customerData) {
      handleEditMode()
    }
  }, [editMode, customerData])

  useEffect(() => {
    if (gpsCoordinatesValue) {
      const coordinates = getFormattedCoordinate(gpsCoordinatesValue)
      setCenter(coordinates)
    }
  }, [gpsCoordinatesValue])

  return (
    <>
      <Toast ref={toastRef} />
      <div className={`" ml-4" ${isLoading ? 'blurred' : ''}`}>
        <div className="flex gap-6  ">
          <div>
            <span className="font-medium text-sm text-[#000000]">
              Boatyard <span className="text-red-500">*</span>
            </span>
            <div className="mt-1">
              <InputComponent
                value={boatyardName}
                onChange={(e) => {
                  setBoatyardName(e.target.value)
                  setErrorMessage((prev) => ({ ...prev, name: '' }))
                }}
                style={{
                  width: '230px',
                  height: '32px',
                  border: errorMessage.name ? '1px solid red' : '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.8rem',
                  padding: '0.5rem',
                }}
              />
            </div>
            <p>{errorMessage.name && <small className="p-error">{errorMessage.name}</small>}</p>
          </div>
          <div>
            <span className="font-medium text-sm text-[#000000]">Storage Area</span>
            <div className="mt-1 flex items-center gap-1 relative">
              <div>
                <div className="p-input-icon-left">
                  <InputText
                    value={storage}
                    onChange={(e) => {
                      setStorage(e.target.value)
                    }}
                    style={{
                      width: '230px',
                      height: '32px',
                      borderRadius: '0.50rem',
                      fontSize: '0.8rem',
                      padding: '0.5rem',
                      paddingRight: '2.5rem',
                    }}
                  />
                  <IoMdAdd
                    style={{
                      position: 'absolute',
                      left: '12.5rem',
                      top: '72%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      fontSize: '1.5rem',
                      color: 'black',
                      backgroundColor: '#D5E1EA',
                      borderRadius: '5px',
                      padding: '3px',
                    }}
                    onClick={() => storage && handleAddStorage()}
                  />
                </div>
              </div>
            </div>
            <ul className="mt-1 flex w-[230px] overflow-y-auto ">
              {storageList?.map((item, index) => (
                <li
                  key={index}
                  style={{
                    borderRadius: '5px',
                    fontWeight: '400',
                    fontSize: '12px',
                    color: '#10293A',
                    backgroundColor: '#D5E1EA',
                    padding: '4px',
                  }}
                  className="flex items-center m-1">
                  {item}
                  <IoMdClose
                    style={{
                      marginLeft: '0.5rem',
                      marginBottom: '12px',
                      cursor: 'pointer',
                      color: 'red',
                    }}
                    onClick={() => handleDeleteStorage(index)}
                  />

                  <button></button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {isLoading && (
          <ProgressSpinner
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '50px',
              height: '50px',
            }}
            strokeWidth="4"
          />
        )}
        <div className="mt-3">
          <span className="font-medium text-sm text-[#000000]">Address</span>
        </div>
        <div className="flex gap-6 mt-1">
          <div>
            <div className="">
              <Dropdown
                id="stateDropdown"
                value={country}
                onChange={(e) => {
                  setCountry(e.value)
                  setErrorMessage((prev) => ({ ...prev, country: '' }))
                }}
                editable
                placeholder="Country"
                options={countriesData}
                optionLabel="name"
                disabled={isLoading}
                style={{
                  width: '230px',
                  height: '32px',
                  border: errorMessage.country ? '1px solid red' : '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.8rem',
                  paddingLeft: '0.5rem',
                }}
              />
            </div>
          </div>

          <div className="">
            <Dropdown
              id="stateDropdown"
              placeholder="State"
              editable
              value={state}
              onChange={(e) => {
                setState(e.target.value)
                setFieldErrors((prevErrors) => ({ ...prevErrors, state: '' }))
              }}
              options={statesData}
              optionLabel="name"
              disabled={isLoading}
              style={{
                width: '230px',
                height: '32px',
                border: errorMessage.state ? '1px solid red' : '1px solid #D5E1EA',
                borderRadius: '0.50rem',
                fontSize: '0.8rem',
                paddingLeft: '0.5rem',
                color: 'black',
              }}
            />
          </div>

          <div className="flex flex-col ">
            <InputComponent
              value={zipCode}
              onChange={(e) => {
                setZipCode(e.target.value)
              }}
              placeholder="Zip Code"
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

        <div className="flex  gap-6 mt-4">
          <div>
            <div className="">
              <InputComponent
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value)
                }}
                placeholder="Address"
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

          <div>
            <div>
              <div className="">
                <InputComponent
                  {...(mapPositionChanged ? { value: gpsCoordinatesValue } : '')}
                  onFocus={() => setMapPositionChanged(false)}
                  onBlur={() => setMapPositionChanged(true)}
                  defaultValue={getFormattedCoordinate(customerData?.gpsCoordinates)?.join(' ')}
                  onChange={debounce((e) => {
                    setGpsCoordinatesValue(e.target.value)
                  })}
                  placeholder="GPS Coordinates"
                  style={{
                    width: '230px',
                    height: '32px',
                    border: errorMessage.gpsCoordinatesValue
                      ? '1px solid red'
                      : '1px solid #D5E1EA',
                    borderRadius: '0.50rem',
                    fontSize: '0.8rem',
                    padding: '0.5rem',
                  }}
                />
              </div>
              <p>
                {errorMessage.gpsCoordinatesValue && (
                  <small className="p-error">{errorMessage.gpsCoordinatesValue}</small>
                )}
              </p>
            </div>
          </div>
          <div></div>
        </div>

        <div className="flex mt-4 ">
          <div>
            <div>
              <span className="font-medium text-sm text-[#000000]">
                Main Contact <span className="text-red-500">*</span>
              </span>
            </div>
            <div>
              <div>
                <div className=" mt-1">
                  <InputComponent
                    value={mainContact}
                    onChange={(e) => {
                      setMainContact(e.target.value)
                      setErrorMessage((prev) => ({ ...prev, mainContact: '' }))
                    }}
                    style={{
                      width: '230px',
                      height: '32px',
                      border: errorMessage.mainContact ? '1px solid red' : '1px solid #D5E1EA',
                      borderRadius: '0.50rem',
                      fontSize: '0.8rem',
                      padding: '0.5rem',
                    }}
                  />
                </div>
                <p>
                  {errorMessage.mainContact && (
                    <small className="p-error">{errorMessage.mainContact}</small>
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="w-full h-[150px] p-2 rounded-lg mt-[22px]">
            <CustomSelectPositionMap
              onPositionChange={handlePositionChange}
              zoomLevel={15}
              center={center}
            />
          </div>
        </div>
      </div>
      <div className={`"flex gap-4 ml-4 bottom-5 absolute left-6" ${isLoading ? 'blurred' : ''}`}>
        <Button
          label={'Save'}
          onClick={handleSave}
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
          }}
        />

        <Button
          label={'Back'}
          onClick={handleBack}
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
    </>
  )
}

export default AddBoatyards
