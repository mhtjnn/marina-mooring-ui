import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { properties } from '../../../Utils/MeassageProperties'
import { WorkOrdersAccordianProps } from '../../../../Type/AccordianBasedTypes'
import DataTableComponent from '../../../CommonComponent/Table/DataTableComponent'
import { ErrorResponse, WorkOrderPayload, WorkOrderResponse } from '../../../../Type/ApiTypes'
import { Params } from '../../../../Type/CommonType'
import { Toast } from 'primereact/toast'
import { useGetWorkOrdersMutation } from '../../../../Services/MoorServe/MoorserveApi'
import { useSelector } from 'react-redux'
import { selectCustomerId } from '../../../../Store/Slice/userSlice'
import { TechnicianfirstLastName, firstLastName } from '../../../Helper/Helper'
import { AccountRecievableColumnStyle } from '../../../Utils/Style'
import { ActionButtonColumnProps } from '../../../../Type/Components/TableTypes'
import { Paginator } from 'primereact/paginator'
import PopUpCustomModal from '../../../CustomComponent/PopUpCustomModal'
import AddWorkOrders from '../../../Moorserve/WorkOrders/AddWorkOrders'
import { ProgressSpinner } from 'primereact/progressspinner'

const WorkOrderSection: React.FC<WorkOrdersAccordianProps> = ({ accordion, handleToggle }) => {
  const toast = useRef<Toast>(null)
  const selectedCustomerId = useSelector(selectCustomerId)
  const [workOrderData, setWorkOrderData] = useState<WorkOrderPayload[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pageNumber, setPageNumber] = useState(0)
  const [pageNumber1, setPageNumber1] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalRecords, setTotalRecords] = useState<number>()
  const [addWorkOrderModal, setAddWorkOrderModal] = useState(false)
  const [selectedWorkOrderRowData, setSelectedWorkOredrRowData] = useState<any>()
  const [getWorkOrder] = useGetWorkOrdersMutation()

  const onPageChange = (event: any) => {
    setPageNumber(event.page)
    setPageNumber1(event.first)
    setPageSize(event.rows)
  }

  const ReasonForDenial = (data: any) => {
    return data?.reasonForDenial !== null ? data?.reasonForDenial : '-'
  }
  const workOrderColumns = useMemo(
    () => [
      {
        id: 'firstName',
        label: 'Customer Name',
        style: AccountRecievableColumnStyle,
        body: firstLastName,
      },
      {
        id: 'mooringResponseDto.mooringNumber',
        label: 'Mooring Number',
        style: AccountRecievableColumnStyle,
      },
      {
        id: 'technicianUserResponseDto.name',
        label: 'Assigned to',
        style: AccountRecievableColumnStyle,
        body: TechnicianfirstLastName,
      },
      { id: 'dueDate', label: 'Due Date', style: AccountRecievableColumnStyle },
      {
        id: 'reasonForDenial',
        label: 'Notes',
        style: AccountRecievableColumnStyle,
        body: ReasonForDenial,
      },
      { id: 'workOrderStatusDto.status', label: 'Status', style: AccountRecievableColumnStyle },
    ],
    [],
  )

  const handleModalClose = () => {
    setAddWorkOrderModal(false)
    setSelectedWorkOredrRowData('')
  }

  const handleView = (rowData: any) => {
    setSelectedWorkOredrRowData(rowData)
    setAddWorkOrderModal(true)
  }

  const ActionButtonColumn: ActionButtonColumnProps = {
    header: 'Action',
    buttons: [
      {
        color: 'black',
        label: 'View',
        underline: true,
        onClick: (row) => handleView(row),
      },
    ],
    headerStyle: { ...AccountRecievableColumnStyle },
    style: { borderBottom: '1px solid #D5E1EA' },
  }

  const getWorkOrderData = useCallback(async () => {
    setIsLoading(true)
    try {
      const params: Params = {}
      if (pageNumber) {
        params.pageNumber = pageNumber
      }
      if (pageSize) {
        params.pageSize = pageSize
      }
      params.showCompletedWorkOrders = 'Yes'
      const response = await getWorkOrder(params).unwrap()
      const { status, content, message, totalSize } = response as WorkOrderResponse
      if (status === 200 && Array.isArray(content)) {
        setWorkOrderData(content)
        setIsLoading(false)
        setTotalRecords(totalSize)
      } else {
        setIsLoading(false)
        toast?.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        })
      }
    } catch (error) {
      const { message: msg } = error as ErrorResponse
      setIsLoading(false)
      console.error('Error occurred while fetching customer data:', msg)
    }
  }, [selectedCustomerId, pageNumber, pageSize])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getWorkOrderData()
    }, 600)
    return () => clearTimeout(timeoutId)
  }, [selectedCustomerId, pageNumber, pageSize])

  return (
    <>
      <Toast ref={toast} />
      <div
        className="tab relative bg-[#FFFFFF] border-[1px] border-[#D5E1EA] mr-8"
        style={{
          width: '450px',
          maxWidth: '450px',
          marginTop: '0px',
        }}>
        <label
          htmlFor="faq3"
          style={{ backgroundColor: '#10293A' }}
          className="cursor-pointer flex items-center justify-between h-14"
          onClick={() => handleToggle('faq4')}>
          <div className="flex items-center">
            <div style={{ flexShrink: 1 }}>
              <h1 className="p-3 text-white text-lg font-extrabold">
                {properties.workOrderHeader}
              </h1>
            </div>
          </div>
          <div>
            <div className="p-2">
              {accordion === 'faq4' ? (
                <svg
                  width="24"
                  height="4"
                  viewBox="0 0 11 3"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.125 1.5C10.125 1.92188 9.77344 2.25 9.375 2.25H1.125C0.703125 2.25 0.375 1.92188 0.375 1.5C0.375 1.10156 0.703125 0.75 1.125 0.75H9.375C9.77344 0.75 10.125 1.10156 10.125 1.5Z"
                    fill="white"
                  />
                </svg>
              ) : (
                <img
                  src="/assets/images/plus.png"
                  alt="Key Icon"
                  className="p-clickable"
                  style={{}}
                />
              )}
            </div>
          </div>
        </label>
        <div
          className={`content mt-5 transition-all ease-in-out duration-500 ${accordion === 'faq4' ? '' : 'hidden'}`}>
          <div
            className={`bg-#00426F overflow-x-hidden  table-container flex flex-col`}
            style={{ height: 'calc(100vh - 580px)' }}>
            <div className="flex-grow" style={{ overflow: 'auto' }}>
              <DataTableComponent
                tableStyle={{
                  fontSize: '12px',
                  color: '#000000',
                  fontWeight: 600,
                  backgroundColor: '#D9D9D9',
                }}
                data={workOrderData}
                columns={workOrderColumns}
                actionButtons={ActionButtonColumn}
                selectionMode="single"
                dataKey="id"
                rowStyle={(rowData) => rowData}
                style={{ borderBottom: '1px solid #D5E1EA', fontWeight: '400' }}
                emptyMessage={
                  <div className="text-center mt-28">
                    <img
                      src="/assets/images/empty.png"
                      alt="Empty Data"
                      className="w-28 mx-auto mb-4"
                    />
                    <p className="text-gray-500 font-[600] text-lg">{properties.noDataMessage}</p>
                  </div>
                }
              />
            </div>
            <div className="text-center">
              {isLoading && (
                <ProgressSpinner
                  style={{
                    position: 'absolute',
                    top: '60%',
                    left: '60%',
                    transform: 'translate(-50%, -50%)',
                    width: '50px',
                    height: '50px',
                  }}
                  strokeWidth="4"
                />
              )}
            </div>
            <Paginator
              first={pageNumber1}
              rows={pageSize}
              totalRecords={totalRecords}
              rowsPerPageOptions={[5, 10, 20, 30]}
              onPageChange={onPageChange}
              style={{
                position: 'sticky',
                bottom: 0,
                zIndex: 1,
                backgroundColor: 'white',
                borderTop: '1px solid #D5E1EA',
                padding: '0.5rem',
              }}
            />
          </div>
        </div>
      </div>
      {/*view button */}
      <PopUpCustomModal
        style={{
          width: '851px',
          minWidth: '851px',
          height: '526px',
          minHeight: '526px',
        }}
        visible={addWorkOrderModal}
        header={<h1 className="text-xl font-extrabold text-black ml-4">Work Order</h1>}
        onHide={handleModalClose}
        children={
          <AddWorkOrders
            workOrderData={selectedWorkOrderRowData}
            editModeWorkOrder={true}
            isTechnician={true}
            setVisible={() => {
              setAddWorkOrderModal(false)
            }}
            closeModal={() => {
              handleModalClose()
            }}
          />
        }></PopUpCustomModal>
    </>
  )
}

export default WorkOrderSection
