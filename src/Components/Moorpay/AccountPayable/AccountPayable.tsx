import { useMemo, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import CustomModal from '../../CustomComponent/CustomModal'
import { MoorPayProps } from '../../../Type/ComponentBasedType'
import DataTableSearchFieldComponent from '../../CommonComponent/Table/DataTableComponent'
import { ActionButtonColumnProps } from '../../../Type/Components/TableTypes'

interface TableColumn {
  id: string
  label: string
  style: {
    width: string
    backgroundColor: string
  }
}

type TableColumns = TableColumn[]
const AccountPayable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [accountPayableData, setAccountPayableData] = useState<MoorPayProps[]>([
    {
      invoice: '#425',
      mooringid: '#6658',
      name: 'John Smith',
      technicianName: 'jim Carry',
      services: 'Regular Services',
      time: '2hrs',
      amount: '$12',
    },

    {
      invoice: '#425',
      mooringid: '#6658',
      name: 'John Smith',
      technicianName: 'jim Carry',
      services: 'Regular Services',
      time: '2hrs',
      amount: '$12',
    },
    {
      invoice: '#425',
      mooringid: '#6658',
      name: 'John Smith',
      technicianName: 'jim Carry',
      services: 'Regular Services',
      time: '2hrs',
      amount: '$12',
    },
    {
      invoice: '#425',
      mooringid: '#6658',
      name: 'John Smith',
      technicianName: 'jim Carry',
      services: 'Regular Services',
      time: '2hrs',
      amount: '$12',
    },
  ])

  const handleButtonClick = () => {
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const tableColumns: TableColumns = useMemo<TableColumns>(
    () => [
      {
        id: 'customerId',
        label: 'Customer ID',
        style: { width: '6vw', backgroundColor: '#F2F2F2' },
      },
      {
        id: 'mooringId',
        label: 'Mooring ID',
        style: { width: '12vw', backgroundColor: '#F2F2F2' },
      },
      {
        id: 'boatyard',
        label: 'Boatyard',
        style: { width: '10vw', backgroundColor: '#F2F2F2' },
      },
      {
        id: 'assignedTo',
        label: 'Assigned to',
        style: { width: '12vw', backgroundColor: '#F2F2F2' },
      },
      {
        id: 'status',
        label: 'Status',
        style: { width: '10vw', backgroundColor: '#F2F2F2' },
      },
    ],
    [],
  )

  const CustomersHeader = () => {
    return (
      <div className="flex items-center">
        <div className="">
          <h1>Account Payable</h1>
        </div>
      </div>
    )
  }

  const ActionButtonColumn: ActionButtonColumnProps = {
    header: 'Action',
    buttons: [
      {
        color: 'green',
        label: 'Paid',
        filled: true,
      },
    ],
    headerStyle: { backgroundColor: '#F2F2F2' },
  }

  return (
    <>
      <div className="flex justify-between items-center ml-12">
        <div>
          <h1 className="mt-14 ml-8 opacity-30 text-2xl font-normal">Moormanage/Account Payable</h1>
        </div>

        <div className="flex gap-1 ml-[18rem] text-[gray] font-extrabold mt-14">
          <div>
            <img
              src="/assets/images/download.png"
              alt=""
              className="w-5 "
              style={{ filter: 'grayscale(100%)', color: 'gray' }}
            />
          </div>
          <div>
            <h1>DownLoad Excel</h1>
          </div>
        </div>

        <div className="items-center mr-[10rem] mt-14">
          <CustomModal
            onClick={handleButtonClick}
            visible={false}
            onHide={handleModalClose}></CustomModal>
        </div>
      </div>

      <div className="bg-[F2F2F2] rounded-md border-[1px] border-gray-300 w-[67vw]  ml-32 mb-80">
        <DataTableSearchFieldComponent
          tableStyle={{
            fontSize: '12px',
            color: '#000000',
            fontWeight: 600,
          }}
          data={accountPayableData}
          columns={tableColumns}
          header={CustomersHeader}
          actionButtons={ActionButtonColumn}
          style={{ backgroundColor: '#F2F2F2' }}
        />
      </div>
    </>
  )
}

export default AccountPayable
