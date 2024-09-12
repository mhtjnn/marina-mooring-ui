import React, { useState, useEffect } from 'react'
import { InputTextarea } from 'primereact/inputtextarea'
import InputComponent from '../../CommonComponent/InputComponent'
import { InputText } from 'primereact/inputtext'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { Checkbox } from 'primereact/checkbox'
import { useAddVendorsMutation } from '../../../Services/MoorManage/MoormanageApi'
import { Button } from 'primereact/button'
import { CityProps } from '../../../Type/CommonType'
import { AddVendorProps } from '../../../Type/ComponentBasedType'

const AddVendor: React.FC<AddVendorProps> = ({ vendors, editMode, closeModal, getVendor }) => {
  const [checked, setChecked] = useState<boolean>(false)
  const [companyName, setCompanyName] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [website, setWebsite] = useState<string>('')
  const [streetBuilding, setStreetBuilding] = useState<string>('')
  const [aptSuite, setAptSuite] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState<CityProps | undefined>(undefined)
  const [addressZipCode, setAddressZipCode] = useState<number | undefined>(undefined)
  const [remitStreetBuilding, setRemitStreetBuilding] = useState<string>('')
  const [remitAptSuite, setRemitAptSuite] = useState<string>('')
  const [remitZipCode, setRemitZipCode] = useState<number | undefined>(undefined)
  const [emailAddress, setEmailAddress] = useState<string>('')
  const [accountNumber, setAccountNumber] = useState<string>('')
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [salesRepPhone, setSalesRepPhone] = useState<string>('')
  const [salesRepEmail, setSalesRepEmail] = useState<string>('')
  const [note, setNote] = useState<string>('')
  const [addVendor] = useAddVendorsMutation()

  useEffect(() => {
    if (editMode) {
      setCompanyName(vendors.companyName || '')
      setPhone(vendors.companyPhoneNumber || '')
      setWebsite(vendors.website || '')
      setStreetBuilding(vendors.street || '')
      setAptSuite(vendors.aptSuite || '')
      setSelectedCity({ name: vendors.country, code: '' })
      setAddressZipCode(vendors.zipCode || undefined)
      setEmailAddress(vendors.companyEmail || '')
      setAccountNumber(vendors.accountNumber || '')
      setFirstName(vendors.firstName || '')
      setLastName(vendors.lastName || '')
      setSalesRepPhone(vendors.salesRepPhoneNumber || '')
      setSalesRepEmail(vendors.salesRepEmail || '')
      setNote(vendors.salesRepNote || '')
    } else {
      setCompanyName('')
      setPhone('')
      setWebsite('')
      setStreetBuilding('')
      setAptSuite('')
      setSelectedCity(undefined)
      setAddressZipCode(undefined)
      setEmailAddress('')
      setAccountNumber('')
      setFirstName('')
      setLastName('')
      setSalesRepPhone('')
      setSalesRepEmail('')
      setNote('')
    }
  }, [editMode, vendors])

  const cities: CityProps[] = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
  ]

  const saveVendor = async () => {
    const payload = {
      companyName: companyName,
      companyPhoneNumber: phone,
      website: website,
      street: streetBuilding,
      aptSuite: aptSuite,
      country: selectedCity?.name || '',
      zipCode: addressZipCode,
      companyEmail: emailAddress,
      accountNumber: accountNumber,
      firstName: firstName,
      lastName: lastName,
      salesRepPhoneNumber: salesRepPhone,
      salesRepEmail: salesRepEmail,
      salesRepNote: note,
      primarySalesRep: true,
    }
    const response = await addVendor(payload)
  }

  return (
    <>
      <div className="main">
        <div className="flex">
          <div className="flex gap-8">
            <div>
              <span className="font-semibold text-sm text-black">Company Name</span>
              <div className="mt-2">
                <InputComponent
                  value={companyName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCompanyName(e.target.value)
                  }
                  style={{
                    width: '12vw',
                    height: '4vh',
                    border: '1px solid gray',
                    borderRadius: '0.50rem',
                    fontSize: '0.80vw',
                  }}
                />
              </div>
            </div>
            <div>
              <span className="font-semibold text-sm text-black">Phone</span>
              <div className="mt-2">
                <InputComponent
                  value={phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                  style={{
                    width: '12vw',
                    height: '4vh',
                    border: '1px solid gray',
                    borderRadius: '0.50rem',
                    fontSize: '0.80vw',
                  }}
                />
              </div>
            </div>
            <div>
              <span className="font-semibold text-sm text-black">Website</span>
              <div className="mt-2">
                <InputComponent
                  value={website}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWebsite(e.target.value)}
                  style={{
                    width: '10vw',
                    height: '4vh',
                    border: '1px solid gray',
                    borderRadius: '0.50rem',
                    fontSize: '0.80vw',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="mt-5 ml-1 flex">
            <div>
              <h1 className="text-sm font-bold text-black">Address</h1>
            </div>
            <div className="ml-[16.50rem]">
              <h1 className="text-sm font-bold text-black">Remit Address</h1>
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <div>
              <div className="mt-2">
                <InputText
                  placeholder="Street/Building"
                  value={streetBuilding}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setStreetBuilding(e.target.value)
                  }
                  style={{
                    width: '10vw',
                    height: '4vh',
                    border: '1px solid gray',
                    borderRadius: '0.50rem',
                    fontSize: '0.70rem',
                  }}
                />
              </div>
            </div>
            <div>
              <div className="mt-2">
                <InputText
                  placeholder="Apt/Suite"
                  value={aptSuite}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAptSuite(e.target.value)}
                  style={{
                    width: '10vw',
                    height: '4vh',
                    border: '1px solid gray',
                    borderRadius: '0.50rem',
                    fontSize: '0.70rem',
                  }}
                />
              </div>
            </div>
            <div>
              <div className="mt-2">
                <InputText
                  placeholder="Street/Building"
                  value={remitStreetBuilding}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setRemitStreetBuilding(e.target.value)
                  }
                  style={{
                    width: '10vw',
                    height: '4vh',
                    border: '1px solid gray',
                    borderRadius: '0.50rem',
                    fontSize: '0.70rem',
                  }}
                />
              </div>
            </div>
            <div>
              <div className="mt-2">
                <InputText
                  placeholder="Apt/Suite"
                  value={remitAptSuite}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setRemitAptSuite(e.target.value)
                  }
                  style={{
                    width: '10vw',
                    height: '4vh',
                    border: '1px solid gray',
                    borderRadius: '0.50rem',
                    fontSize: '0.70rem',
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex mt-5 gap-2">
            <div className="">
              <Dropdown
                value={selectedCity}
                onChange={(e: DropdownChangeEvent) => setSelectedCity(e.value as CityProps)}
                options={cities}
                optionLabel="name"
                editable
                placeholder="Country"
                className=""
                style={{
                  width: '10vw',
                  height: '4vh',
                  border: '1px solid gray',
                  borderRadius: '0.50rem',
                  fontSize: '0.40rem',
                }}
              />
            </div>
            <div>
              <Dropdown
                value={selectedCity}
                onChange={(e: DropdownChangeEvent) => setSelectedCity(e.value as CityProps)}
                options={cities}
                optionLabel="name"
                editable
                placeholder="State"
                className=""
                style={{
                  width: '10vw',
                  height: '4vh',
                  border: '1px solid gray',
                  borderRadius: '0.50rem',
                  fontSize: '0.70rem',
                }}
              />
            </div>
            <div className="">
              <Dropdown
                value={selectedCity}
                onChange={(e: DropdownChangeEvent) => setSelectedCity(e.value as CityProps)}
                options={cities}
                optionLabel="name"
                editable
                placeholder="Country"
                className=""
                style={{
                  width: '10vw',
                  height: '4vh',
                  border: '1px solid gray',
                  borderRadius: '0.50rem',
                  fontSize: '0.70rem',
                }}
              />
            </div>
            <div className="">
              <Dropdown
                value={selectedCity}
                onChange={(e: DropdownChangeEvent) => setSelectedCity(e.value as CityProps)}
                options={cities}
                optionLabel="name"
                editable
                placeholder="State"
                className=""
                style={{
                  width: '10vw',
                  height: '4vh',
                  border: '1px solid gray',
                  borderRadius: '0.50rem',
                  fontSize: '0.70rem',
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex mt-2 gap-2">
          {/* Address Zip Code */}
          <div className="mt-2 ">
            <InputText
              type="number"
              placeholder="Zip Code"
              value={addressZipCode !== undefined ? addressZipCode.toString() : ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const inputVal = e.target.value
                const newValue = inputVal !== '' ? parseInt(inputVal, 10) : undefined
                setAddressZipCode(newValue)
              }}
              style={{
                width: '10vw',
                height: '4vh',
                border: '1px solid gray',
                borderRadius: '0.50rem',
                fontSize: '0.70rem',
              }}
            />
          </div>
          <div className="mt-2 ">
            <InputText
              placeholder="Email Address"
              value={emailAddress}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailAddress(e.target.value)}
              style={{
                width: '10vw',
                height: '4vh',
                border: '1px solid gray',
                borderRadius: '0.50rem',
                fontSize: '0.70rem',
              }}
            />
          </div>
          <div className="mt-2 ">
            <InputText
              placeholder="Zip Code"
              value={remitZipCode !== undefined ? remitZipCode.toString() : ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const inputVal = e.target.value
                const newValue = inputVal !== '' ? parseInt(inputVal, 10) : undefined
                setRemitZipCode(newValue)
              }}
              style={{
                width: '10vw',
                height: '4vh',
                border: '1px solid gray',
                borderRadius: '0.50rem',
                fontSize: '0.70rem',
              }}
            />
          </div>

          {/* Remit Email Address */}
          <div className="mt-2 ">
            <InputText
              placeholder="Email Address"
              value={emailAddress}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailAddress(e.target.value)}
              style={{
                width: '10vw',
                height: '4vh',
                border: '1px solid gray',
                borderRadius: '0.50rem',
                fontSize: '0.70rem',
              }}
            />
          </div>
        </div>
      </div>

      <div>
        <div className="mt-8">
          <div className="ml-1 text-black font-semibold text-sm">
            <span>Account Number</span>
          </div>
          <div className="mt-1">
            <InputText
              value={accountNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAccountNumber(e.target.value)
              }
              type="text"
              style={{
                width: '14vw',
                height: '4vh',
                border: '1px solid gray',
                borderRadius: '0.50rem',
                fontSize: '0.70rem',
                padding:"1em"
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 bg-slate-50">
        <div className="">
          <h1 className="text-sm font-bold">Sales Representative</h1>
        </div>

        <div className="flex   mt-2 gap-2 ">
          <div className="mt-2">
            <div>
              <span>First Name</span>
            </div>
            <div className="mt-1">
              <InputText
                placeholder=""
                type="text"
                style={{
                  width: '12vw',
                  height: '4vh',
                  border: '1px solid gray',
                  borderRadius: '0.50rem',
                  fontSize: '0.70rem',
                }}
              />
            </div>
          </div>

          <div>
            <div className="mt-2">
              <div>
                <span>Last Name</span>
              </div>
              <div className="mt-1">
                <InputText
                  value={firstName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFirstName(e.target.value)
                  }
                  placeholder=""
                  type="text"
                  style={{
                    width: '12vw',
                    height: '4vh',
                    border: '1px solid gray',
                    borderRadius: '0.50rem',
                    fontSize: '0.70rem',
                  }}
                />
              </div>
            </div>
          </div>

          <div className="card flex justify-content-center mt-2 ">
            <div className="">
              <div>
                <span>Phone</span>
              </div>
              <div className="mt-1">
                <InputText
                  value={salesRepEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSalesRepEmail(e.target.value)
                  }
                  placeholder=""
                  type="text"
                  style={{
                    width: '12vw',
                    height: '4vh',
                    border: '1px solid gray',
                    borderRadius: '0.50rem',
                    fontSize: '0.70rem',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex mt-5 gap-4">
          <div className="mt-2">
            <div>
              <span>Email</span>
            </div>
            <div className="mt-1">
              <InputText
                placeholder=""
                type="text"
                style={{
                  width: '14vw',
                  height: '4vh',
                  border: '1px solid gray',
                  borderRadius: '0.50rem',
                  fontSize: '0.70rem',
                }}
              />
            </div>
          </div>

          <div className="mt-1">
            <div className="">
              <span>Note</span>
            </div>
            <div className="mt-1">
              <InputTextarea
                className="w-[25vw] h-[1vh] rounded-lg  border-[1px] border-gray-500"
                autoResize
                value={note}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
                rows={5}
                cols={30}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card flex justify-content-center gap-3">
        <Checkbox onChange={(e) => setChecked(e.checked ?? false)} checked={checked}></Checkbox>

        <div>
          <p>Primary Sales Representative</p>
        </div>
      </div>

      <div className="flex gap-3 mt-4 ">
        <Button
          onClick={saveVendor}
          label={'Save'}
          style={{
            width: '5vw',
            backgroundColor: 'black',
            cursor: 'pointer',
            fontWeight: 'bolder',
            fontSize: '1vw',
            border: '1px solid  gray',
            color: 'white',
            borderRadius: '0.50rem',
          }}
        />
        <Button
          onClick={closeModal}
          label={'Back'}
          text={true}
          style={{ backgroundColor: 'white', color: 'black', border: 'none' }}
        />
      </div>
    </>
  )
}

export default AddVendor
