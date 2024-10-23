import React, { useState, useEffect, useCallback, useRef } from 'react'
import InputComponent from '../../CommonComponent/InputComponent'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import {
  useAddVendorsMutation,
  useUpdateVendorMutation,
} from '../../../Services/MoorManage/MoormanageApi'
import { Button } from 'primereact/button'
import { Country, State } from '../../../Type/CommonType'
import { AddVendorProps } from '../../../Type/ComponentBasedType'
import { ErrorResponse, VendorResponse } from '../../../Type/ApiTypes'
import { CountriesData, StatesData } from '../../CommonComponent/MetaDataComponent/MetaDataApi'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Toast } from 'primereact/toast'
import { formatPhoneNumber } from '../../Utils/RegexUtils'

const AddVendor: React.FC<AddVendorProps> = ({ vendors, editMode, closeModal, getVendor }) => {
  const [countriesData, setCountriesData] = useState<Country[]>()
  const [statesData, setStatesData] = useState<State[]>()
  const [remitAddressStatesData, setRemitAddressStatesData] = useState<State[]>()
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState<any>({
    companyName: '',
    phone: '',
    website: '',
    vendorAddress: '',
    remitAddress: '',
    countryForAddress: '',
    stateForAddress: '',
    zipCodeForAddress: '',
    emailForAddress: '',
    countryForRemit: '',
    stateForRemit: '',
    zipCodeForRemit: '',
    emailForRemit: '',
    accountNumber: '',
    firstName: '',
    lastName: '',
    phoneForRepresentative: '',
    emailForRepresentative: '',
    note: '',
  })
  const [addVendor] = useAddVendorsMutation()
  const [editVendor] = useUpdateVendorMutation()
  const { getStatesData } = StatesData(
    formData?.countryForAddress?.id ||
      vendors?.countryResponseDto?.id ||
      formData?.countryForRemit?.id,
  )
  const { getCountriesData } = CountriesData()
  const toastRef = useRef<Toast>(null)

  const validateAddVendorFields = () => {
    const errors: { [key: string]: string } = {}
    if (!formData.companyName) {
      errors.companyName = 'Vendor Name is required'
    }
    setFieldErrors(errors)
    return errors
  }

  const handleInputChange = (field: string, value: any) => {
    if (field === 'phone') {
      value = formatPhoneNumber(value)
    }
    if (field === 'phoneForRepresentative') {
      value = formatPhoneNumber(value)
    }
    const numberRegex = /^\d+$/
    if (field === 'accountNumber') {
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
      setStatesData([])
    }
  }, [formData?.countryForAddress?.id])

  const fetchRemitAddressStateDataAndUpdate = useCallback(async () => {
    const { statesData } = await getStatesData()
    if (statesData !== null) {
      setIsLoading(false)
      setRemitAddressStatesData(statesData)
    } else {
      setRemitAddressStatesData([])
    }
  }, [formData?.countryForRemit?.id])

  useEffect(() => {
    if (formData?.countryForAddress?.id) {
      fetchStateDataAndUpdate()
    }
    if (formData?.countryForRemit?.id) {
      fetchRemitAddressStateDataAndUpdate()
    }
  }, [formData?.countryForAddress?.id, formData?.countryForRemit?.id])

  useEffect(() => {
    fetchDataAndUpdate()
  }, [])

  const handleClick = () => {
    if (editMode) {
      updateVendor()
    } else {
      saveVendor()
    }
  }

  const handleEditMode = () => {
    setFormData((prevState: any) => ({
      ...prevState,
      companyName: vendors?.vendorName || '',
      phone: vendors?.companyPhoneNumber || '',
      website: vendors?.website || '',
      vendorAddress: vendors?.address || '',
      remitAddress: vendors?.remitAddress || '',
      countryForAddress: vendors?.countryResponseDto?.name || '',
      stateForAddress: vendors?.stateResponseDto?.name || '',
      zipCodeForAddress: vendors?.zipCode || '',
      emailForAddress: vendors?.companyEmail || '',
      countryForRemit: vendors?.remitCountryResponseDto?.name || '',
      stateForRemit: vendors?.remitStateResponseDto?.name || '',
      zipCodeForRemit: vendors?.remitZipCode || '',
      emailForRemit: vendors?.remitEmailAddress || '',
      accountNumber: vendors?.accountNumber || '',
      firstName: vendors?.firstName || '',
      lastName: vendors?.lastName || '',
      phoneForRepresentative: vendors?.salesRepPhoneNumber || '',
      emailForRepresentative: vendors?.salesRepEmail || '',
      note: vendors?.salesRepNote || '',
    }))
  }

  const saveVendor = async () => {
    const errors = validateAddVendorFields()
    if (Object.keys(errors).length > 0) {
      return
    }
    setIsLoading(true)
    try {
      const payload: any = {
        vendorName: formData?.companyName,
        ...(formData?.phone && { companyPhoneNumber: formData.phone }),
        ...(formData?.website && { website: formData.website }),
        ...(formData?.vendorAddress && { address: formData.vendorAddress }),
        ...(formData?.remitAddress && { remitAddress: formData.remitAddress }),
        ...(formData?.stateForAddress?.id && { stateId: formData.stateForAddress.id }),
        ...(formData?.countryForAddress?.id && { countryId: formData.countryForAddress.id }),
        ...(formData?.zipCodeForAddress && { zipCode: formData.zipCodeForAddress }),
        ...(formData?.emailForAddress && { companyEmail: formData.emailForAddress }),
        ...(formData?.accountNumber && { accountNumber: formData.accountNumber }),
        ...(formData?.stateForRemit?.id && { remitStateId: formData.stateForRemit.id }),
        ...(formData?.countryForRemit?.id && { remitCountryId: formData.countryForRemit.id }),
        ...(formData?.zipCodeForRemit && { remitZipCode: formData.zipCodeForRemit }),
        ...(formData?.emailForRemit && { remitEmailAddress: formData.emailForRemit }),
        ...(formData?.firstName && { firstName: formData.firstName }),
        ...(formData?.lastName && { lastName: formData.lastName }),
        ...(formData?.phoneForRepresentative && {
          salesRepPhoneNumber: formData.phoneForRepresentative,
        }),
        ...(formData?.emailForRepresentative && { salesRepEmail: formData.emailForRepresentative }),
        ...(formData?.note && { salesRepNote: formData.note }),
      }

      const response = await addVendor(payload).unwrap()
      const { status, message } = response as VendorResponse
      if (status === 200 || status === 201) {
        toastRef?.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Vendor Saved successfully',
          life: 3000,
        })
        closeModal()
        getVendor()
      } else {
        toastRef?.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        })
      }
    } catch (error) {
      const { message, data } = error as ErrorResponse
      toastRef?.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: message || data?.message,
        life: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateVendor = async () => {
    const errors = validateAddVendorFields()
    if (Object.keys(errors).length > 0) {
      return
    }
    setIsLoading(true)
    try {
      const payload = {
        vendorName: formData?.companyName || vendors?.vendorName,
        companyPhoneNumber: formData?.phone || vendors?.companyPhoneNumber,
        website: formData?.website || vendors?.website,
        stateId: formData?.stateForAddress?.id || vendors?.stateResponseDto?.id,
        countryId: formData?.countryForAddress?.id || vendors?.countryResponseDto?.id,
        zipCode: formData?.zipCodeForAddress || vendors?.zipCode,
        address: formData?.vendorAddress || vendors?.address,
        remitAddress: formData?.remitAddress || vendors?.remitAddress,
        companyEmail: formData?.emailForAddress || vendors?.companyEmail,
        accountNumber: formData?.accountNumber || vendors?.accountNumber,
        remitStateId: formData?.stateForRemit?.id || vendors?.remitStateResponseDto?.id,
        remitCountryId: formData?.countryForRemit?.id || vendors?.remitCountryResponseDto?.id,
        remitZipCode: formData?.zipCodeForRemit || vendors?.remitZipCode,
        remitEmailAddress: formData?.emailForRemit || vendors?.remitEmailAddress,
        firstName: formData?.firstName || vendors?.firstName,
        lastName: formData?.lastName || vendors?.lastName,
        salesRepPhoneNumber: formData?.phoneForRepresentative || vendors?.salesRepPhoneNumber,
        salesRepEmail: formData?.emailForRepresentative || vendors?.salesRepEmail,
        salesRepNote: formData?.note || vendors?.salesRepNote,
      }
      const response = await editVendor({
        payload: payload,
        id: vendors?.id,
      }).unwrap()
      const { status, message } = response as VendorResponse
      if (status === 200 || status === 201) {
        setIsLoading(false)
        toastRef?.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: message,
          life: 3000,
        })
        closeModal()
        getVendor()
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

  useEffect(() => {
    if (editMode && vendors) {
      handleEditMode()
    }
  }, [editMode, vendors])

  // useEffect(() => {
  //   fetchStateDataAndUpdate()
  // }, [formData?.countryForAddress?.id])

  useEffect(() => {
    formData?.countryForAddress?.id && fetchStateDataAndUpdate()
  }, [formData?.countryForAddress?.id])

  return (
    <>
      <Toast ref={toastRef} />
      <div className={isLoading ? 'blurred' : ''}>
        <div className="main">
          <div className="flex">
            <div className="flex gap-8">
              <div>
                <span style={{ fontWeight: '400', fontSize: '14px', color: '#000000' }}>
                  <div className="flex gap-1">
                    Vendor Name
                    <p className="text-red-600">*</p>
                  </div>
                </span>
                <div className="mt-2">
                  <InputComponent
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    value={formData.companyName}
                    style={{
                      width: '230px',
                      height: '32px',
                      border: fieldErrors.companyName ? '1px solid red' : '1px solid #D5E1EA',
                      borderRadius: '0.50rem',
                      fontSize: '0.70rem',
                      paddingLeft: '0.5rem',
                    }}
                  />
                </div>
                {fieldErrors.companyName && (
                  <small className="p-error">{fieldErrors.companyName}</small>
                )}
              </div>
              <div>
                <span style={{ fontWeight: '400', fontSize: '14px', color: '#000000' }}>
                  <div className="flex gap-1">Phone</div>
                </span>
                <div className="mt-2">
                  <InputComponent
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    value={formData.phone}
                    type="text"
                    style={{
                      width: '230px',
                      height: '32px',
                      border: '1px solid #D5E1EA',
                      borderRadius: '0.50rem',
                      fontSize: '0.70rem',
                      paddingLeft: '0.5rem',
                    }}
                  />
                </div>
              </div>
              <div>
                <span style={{ fontWeight: '400', fontSize: '14px', color: '#000000' }}>
                  <div className="flex gap-1">Website</div>
                </span>
                <div className="mt-2">
                  <InputComponent
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    value={formData.website}
                    style={{
                      width: '230px',
                      height: '32px',
                      border: '1px solid #D5E1EA',
                      borderRadius: '0.50rem',
                      fontSize: '0.70rem',
                      paddingLeft: '0.5rem',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex mt-3 gap-4">
            <div className="mt-5">
              <div>
                <h1 style={{ fontWeight: '400', fontSize: '14px', color: '#000000' }}>
                  <div className="flex gap-1">Address</div>
                </h1>
              </div>

              <div className=" flex gap-2 mt-2">
                <div>
                  <div></div>
                  <div>
                    <div className="mt-3">
                      <Dropdown
                        value={formData.countryForAddress}
                        onChange={(e) => handleInputChange('countryForAddress', e.target.value)}
                        options={countriesData}
                        optionLabel="name"
                        editable
                        placeholder="Country"
                        disabled={isLoading}
                        className=""
                        style={{
                          width: '178.39px',
                          height: '32px',
                          border: '1px solid #D5E1EA',
                          borderRadius: '0.50rem',
                          fontSize: '0.70rem',
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mt-3 ">
                      <InputComponent
                        type="text"
                        placeholder="Zip Code"
                        value={formData.zipCodeForAddress}
                        onChange={(e) => handleInputChange('zipCodeForAddress', e.target.value)}
                        style={{
                          width: '178.39px',
                          height: '32px',
                          border: '1px solid #D5E1EA',
                          borderRadius: '0.50rem',
                          fontSize: '0.70rem',
                          paddingLeft: '0.5rem',
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mt-2">
                      <InputComponent
                        placeholder="Email Address"
                        value={formData.emailForAddress}
                        onChange={(e) => handleInputChange('emailForAddress', e.target.value)}
                        style={{
                          width: '178.39px',
                          height: '32px',
                          border: '1px solid #D5E1EA',
                          borderRadius: '0.50rem',
                          fontSize: '0.70rem',
                          paddingLeft: '0.5rem',
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="">
                  <div>
                    <div className="mt-3">
                      <Dropdown
                        value={formData.stateForAddress}
                        onChange={(e) => handleInputChange('stateForAddress', e.target.value)}
                        options={statesData}
                        optionLabel="name"
                        editable
                        placeholder="State"
                        disabled={isLoading}
                        className=""
                        style={{
                          width: '178.39px',
                          height: '32px',
                          border: '1px solid #D5E1EA',
                          borderRadius: '0.50rem',
                          fontSize: '0.70rem',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mt-3 ">
                      <InputComponent
                        placeholder="Address"
                        value={formData.vendorAddress}
                        onChange={(e) => handleInputChange('vendorAddress', e.target.value)}
                        style={{
                          width: '178.39px',
                          height: '32px',
                          border: '1px solid #D5E1EA',
                          borderRadius: '0.50rem',
                          fontSize: '0.70rem',
                          paddingLeft: '0.5rem',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="mt-1 py-5 px-5 rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
                <div>
                  <h1 style={{ fontWeight: '400', fontSize: '14px', color: '#000000' }}>
                    <div className="flex gap-1">Remit Address</div>
                  </h1>
                </div>
                <div className="flex mt-2 gap-2">
                  <div className="mt-1">
                    <div>
                      <div className="">
                        <Dropdown
                          value={formData.countryForRemit}
                          onChange={(e) => handleInputChange('countryForRemit', e.target.value)}
                          options={countriesData}
                          optionLabel="name"
                          editable
                          placeholder="Country"
                          disabled={isLoading}
                          className=""
                          style={{
                            width: '178.39px',
                            height: '32px',
                            border: '1px solid #D5E1EA',
                            borderRadius: '0.50rem',
                            fontSize: '0.70rem',
                            backgroundColor: '#F5F5F5',
                          }}
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <InputComponent
                        type="text"
                        placeholder="Zip Code"
                        value={formData.zipCodeForRemit}
                        onChange={(e) => handleInputChange('zipCodeForRemit', e.target.value)}
                        style={{
                          width: '178.39px',
                          height: '32px',
                          border: '1px solid #D5E1EA',
                          borderRadius: '0.50rem',
                          fontSize: '0.70rem',
                          backgroundColor: '#F5F5F5',
                          paddingLeft: '0.5rem',
                        }}
                      />
                    </div>

                    <div className="mt-3">
                      <InputComponent
                        placeholder="Email Address"
                        value={formData.emailForRemit}
                        onChange={(e) => handleInputChange('emailForRemit', e.target.value)}
                        style={{
                          width: '178.39px',
                          height: '32px',
                          border: '1px solid #D5E1EA',
                          borderRadius: '0.50rem',
                          fontSize: '0.70rem',
                          backgroundColor: '#F5F5F5',
                          paddingLeft: '0.5rem',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div>
                      <div className="mt-1">
                        <Dropdown
                          onChange={(e) => handleInputChange('stateForRemit', e.target.value)}
                          value={formData.stateForRemit}
                          options={remitAddressStatesData}
                          optionLabel="name"
                          editable
                          placeholder="State"
                          disabled={isLoading}
                          className=""
                          style={{
                            width: '178.39px',
                            height: '32px',
                            border: '1px solid #D5E1EA',
                            borderRadius: '0.50rem',
                            fontSize: '0.70rem',
                            backgroundColor: '#F5F5F5',
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mt-3">
                        <InputComponent
                          placeholder="Address"
                          value={formData.remitAddress}
                          onChange={(e) => handleInputChange('remitAddress', e.target.value)}
                          style={{
                            width: '178.39px',
                            height: '32px',
                            border: '1px solid #D5E1EA',
                            borderRadius: '0.50rem',
                            fontSize: '0.70rem',
                            backgroundColor: '#F5F5F5',
                            paddingLeft: '0.5rem',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isLoading && (
          <ProgressSpinner
            style={{
              position: 'absolute',
              top: '35%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '50px',
              height: '50px',
            }}
            strokeWidth="4"
          />
        )}
        <div>
          <div className="mt-5">
            <div className="ml-1 text-black font-semibold text-sm">
              <span style={{ fontWeight: '400', fontSize: '14px', color: '#000000' }}>
                <div className="flex gap-1">Account Number</div>
              </span>
            </div>
            <div className="mt-2">
              <InputText
                value={formData.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                type="text"
                style={{
                  width: '230px',
                  height: '32px',
                  border: '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.70rem',
                  padding: '1em',
                }}
              />
            </div>
          </div>
        </div>

        <div
          className="py-3 pl-3 mb-20 mt-4 rounded-lg"
          style={{ backgroundColor: '#F5F5F5', height: '250px' }}>
          <div className="">
            <h1 style={{ fontWeight: '500', fontSize: '24px', color: '#000000' }}>
              Sales Representative
            </h1>
          </div>

          <div className="flex   mt-2 gap-4 ">
            <div className="mt-2">
              <div>
                <span style={{ fontWeight: '400', fontSize: '14px', color: '#000000' }}>
                  <div className="flex gap-1">First Name</div>
                </span>
              </div>
              <div className="mt-1">
                <InputComponent
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder=""
                  type="text"
                  style={{
                    width: '230px',
                    height: '32px',
                    border: '1px solid #D5E1EA',
                    borderRadius: '0.50rem',
                    fontSize: '0.70rem',
                    backgroundColor: '#F5F5F5',
                    paddingLeft: '0.5rem',
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mt-2">
                <div>
                  <span style={{ fontWeight: '400', fontSize: '14px', color: '#000000' }}>
                    <div className="flex gap-1">Last Name</div>
                  </span>
                </div>
                <div className="mt-1">
                  <InputComponent
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder=""
                    type="text"
                    style={{
                      width: '230px',
                      height: '32px',
                      border: '1px solid #D5E1EA',
                      borderRadius: '0.50rem',
                      fontSize: '0.70rem',
                      backgroundColor: '#F5F5F5',
                      paddingLeft: '0.5rem',
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="card flex justify-content-center mt-2 ">
              <div className="">
                <div>
                  <span style={{ fontWeight: '400', fontSize: '14px', color: '#000000' }}>
                    <div className="flex gap-1">Phone</div>
                  </span>
                </div>
                <div className="mt-1">
                  <InputComponent
                    value={formData.phoneForRepresentative}
                    onChange={(e) => handleInputChange('phoneForRepresentative', e.target.value)}
                    placeholder=""
                    type="text"
                    style={{
                      width: '230px',
                      height: '32px',
                      border: '1px solid #D5E1EA',
                      borderRadius: '0.50rem',
                      fontSize: '0.70rem',
                      backgroundColor: '#F5F5F5',
                      paddingLeft: '0.5rem',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mt-2">
              <div>
                <span style={{ fontWeight: '400', fontSize: '14px', color: '#000000' }}>
                  <div className="flex gap-1">Email</div>
                </span>
              </div>
              <div className="mt-1">
                <InputComponent
                  value={formData.emailForRepresentative}
                  onChange={(e) => handleInputChange('emailForRepresentative', e.target.value)}
                  placeholder=""
                  type="text"
                  style={{
                    width: '230px',
                    height: '32px',
                    border: '1px solid #D5E1EA',
                    borderRadius: '0.50rem',
                    fontSize: '0.70rem',
                    backgroundColor: '#F5F5F5',
                    paddingLeft: '0.5rem',
                  }}
                />
              </div>
            </div>

            <div className="mt-2">
              <div className="">
                <span style={{ fontWeight: '400', fontSize: '14px', color: '#000000' }}>
                  <div className="flex gap-1">Note</div>
                </span>
              </div>
              <div className="mt-1">
                <InputComponent
                  value={formData.note}
                  onChange={(e) => handleInputChange('note', e.target.value)}
                  style={{
                    width: '487.77px',
                    height: '32px',
                    border: '1px solid #D5E1EA',
                    borderRadius: '0.50rem',
                    fontSize: '0.70rem',
                    backgroundColor: '#F5F5F5',
                    boxShadow: 'none',
                    padding: '10px',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
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
    </>
  )
}

export default AddVendor
