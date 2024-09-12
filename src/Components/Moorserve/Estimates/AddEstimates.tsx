import React, { useState } from 'react'
import ButtonComponent from '../../CommonComponent/ButtonComponent'
import { InputTextarea } from 'primereact/inputtextarea'
import { InputText } from 'primereact/inputtext'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import InputComponent from '../../CommonComponent/InputComponent'
import { IoIosAdd } from 'react-icons/io'
import { GrFormSubtract } from 'react-icons/gr'
import { Button } from 'primereact/button'

const AddEstimates = () => {
  const [value, setValue] = useState<string>('')

  return (
    <div>
      <div className="w-full h-full">
        <h1 className=" text-lg font-bold">Estimate Form</h1>

        <div className="flex gap-8  mt-3">
          <div>
            <span className="font-semibold text-sm">Customer Name</span>
            <div className="mt-2">
              <InputComponent
                value={''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {}}
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
            <span className="font-semibold text-sm">Customer ID</span>
            <div className="mt-2">
              <InputComponent
                value={''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {}}
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
            <span className="font-semibold text-sm">Mooring ID</span>
            <div className="mt-2">
              <Dropdown
                value={''}
                onChange={() => {}}
                options={[]}
                optionLabel="name"
                editable
                placeholder="State"
                style={{
                  width: '13vw',
                  height: '4vh',
                  border: '1px solid gray',
                  borderRadius: '0.50rem',
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-8  mt-4 ">
          <div>
            <span className="font-semibold text-sm">Boatyards</span>
            <div className="mt-2">
              <InputText
                value={''}
                onChange={() => {}}
                placeholder="Street/house"
                style={{
                  width: '13vw',
                  height: '4vh',
                  border: '1px solid gray',
                  borderRadius: '0.50rem',
                }}
              />
            </div>
          </div>

          <div>
            <span className="font-semibold text-sm">Assigned to</span>
            <div className="mt-2">
              <Dropdown
                value={''}
                onChange={() => {}}
                options={[]}
                optionLabel="name"
                editable
                placeholder="State"
                style={{
                  width: '13vw',
                  height: '4vh',
                  border: '1px solid gray',
                  borderRadius: '0.50rem',
                }}
              />
            </div>
          </div>

          <div className="card  justify-content-center  ">
            <div>
              <span className="font-semibold text-sm">Due Date</span>
            </div>
            <div className="mt-2">
              <InputText
                value={''}
                onChange={() => {}}
                placeholder="Sector/Block"
                type="text"
                style={{
                  width: '13vw',
                  height: '4vh',
                  border: '1px solid gray',
                  borderRadius: '0.50rem',
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-8  mt-4 ">
          <div>
            <span className="font-semibold text-sm">Schedule Date</span>
            <div className="mt-2">
              <InputText
                value={''}
                onChange={() => {}}
                placeholder="Street/house"
                style={{
                  width: '13vw',
                  height: '4vh',
                  border: '1px solid gray',
                  borderRadius: '0.50rem',
                }}
              />
            </div>
          </div>

          <div>
            <span className="font-semibold text-sm">Status</span>
            <div className="mt-2">
              <Dropdown
                value={''}
                onChange={() => {}}
                options={[]}
                optionLabel="name"
                editable
                placeholder="State"
                style={{
                  width: '13vw',
                  height: '4vh',
                  border: '1px solid gray',
                  borderRadius: '0.50rem',
                }}
              />
            </div>
          </div>

          <div className="card  ">
            <span className="font-semibold text-sm">Time(in minutes)</span>
            <div
              className="mt-2"
              style={{
                width: '8vw',
                height: '4vh',
                border: '1px solid gray',
                borderRadius: '0.50rem',
              }}>
              <div className="flex justify-around text-center">
                <h1 className="mt-1 p-[0.1rem] bg-slate-400 rounded-md">
                  <GrFormSubtract />
                </h1>
                <p>00:25</p>
                <h1 className="mt-1 p-[0.1rem] bg-slate-400 rounded-md">
                  <IoIosAdd />
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="">
          <div className="mt-4">
            <span className="text-sm font-bold">Report Problem</span>
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
            onClick={() => {}}
            label={'Back'}
            text={true}
            style={{ backgroundColor: 'white', color: 'black', border: 'none' }}
          />
        </div>
      </div>
    </div>
  )
}

export default AddEstimates
