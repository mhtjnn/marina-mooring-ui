import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { useState } from 'react'
import { FaCircle } from 'react-icons/fa6'
import Timeline from '../CustomComponent/Timeline'
import Accordition from '../CommonComponent/Accordion'
import { BillsData, BoatData } from '../../Type/ComponentBasedType'
import { NullableDateArray } from '../../Type/CommonType'
import DataTableComponent from '../CommonComponent/Table/DataTableComponent'

const Dashboard = () => {
  const [date, setDate] = useState<NullableDateArray>(null)
  const options: string[] = ['Pending', 'Cleared']
  const [value, setValue] = useState<string>(options[0])
  const Boatsheader = (
    <div className="flex flex-wrap align-items-center justify-between gap-2 p-4">
      <span className="text-xl font-extrabold">Moorings Due for Service</span>
      <span
        style={{
          fontFamily: 'Lato',
          fontSize: '14px',
          fontWeight: 700,
          lineHeight: '16.8px',
          letterSpacing: '0.4837472140789032px',
          textAlign: 'right',
        }}
        className="font-[Lato], font-bold leading-4 text-right tracking-tight">
        View All
      </span>
    </div>
  )

  return (
    <>
      <div className="flex ml-12 hello">
        <div>
          <h1 className="mt-14 ml-12 opacity-30 text-2xl font-normal">DASHBOARD</h1>
        </div>
      </div>

      <div className="flex justify-between p-4 ml-8">
        <div className="flex flex-col ">
          <div className="w-[43vw] h-14 mt-11">
            <img src="/assets/images/map.png" />
            <div className="-translate-y-[45vh] translate-x-[5vw]">
              <Timeline />
            </div>
            <div className="-translate-y-[45vh] translate-x-[20vw]">
              <Timeline />
            </div>
          </div>
          <div className="absolute -translate-y-[19vh] translate-x-[25vw] bottom-0  rounded-md border-[1px] p-1 border-gray-300 w-[17vw] h-[13vh] bg-white">
            <p className="text-[0.7rem] ml-1  text-black">Status</p>
            <hr className="m-1 border-black" />
            <div className="flex">
              <div>
                <FaCircle className="h-3 text-red-600 mt-1" />
                <FaCircle className="h-3 text-green-600 mt-4" />
              </div>
              <div>
                <p className="text-[0.6rem] text-black mt-1">Need inspection</p>
                <p className="text-[0.6rem] text-black tracking-tighter mt-[0.9rem]">
                  Gear On (in the water)
                </p>
              </div>
              <div className="ml-1">
                <FaCircle className="h-3 text-violet-600 mt-1 " />
                <FaCircle className="h-3 text-gray-500 mt-4" />
              </div>
              <div>
                <p className="text-[0.6rem] text-black tracking-tighter mt-1">
                  Gear Off (out of the water)
                </p>
                <p className="text-[0.6rem] text-black tracking-tighter mt-[0.9rem]">Not in Use</p>
              </div>
            </div>
          </div>
          <div className="bg-[#F2F2F2] rounded-xl border-[1px] border-[#D1D1D1] p- mt-[20rem] w-[43vw] ">
            <DataTableComponent
              header={Boatsheader}
              tableStyle={{
                fontSize: '0.90rem',
                fontWeight: 'bold',
              }}
              scrollable={true}
              columns={[]}
            />
          </div>
        </div>
        <div className="mr-50 mt-11">
          <Accordition />
        </div>
      </div>
    </>
  )
}

export default Dashboard
