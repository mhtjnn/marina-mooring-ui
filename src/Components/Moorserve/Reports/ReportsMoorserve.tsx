
import { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { SelectButton, SelectButtonChangeEvent } from 'primereact/selectbutton'

const ReportsMoorserve = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const options: string[] = ['Open', 'Closed']
  const weekOption: string[] = ['Weekly', 'Monthly']

  const [value, setValue] = useState<string>(options[0])
  const [value2, setValue2] = useState<string>(options[0])
  const [boatData, setBoatData] = useState<any[]>([
    {
      id: '01',
      mooring: 'Suncatcher',
      technicianName: 'John Smith',
      amount: '$50',
      address: 'Punjab',
    },
    {
      id: '01',
      mooring: 'Suncatcher',
      technicianName: 'John Smith',
      amount: '$50',
      address: 'Punjab',
    },
    {
      id: '01',
      mooring: 'Suncatcher',
      technicianName: 'John Smith',
      amount: '$50',
      address: 'Punjab',
    },
    {
      id: '01',
      mooring: 'Suncatcher',
      technicianName: 'John Smith',
      amount: '$50',
      address: 'Punjab',
    },
  ])

  const [billsData, setBillsData] = useState<any[]>([
    {
      id: 0,
      mooring: 'Suncatcher',
      techniciansName: 'John Smith',
      amount: '$50',
    },

    {
      id: 0,
      mooring: 'Suncatcher',
      techniciansName: 'John Smith',
      amount: '$50',
    },
    {
      id: 0,
      mooring: 'Suncatcher',
      techniciansName: 'John Smith',
      amount: '$50',
    },
    {
      id: 0,
      mooring: 'Suncatcher',
      techniciansName: 'John Smith',
      amount: '$50',
    },
    {
      id: 0,
      mooring: 'Suncatcher',
      techniciansName: 'John Smith',
      amount: '$50',
    },
  ])

  const [bill, setBill] = useState<any[]>([
    {
      id: 0,
      mooring: 'Suncatcher',
      techniciansName: 'John Smith',
      amount: '$50',
    },

    {
      id: 0,
      mooring: 'Mooring',
      techniciansName: 'John Smith',
      amount: '$50',
    },
    {
      id: 0,
      mooring: 'Technicians ',
      techniciansName: 'John Smith',
      amount: '$50',
    },
    {
      id: 0,
      mooring: 'Suncatcher',
      techniciansName: 'John Smith',
      amount: '$50',
    },
    {
      id: 0,
      mooring: 'Suncatcher',
      techniciansName: 'John Smith',
      amount: '$50',
    },
  ])

  const Billsheader = (
    <div className="flex flex-wrap justify-between align-items-center gap-4 ">
      <span className="text-lg font-bold">Services</span>
      <div className=" ">
        

        <div className="">
          <SelectButton
            style={{ fontSize: '0.2rem', fontWeight: 'bolder', height: '2rem' }}
            value={value}
            onChange={(e: SelectButtonChangeEvent) => setValue(e.value)}
            options={options}
            defaultChecked
          />
        </div>
      </div>
    </div>
  )

  const Billsheader1 = (
    <div className="flex flex-wrap justify-between align-items-center gap-4 ">
      <span className="text-lg font-bold">Inspections</span>
      <div className=" ">
        <div className="">
          <SelectButton
            style={{ fontSize: '0.2rem', fontWeight: 'bolder', height: '2rem' }}
            value={value2}
            onChange={(e: SelectButtonChangeEvent) => setValue2(e.value)}
            options={weekOption}
            defaultChecked
          />
        </div>
      </div>
    </div>
  )

  const handleButtonClick = () => {
    setModalVisible(true)
  }

  const handleModalClose = () => {
    setModalVisible(false)
  }


  return (
    <>
      <div className="flex flex-col  ml-12">
        <div
          className="flex justify-between
        ">
          <h1 className="mt-14 ml-10 opacity-30 text-2xl font-normal">MOORSERVE/Reports</h1>

          <div>
            <h1 className="mt-14 mr-36 opacity-30 text-lg font-normal text-black">
              Download Reports
            </h1>
          </div>
        </div>
        <div className="flex mt-6">
          <div>
            <div className="bg-[#F2F2F2] rounded-md border-[1px]  border-[#D1D1D1] p-5 ml-10  w-[40vw] mb-5">
              <DataTable value={billsData} header={Billsheader} scrollable={true}>
                <Column
                  style={{ width: '2vw', fontSize: '0.75rem' }}
                  field="id"
                  header="ID"></Column>
                <Column
                  style={{ width: '4vw', fontSize: '0.75rem' }}
                  field="mooring"
                  header="Mooring"></Column>
                <Column
                  style={{ width: '6vw', fontSize: '0.75rem' }}
                  field="techniciansName"
                  header="Technicians Name"></Column>
                <Column
                  style={{ width: '4vw', fontSize: '0.75rem' }}
                  field="amount"
                  header="Amount"></Column>

                <Column
                  header="Work Order"
                  style={{ width: '5vw', fontSize: '0.75rem' }}
                  body={() => (
                    <div className="flex gap-5 ">
                      <span className="text-black  underline cursor-pointer">view</span>
                      <span className="text-green-500 bg-green-100  cursor-pointer">Confirmed</span>
                    </div>
                  )}></Column>
              </DataTable>
            </div>

            <div>
              <div className="bg-[#F2F2F2] rounded-md border-[1px]  border-[#D1D1D1] p-5 ml-10  w-[40vw] mb-5">
                <DataTable value={billsData} header={Billsheader1} scrollable={true}>
                  <Column
                    style={{ width: '2vw', fontSize: '0.75rem' }}
                    field="id"
                    header="ID"></Column>
                  <Column
                    style={{ width: '4vw', fontSize: '0.75rem' }}
                    field="mooring"
                    header="Mooring"></Column>
                  <Column
                    style={{ width: '6vw', fontSize: '0.75rem' }}
                    field="techniciansName"
                    header="Technicians Name"></Column>
                  <Column
                    style={{ width: '4vw', fontSize: '0.75rem' }}
                    field="amount"
                    header="Boatyard"></Column>

                  <Column
                    header="Action"
                    style={{ width: '5vw', fontSize: '0.75rem' }}
                    body={() => (
                      <div className="flex gap-5 ">
                        <span className="text-black  cursor-pointer">View</span>
                      </div>
                    )}></Column>
                </DataTable>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-[#F2F2F2] rounded-md border-[1px]  border-[#D1D1D1] p-5 ml-8  w-[25vw]  mb-5">
              <DataTable value={bill} header={'Estimates'} scrollable={true}>
                <Column
                  style={{ width: '2vw', fontSize: '0.75rem' }}
                  field="id"
                  header="ID"></Column>
                <Column
                  style={{ width: '8vw', fontSize: '0.75rem' }}
                  field="mooring"
                  header="Boat Name"></Column>
                <Column
                  style={{ width: '9vw', fontSize: '0.75rem' }}
                  field="techniciansName"
                  header="Customer Name"></Column>
                <Column
                  style={{ width: '6vw', fontSize: '0.75rem' }}
                  field="amount"
                  header="Approved"></Column>

                <Column
                  header="Action"
                  style={{ width: '5vw', fontSize: '0.75rem' }}
                  body={() => (
                    <div className="flex gap-5 ">
                      <span className="text-black underline cursor-pointer">Converted</span>
                    </div>
                  )}></Column>
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ReportsMoorserve
