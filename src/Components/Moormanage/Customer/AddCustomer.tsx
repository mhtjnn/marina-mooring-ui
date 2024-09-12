import React, { useEffect, useState } from 'react'
import InputComponent from '../../CommonComponent/InputComponent'
import { InputText } from 'primereact/inputtext'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import {
  useAddCustomerMutation,
  useUpdateCustomerMutation,
} from '../../../Services/MoorManage/MoormanageApi'
import { Button } from 'primereact/button'
import { CustomerDataProps } from '../../../Type/ComponentBasedType'
import { CityProps } from '../../../Type/CommonType'
import AddMoorings from '../Moorings/AddMoorings'
const AddCustomer: React.FC<CustomerDataProps> = ({
  customer,
  editMode,
  closeModal,
  getCustomer,
}) => {
  const [value, setValue] = useState<string>('')
  const [selectedCountry, setSelectedCountry] = useState<CityProps | undefined>(undefined)
  const [selectedState, setSelectedState] = useState<CityProps | undefined>(undefined)
  const [customerName, setCustomerName] = useState<string>('')
  const [customerId, setCustomerId] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [streetHouse, setStreetHouse] = useState<string>('')
  const [sectorBlock, setSectorBlock] = useState<string>('')
  const [pinCode, setPinCode] = useState<string>('')
  const [addCustomer] = useAddCustomerMutation()
  const [selectedCity, setSelectedCity] = useState<CityProps | undefined>(undefined)
  const [updateCustomer] = useUpdateCustomerMutation()

  const cities: CityProps[] = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
    { name: 'India', code: 'IND' },
    { name: 'Punjab', code: 'PNB' },
  ]
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
    topChainCondition: '',
    conditionOfEye: '',
    bottomChainCondition: '',
    shackleSwivelCondition: '',
    pennantCondition: '',
    deptAtMeanHighWater: '',
    note: '',
  })

  const SaveCustomer = async () => {
    const payload = {
      customerName,
      customerId,
      phone,
      emailAddress: email,
      streetHouse,
      sectorBlock,
      state: selectedState?.name || '',
      country: selectedCountry?.name || '',
      pinCode,
      note: value,
    }
    const response = await addCustomer(payload)
    closeModal()
    getCustomer()
  }

  const UpdateCustomer = async () => {
    const payload = {
      customerName,
      customerId,
      phone,
      emailAddress: email,
      streetHouse,
      sectorBlock,
      state: selectedState?.name || '',
      country: selectedCountry?.name || '',
      pinCode,
      note: value,
    }
    const response = await updateCustomer(payload)
    closeModal()
    getCustomer()
  }

  useEffect(() => {
    if (editMode && customer) {
      setValue(customer.note || '')
      setCustomerName(customer.customerName || '')
      setCustomerId(customer.customerId || '')
      setPhone(customer.phone || '')
      setEmail(customer.emailAddress || '')
      setStreetHouse(customer.streetHouse || '')
      setSectorBlock(customer.sectorBlock || '')
      setPinCode(customer.pinCode || '')

      const selectedCountry = cities.find((city) => city.name === customer.country)
      setSelectedCountry(selectedCountry || undefined)

      const selectedState = cities.find((city) => city.name === customer.state)
      setSelectedState(selectedState || undefined)
    }
  }, [editMode, customer])

  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  return (
    <div className="w-full h-full ">
      {/* <h1 className="ml-5 text-xl text-black font-bold">Add Customer</h1> */}
      <div className="flex gap-10">
        <div className="">
          <div>
            <span className="font-semibold text-sm ml-5 text-black">Customer Name</span>
            <div className="mt-2 ml-5">
              <InputComponent
                value={customerName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCustomerName(e.target.value)
                }
                style={{
                  width: '13vw',
                  height: '4.71vh',
                  border: '1px solid gray',
                  borderRadius: '0.50rem',
                  fontSize: '0.80vw',
                }}
              />
            </div>
          </div>
          <div className="mt-4 ml-5 ">
            <div>
              <div>
                <span className="font-semibold text-sm text-black">Email Address</span>
              </div>
              <div className="mt-2">
                <InputText
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  style={{
                    width: '13vw',
                    height: '4.71vh',
                    border: '1px solid gray',
                    borderRadius: '0.50rem',
                    fontSize: '0.80vw',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <div>
            <span className="font-semibold text-sm text-black">Customer ID</span>
            <div className="mt-2">
              <InputComponent
                value={customerId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerId(e.target.value)}
                style={{
                  width: '13vw',
                  height: '4.71vh',
                  border: '1px solid gray',
                  borderRadius: '0.50rem',
                  fontSize: '0.80vw',
                }}
              />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-semibold text-sm text-black">Phone</span>
            <div className="mt-2">
              <InputComponent
                value={phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                style={{
                  width: '13vw',
                  height: '4.71vh',
                  border: '1px solid gray',
                  borderRadius: '0.50rem',
                  fontSize: '0.80vw',
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <div className="mt-4 ml-5">
          <h1 className="text-sm font-bold text-black">Address</h1>
        </div>
        <div className="flex justify-around ml-3 mt-4 ">
          <div>
            <div className="mt-2">
              <InputText
                value={streetHouse}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setStreetHouse(e.target.value)
                }
                placeholder="Street/house"
                style={{
                  width: '14vw',
                  height: '4.71vh',
                  border: '1px solid gray',
                  borderRadius: '0.50rem',
                  color: 'black',
                }}
              />
            </div>
          </div>
          <div>
            <div className="mt-2">
              <InputText
                value={sectorBlock}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSectorBlock(e.target.value)
                }
                placeholder="Apt/Suite"
                type="text"
                style={{
                  width: '14vw',
                  height: '4.71vh',
                  border: '1px solid gray',
                  borderRadius: '0.50rem',
                  color: 'black',
                }}
              />
            </div>
          </div>
          <div className="card flex justify-content-center mt-2 ">
            <Dropdown
              value={selectedState}
              onChange={(e: DropdownChangeEvent) => setSelectedState(e.value)}
              options={cities}
              optionLabel="name"
              editable
              placeholder="State"
              style={{
                width: '14vw',
                height: '4.71vh',
                border: '1px solid gray',
                borderRadius: '0.50rem',
                color: 'black',
              }}
            />
          </div>
        </div>
        <div className="flex mt-5 gap-2 ml-4">
          <div className="card flex justify-content-center">
            <Dropdown
              value={selectedCountry}
              onChange={(e: DropdownChangeEvent) => setSelectedCountry(e.value)}
              options={cities}
              optionLabel="name"
              editable
              placeholder="Country"
              className=""
              style={{
                width: '14vw',
                height: '4.71vh',
                border: '1px solid gray',
                borderRadius: '0.50rem',
              }}
            />
          </div>
          <div>
            <InputText
              value={pinCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPinCode(e.target.value)}
              placeholder="Zipcode"
              style={{
                width: '14vw',
                height: '4.71vh',
                border: '1px solid gray',
                borderRadius: '0.50rem',
              }}
              // className="shadow-none"
            />
          </div>
        </div>
      </div>
      <div className="ml-4 mt-8 text-xl text-black font-semibold">
        <h3>Add Mooring</h3>
      </div>
      <div className="mt-8 ml-2">
        <AddMoorings moorings={formData} editMode={editMode} />
      </div>
    </div>
  )
}

export default AddCustomer
