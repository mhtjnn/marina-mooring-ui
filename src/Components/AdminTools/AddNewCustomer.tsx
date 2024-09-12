import React, { useState, useEffect, useCallback } from 'react'
import { InputText } from 'primereact/inputtext'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import InputComponent from '../CommonComponent/InputComponent'
import { Country, Role, State } from '../../Type/CommonType'
import { CustomerAdminDataProps } from '../../Type/ComponentBasedType'
import useMetaData from '../CommonComponent/MetaDataComponent'
import { useAddCustomerMutation } from '../../Services/MoorManage/MoormanageApi'

const AddNewCustomer: React.FC<CustomerAdminDataProps> = ({
  customerData,
  editMode,
  getCustomer,
  closeModal,
  customerAdminId,
}) => {
  const [name, setName] = useState('')
  const [id, setId] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [street, setStreet] = useState('')
  const [apt, setApt] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [role, setRole] = useState<Role>()
  const [country, setCountry] = useState<Country>()
  const [state, setState] = useState<State>()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [addCustomer] = useAddCustomerMutation()
  const { getMetaData } = useMetaData()
  const [rolesData, setRolesData] = useState<Role[]>()
  const [countriesData, setCountriesData] = useState<Country[]>()
  const [statesData, setStatesData] = useState<State[]>()

  useEffect(() => {
    if (editMode && customerData) {
      setName(customerData.Name || '')
      setId(customerData.UserId || '')
      setPhone(customerData.Phone || '')
      setEmail(customerData.Email || '')
    }
  }, [editMode, customerData])

  const handleSave = async () => {
    const payload = {
      name: name,
      userID: id,
      phoneNumber: phone,
      email: email,
      street: street,
      apt: apt,
      zipCode: zipCode,
      password: password,
      state: state,
      country: country,
      role: role?.name,
      customerAdminId:customerAdminId,
    }
    const response = await addCustomer(payload)
    closeModal()
    getCustomer()
    //Api not implemented yet from backend
  }

  const fetchDataAndUpdate = useCallback(async () => {
    const { rolesData, countriesData, statesData } = await getMetaData()
    if (rolesData !== null) {
      setRolesData(rolesData)
    }

    if (countriesData !== null) {
      setCountriesData(countriesData)
    }

    if (statesData !== null) {
      setStatesData(statesData)
    }
  }, [])

  useEffect(() => {
    fetchDataAndUpdate()
  }, [fetchDataAndUpdate])

  return (
    <>
      <div className="ml-4">
        <div className="flex gap-6 mt-3 ">
          <div>
            <span className="font-semibold text-xs text-black">Name</span>
            <div className="mt-1">
              <InputText
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '15vw',
                  height: '5vh',
                  border: '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.80vw',
                  padding: '1.2em',
                }}
              />
            </div>
          </div>

          <div>
            <span className="font-semibold text-xs text-black">ID</span>
            <div className="mt-1">
              <InputText
                value={id}
                onChange={(e) => setId(e.target.value)}
                style={{
                  width: '15vw',
                  height: '5vh',
                  border: '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.80vw',
                  padding: '1.2em',
                }}
              />
            </div>
          </div>

          <div>
            <span className="font-semibold text-xs text-black">Phone</span>
            <div className="mt-1">
              <InputText
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: '15vw',
                  height: '5vh',
                  border: '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.80vw',
                  padding: '1.2em',
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-6 ">
          <div>
            <div className="mt-3">
              <span className="font-semibold text-xs text-black">Email Address</span>
            </div>

            <div className="mt-1">
              <InputText
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '15vw',
                  height: '5vh',
                  border: '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.80vw',
                  padding: '1.2em',
                }}
              />
            </div>
          </div>

          <div>
            <div className="mt-3">
              <span className="font-semibold text-xs text-black">Role</span>
            </div>

            <div className="mt-1">
              <Dropdown
                value={role}
                onChange={(e: DropdownChangeEvent) => setRole(e.value)}
                options={rolesData}
                optionLabel="name"
                editable
                placeholder="Select"
                style={{
                  width: '15vw',
                  height: '5vh',
                  border: '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-5">
          <h1 className="text-lg font-semibold">Address</h1>
        </div>

        <div className="gap-6 mt-4">
          <div className="flex gap-6 ">
            <div>
              <div className="mt-2">
                <InputText
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Street/house"
                  style={{
                    width: '15vw',
                    height: '5vh',
                    border: '1px solid #D5E1EA',
                    borderRadius: '0.50rem',
                    padding: '0.80em',
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mt-2">
                <InputText
                  value={apt}
                  onChange={(e) => setApt(e.target.value)}
                  placeholder="Apt/Suite"
                  type="text"
                  style={{
                    width: '15vw',
                    height: '5vh',
                    border: '1px solid #D5E1EA',
                    borderRadius: '0.50rem',
                    padding: '0.83em',
                  }}
                />
              </div>
            </div>

            <div className=" mt-2 ">
              <Dropdown
                value={state}
                onChange={(e: DropdownChangeEvent) => setState(e.value)}
                options={statesData}
                optionLabel="name"
                editable
                placeholder="State"
                style={{
                  width: '15vw',
                  height: '5vh',
                  border: '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                }}
              />
            </div>
          </div>

          <div className="flex mt-5 gap-6 ">
            <div className="card flex justify-content-center">
              <Dropdown
                value={country}
                onChange={(e: DropdownChangeEvent) => setCountry(e.value)}
                options={countriesData}
                optionLabel="name"
                editable
                placeholder="Country"
                className=""
                style={{
                  width: '15vw',
                  height: '5vh',
                  border: '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                }}
              />
            </div>
            <InputText
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Zipcode"
              style={{
                width: '15vw',
                height: '5vh',
                border: '1px solid #D5E1EA',
                borderRadius: '0.50rem',
                padding: '0.83em',
              }}
            />
          </div>
        </div>

        <div className="flex mt-5 gap-6">
          <div>
            <span className="font-semibold text-xs text-black">Create password</span>
            <div className="mt-1">
              <InputComponent
                style={{
                  width: '15vw',
                  height: '5vh',
                  border: '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.80vw',
                  padding: '1.2em',
                }}
              />
            </div>
          </div>
          <div className="">
            <span className="font-semibold text-xs text-black">Confirm password</span>
            <div className="mt-1 ">
              <InputComponent
                style={{
                  width: '15vw',
                  height: '5vh',
                  border: '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.80vw',
                  padding: '1.2em',
                }}
              />
            </div>
          </div>
        </div>

        {/* Save and Back buttons */}
        <div className="flex gap-6 mt-10 ">
          <Button
            label={'Save'}
            onClick={handleSave}
            style={{
              width: '6vw',
              height: '7vh',
              backgroundColor: '#0098FF',
              cursor: 'pointer',
              fontWeight: 'bolder',
              fontSize: '1vw',
              color: 'white',
              borderRadius: '0.50rem',
            }}
          />
          <Button
            label={'Back'}
            text={true}
            style={{ backgroundColor: 'white', color: 'black', border: 'none' }}
          />
        </div>
      </div>
    </>
  )
}

export default AddNewCustomer
