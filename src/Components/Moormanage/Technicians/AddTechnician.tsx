import React, { useState } from 'react'
import ButtonComponent from '../../CommonComponent/ButtonComponent'
import { InputTextarea } from 'primereact/inputtextarea'
import InputComponent from '../../CommonComponent/InputComponent'
import { InputText } from 'primereact/inputtext'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { CityProps } from '../../../Type/CommonType'

const AddTechnication = () => {
  const [value, setValue] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState<CityProps | undefined>(undefined)
  const cities: CityProps[] = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
  ]

  return (
    <>
      <div className="main">
        <h1 className=" text-lg font-bold">Add Technician</h1>

        <div className="flex">
          <div className="flex mt-3 gap-8">
            <div>
              <div>
                <span className="font-semibold text-sm">Technician Name</span>
                <div className="mt-2">
                  <InputComponent
                    style={{
                      width: '13vw',
                      height: '4vh',
                      border: '1px solid gray',
                      borderRadius: '0.50rem',
                      fontSize: '0.80vw',
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="mt-2">
                  <span className="font-semibold text-sm">Email Address</span>
                </div>
                <div className="mt-2">
                  <InputComponent
                    style={{
                      width: '13vw',
                      height: '4vh',
                      border: '1px solid gray',
                      borderRadius: '0.50rem',
                      fontSize: '0.80vw',
                    }}
                  />
                </div>
              </div>
              <div></div>
            </div>

            <div className="">
              <div>
                <span className="font-semibold text-sm">Technician ID</span>
                <div className="mt-2">
                  <InputComponent
                    style={{
                      width: '13vw',
                      height: '4vh',
                      border: '1px solid gray',
                      borderRadius: '0.50rem',
                      fontSize: '0.80vw',
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="mt-2">
                  <span className="font-semibold text-sm">Phone</span>
                </div>
                <div className="mt-2">
                  <InputComponent
                    style={{
                      width: '13vw',
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

          <div className="w-4 h-4 rounded-full mr-3 border-5 border-[red] mt-20 ml-14">image</div>
        </div>

        <div className="">
          <div className="mt-4 ">
            <h1 className="text-sm font-bold">Address</h1>
          </div>
          <div className="flex justify-around  mt-2 gap-4 ">
            <div>
              <div className="mt-2">
                <InputText
                  placeholder="Street/house"
                  style={{
                    width: '14vw',
                    height: '4vh',
                    border: '1px solid gray',
                    borderRadius: '0.50rem',
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mt-2">
                <InputText
                  placeholder="Sector/Block"
                  type="text"
                  style={{
                    width: '14vw',
                    height: '4vh',
                    border: '1px solid gray',
                    borderRadius: '0.50rem',
                  }}
                />
              </div>
            </div>

            <div className="card flex justify-content-center mt-2 ">
              <Dropdown
                value={selectedCity}
                onChange={(e: DropdownChangeEvent) => setSelectedCity(e.value)}
                options={cities}
                optionLabel="name"
                editable
                placeholder="State"
                style={{
                  width: '14vw',
                  height: '4vh',
                  border: '1px solid gray',
                  borderRadius: '0.50rem',
                }}
              />
            </div>
          </div>

          <div className="flex mt-5 gap-5">
            <div className="card flex justify-content-center">
              <Dropdown
                value={selectedCity}
                onChange={(e: DropdownChangeEvent) => setSelectedCity(e.value)}
                options={cities}
                optionLabel="name"
                editable
                placeholder="Country"
                className=""
                style={{
                  width: '14vw',
                  height: '4vh',
                  border: '1px solid gray',
                  borderRadius: '0.50rem',
                }}
              />
            </div>
            <InputText
              placeholder="Pincode"
              style={{
                width: '14vw',
                height: '4vh',
                border: '1px solid gray',
                borderRadius: '0.50rem',
              }}
            />
          </div>
        </div>

        <div className="">
          <div className="mt-4">
            <span className="text-sm font-bold">Note</span>
          </div>

          <div className="mt-4">
            <div className="card flex justify-content-center">
              <InputTextarea
                className="w-full h-14"
                autoResize
                value={value}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)}
                rows={5}
                cols={30}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-4 ">
          <Button
            onClick={function (): void {
              throw new Error('Function not implemented.')
            }}
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

export default AddTechnication
