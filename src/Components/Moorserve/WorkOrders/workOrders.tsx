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
import {
  AccountRecievableColumnStyle,
  AddNewButtonStyle,
  WorkOrderActionButtonStyle,
  WorkOrderButtonStyle,
  WorkOrderDataTableStyle,
} from '../../Utils/Style'
import { TechnicianfirstLastName, dataToPdf, firstLastName } from '../../Helper/Helper'

const WorkOrders: React.FC<WorkOrderValue> = () => {
  const toast = useRef<Toast>(null)
  const selectedCustomerId = useSelector(selectCustomerId)
  const [visible, setVisible] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [workOrderData, setWorkOrderData] = useState<WorkOrderPayload[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<any>('')
  const [editMode, setEditMode] = useState(false)
  const [pageNumber, setPageNumber] = useState(0)
  const [pageNumber1, setPageNumber1] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalRecords, setTotalRecords] = useState<number>()
  const [completedWorkOrder, setCompletedOrder] = useState<string>('No')
  const [getWorkOrder] = useGetWorkOrdersMutation()

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
    headerStyle: { ...AccountRecievableColumnStyle },
    style: { ...WorkOrderActionButtonStyle },
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
      { id: 'workOrderStatusDto.status', label: 'Status', style: AccountRecievableColumnStyle },
    ],
    [],
  )

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
        dataToPdf(combinedContent, toast)
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
      <Header header="MOORSERVE/Work Orders" />
      <Toast ref={toast} />
      <div className="">
        <div className="flex justify-end gap-4 mt-8 mr-12">
          <Button onClick={handleExportPdf} style={{ ...WorkOrderButtonStyle }}>
            {properties.exportToPdfText}{' '}
          </Button>
          <div className="items-center">
            <CustomModal
              buttonText={properties.buttonText}
              icon={
                <img src="/assets/images/Plus.png" alt="icon" className="w-3.8 h-3.8  mb-0.5" />
              }
              children={
                <AddWorkOrders
                  workOrderData={selectedCustomer}
                  setWorkOrderData={setSelectedCustomer}
                  editModeWorkOrder={editMode}
                  setVisible={setVisible}
                  visible={visible}
                  toastRef={toast}
                  closeModal={handleModalClose}
                  isAccountRecievable={false}
                />
              }
              headerText={<h1 className="text-xl font-extrabold text-black ml-4">Work Order</h1>}
              visible={visible}
              onClick={() => setVisible(true)}
              onHide={handleModalClose}
              buttonStyle={{ ...AddNewButtonStyle, marginTop: '-16px' }}
              dialogStyle={{
                width: '800px',
                height: '526px',
                borderRadius: '1rem',
              }}
            />
          </div>
        </div>

        <div
          style={{
            height: 'calc(100vh - 160px)',
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
              tableStyle={{ ...WorkOrderDataTableStyle }}
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
