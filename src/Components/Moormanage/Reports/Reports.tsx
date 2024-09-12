import { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import './Reports.module.css'

const Reports = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const options: string[] = ['Open', 'Closed']
  const [value, setValue] = useState<string>(options[0])
  const [reportsData, setReportsData] = useState<any[]>([
    {
      id: 0,
      name: 'Suncatcher',
      email: 'JohnSmith@gmail.com',
      phone: '7258807043',
      address: 'delhi',
    },
    {
      id: 0,
      name: 'Suncatcher',
      email: 'JohnSmith@gmail.com',
      phone: '7258807043',
      address: 'delhi',
    },
    {
      id: 0,
      name: 'Suncatcher',
      email: 'JohnSmith@gmail.com',
      phone: '7258807043',
      address: 'delhi',
    },
    {
      id: 0,
      name: 'Suncatcher',
      email: 'JohnSmith@gmail.com',
      phone: '7258807043',
      address: 'delhi',
    },
  ])

  const [bill, setBill] = useState<any[]>([
    {
      id: 0,
      customerName: 'Suncatcher',
      mooringNumber: 'BD6,B23',
      inspectionDate: '15,March 2024',
      mooringLocation: '38 21.806 14444.959',
    },
    {
      id: 0,
      customerName: 'Suncatcher',
      mooringNumber: 'BD6,B23',
      inspectionDate: '15,March 2024',
      mooringLocation: '38 21.806 14444.959',
    },
    {
      id: 0,
      customerName: 'Suncatcher',
      mooringNumber: 'BD6,B23',
      inspectionDate: '15,March 2024',
      mooringLocation: '38 21.806 14444.959',
    },
    {
      id: 0,
      customerName: 'Suncatcher',
      mooringNumber: 'BD6,B23',
      inspectionDate: '15,March 2024',
      mooringLocation: '38 21.806 14444.959',
    },
  ])

  const [bills, setBills] = useState<any[]>([
    {
      technicianName: 'Suncatcher',
      workOrder: '5',
      mooring: 'Pionner',
      BillableHours: '15 hours',
    },

    {
      technicianName: 'Suncatcher',
      workOrder: '5',
      mooring: 'Pionner',
      BillableHours: '15 hours',
    },

    {
      technicianName: 'Suncatcher',
      workOrder: '5',
      mooring: 'Pionner',
      BillableHours: '15 hours',
    },
    {
      technicianName: 'Suncatcher',
      workOrder: '5',
      mooring: 'Pionner',
      BillableHours: '15 hours',
    },
  ])

  const Billsheader = (
    <div className="flex flex-wrap justify-between align-items-center  ">
      <span className="text-lg font-bold">Customers</span>
    </div>
  )

  const handleButtonClick = () => {
    setModalVisible(true)
  }

  const handleModalClose = () => {
    setModalVisible(false)
  }

  const statCardsData = [
    [
      { title: 'Total Customers', percentage: 17, count: 42324 },
      { title: 'Total Customers', percentage: 17, count: 42324 },
      { title: 'Total Customers', percentage: 17, count: 42324 },
      { title: 'Total Customers', percentage: 17, count: 58765 },
      { title: 'Total Customers', percentage: 17, count: 42324 },
      { title: 'Total Customers', percentage: 17, count: 46789 },
    ],

    [{ title: 'Services', percentage: 25, count: 34576 }],

    [{ title: 'Work Orders', percentage: 58, count: 8421 }],
  ]

  return (
    <>
      <div className="flex flex-col  ml-36">
        <div className="flex justify-between">
          <div>
            <h1 className="mt-14 ml-10 opacity-40 text-2xl font-normal">MOORMANAGE/Reports</h1>
          </div>
          <div>
            <h1 className="mt-14 mr-10 opacity-60 text-sm font-bold text-black">
              Download Reports
            </h1>
          </div>
        </div>

        <div className="flex mt-6">
          <div>
            <div className="bg-[#F2F2F2] rounded-md border-[1px]  border-[#D1D1D1] p-5 ml-10  w-[30vw] mb-5">
              <DataTable value={reportsData} header={Billsheader} scrollable={true}>
                <Column
                  style={{ width: '2vw', fontSize: '0.75rem' }}
                  field="id"
                  header="ID"></Column>
                <Column
                  style={{ width: '5vw', fontSize: '0.75rem' }}
                  field="name"
                  header="Name"></Column>
                <Column
                  style={{ width: '8vw', fontSize: '0.75rem' }}
                  field="email"
                  header="Email"></Column>
                <Column
                  style={{ width: '5vw', fontSize: '0.75rem' }}
                  field="phone"
                  header="Phone"></Column>
                <Column
                  style={{ width: '4vw', fontSize: '0.75rem' }}
                  field="address"
                  header="Address"></Column>
              </DataTable>
            </div>
          </div>

          <div>
            <div className="bg-[#F2F2F2] rounded-md border-[1px]  border-[#D1D1D1] p-5 ml-8  w-[35vw]  mb-5">
              <DataTable value={bill} header={'Customer by Mooring'} scrollable={true}>
                <Column
                  style={{ width: '10vw', fontSize: '0.75rem' }}
                  field="customerName"
                  header="Customer Name"></Column>
                <Column
                  style={{ width: '10vw', fontSize: '0.75rem' }}
                  field="mooringNumber"
                  header="Mooring Number"></Column>
                <Column
                  style={{ width: '10vw', fontSize: '0.75rem' }}
                  field="inspectionDate"
                  header="Inspection date"></Column>

                <Column
                  style={{ width: '9vw', fontSize: '0.75rem' }}
                  field="mooringLocation"
                  header="Mooring location"></Column>
              </DataTable>
            </div>

            <div className="bg-[#F2F2F2] rounded-md border-[1px]  border-[#D1D1D1] p-5 ml-8  w-[35vw]  mb-5">
              <DataTable value={bills} header={'Technicians'} scrollable={true}>
                <Column
                  style={{ width: '10vw', fontSize: '0.75rem' }}
                  field="technicianName"
                  header="Technician Name"></Column>
                <Column
                  style={{ width: '8vw', fontSize: '0.75rem' }}
                  field="workOrder"
                  header="Work Orders"></Column>
                <Column
                  style={{ width: '5vw', fontSize: '0.75rem' }}
                  field="mooring"
                  header="Mooring"></Column>
                <Column
                  style={{ width: '9vw', fontSize: '0.75rem' }}
                  field="BillableHours"
                  header="Billable Hours"></Column>
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Reports
