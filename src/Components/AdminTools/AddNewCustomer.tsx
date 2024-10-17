import React, { useState, useEffect, useCallback, useRef } from 'react'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import InputComponent from '../CommonComponent/InputComponent'
import { Country, Role, State } from '../../Type/CommonType'
import { CustomerAdminDataProps } from '../../Type/ComponentBasedType'
import { ErrorResponse, GetUserResponse, SaveUserResponse } from '../../Type/ApiTypes'
import {
  useAddUserMutation,
  useGetUsersMutation,
  useUpdateUserMutation,
} from '../../Services/AdminTools/AdminToolsApi'
import { ProgressSpinner } from 'primereact/progressspinner'
import {
  CountriesData,
  RolesData,
  StatesData,
} from '../CommonComponent/MetaDataComponent/MetaDataApi'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectCustomerId,
  selectCustomerName,
  setCustomerId,
  setCustomerName,
} from '../../Store/Slice/userSlice'
import { Toast } from 'primereact/toast'
import { EMAIL_REGEX, formatPhoneNumber, NAME_REGEX } from '../Utils/RegexUtils'

const AddNewCustomer: React.FC<CustomerAdminDataProps> = ({
  customerData,
  editMode,
  editCustomerMode,
  getUser,
  getCustomerUser,
  closeModal,
  customerAdminId,
  setModalVisible,
  customerUsers,
  permission,
  setSelectedCustomerUser,
  setSelectedCustomer,
  setEditCustomer,
  passWordDisplay,
  setIsCustomerUpdated,
}) => {
  const dispatch = useDispatch()
  const selectedCustomerOwnerName = useSelector(selectCustomerName)
  const selectedCustomerOwnerId = useSelector(selectCustomerId)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [role, setRole] = useState<Role>()
  const [companyName, setCompanyName] = useState('')
  const [country, setCountry] = useState<any>()
  const [state, setState] = useState<any>()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [rolesData, setRolesData] = useState<Role[]>()
  const [countriesData, setCountriesData] = useState<Country[]>()
  const [statesData, setStatesData] = useState<State[]>()
  const [errorMessage, setErrorMessage] = useState<string>()
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})
  const [selectedCustomerId, setSelectedCustomerId] = useState<any>()
  const [selectedCustomerName, setSelectedCustomerName] = useState<any>()
  const [firstErrorField, setFirstErrorField] = useState('')
  const [customerAdminDropdownEnabled, setCustomerAdminDropdownEnabled] = useState(false)
  const [getCustomerOwnerData, setgetCustomerOwnerData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [addCustomer] = useAddUserMutation()
  const [editCustomer] = useUpdateUserMutation()
  const [getUsersData] = useGetUsersMutation()
  const { getRolesData } = RolesData()
  const { getStatesData } = StatesData(
    country?.id ? country?.id : customerData?.countryResponseDto?.id,
  )
  const { getCountriesData } = CountriesData()
  const toastRef = useRef<Toast>(null)

  const [passwordCriteria, setPasswordCriteria] = useState({
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
    length: false,
  })

  const handleEditMode = () => {
    if ((editMode || editCustomerMode) && customerData) {
      setFirstName(customerData?.firstName || '')
      setLastName(customerData?.lastName || '')
      setCompanyName(customerData?.userID || '')
      setPhone(customerData?.phoneNumber || '')
      setEmail(customerData?.email || '')
      setAddress(customerData?.address || '')
      setZipCode(customerData?.zipCode || '')
      setRole(customerData?.roleResponseDto?.name || undefined)
      setCountry(customerData?.countryResponseDto?.name || undefined)
      setCompanyName(customerData?.companyName || '')
      setState(customerData?.stateResponseDto?.name || undefined)
      const selectedCustomerAdmin = customerUsers?.find(
        (customer: any) => customer.id === customerAdminId,
      )
      const selectedCustomerAdminName = selectedCustomerAdmin
        ? selectedCustomerAdmin.firstName + ' ' + selectedCustomerAdmin.lastName
        : ''
      if (customerData?.roleResponseDto.id !== 2) {
        setSelectedCustomerId(selectedCustomerAdminName)
      }
      dispatch(setCustomerName(selectedCustomerAdminName))
      dispatch(setCustomerId(selectedCustomerAdmin ? selectedCustomerAdmin.id : ''))
    }
  }

  const validateFields = () => {
    const errors: { [key: string]: string } = {}
    let firstError = ''
    if (!firstName) {
      errors.firstName = 'First Name is required'
    } else if (!NAME_REGEX.test(firstName)) {
      errors.firstName = 'First Name must only contain letters'
    } else if (firstName.length < 3) {
      errors.firstName = 'First Name must be at least 3 characters long'
    }
    if (errors.firstName) firstError = 'firstName'
    if (!lastName) {
      errors.lastName = 'Last Name is required'
    } else if (!NAME_REGEX.test(lastName)) {
      errors.lastName = 'Last Name must only contain letters'
    } else if (lastName.length < 3) {
      errors.lastName = 'Last Name must be at least 3 characters long'
    }
    if (errors.lastName) firstError = 'lastName'
    if (!email) {
      errors.email = 'Email is required'
    } else if (!EMAIL_REGEX.test(email)) {
      errors.email = 'Please enter a valid email format'
    }
    if (errors.email && !firstError) firstError = 'email'
    if (!role) errors.role = 'Role is required'
    if (errors.role && !firstError) firstError = 'role'
    if (
      !selectedCustomerId &&
      customerAdminDropdownEnabled &&
      !permission &&
      (role?.id === 3 || role?.id === 4)
    )
      errors.selectedCustomerId = 'Customer Owner is required'
    if (errors.selectedCustomerId && !firstError) firstError = 'selectedCustomerId'
    if (!companyName && role?.id === 2) errors.companyName = 'Company Name is required'
    if (errors.companyName && !firstError) firstError = 'companyName'
    if (!password && !passWordDisplay) errors.password = 'Password is required'
    if (errors.password && !firstError) firstError = 'password'
    if (!confirmPassword && !passWordDisplay)
      errors.confirmPassword = 'Confirm Password is required'
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match'
    if (errors.confirmPassword && !firstError) firstError = 'confirmPassword'
    setFirstErrorField(firstError)
    return errors
  }

  const validatePassword = (password: string) => {
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecialChar = /[@$!%*?&]/.test(password)
    const hasMinLength = password.length >= 10

    setPasswordCriteria({
      uppercase: hasUppercase,
      lowercase: hasLowercase,
      number: hasNumber,
      specialChar: hasSpecialChar,
      length: hasMinLength,
    })

    return hasUppercase && hasLowercase && hasNumber && hasSpecialChar && hasMinLength
  }

  const handleFocus = () => {
    const passwordMessage = document.getElementById('password-message')
    if (passwordMessage) {
      passwordMessage.style.display = 'block'
      passwordMessage.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleInputChange = (fieldName: string, value: any) => {
    if (fieldName === 'phone') {
      value = formatPhoneNumber(value)
    }
    switch (fieldName) {
      case 'firstName':
        setFirstName(value)
        break
      case 'lastName':
        setLastName(value)
        break
      case 'companyName':
        setCompanyName(value)
        break
      case 'phone':
        setPhone(value)
        break
      case 'email':
        setEmail(value)
        setErrorMessage('')
        break
      case 'address':
        setAddress(value)
        break
      case 'zipCode':
        setZipCode(value)
        break
      case 'password':
        setPassword(value)
        setErrorMessage('')
        validatePassword(value)
        handleFocus()
        break
      case 'confirmPassword':
        setConfirmPassword(value)
        break
      default:
        break
    }
    setFieldErrors((prevErrors) => ({ ...prevErrors, [fieldName]: '' }))
  }

  const handleBlur = () => {
    const passwordMessage = document.getElementById('password-message')
    if (passwordMessage) passwordMessage.style.display = 'none'
  }

  const handleEdit = async () => {
    const errors = validateFields()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setIsLoading(true)
    try {
      const editUserPayload = {
        firstName,
        lastName,
        companyName,
        phoneNumber: phone,
        email,
        address,
        zipCode,
        stateId: state?.id,
        countryId: country?.id,
        roleId: role?.id,
        customerOwnerId: editCustomerMode ? '' : customerData?.customerOwnerId,
      }
      const response = await editCustomer({
        payload: editUserPayload,
        id: customerData?.id,
      }).unwrap()
      const { status, message } = response as SaveUserResponse
      if (status === 200 || status === 201) {
        setIsLoading(false)
        toastRef?.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: message,
          life: 3000,
        })
        getUser()
        if (setEditCustomer) {
          setEditCustomer(false)
        }
        if (setIsCustomerUpdated) {
          setIsCustomerUpdated(true)
        }
        setModalVisible(false)
        closeModal()
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

  const handleCustomerUserEdit = async () => {
    const errors = validateFields()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    dispatch(setCustomerId(editMode ? '' : customerData?.customerOwnerId))
    setIsLoading(true)
    try {
      const editUserPayload = {
        firstName,
        lastName,
        companyName,
        phoneNumber: phone,
        email,
        address,
        zipCode,
        stateId: state?.id,
        countryId: country?.id,
        roleId: role?.id,
      }
      const response = await editCustomer({
        payload: editUserPayload,
        id: customerData?.id,
      }).unwrap()
      const { status, message } = response as SaveUserResponse
      if (status === 200 || status === 201) {
        toastRef?.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: message,
          life: 3000,
        })
        if (getCustomerUser) {
          getCustomerUser()
        }
        if (setEditCustomer) {
          setEditCustomer(false)
        }
        setModalVisible(false)
        if (setIsCustomerUpdated) {
          setIsCustomerUpdated(true)
        }
        setIsLoading(false)
        closeModal()
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

  const handleSave = async () => {
    const errors = validateFields()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    if (!validatePassword(password)) {
      setErrorMessage('Password is Incorrect')
      return
    }
    dispatch(setCustomerId(permission ? customerAdminId : selectedCustomerId))
    setIsLoading(true)
    try {
      // Encode the password using base64
      const encodedPassword = btoa(password)
      const addUserPayload = {
        firstName,
        lastName,
        companyName,
        phoneNumber: phone,
        email,
        address,
        zipCode,
        password: encodedPassword, // Using base64 encoded password
        stateId: state?.id,
        countryId: country?.id,
        roleId: role?.id,
        confirmPassword: encodedPassword, // Using base64 encoded password for confirmPassword
      }

      // Send the encoded password to the server
      const response = await addCustomer({
        payload: addUserPayload,
      }).unwrap()
      const { status, message } = response as SaveUserResponse
      if (status === 200 || status === 201) {
        setIsLoading(false)
        toastRef?.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'User Saved successfully',
          life: 3000,
        })
        if (role?.id === 2 || getUser) {
          getUser()
        }
        if (setIsCustomerUpdated) {
          setIsCustomerUpdated(true)
        }
        dispatch(setCustomerId(''))
        setIsLoading(false)
        setModalVisible(false)
      } else {
        setIsLoading(false)
        toastRef?.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: message || 'An error occurred while saving the customer.',
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

  const handleClick = () => {
    if (editMode) {
      handleEdit()
    } else if (editCustomerMode) {
      handleCustomerUserEdit()
    } else {
      handleSave()
    }
  }

  const handleBack = () => {
    setModalVisible(false)
    setSelectedCustomerUser('')
    setSelectedCustomer('')
  }

  const fetchDataAndUpdate = useCallback(async () => {
    const { rolesData } = await getRolesData()
    const { countriesData } = await getCountriesData()

    if (rolesData !== null) {
      setIsLoading(false)
      setRolesData(rolesData)
    }
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
  }, [country?.id])

  const getUserHandler = async () => {
    try {
      setIsLoading(true)
      dispatch(setCustomerId(''))
      dispatch(setCustomerName(''))
      const response = await getUsersData({}).unwrap()
      const { status, message, content } = response as GetUserResponse
      if (status === 200 && Array.isArray(content)) {
        setIsLoading(false)
        if (content.length > 0) {
          const firstLastName = content?.map((item) => ({
            label: item.firstName + ' ' + item.lastName,
            value: item,
          }))
          setgetCustomerOwnerData(firstLastName)
        } else {
          setgetCustomerOwnerData([])
        }
      } else {
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Error occurred while fetching customer data:', error)
    }
  }

  useEffect(() => {
    if (firstErrorField) {
      document.getElementById(firstErrorField)?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [firstErrorField])

  useEffect(() => {
    if (role && (role?.id === 3 || role?.id === 4)) {
      setCustomerAdminDropdownEnabled(true)
    } else {
      setCustomerAdminDropdownEnabled(false)
    }
  }, [role])

  useEffect(() => {
    fetchDataAndUpdate()
    getUserHandler()
  }, [])

  useEffect(() => {
    if (country?.id) fetchStateDataAndUpdate()
  }, [country?.id])

  useEffect(() => {
    if (editMode || editCustomerMode) {
      handleEditMode()
    } else {
      dispatch(setCustomerId(selectedCustomerOwnerId))
      dispatch(setCustomerName(selectedCustomerOwnerName))
    }
  }, [editMode, editCustomerMode, customerData])

  return (
    <>
      <Toast ref={toastRef} />
      <div style={{ paddingBottom: '50px' }} className={isLoading ? 'blurred' : ''}>
        <div className="flex gap-8 mt-5 ml-4">
          <div>
            <span className="font-medium text-sm text-[#000000]">
              <div className="flex gap-1">
                First Name
                <p className="text-red-600">*</p>
              </div>
            </span>
            <div className="mt-1">
              <InputText
                value={firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={fieldErrors.firstName ? 'p-invalid' : ''}
                style={{
                  width: '232px',
                  height: '32px',
                  border: fieldErrors.firstName ? '1px solid red' : '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.8rem',
                  padding: '0.5rem',
                }}
              />
            </div>
            <p className="" id="firstName">
              {fieldErrors.firstName && <small className="p-error">{fieldErrors.firstName}</small>}
            </p>
          </div>

          <div>
            <span className="font-medium text-sm text-[#000000]">
              <div className="flex gap-1">
                Last Name
                <p className="text-red-600">*</p>
              </div>
            </span>
            <div className="mt-1">
              <InputText
                value={lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={fieldErrors.lastName ? 'p-invalid' : ''}
                style={{
                  width: '232px',
                  height: '32px',
                  border: fieldErrors.lastName ? '1px solid red' : '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.8rem',
                  padding: '0.5rem',
                }}
              />
            </div>

            <p className="" id="lastName">
              {fieldErrors.lastName && <small className="p-error">{fieldErrors.lastName}</small>}
            </p>
          </div>

          <div>
            <span className="font-medium text-sm text-[#000000]">
              <div className="flex gap-1">Phone</div>
            </span>
            <div className="mt-1">
              <InputText
                value={phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
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

        <div className="flex gap-8 ml-4">
          <div>
            <div className="mt-3">
              <span className="font-medium text-sm text-[#000000]">
                <div className="flex gap-1">
                  Email Address
                  <p className="text-red-600">*</p>
                </div>
              </span>
            </div>

            <div className="mt-1">
              <InputText
                value={email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                style={{
                  width: '230px',
                  height: '32px',
                  border:
                    fieldErrors.email ||
                    (errorMessage && errorMessage.includes('Email already present'))
                      ? '1px solid red'
                      : '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.8rem',
                  padding: '0.5rem',
                }}
              />
            </div>
            <p id="email">
              {fieldErrors.email && <small className="p-error">{fieldErrors.email}</small>}
            </p>
            <p>
              {errorMessage && errorMessage.includes('Email already present') && (
                <small className="p-error mt-1">Email already present</small>
              )}
            </p>
          </div>
          <div>
            <div className="mt-3">
              <span className="font-medium text-sm text-[#000000]">
                <div className="flex gap-1">Role</div>
              </span>
            </div>
            <div className="mt-1">
              <Dropdown
                value={role}
                onChange={(e) => {
                  setRole(e.value)
                  if (e.value !== 'FINANCE' || e.value !== 'TECHNICIAN') {
                    setSelectedCustomerId('')
                  }
                  if (!permission) {
                    setFieldErrors((prevErrors) => ({ ...prevErrors, role: '' }))
                  }
                }}
                options={rolesData}
                optionLabel="name"
                disabled={editCustomerMode || editMode}
                editable
                placeholder="Select"
                style={{
                  width: '230px',
                  height: '32px',
                  minHeight: '32px',
                  border: fieldErrors.role ? '1px solid red' : '1px solid #D5E1EA',
                  fontSize: '0.8rem',
                  color: 'gray,',
                  borderRadius: '0.50rem',
                  cursor: editCustomerMode || editMode ? 'not-allowed' : 'auto',
                }}
              />
            </div>
            <p className="" id="role">
              {fieldErrors.role && <small className="p-error">{fieldErrors.role}</small>}
            </p>
          </div>

          {!permission && customerAdminDropdownEnabled && (
            <div>
              <div className="mt-3">
                <span className="font-medium text-sm text-[#000000]">
                  <div className="flex gap-1">
                    Customer Owner
                    {customerAdminDropdownEnabled && <p className="text-red-600">*</p>}
                  </div>
                </span>
              </div>
              <div className="mt-1">
                <Dropdown
                  className="cursor-wait"
                  value={selectedCustomerName}
                  onChange={(e) => {
                    const firstLastName = e?.value?.firstName + ' ' + e?.value?.lastName
                    setSelectedCustomerName(firstLastName)
                    setSelectedCustomerId(e.value.id)
                    if (role?.id === 3 || role?.id === 4) {
                      setFieldErrors((prevErrors) => ({ ...prevErrors, selectedCustomerId: '' }))
                    }
                  }}
                  options={getCustomerOwnerData}
                  optionLabel="label"
                  optionValue="value"
                  editable
                  placeholder="Select"
                  disabled={customerAdminDropdownEnabled ? false : true}
                  style={{
                    width: '230px',
                    height: '32px',
                    minHeight: '32px',

                    border:
                      role?.id === 1 || role?.id === 2
                        ? '1px solid #D5E1EA'
                        : fieldErrors.selectedCustomerId
                          ? '1px solid red'
                          : '1px solid #D5E1EA',
                    fontSize: '0.8rem',
                    borderRadius: '0.50rem',
                    pointerEvents: customerAdminDropdownEnabled ? 'auto' : 'none',
                    opacity: customerAdminDropdownEnabled ? 1 : 0.5,
                    cursor: customerAdminDropdownEnabled ? 'pointer' : 'not-allowed',
                  }}
                />
              </div>
              <p className="" id="selectedCustomerId">
                {role?.id === 1 || role?.id === 2
                  ? ' '
                  : fieldErrors.selectedCustomerId && (
                      <small className="p-error">{fieldErrors.selectedCustomerId}</small>
                    )}
              </p>
            </div>
          )}

          {!permission && role?.id === 2 && (
            <div>
              <div className="mt-3">
                <span className="font-medium text-sm text-[#000000]">
                  <div className="flex gap-1">
                    Company Name
                    {role?.id === 2 && <p className="text-red-600">*</p>}
                  </div>
                </span>
              </div>

              <div className="mt-1">
                <InputText
                  value={companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  disabled={!(role?.id === 2)}
                  style={{
                    width: '230px',
                    height: '32px',
                    border:
                      fieldErrors.companyName && role?.id === 2
                        ? '1px solid red'
                        : '1px solid #D5E1EA',
                    borderRadius: '0.50rem',
                    fontSize: '0.8rem',
                    padding: '1.2em',
                  }}
                />
              </div>
              <p id="companyName">
                {role?.id === 2 && fieldErrors.companyName && (
                  <small className="p-error">{fieldErrors.companyName}</small>
                )}
              </p>
            </div>
          )}
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

        <div className="gap-8 mt-1 ml-4">
          <div className="flex gap-8 ">
            <div>
              <div className="mt-3">
                <span className="font-medium text-sm text-[#000000]">
                  <div className="flex gap-1">Country</div>
                </span>
              </div>
              <div className="mt-1">
                <Dropdown
                  value={country}
                  onChange={(e) => {
                    setCountry(e.value)
                  }}
                  options={countriesData}
                  optionLabel="name"
                  editable
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

            <div>
              <div className="mt-3">
                <span className="font-medium text-sm text-[#000000]">
                  <div className="flex gap-1">State</div>
                </span>
              </div>
              <div className="mt-1">
                <Dropdown
                  value={state}
                  onChange={(e) => {
                    setState(e.value)
                    setFieldErrors((prevErrors) => ({ ...prevErrors, state: '' }))
                  }}
                  options={statesData}
                  optionLabel="name"
                  editable
                  disabled={isLoading}
                  style={{
                    width: '230px',
                    height: '32px',
                    minHeight: '32px',
                    border: fieldErrors.state ? '1px solid red' : '1px solid #D5E1EA',
                    fontSize: '0.8rem',
                    borderRadius: '0.50rem',
                    color: 'gray',
                  }}
                />
              </div>
              <p className="" id="state">
                {fieldErrors.state && <small className="p-error">{fieldErrors.state}</small>}
              </p>
            </div>

            <div className="flex mt-3 gap-8 ">
              <div>
                <div className="mt-">
                  <span className="font-medium text-sm text-[#000000]">
                    <div className="flex gap-1">
                      Zip Code
                      {/* <p className="text-red-600">*</p> */}
                    </div>
                  </span>
                </div>
                <div className="mt-1">
                  <InputText
                    value={zipCode}
                    invalid
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    style={{
                      width: '230px',
                      height: '32px',
                      border: '1px solid #D5E1EA',
                      borderRadius: '0.50rem',
                      fontSize: '0.8rem',
                      padding: '0.83em',
                    }}
                  />
                </div>
                <p className="" id="state">
                  {fieldErrors.state && <small className="p-error">{fieldErrors.state}</small>}
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="mt-3">
              <span className="font-medium text-sm text-[#000000]">
                <div className="flex gap-1">Address</div>
              </span>
            </div>
            <div className="mt-1">
              <InputText
                value={address}
                invalid
                onChange={(e) => handleInputChange('address', e.target.value)}
                style={{
                  width: '230px',
                  height: '32px',
                  border: '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.8rem',
                  padding: '0.83em',
                }}
              />
            </div>
          </div>
        </div>
        {!passWordDisplay && (
          <div className="flex mt-5 gap-8 ml-4">
            <div>
              <span className="font-medium text-sm text-[#000000]">
                <div className="flex gap-1 text-center ">
                  Create Password
                  <p className="text-red-600">*</p>
                </div>
              </span>
              <div className="mt-1">
                <div style={{ position: 'relative', width: '230px', marginBottom: '10px' }}>
                  <InputComponent
                    value={password}
                    type="password"
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onBlur={handleBlur}
                    style={{
                      width: '230px',
                      height: '32px',
                      border:
                        fieldErrors.password || errorMessage
                          ? '1px solid red'
                          : '1px solid #D5E1EA',
                      borderRadius: '0.50rem',
                      fontSize: '0.8rem',
                      padding: '0.5rem',
                    }}
                  />

                  <p className=" w-48" id="password">
                    {fieldErrors.password || errorMessage ? (
                      <small className="p-error">
                        {fieldErrors.password}
                        {errorMessage}
                      </small>
                    ) : (
                      ''
                    )}
                  </p>
                </div>

                <div
                  style={{ width: '230px', fontSize: '14px' }}
                  id="password-message"
                  className="mt-2 hidden ">
                  <h3 className="font-medium text-sm text-[#000000] flex justify-center mr-3">
                    PASSWORD MUST CONTAIN:
                  </h3>
                  <div className="flex items-center gap-6 p-1 mt-2">
                    {passwordCriteria.uppercase ? (
                      <img src={'/assets/images/check-mark.png'} alt="icon" className="w-4" />
                    ) : (
                      <img src={'/assets/images/close.png'} alt="icon" className="w-3 " />
                    )}
                    <p
                      className={`password-message-item ${passwordCriteria.uppercase ? 'text-green-500' : 'text-red-500'}`}>
                      At least <span className="font-[500]"> one uppercase letter</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-6 p-1 ">
                    {passwordCriteria.lowercase ? (
                      <img src={'/assets/images/check-mark.png'} alt="icon" className="w-4" />
                    ) : (
                      <img src={'/assets/images/close.png'} alt="icon" className="w-3 " />
                    )}

                    <p
                      className={`password-message-item ${passwordCriteria.lowercase ? 'text-green-500' : 'text-red-500'}`}>
                      At least <span className="font-[500]">one lowercase letter</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-6 p-1 ">
                    {passwordCriteria.number ? (
                      <img src={'/assets/images/check-mark.png'} alt="icon" className="w-4" />
                    ) : (
                      <img src={'/assets/images/close.png'} alt="icon" className="w-3 " />
                    )}
                    <p
                      className={`password-message-item ${passwordCriteria.number ? 'text-green-500' : 'text-red-500'}`}>
                      At least<span className="font-[500]">one number</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-6 p-1 ">
                    {passwordCriteria.specialChar ? (
                      <img src={'/assets/images/check-mark.png'} alt="icon" className="w-4" />
                    ) : (
                      <img src={'/assets/images/close.png'} alt="icon" className="w-3 " />
                    )}
                    <p
                      className={`password-message-item ${passwordCriteria.specialChar ? 'text-green-500' : 'text-red-500'}`}>
                      At least<span className="font-[500]">one special character</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-6 p-1 ">
                    {passwordCriteria.length ? (
                      <img src={'/assets/images/check-mark.png'} alt="icon" className="w-4" />
                    ) : (
                      <img src={'/assets/images/close.png'} alt="icon" className="w-3 " />
                    )}
                    <p
                      className={`password-message-item ${passwordCriteria.length ? 'text-green-500' : 'text-red-500'}`}>
                      At least <span className="font-[500]">10 characters</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="">
              <span className="font-medium text-sm text-[#000000]">
                <div className="flex gap-1">
                  Confirm password
                  <p className="text-red-600">*</p>
                </div>
              </span>
              <div className="mt-1 ">
                <div style={{ position: 'relative', marginBottom: '10px' }}>
                  <InputComponent
                    value={confirmPassword}
                    type="password"
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    style={{
                      width: '230px',
                      height: '32px',
                      border: fieldErrors.confirmPassword ? '1px solid red' : '1px solid #D5E1EA',
                      borderRadius: '0.50rem',
                      fontSize: '0.8rem',
                      padding: '0.5rem',
                    }}
                  />

                  {fieldErrors.confirmPassword && (
                    <small className="p-error" id="confirmPassword">
                      {fieldErrors.confirmPassword}
                    </small>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div
        className={`"flex gap-4 ml-4 bottom-2 absolute left-6"  ${isLoading ? 'blurred' : ''}`}
        style={{
          width: '100%',
          height: '80px',
          backgroundColor: 'white',
          padding: '0 12px',
          marginBottom: '2px',
        }}>
        <Button
          label={'Save'}
          onClick={handleClick}
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
            top: '20px',
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
            top: '20px',
          }}
        />
      </div>
    </>
  )
}

export default AddNewCustomer
