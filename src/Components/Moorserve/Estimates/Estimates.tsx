import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AddWorkOrders from '../WorkOrders/AddWorkOrders'
import { ErrorResponse, WorkOrderPayload, WorkOrderResponse } from '../../../Type/ApiTypes'
import {
  useGetConvertEstimateToWorkOrderMutation,
  useGetEstimateMutation,
} from '../../../Services/MoorServe/MoorserveApi'
import { ActionButtonColumnProps } from '../../../Type/Components/TableTypes'
import Header from '../../Layout/LayoutComponents/Header'
import { boatyardMooring, vendor } from '../../Utils/CustomData'
import { InputText } from 'primereact/inputtext'
import DataTableComponent from '../../CommonComponent/Table/DataTableComponent'
import CustomModal from '../../CustomComponent/CustomModal'
import { useSelector } from 'react-redux'
import { selectCustomerId } from '../../../Store/Slice/userSlice'
import { Toast } from 'primereact/toast'
import { Params } from '../../../Type/CommonType'
import { Paginator } from 'primereact/paginator'
import { ProgressSpinner } from 'primereact/progressspinner'
import { utils, writeFile } from 'xlsx'
import React from 'react'
import { properties } from '../../Utils/MeassageProperties'
import { AddNewButtonStyle } from '../../Style'

const Estimates = () => {
  const selectedCustomerId = useSelector(selectCustomerId)
  const [visible, setVisible] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [estimateData, setEstimateData] = useState<WorkOrderPayload[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<any>(undefined)
  const [editMode, setEditMode] = useState(false)
  const [getEstimate] = useGetEstimateMutation()
  const [convertToWorkOrder] = useGetConvertEstimateToWorkOrderMutation()

  const toast = useRef<Toast>(null)
  const [pageNumber, setPageNumber] = useState(0)
  const [pageNumber1, setPageNumber1] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalRecords, setTotalRecords] = useState<number>()

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

  const ActionButtonColumn: ActionButtonColumnProps = {
    header: 'Action',
    buttons: [
      {
        color: 'black',
        label: 'Convert',
        underline: true,
        style: { cursor: 'disable' },
        onClick: (row) => handleConvert(row),
      },
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
    return data.customerResponseDto.firstName + ' ' + data.customerResponseDto.lastName
  }
  const TechnicianfirstLastName = (data: any) => {
    return (
      data?.technicianUserResponseDto?.firstName + ' ' + data?.technicianUserResponseDto?.lastName
    )
  }

  const workOrderColumns = useMemo(
    () => [
      {
        id: 'customerResponseDto.customerId',
        label: 'Customer ID',
        style: columnStyle,
      },
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
        id: 'boatyardResponseDto.boatyardId',
        label: 'Boatyard',
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

  const getEstimateData = useCallback(async () => {
    try {
      let params: Params = {}
      if (searchText) {
        params.searchText = searchText
      }
      if (pageNumber) {
        params.pageNumber = pageNumber
      }
      if (pageSize) {
        params.pageSize = pageSize
      }
      const response = await getEstimate(params).unwrap()
      const { status, content, message, totalSize } = response as WorkOrderResponse
      if (status === 200 && Array.isArray(content)) {
        setEstimateData(content)
        setTotalRecords(totalSize)
        setIsLoading(false)
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
  }, [searchText, selectedCustomerId, pageNumber, pageSize])

  const convertEstimateToWorkOrder = useCallback(async (id: any) => {
    try {
      setIsLoading(true)
      const response = await convertToWorkOrder({ id: id }).unwrap()
      const { status, message } = response as WorkOrderResponse
      if (status === 200) {
        setIsLoading(false)
        toast?.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: message,
          life: 3000,
        })
        getEstimateData()
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
  }, [])

  const dataToXlsx = (data: WorkOrderPayload[], fileName = 'EstimateData.xlsx') => {
    const formattedData = data.map((item) => ({
      CustomerName: `${item.customerResponseDto.firstName} ${item.customerResponseDto.lastName}`,
      MooringNumber: item.mooringResponseDto.mooringNumber,
      Boatyard: item.boatyardResponseDto.boatyardId,
      AssignedTo: `${item.technicianUserResponseDto.firstName} ${item.technicianUserResponseDto.lastName}`,
      DueDate: item.dueDate,
      Status: item.workOrderStatusDto.status,
    }))

    const worksheet = utils.json_to_sheet(formattedData)
    const workbook = utils.book_new()
    utils.book_append_sheet(workbook, worksheet, 'Estimates')
    writeFile(workbook, fileName)
  }

  const handleEdit = (rowData: any) => {
    setSelectedCustomer(rowData)
    setEditMode(true)
    setVisible(true)
  }

  const handleConvert = (rowData: any) => {
    convertEstimateToWorkOrder(rowData?.id)
  }

  const handleModalClose = () => {
    setVisible(false)
    setEditMode(false)
    getEstimateData()
  }
  const handleButtonClick = () => {
    setVisible(true)
  }

  useEffect(() => {
    getEstimateData()
  }, [pageNumber, pageSize, selectedCustomerId])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getEstimateData()
    }, 600)
    return () => clearTimeout(timeoutId)
  }, [searchText, selectedCustomerId, pageSize, pageNumber])

  useEffect(() => {
    if (selectedCustomerId) {
      setVisible(false)
      setEditMode(false)
    }
  }, [selectedCustomerId])

  return (
    <div style={{ height: '150vh' }} className={visible ? 'backdrop-blur-lg' : ''}>
      <Header header="MOORSERVE/Estimate" />
      <Toast ref={toast} />
      <div className="">
        <div className="flex justify-end gap-6 mt-6 mr-16">
          <div className="flex text-gray-600 mt-3 font-extrabold">
            <div className="">
              <img
                src="/assets/images/Download.png"
                alt="DownLoad"
                className="w-30 h-6 cursor-pointer"
                onClick={() => dataToXlsx(estimateData)}
              />
            </div>
          </div>
          <div className="items-center">
            <CustomModal
              buttonText={'ADD NEW'}
              icon={
                <img src="/assets/images/Plus.png" alt="icon" className="w-3.8 h-3.8  mb-0.5" />
              }
              children={
                <AddWorkOrders
                  workOrderData={selectedCustomer}
                  editModeEstimate={editMode}
                  estimate={true}
                  setVisible={setVisible}
                  toastRef={toast}
                  closeModal={handleModalClose}
                  isAccountRecievable={false}
                />
              }
              headerText={<h1 className="text-xl font-extrabold text-black ml-4">Estimate Form</h1>}
              visible={visible}
              onClick={handleButtonClick}
              onHide={handleModalClose}
              buttonStyle={AddNewButtonStyle}
              dialogStyle={{
                width: '851px',
                height: '526px',
                borderRadius: '1rem',
              }}
            />
          </div>
        </div>

        <div
          style={{
            height: '713px',
            gap: '0px',
            borderRadius: '10px',
            border: '1px solid #D5E1EA',
            opacity: '0px',
            backgroundColor: '#FFFFFF',
          }}
          className="bg-[F2F2F2]  ml-12  mt-3 mr-14">
          <div className="flex flex-wrap align-items-center justify-between  bg-[#00426F] p-2   rounded-tl-[10px] rounded-tr-[10px]">
            <h1
              // style={{
              //   fontSize: '18px',
              //   fontWeight: '700',
              //   lineHeight: '21.09px',
              //   letterSpacing: '0.4837472140789032px',
              //   color: '#FFFFFF',
              //   padding: '8px',
              // }}
              className=" p-2 text-xl font-extrabold text-white">
              Estimate
            </h1>

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
                  className="pl-10 w-[237px] bg-[#00426F] h-[35px] rounded-lg border text-[white] 
                  border-[#D5E1EA] placeholder:text-[#FFFFFF]  focus:outline-none overflow-hidden"
                />
              </div>
            </div>
          </div>

          <div
            data-testid="customer-admin-data"
            className="flex flex-col h-full "
            style={{ height: '630px' }}>
            <div className="flex-grow overflow-auto">
              <DataTableComponent
                tableStyle={{
                  fontSize: '12px',
                  color: '#000000',
                  fontWeight: 600,
                  backgroundColor: '#D9D9D9',
                }}
                data={estimateData}
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
            <div className="mt-auto">
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
                  marginBottom: '-25px',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Estimates
