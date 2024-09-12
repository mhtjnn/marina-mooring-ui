import React, { useEffect, useState } from 'react'
import { InputTextarea } from 'primereact/inputtextarea'
import { InputText } from 'primereact/inputtext'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import InputComponent from '../../CommonComponent/InputComponent'
import { useAddMooringsMutation } from '../../../Services/MoorManage/MoormanageApi'
import { Button } from 'primereact/button'
import { CityProps } from '../../../Type/CommonType'
import { AddMooringProps } from '../../../Type/ComponentBasedType'

const AddMoorings: React.FC<AddMooringProps> = ({ moorings, editMode }) => {
  const [value, setValue] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState<CityProps | undefined>(undefined)
  const [saveMoorings] = useAddMooringsMutation()
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

  useEffect(() => {
    if (editMode && moorings) {
      setFormData({
        customerName: moorings.customerName || '',
        mooringNumber: moorings.mooringNumber || '',
        harbor: moorings.harbor || '',
        waterDepth: moorings.waterDepth || '',
        gpsCoordinates: moorings.gpsCoordinates || '',
        boatName: moorings.boatName || '',
        boatSize: moorings.boatSize || '',
        boatWeight: moorings.boatWeight || '',
        sizeOfWeight: moorings.sizeOfWeight || '',
        typeOfWeight: moorings.typeOfWeight || '',
        topChainCondition: moorings.topChainCondition || '',
        conditionOfEye: moorings.conditionOfEye || '',
        bottomChainCondition: moorings.bottomChainCondition || '',
        shackleSwivelCondition: moorings.shackleSwivelCondition || '',
        pennantCondition: moorings.pennantCondition || '',
        deptAtMeanHighWater: moorings.deptAtMeanHighWater || '',
      })
    }
  }, [editMode, moorings])

  const cities: CityProps[] = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const SaveMoorings = async () => {
    const payload = {
      ...formData,
    }
    const response = await saveMoorings(payload)
  }

  return (
    <>
      <div className="w-full h-full ">
        <div className="flex justify-around ">
          <div>
            <span className="font-semibold text-sm text-black">Customer Name</span>
            <div className="mt-2">
              <InputComponent
                value={formData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
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

          <div>
            <span className="font-semibold text-sm text-black">Mooring ID</span>
            <div className="mt-2">
              <InputComponent
                value={formData.mooringNumber}
                onChange={(e) => handleInputChange('mooringNumber', e.target.value)}
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

          <div>
            <span className="font-semibold text-sm text-black">Harbor</span>
            <div className="mt-2">
              <InputComponent
                value={formData.harbor}
                onChange={(e) => handleInputChange('harbor', e.target.value)}
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

        <div className="flex justify-around mt-3">
          <div>
            <span className="font-semibold text-sm text-black">Water Depth</span>
            <div className="mt-2">
              <InputComponent
                value={formData.waterDepth}
                onChange={(e) => handleInputChange('waterDepth', e.target.value)}
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

          <div>
            <span className="font-semibold text-sm text-black">G.P.S Cordinates</span>
            <div className="mt-2">
              <InputComponent
                value={formData.gpsCoordinates}
                onChange={(e) => handleInputChange('gpsCoordinates', e.target.value)}
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

          <div>
            <span className="font-semibold text-sm text-black">Boatyard Name</span>
            <div className="mt-2">
              <InputComponent
                value={formData.boatName}
                onChange={(e) => handleInputChange('boatName', e.target.value)}
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

        <div className="flex justify-around mt-3">
          <div>
            <span className="font-semibold text-sm text-black">Boat Name</span>
            <div className="mt-2">
              <InputComponent
                // placeholder="Enter owner name"
                // type="text"
                value={formData.boatName}
                onChange={(e) => handleInputChange('boatName', e.target.value)}
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

          <div className="">
            <span className="font-semibold text-sm text-black">Boat Size</span>
            <div className="mt-2">
              <InputComponent
                value={formData.boatSize}
                onChange={(e) => handleInputChange('boatSize', e.target.value)}
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

          <div className="">
            <div>
              <span className="font-semibold text-sm text-black">Type</span>
            </div>

            <div className="mt-2">
              <Dropdown
                value={formData.typeOfWeight}
                onChange={(e) => handleInputChange('typeOfWeight', e.value)}
                options={cities}
                optionLabel="name"
                editable
                placeholder="Skiff"
                style={{
                  width: '13vw',
                  height: '4.71vh',
                  border: '1px solid gray',
                  borderRadius: '0.50rem',
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-around mt-3">
          <div>
            <span className="font-semibold text-sm text-black">Weight</span>
            <div className="mt-2">
              <InputComponent
                value={formData.boatWeight}
                onChange={(e) => handleInputChange('boatWeight', e.target.value)}
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

          <div>
            <div>
              <span className="font-semibold text-sm text-black">Size of Weight</span>
            </div>

            <div className="mt-2">
              <Dropdown
                value={formData.sizeOfWeight}
                onChange={(e) => handleInputChange('sizeOfWeight', e.value)}
                options={cities}
                optionLabel="name"
                editable
                placeholder="Select"
                style={{
                  width: '13vw',
                  height: '4.71vh',
                  border: '1px solid gray',
                  borderRadius: '0.50rem',
                }}
              />
            </div>
          </div>

          <div>
            <div>
              <span className="font-semibold text-sm text-black">Type of Weight</span>
            </div>

            <div className="mt-2">
              <Dropdown
                value={formData.typeOfWeight}
                onChange={(e) => handleInputChange('typeOfWeight', e.value)}
                options={cities}
                optionLabel="name"
                editable
                placeholder="Select"
                style={{
                  width: '13vw',
                  height: '4.71vh',
                  border: '1px solid gray',
                  borderRadius: '0.50rem',
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-6 ml-3 mt-3">
          <div>
            <div>
              <div>
                <span className="font-semibold text-sm text-black">Top Chain Condition</span>
              </div>

              <div className="mt-2">
                <Dropdown
                  value={formData.topChainCondition}
                  onChange={(e) => handleInputChange('topChainCondition', e.value)}
                  options={cities}
                  optionLabel="name"
                  editable
                  placeholder="Select"
                  style={{
                    width: '13vw',
                    height: '4.71vh',
                    border: '1px solid gray',
                    borderRadius: '0.50rem',
                  }}
                />
              </div>
            </div>
            <div className="mt-3">
              <div>
                <span className="font-semibold text-sm text-black">Bootom Chain Condition</span>
              </div>

              <div className="mt-2">
                <Dropdown
                  value={formData.conditionOfEye}
                  onChange={(e) => handleInputChange('conditionOfEye', e.value)}
                  options={cities}
                  optionLabel="name"
                  editable
                  placeholder="Select"
                  style={{
                    width: '13vw',
                    height: '4.71vh',
                    border: '1px solid gray',
                    borderRadius: '0.50rem',
                  }}
                />
              </div>
            </div>
            <div className="mt-3">
              <div>
                <span className="font-semibold text-sm text-black">Pennant Condition</span>
              </div>

              <div className="mt-2">
                <Dropdown
                  value={selectedCity}
                  onChange={(e: DropdownChangeEvent) => setSelectedCity(e.value)}
                  options={cities}
                  optionLabel="name"
                  editable
                  placeholder="Select"
                  style={{
                    width: '13vw',
                    height: '4.71vh',
                    border: '1px solid gray',
                    borderRadius: '0.50rem',
                  }}
                />
              </div>
            </div>
          </div>

          <div className='ml-1'>
            <div>
              <div>
                <span className="font-semibold text-sm text-black">Condition of Eye</span>
              </div>
              <div className="mt-2">
                <Dropdown
                  value={formData.conditionOfEye}
                  onChange={(e) => handleInputChange('conditionOfEye', e.value)}
                  options={cities}
                  optionLabel="name"
                  editable
                  placeholder="Select"
                  style={{
                    width: '13vw',
                    height: '4.71vh',
                    border: '1px solid gray',
                    borderRadius: '0.50rem',
                  }}
                />
              </div>
            </div>
            <div className="mt-3">
              <div>
                <span className="font-semibold text-sm text-black">Shackle,Swivel Condition</span>
              </div>

              <div className="mt-2">
                <Dropdown
                  value={selectedCity}
                  onChange={(e: DropdownChangeEvent) => setSelectedCity(e.value)}
                  options={cities}
                  optionLabel="name"
                  editable
                  placeholder="Select"
                  style={{
                    width: '13vw',
                    height: '4.71vh',
                    border: '1px solid gray',
                    borderRadius: '0.50rem',
                  }}
                />
              </div>
            </div>
            <div className="mt-3">
              <div>
                <span className="font-semibold text-sm text-black">Dept at Mean High Water</span>
              </div>

              <div className="mt-2">
                <InputText
                  value={formData.deptAtMeanHighWater}
                  onChange={(e) => handleInputChange('deptAtMeanHighWater', e.target.value)}
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
          <div>
            <div>
              <span className="font-semibold text-sm  text-black">Pin on Map</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-10 ml-5">
          <Button
            onClick={SaveMoorings}
            label={'Save'}
            style={{
              width: '5vw',
              height: '7vh',
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
            onClick={function (): void {
              throw new Error('Function not implemented.')
            }}
            label={'Back'}
            text={true}
            style={{ backgroundColor: 'white', color: 'black', border: 'none' }}
          />
        </div>
      </div>
    </>
  )
}

export default AddMoorings
