import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from 'primereact/button'
import AddWorkOrders from './AddWorkOrders'
import { ErrorResponse, WorkOrderPayload, WorkOrderResponse } from '../../../Type/ApiTypes'
import { useGetWorkOrdersMutation } from '../../../Services/MoorServe/MoorserveApi'
import { ActionButtonColumnProps } from '../../../Type/Components/TableTypes'
import Header from '../../Layout/LayoutComponents/Header'
import './WorkOrder.module.css'
import { InputText } from 'primereact/inputtext'
import DataTableComponent from '../../CommonComponent/Table/DataTableComponent'
import CustomModal from '../../CustomComponent/CustomModal'
import { useSelector } from 'react-redux'
import { selectCustomerId } from '../../../Store/Slice/userSlice'
import { Toast } from 'primereact/toast'
import { Params } from '../../../Type/CommonType'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Paginator } from 'primereact/paginator'
import { SelectButton, SelectButtonChangeEvent } from 'primereact/selectbutton'
import { properties } from '../../Utils/MeassageProperties'
import { WorkOrderValue } from '../../../Type/ComponentBasedType'
import { jsPDF } from 'jspdf'
import { AddNewButtonStyle } from '../../Style'
import AddWorkOrder2 from './AddWorkOrder2'
import { IoMdSave } from "react-icons/io";
import { Dialog } from 'primereact/dialog'

const WorkOrders: React.FC<WorkOrderValue> = ({ report }) => {
  const selectedCustomerId = useSelector(selectCustomerId)
  const [visible, setVisible] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [workOrderData, setWorkOrderData] = useState<WorkOrderPayload[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<any>('')
  const [editMode, setEditMode] = useState(false)
  const [getWorkOrder] = useGetWorkOrdersMutation()
  const toast = useRef<Toast>(null)
  const [pageNumber, setPageNumber] = useState(0)
  const [pageNumber1, setPageNumber1] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalRecords, setTotalRecords] = useState<number>()
  const [completedWorkOrder, setCompletedOrder] = useState<string>('No')

  const onPageChange = (event: any) => {
    setPageNumber(event.page)
    setPageNumber1(event.first)
    setPageSize(event.rows)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageNumber(0)
    setPageNumber1(0)
    setSearchText(e.target.value)
  }

  const handleCompleted = (e: SelectButtonChangeEvent) => {
    if (e.value) {
      setCompletedOrder(e.value)
    }
  }

  const options = [
    { label: 'Pending', value: 'No' },
    { label: 'Completed', value: 'Yes' },
  ]

  const ActionButtonColumn: ActionButtonColumnProps = {
    header: 'Action',
    buttons: [
      {
        color: 'black',
        label: 'Edit',
        underline: true,
        onClick: (row) => handleEdit(row),
      },
    ],
    headerStyle: {
      backgroundColor: '#FFFFFF',
      color: '#000000',
      fontWeight: '700',
      fontSize: '12px',
    },
    style: { borderBottom: '1px solid #D5E1EA', backgroundColor: '#FFFFFF', fontWeight: '400' },
  }

  const columnStyle = {
    backgroundColor: '#FFFFFF',
    color: '#000000',
    fontWeight: '700',
    fontSize: '12px',
  }

  const firstLastName = (data: any) => {
    const firstName = data?.customerResponseDto?.firstName
    const lastName = data?.customerResponseDto?.lastName
    return firstName !== null ? `${firstName} ${lastName}` : '-'
  }

  const TechnicianfirstLastName = (data: any) => {
    const firstName = data?.technicianUserResponseDto?.firstName
    const lastName = data?.technicianUserResponseDto?.lastName

    return firstName !== null ? `${firstName} ${lastName}` : '-'
  }

  const workOrderColumns = useMemo(
    () => [
      {
        id: 'firstName',
        label: 'Customer Name',
        style: columnStyle,
        body: firstLastName,
      },
      {
        id: 'mooringResponseDto.mooringNumber',
        label: 'Mooring Number',
        style: columnStyle,
      },
      {
        id: 'technicianUserResponseDto.name',
        label: 'Assigned to',
        style: columnStyle,
        body: TechnicianfirstLastName,
      },
      {
        id: 'dueDate',
        label: 'Due Date',
        style: columnStyle,
      },
      {
        id: 'workOrderStatusDto.status',
        label: 'Status',
        style: columnStyle,
      },
    ],
    [],
  )

  const dataToPdf = (data: any[]) => {
    if (!Array.isArray(data) || data.length === 0) {
      const message = 'Invalid data provided. Expected an array of objects.'
      toast?.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 3000,
      })
      return
    }

    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('Work Orders', 14, 22)

    const headers = [
      'Customer Name',
      'Mooring Number',
      'Boatyard',
      'Assigned To',
      'Due Date',
      'Status',
    ]

    const columnWidths = [40, 40, 30, 30, 30, 50]
    const xStart = 5
    const yStart = 30
    const recordsPerPage = 20
    let yPosition = yStart
    let pageCount = 1

    const addHeaders = () => {
      let xPosition = xStart
      doc.setFontSize(12)
      headers.forEach((header, index) => {
        doc.text(header, xPosition, yPosition)
        xPosition += columnWidths[index]
      })
      yPosition += 5 // Space below headers
    }

    addHeaders()
    yPosition += 5 // Additional space between headers and values
    doc.setFontSize(10)

    data.forEach((item, rowIndex) => {
      let xPosition = xStart
      const row = [
        item?.customerResponseDto?.firstName && item?.customerResponseDto?.lastName
          ? `${item.customerResponseDto.firstName} ${item.customerResponseDto.lastName}`
          : 'N/A',
        item?.mooringResponseDto?.mooringNumber
          ? item.mooringResponseDto.mooringNumber.toString()
          : 'N/A',
        item?.boatyardResponseDto?.boatyardId
          ? item.boatyardResponseDto.boatyardId.toString()
          : 'N/A',
        item?.technicianUserResponseDto?.firstName && item?.technicianUserResponseDto?.lastName
          ? `${item.technicianUserResponseDto.firstName} ${item.technicianUserResponseDto.lastName}`
          : 'N/A',
        item?.dueDate ? item.dueDate.toString() : 'N/A',
        item?.workOrderStatusDto?.status ? item.workOrderStatusDto.status : 'N/A',
      ]

      row.forEach((cell, colIndex) => {
        const textLines = doc.splitTextToSize(cell.toString(), columnWidths[colIndex])
        doc.text(textLines, xPosition, yPosition)
        xPosition += columnWidths[colIndex]
      })

      yPosition += 10
      if ((rowIndex + 1) % recordsPerPage === 0 && rowIndex + 1 < data.length) {
        doc.addPage()
        yPosition = yStart
        addHeaders()
        yPosition += 5 // Space between headers and values for new page
        pageCount += 1
      }
    })

    doc.save('WorkOrders.pdf')
  }

  const handleExportPdf = async () => {
    setIsLoading(true)
    const params1: Params = {
      pageSize: 999999,
      showCompletedWorkOrders: 'Yes',
    }
    const params2: Params = {
      pageSize: 999999,
      showCompletedWorkOrders: 'No',
    }

    try {
      const [response1, response2] = await Promise.all([
        getWorkOrder(params1).unwrap(),
        getWorkOrder(params2).unwrap(),
      ])

      const {
        status: status1,
        content: content1,
        message: message1,
      } = response1 as WorkOrderResponse
      const {
        status: status2,
        content: content2,
        message: message2,
      } = response2 as WorkOrderResponse

      if (
        status1 === 200 &&
        Array.isArray(content1) &&
        status2 === 200 &&
        Array.isArray(content2)
      ) {
        const combinedContent = [...content1, ...content2]
        dataToPdf(combinedContent)
      } else {
        if (status1 !== 200 || !Array.isArray(content1)) {
          toast?.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: message1,
            life: 3000,
          })
        }
        if (status2 !== 200 || !Array.isArray(content2)) {
          toast?.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: message2,
            life: 3000,
          })
        }
      }
    } catch (error) {
      toast?.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'An error occurred while fetching work orders.',
        life: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getWorkOrderData = useCallback(async () => {
    setIsLoading(true)
    try {
      const params: Params = {}
      params.searchText = searchText
      if (pageNumber) {
        params.pageNumber = pageNumber
      }
      if (pageSize) {
        params.pageSize = pageSize
      }
      if (completedWorkOrder) {
        params.showCompletedWorkOrders = completedWorkOrder
      }

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
  }, [searchText, selectedCustomerId, pageNumber, pageSize, completedWorkOrder])

  const handleEdit = (rowData: any) => {
    setSelectedCustomer(rowData)
    setEditMode(true)
    setVisible(true)
  }

  const handleModalClose = () => {
    setVisible(false)
    setEditMode(false)
    getWorkOrderData()
  }
  const handleButtonClick = () => {
    setVisible(true)
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getWorkOrderData()
    }, 600)
    return () => clearTimeout(timeoutId)
  }, [searchText, selectedCustomerId, pageSize, pageNumber, completedWorkOrder])

  useEffect(() => {
    if (selectedCustomerId) {
      handleModalClose()
    }
  }, [selectedCustomerId])

  return (
    <div style={{ height: '100vh' }} className={visible ? 'backdrop-blur-lg' : ''}>
      <Toast ref={toast} />
      {!report && <Header header="MOORSERVE/Work Orders" />}
      <div className="">
        {!report && (
          <div className="flex justify-end gap-4 mt-6 mr-12">
            <Button
              onClick={handleExportPdf}
              style={{
                marginTop: '-16px',
                width: '125px',
                height: '44px',
                minHeight: '44px',
                backgroundColor: '#0098FF',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                color: 'white',
                borderRadius: '0.50rem',
                marginLeft: '8px',
                boxShadow: 'none',
              }}>
              Export To PDF
            </Button>
            



               <div className="items-center">
              <CustomModal
                buttonText={'ADD NEW'}
                icon={
                  <img src="/assets/images/Plus.png" alt="icon" className="w-3.8 h-3.8 mb-0.5" />
                }
                children={<AddWorkOrder2 
                   workOrderData={selectedCustomer}
                  setWorkOrderData={setSelectedCustomer}
                  editModeWorkOrder={editMode}
                  setVisible={setVisible}
                  visible={visible}
                  toastRef={toast}
                  closeModal={handleModalClose}
                  isAccountRecievable={false}/>}
                visible={visible}
                onClick={handleButtonClick}
                onHide={() => { }}
                buttonStyle={{ ...AddNewButtonStyle, marginTop: '-16px' }}
                dialogStyle={{
                  width: '800px',
                  height: '526px'
                }}
              />
            </div>
            <style>
              {`
               .p-dialog-header-icon {
                display: none !important}
               .p-dialog-content {
                padding: 0 !important}
                .p-dialog-header, .p-dialog-footer {
                  padding: 0 !important;
                  margin: 0 !important;
                }
                .p-component {
                  padding: 0 !important
                  margin: 0 !important
                  .p-dialog-body {
                    padding: 0 !important;
                    margin: 0 !important;
                  }
              `}
            </style> 
 


               {/* 

              <div className="items-center">
              <CustomModal
                buttonText={'ADD NEW'}
                icon={
                  <img src="/assets/images/Plus.png" alt="icon" className="w-3.8 h-3.8 mb-0.5" />
                }
                children={<AddWorkOrder2
                  workOrderData={selectedCustomer}
                  setWorkOrderData={setSelectedCustomer}
                  editModeWorkOrder={editMode}
                  setVisible={setVisible}
                  visible={visible}
                  toastRef={toast}
                  closeModal={handleModalClose}
                  isAccountRecievable={false}/>}
                visible={visible}
                onClick={handleButtonClick}
                onHide={handleModalClose}
                buttonStyle={{ ...AddNewButtonStyle, marginTop: '-16px' }}
                dialogStyle={{
                  width: '800px',
                  height: '526px'
                }}
               />
              </div> */}

              </div> 
        )} 


        <div
          style={{
            height: 'calc(100vh - 150px)',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
            border: '1px solid #D5E1EA',
            borderRadius: '10px',
            marginTop: '7px',
            width: 'screen',
            marginLeft: '45px',
            marginRight: '35px',
          }}>
          <div className="flex items-center justify-between bg-[#00426F] p-2 rounded-tl-[10px] rounded-tr-[10px] ">
            <h1 className="p-2 text-xl font-extrabold text-white">Work Orders</h1>

            <div className="flex gap-6">
              <div className="relative inline-block">
                <div className="relative mt-1">
                  <img
                    src="/assets/images/Search.png"
                    alt="search icon"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                    data-testid="search-icon"
                  />
                  <InputText
                    value={searchText}
                    onChange={handleSearch}
                    placeholder="Search"
                    id="placeholderText"
                    className="pl-10 w-[237px] bg-[#00426F] text-[white] h-[35px] rounded-lg border border-[#D5E1EA] placeholder:text-[#FFFFFF] focus:outline-none"
                  />
                </div>
              </div>
              <div className="bg-white rounded-md">
                <div className="card flex justify-content-center p-0.5 pl-0.5">
                  <SelectButton
                    value={completedWorkOrder}
                    onChange={handleCompleted}
                    options={options}
                    className="selectButtons"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-grow relative overflow-auto">
            <DataTableComponent
              tableStyle={{
                fontSize: '10px',
                color: '#000000',
                fontWeight: 600,
                backgroundColor: '#F9FAFB',
              }}
              data={workOrderData}
              columns={workOrderColumns}
              actionButtons={ActionButtonColumn}
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

            {isLoading && (
              <ProgressSpinner
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '50px',
                  height: '50px',
                }}
                strokeWidth="4"
              />
            )}
          </div>

          <div style={{ position: 'relative' }}>
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
    </div>
  )
}
export default WorkOrders
