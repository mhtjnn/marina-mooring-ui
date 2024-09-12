import { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { TimeCardsProps } from '../../../Type/ComponentBasedType'

const Timecards = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [boatData, setBoatData] = useState<TimeCardsProps[]>([
    {
      id: '01',
      boatName: 'Suncatcher',
      name: 'John Smith',
      date: '15, March 2024 to 15, March 2024',
      measurement: 'Length: 10m, Width: 3.8m',
      place: 'Boatyard',
    },
    {
      id: '01',
      boatName: 'Suncatcher',
      name: 'John Smith',
      date: '15, March 2024 to 15, March 2024',
      measurement: 'Length: 10m, Width: 3.8m',
      place: 'Boatyard',
    },
    {
      id: '01',
      boatName: 'Suncatcher',
      name: 'John Smith',
      date: '15, March 2024 to 15, March 2024',
      measurement: 'Length: 10m, Width: 3.8m',
      place: 'Boatyard',
    },
    {
      id: '01',
      boatName: 'Suncatcher',
      name: 'John Smith',
      date: '15, March 2024 to 15, March 2024',
      measurement: 'Length: 10m, Width: 3.8m',
      place: 'Boatyard',
    },
  ])

  const handleButtonClick = () => {
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const header = (
    <div className="flex flex-wrap align-items-center justify-between gap-2 p-4">
      <span className="text-xl font-bold">Time Cards</span>
      <span
        style={{
          fontFamily: 'Lato',
          fontSize: '14px',
          fontWeight: 700,
          lineHeight: '16.8px',
          letterSpacing: '0.4837472140789032px',
          textAlign: 'right',
        }}>
        View All
      </span>
    </div>
  )

  return (
    <>
      <div className="flex justify-between items-center ml-12">
        <div>
          <h1 className="mt-14 ml-8 opacity-30 text-2xl font-normal">Moormanage/Time Cards</h1>
        </div>
      </div>
      <div className="bg-[#F2F2F2] rounded-md border-[1px] border-[#D1D1D1] p-2 mt-12 w-[65vw] ml-20">
        <DataTable value={boatData} header={header} tableStyle={{}}>
          <Column header="ID" field="id" style={{ width: '5vw', fontSize: '0.80rem' }}></Column>
          <Column
            field="boatName"
            header="Boat Name"
            style={{ width: '8vw', fontSize: '0.80rem' }}></Column>
          <Column field="name" header="Name" style={{ width: '8vw', fontSize: '0.80rem' }}></Column>
          <Column
            field="date"
            header="Date"
            style={{ width: '12vw', fontSize: '0.80rem' }}></Column>
          <Column
            field="measurement"
            header="Measurement"
            style={{ width: '8vw', fontSize: '0.80rem' }}></Column>
          <Column
            field="place"
            header="Place"
            style={{ width: '5vw', fontSize: '0.80rem' }}></Column>
          <Column
            header="Actions"
            body={() => (
              <div className="flex gap-2">
                <span className="text-green text-green-500 underline cursor-pointer">Approved</span>
                <span className="text-[#E1A325] underline cursor-pointer">Pending</span>
                <span className="text-red-500 underline cursor-pointer">Cancle</span>
              </div>
            )}></Column>
        </DataTable>
      </div>
    </>
  )
}

export default Timecards
