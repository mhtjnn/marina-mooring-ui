import { useMemo, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import CustomModal from '../../CustomComponent/CustomModal'
import AddEstimates from './AddEstimates'
import { InputText } from 'primereact/inputtext'
import { EstimateProps } from '../../../Type/ComponentBasedType'
import DataTableSearchFieldComponent from '../../CommonComponent/Table/DataTableComponent'
import { ActionButtonColumnProps } from '../../../Type/Components/TableTypes'
import DataTableComponent from '../../CommonComponent/Table/DataTableComponent'

const Estimates = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [boatData, setBoatData] = useState<EstimateProps[]>([
    {
      customerId: '1',
      customerName: 'jon Smith',
      mooringId: '#75677',
      boatyard: 'pioneer',
      assigned: 'Clara Ortiz',
      duedate: '15,March 2024',
    },

    {
      customerId: '1',
      customerName: 'jon Smith',
      mooringId: '#75677',
      boatyard: 'pioneer',
      assigned: 'Clara Ortiz',
      duedate: '15,March 2024',
    },
    {
      customerId: '1',
      customerName: 'jon Smith',
      mooringId: '#75677',
      boatyard: 'pioneer',
      assigned: 'Clara Ortiz',
      duedate: '15,March 2024',
    },
    {
      customerId: '1',
      customerName: 'jon Smith',
      mooringId: '#75677',
      boatyard: 'pioneer',
      assigned: 'Clara Ortiz',
      duedate: '15,March 2024',
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
      <span className="text-xl font-bold">Estimate</span>
      <span
        style={{
          fontFamily: 'Lato',
          fontSize: '14px',
          fontWeight: 700,
          lineHeight: '16.8px',
          letterSpacing: '0.4837472140789032px',
          textAlign: 'right',
        }}>
        <div className="flex  items-center  ">
          <div>
            <div className="p-input-icon-left">
              <i className="pi pi-search text-[#D2D2D2]" />
              <InputText
                placeholder="Search"
                className="h-[5vh] cursor-pointer rounded-lg bg-white font-bold"
              />
            </div>
          </div>
        </div>
      </span>
    </div>
  )



  const tableColumns = useMemo(
    () => [
      {
        id: 'invoice',
        label: 'Invoice',
        style: { width: '6vw', backgroundColor: '#F2F2F2' },
      },
      {
        id: 'mooringId',
        label: 'Mooring ID',
        style: { width: '12vw', backgroundColor: '#F2F2F2' },
      },
      {
        id: 'customerName',
        label: 'Customer Name',
        style: { width: '10vw', backgroundColor: '#F2F2F2' },
      },
      {
        id: 'technicianName',
        label: 'Technician Name',
        style: { width: '12vw', backgroundColor: '#F2F2F2' },
      },
      {
        id: 'services',
        label: 'Services',
        style: { width: '10vw', backgroundColor: '#F2F2F2' },
      },
      {
        id: 'time',
        label: 'Time',
        style: { width: '10vw', backgroundColor: '#F2F2F2' },
      },
      {
        id: 'amount',
        label: 'Amount',
        style: { width: '10vw', backgroundColor: '#F2F2F2' },
      },
    ],
    [],
  )


  const ActionButtonColumn: ActionButtonColumnProps = {
    header: 'Action',
    buttons: [
      {
        color: 'black',
        label: 'Edit',
        underline: true,
      }
    ],
    headerStyle:  {backgroundColor:"#F2F2F2"}
  }





  return (
    <>
      <div className="flex justify-between items-center ml-12">
        <div>
          <h1 className="mt-14 ml-[7.50vw] opacity-30 text-2xl font-normal">MOORSERVE/Estimates</h1>
        </div>
        <div className="flex gap-1 ml-[15rem] text-[gray] font-extrabold mt-14">
          <div>
            <img
              src="/assets/images/download.png"
              alt=""
              className="w-5 "
              style={{ filter: 'grayscale(100%)', color: 'gray' }}
            />
          </div>

          <div>
            <h1>DownLoad </h1>
          </div>

          <div></div>
        </div>
        <div className="items-center mr-[10rem] mt-14">
          <CustomModal
            data-testid="modal"
            onClick={handleButtonClick}
            visible={false}
            onHide={handleModalClose}
            header={header}
          >
            <AddEstimates/>
          </CustomModal>
        </div>
      </div>
  
      <div className="bg-[F2F2F2] rounded-md border-[1px] border-gray-300 w-[64vw]  ml-32 mt-12 ">

        <DataTableComponent
         tableStyle={{
          fontSize: '12px',
          color: '#000000',
          fontWeight: 600,
        }}
        data={boatData}
        columns={tableColumns}
        header={header}
        actionButtons={ActionButtonColumn}
        style={{ backgroundColor: '#F2F2F2' }}
        
        />
      
      </div>


    </>
  )
}

export default Estimates
