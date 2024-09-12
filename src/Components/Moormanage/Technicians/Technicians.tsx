import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SelectButton, SelectButtonChangeEvent } from 'primereact/selectbutton'
import { Calendar } from 'primereact/calendar'
import {
  CustomerPayload,
  ErrorResponse,
  GetUserResponse,
  TechnicianPayload,
  TechnicianResponse,
} from '../../../Type/ApiTypes'
import { Params } from '../../../Type/CommonType'
import Header from '../../Layout/LayoutComponents/Header'
import DataTableComponent from '../../CommonComponent/Table/DataTableComponent'
import InputTextWithHeader from '../../CommonComponent/Table/InputTextWithHeader'
import { properties } from '../../Utils/MeassageProperties'
import { ProgressSpinner } from 'primereact/progressspinner'
import { ActionButtonColumnProps } from '../../../Type/Components/TableTypes'
import {
  useGetTechnicianDataMutation,
  useGetOpenWorkOrdersMutation,
  useGetClosedWorkOrdersMutation,
} from '../../../Services/MoorManage/MoormanageApi'
import { useSelector } from 'react-redux'
import { selectCustomerId } from '../../../Store/Slice/userSlice'
import { Toast } from 'primereact/toast'
import { Paginator } from 'primereact/paginator'
import { Dialog } from 'primereact/dialog'
import AddWorkOrders from '../../Moorserve/WorkOrders/AddWorkOrders'

const Technicians = () => {
  const [dateFrom, setDateFrom] = useState<any>()
  const [dateTo, setDateTo] = useState<any>()
  const [filterDateFrom, setFilterDateFrom] = useState<any>()
  const [filterDateTo, setFilterDateTo] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)
  const [technicianData, setTechnicianData] = useState<TechnicianPayload[]>([])
  const [filteredTechnicianData, setFilteredTechnicianData] = useState<TechnicianPayload[]>([])
  const [getTechnicians] = useGetTechnicianDataMutation()
  const [getOpenWork] = useGetOpenWorkOrdersMutation()
  const [getWorkedClosed] = useGetClosedWorkOrdersMutation()
  const [getOpenWorkOrderData, setGetOpenWorkOrderData] = useState<CustomerPayload[]>([])
  const [searchText, setSearchText] = useState('')
  const [selectedProduct, setSelectedProduct] = useState()
  const [technicianId, setTechnicianId] = useState()
  const [selectedWorkOrderRowData, setSelectedWorkOredrRowData] = useState<any>()
  const [addWorkOrderModal, setAddWorkOrderModal] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const toast = useRef<Toast>(null)
  const selectedCustomerId = useSelector(selectCustomerId)
  const [pageNumber, setPageNumber] = useState(0)
  const [pageNumber1, setPageNumber1] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalRecords, setTotalRecords] = useState<number>()
  const [pageNumberTwo, setPageNumberTwo] = useState(0)
  const [pageNumber2, setPageNumber2] = useState(0)
  const [pageSizeTwo, setPageSizeTwo] = useState(10)
  const [totalRecordsTwo, setTotalRecordsTwo] = useState<number>()
  const [openWorkOrder, setOpenWorkOrder] = useState<number>(0)
  const [completedWorkOrder, setCompletedOrder] = useState<number>(0)
  const options: string[] = [`Open (${openWorkOrder})`, `Completed (${completedWorkOrder})`]
  const [value, setValue] = useState<string>(options[0])
  const [visible, setVisible] = useState(false)

  const onPageChange = (event: any) => {
    setPageNumber(event.page)
    setPageNumber1(event.first)
    setPageSize(event.rows)
  }

  const onPageChangeTwo = (event: any) => {
    setPageNumberTwo(event.page)
    setPageNumber2(event.first)
    setPageSizeTwo(event.rows)
  }

  const TechnicianTableColumnStyle = {
    backgroundColor: '#FFFFFF',
    fontWeight: '700',
    fontSize: '12px',
    color: '#000000',
  }

  const WorkOrdersColumnStyle = {
    fontSize: '12px',
    height: '12px',
    color: 'white',
    backgroundColor: '#00426F',
    marginTop: '1rem',
    border: '1px solid #00426F',
    fontWeight: '700',
  }

  const TechfirstLastName = (data: any) => {
    return data?.firstName + ' ' + data?.lastName
  }

  const TechnicianTableColumn = useMemo(
    () => [
      { id: 'id', label: 'ID', style: TechnicianTableColumnStyle },
      {
        id: 'name',
        label: 'Technicians Name',
        body: TechfirstLastName,
        style: TechnicianTableColumnStyle,
      },
      { id: 'openWorkOrder', label: 'Open Work Orders', style: TechnicianTableColumnStyle },
      { id: 'closeWorkOrder', label: 'Completed Jobs', style: TechnicianTableColumnStyle },
    ],

    [],
  )

  const handleModalClose = () => {
    setAddWorkOrderModal(false)
    setModalVisible(false)
    setSelectedWorkOredrRowData('')
  }

  const handleActionClick = (row: any) => {
    setSelectedWorkOredrRowData(row)
    setAddWorkOrderModal(true)
    setModalVisible(true)
  }
  const firstLastName = (data: any) => {
    return data?.customerResponseDto?.firstName + ' ' + data?.customerResponseDto?.lastName
  }

  const WorkOrdersColumn = useMemo(
    () => [
      { id: 'id', label: 'ID', style: WorkOrdersColumnStyle },
      { id: 'mooringResponseDto.mooringNumber', label: 'Mooring', style: WorkOrdersColumnStyle },
      {
        id: 'firstName',
        label: 'Customer Name',
        body: firstLastName,
        style: WorkOrdersColumnStyle,
      },
      { id: 'dueDate', label: 'Due Date', style: WorkOrdersColumnStyle },
    ],
    [],
  )

  const WorkOrderActionColumn: ActionButtonColumnProps = {
    header: 'Action',
    buttons: [
      {
        color: 'black',
        label: 'View',
        filled: true,
        onClick: (row) => {
          handleActionClick(row)
        },
      },
    ],
    headerStyle: WorkOrdersColumnStyle,
    style: { borderBottom: '1px solid #D5E1EA', fontWeight: '' },
  }

  const formatDate = (dateString: any) => {
    const date = new Date(dateString)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const year = date.getFullYear()
    return `${month}/${day}/${year}`
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  const handleWorkOrder = (rowData: any) => {
    setTechnicianId(rowData?.id)
    setSelectedProduct(rowData)

    setOpenWorkOrder(rowData?.openWorkOrder)
    setCompletedOrder(rowData?.closeWorkOrder)

    if (!dateFrom || !dateTo) {
      setFilterDateFrom(undefined)
      setFilterDateTo(undefined)
    }

    if (technicianId) {
      if (value.includes('Open')) {
        getOpenWorkOrder(technicianId)
      } else {
        getClosedWorkOrder(technicianId)
      }
    }
  }

  const getTechniciansData = useCallback(async () => {
    setIsLoading(true)
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

      const response = await getTechnicians(params).unwrap()
      const { status, content, message, totalSize } = response as TechnicianResponse
      if (status === 200 && Array.isArray(content)) {
        if (content.length > 0) {
          setIsLoading(false)
          setTechnicianData(content)
          setSelectedProduct(content[0])
          setTechnicianId(content[0]?.id)
          setFilteredTechnicianData(content)
          setTotalRecords(totalSize)
          setOpenWorkOrder(content[0]?.openWorkOrder)
          setCompletedOrder(content[0]?.closeWorkOrder)
        } else {
          setIsLoading(false)
          setGetOpenWorkOrderData([])
          setTechnicianData([])
        }
      } else {
        setIsLoading(false)
        setGetOpenWorkOrderData([])
        toast?.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        })
      }
    } catch (error) {
      setIsLoading(false)
      const { message: msg } = error as ErrorResponse
      console.error('Error occurred while fetching customer data:', msg)
    }
  }, [searchText, getTechnicians, pageSize, pageNumber, openWorkOrder, completedWorkOrder])

  const getOpenWorkOrder = useCallback(
    async (id: any) => {
      setIsLoading(true)

      try {
        const response = await getOpenWork({
          technicianId: id,
          pageNumber: pageNumberTwo,
          pageSize: pageSizeTwo,
          filterDateFrom: filterDateFrom,
          filterDateTo: filterDateTo,
        }).unwrap()
        const { status, message, content, totalSize } = response as GetUserResponse
        if (status === 200 && Array.isArray(content)) {
          setIsLoading(false)
          setValue(options[0])
          setGetOpenWorkOrderData(content)
          setTotalRecordsTwo(totalSize)
          setOpenWorkOrder(totalSize)
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
        setIsLoading(false)
        console.error('Error occurred while fetching customer data:', error)
      }
    },
    [
      technicianId,
      value,
      pageSizeTwo,
      pageNumberTwo,
      filterDateFrom,
      filterDateTo,
      getOpenWorkOrderData,
      openWorkOrder,
    ],
  )

  const getClosedWorkOrder = useCallback(
    async (id: any) => {
      setIsLoading(true)

      try {
        const response = await getWorkedClosed({
          technicianId: id,
          pageNumber: pageNumberTwo,
          pageSize: pageSizeTwo,
          filterDateFrom: filterDateFrom,
          filterDateTo: filterDateTo,
        }).unwrap()
        const { status, message, content, totalSize } = response as GetUserResponse
        if (status === 200 && Array.isArray(content)) {
          setIsLoading(false)
          setValue(options[1])
          setGetOpenWorkOrderData(content)
          setTotalRecordsTwo(totalSize)
          setCompletedOrder(totalSize)
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
        setIsLoading(false)
        console.error('Error occurred while fetching customer data:', error)
      }
    },
    [
      technicianId,
      value,
      pageSizeTwo,
      pageNumberTwo,
      filterDateFrom,
      filterDateTo,
      completedWorkOrder,
    ],
  )

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!dateFrom) {
        setFilterDateFrom(undefined)
      } else if (!dateTo) {
        setFilterDateTo(undefined)
      }

      if (technicianId) {
        if (value.includes('Open')) {
          getOpenWorkOrder(technicianId)
        } else {
          getClosedWorkOrder(technicianId)
        }
      }
    }, 600)
    return () => clearTimeout(timeoutId)
  }, [
    technicianId,
    value,
    pageSizeTwo,
    pageNumberTwo,
    filterDateFrom,
    filterDateTo,
    openWorkOrder,
    completedWorkOrder,
    !dateFrom,
    !dateTo,
  ])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (technicianId && filterDateFrom && filterDateTo) {
        getOpenWorkOrder(technicianId)
        getClosedWorkOrder(technicianId)
      }
    }, 600)
    return () => clearTimeout(timeoutId)
  }, [technicianId, filterDateFrom, filterDateTo])

  useEffect(() => {
    if (dateFrom && dateTo) {
      setFilterDateFrom(formatDate(dateFrom))
      setFilterDateTo(formatDate(dateTo))
    }
  }, [dateFrom, dateTo])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getTechniciansData()
    }, 600)
    return () => clearTimeout(timeoutId)
  }, [searchText, selectedCustomerId, pageSize, pageNumber])

  return (
    <>
      <Header header="MOORMANAGE/Technicians" />
      <Toast ref={toast} />

      <div className="mt-6">
        <div className="flex justify-end mr-[54px]">
          <div className="flex gap-4 items-center">
            <div className="">
              <p style={{ color: '#00426F', fontWeight: '600' }}>Filter order by Date</p>
            </div>

            <div
              className="flex-auto"
              style={{
                position: 'relative',
                border: '1px solid #D5E1EA',
                borderRadius: '5px',
                display: 'flex',
                gap: '8px',
                padding: '8px',
              }}>
              <div
                data-testid="BiCalendarAlt"
                style={{ flex: '1', display: 'flex', justifyContent: 'center' }}>
                <Calendar
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.value || null)
                  }}
                  placeholder="   From:  mm/dd/yyyy"
                  className="h-10"
                  id="calender"
                  showIcon
                />
              </div>
              <div
                data-testid="BiCalendarAltTwo"
                style={{ flex: '1', display: 'flex', justifyContent: 'center' }}>
                <Calendar
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.value || null)
                  }}
                  placeholder="   To:  mm/dd/yyyy"
                  className="h-10"
                  id="calender"
                  showIcon
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex lg:flex-row justify-around md:flex-col mt-3">
          <div
            style={{
              width: '700px',
              height: '700px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #D5E1EA',
              borderRadius: '5px',
              marginLeft: '3rem',
            }}>
            <div className="bg-[#00426F] rounded-tl-[10px] rounded-tr-[10px] text-white">
              <h1 className="p-4 text-xl font-extrabold">{properties.Technician}</h1>
            </div>
            <InputTextWithHeader
              value={searchText}
              onChange={handleSearch}
              placeholder="Search by name, ID..."
              inputTextStyle={{
                height: '44px',
                width: '100%',
                cursor: 'pointer',
                fontSize: '',
                color: '#000000',
                border: '1px solid #D5E1EA',
                paddingLeft: '40px',
                borderRadius: '5px',
              }}
              iconStyle={{
                position: 'absolute',
                left: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '18px',
                height: '18px',
              }}
            />

            <div
              data-testid="technician-data"
              className="flex flex-col mt-[3px] table-container "
              style={{ height: '548px' }}>
              <div className="flex-grow overflow-auto">
                <DataTableComponent
                  columns={TechnicianTableColumn}
                  scrollable={true}
                  tableStyle={{
                    fontSize: '12px',
                    color: '#000000',
                    fontWeight: 600,
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer',
                  }}
                  onRowClick={(row) => {
                    handleWorkOrder(row.data)
                  }}
                  onSelectionChange={(e) => {
                    setSelectedProduct(e.value)
                  }}
                  selection={selectedProduct}
                  data={technicianData}
                  emptyMessage={
                    <div className="text-center mt-40 mb-10">
                      <img
                        src="/assets/images/empty.png"
                        alt="Empty Data"
                        className="w-20 mx-auto mb-4"
                      />
                      <p className="text-gray-500 text-lg ">{properties.noDataMessage}</p>
                    </div>
                  }
                  style={{ borderBottom: '1px solid #D5E1EA', fontWeight: '500' }}
                />
              </div>
              <div data-testid="progressOne">
                {isLoading && (
                  <ProgressSpinner
                    style={{
                      position: 'absolute',
                      top: '70%',
                      left: '40%',
                      transform: 'translate(-50%, -50%)',
                      width: '50px',
                      height: '50px',
                    }}
                    strokeWidth="4"
                  />
                )}
              </div>
              <div data-testid="PaginatorOne" className="mt-auto">
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
                    marginBottom: '-14px',
                  }}
                />
              </div>
            </div>
          </div>

          <div
            className={`md:ml-12 md:mt-3 lg:mt-0`}
            style={{
              flexGrow: 1,
              borderRadius: '5px',
              border: '1px solid #D5E1EA',
              backgroundColor: '#FFFFFF',
              marginRight: '50px',
              width: '700px',
              height: '700px',
            }}>
            <div className="flex justify-between mt-6  mb-3 ">
              <div className="font-bold ml-5">
                <p style={{ color: '#000000', fontSize: '18px' }}>{properties.workOrderHeader}</p>
              </div>
              <div className="mr-10">
                <div className="card flex justify-content-center ">
                  <SelectButton
                    data-testid="selectButton"
                    value={value}
                    onChange={(e: SelectButtonChangeEvent) => {
                      if (e.value) {
                        setValue(e.value)
                      }
                    }}
                    options={options}
                    className="selectButton"
                  />
                </div>
              </div>
            </div>

            <div
              data-testid="workOrder"
              className="flex flex-col mt-[3px] table-container "
              style={{ height: '600px' }}>
              <div className="flex-grow overflow-auto">
                <DataTableComponent
                  columns={WorkOrdersColumn}
                  actionButtons={WorkOrderActionColumn}
                  scrollable={true}
                  tableStyle={{
                    fontSize: '12px',
                    color: '#000000',
                    fontWeight: 600,
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer',
                  }}
                  onSelectionChange={(e) => {
                    setSelectedProduct(e.value)
                  }}
                  data={getOpenWorkOrderData}
                  emptyMessage={
                    <div className="text-center mt-40 mb-10">
                      <img
                        src="/assets/images/empty.png"
                        alt="Empty Data"
                        className="w-20 mx-auto mb-4"
                      />
                      <p className="text-gray-500 text-lg ">{properties.noDataMessage}</p>
                    </div>
                  }
                  style={{ borderBottom: '1px solid #D5E1EA', fontWeight: '500' }}
                />
                <div data-testid="progressTwo">
                  {isLoading && (
                    <ProgressSpinner
                      style={{
                        position: 'absolute',
                        top: '70%',
                        left: '40%',
                        transform: 'translate(-50%, -50%)',
                        width: '50px',
                        height: '50px',
                      }}
                      strokeWidth="4"
                    />
                  )}
                </div>
              </div>
              <div data-testid="Paginator" className="mt-auto">
                <Paginator
                  first={pageNumber2}
                  rows={pageSizeTwo}
                  totalRecords={totalRecordsTwo}
                  rowsPerPageOptions={[5, 10, 20, 30]}
                  onPageChange={onPageChangeTwo}
                  style={{
                    position: 'sticky',
                    bottom: 0,
                    zIndex: 1,
                    backgroundColor: 'white',
                    borderTop: '1px solid #D5E1EA',
                    padding: '0.5rem',
                    marginBottom: '-22px',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* for view button */}
      <Dialog
        position="center"
        style={{
          width: '851px',
          minWidth: '851px',
          height: '526px',
          minHeight: '526px',
          borderRadius: '1rem',
          fontWeight: '400',
          cursor: 'alias',
        }}
        draggable={false}
        headerStyle={{ cursor: 'alias' }}
        visible={addWorkOrderModal}
        onHide={handleModalClose}
        header={<h1 className="text-xl font-extrabold text-black ml-4">Work Order</h1>}>
        <AddWorkOrders
          workOrderData={selectedWorkOrderRowData}
          isTechnician={true}
          editModeWorkOrder={true}
          setVisible={() => {
            setAddWorkOrderModal(false)
            setModalVisible(false)
          }}
          closeModal={() => {
            handleModalClose()
            setModalVisible(false)
          }}
        />
      </Dialog>
    </>
  )
}

export default Technicians
