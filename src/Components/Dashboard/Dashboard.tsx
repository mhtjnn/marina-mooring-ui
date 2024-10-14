import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import DataTableComponent from '../CommonComponent/Table/DataTableComponent'
import Header from '../Layout/LayoutComponents/Header'
import { ActionButtonColumnProps, TableColumnProps } from '../../Type/Components/TableTypes'
import { ErrorResponse, MooringAndWorkOrderResponse, MooringResponse } from '../../Type/ApiTypes'
import {
  useGetAllOpenWorkOrdersAndMooringDueForServiceMutation,
  useGetMooringsMutation,
  useGetMooringsPercentageMutation,
} from '../../Services/MoorManage/MoormanageApi'
import { useSelector } from 'react-redux'
import { selectCustomerId } from '../../Store/Slice/userSlice'
import { Toast } from 'primereact/toast'
import { PositionType } from '../../Type/Components/MapTypes'
import { GearOffIcon, GearOnIcon, NeedInspectionIcon, NotInUseIcon } from '../Map/DefaultIcon'
import { FiMinus } from 'react-icons/fi'
import { IoAddOutline } from 'react-icons/io5'
import { Paginator } from 'primereact/paginator'
import StatCard from '../StatCard/StatCard'
import { Dialog } from 'primereact/dialog'
import AddWorkOrders from '../Moorserve/WorkOrders/AddWorkOrders'
import { Calendar } from 'primereact/calendar'
import { ProgressSpinner } from 'primereact/progressspinner'
import CustomDashboardMooringMap from '../Map/CustomDashboardMooringMap'
import { properties } from '../Utils/MeassageProperties'

const Dashboard = () => {
  const selectedCustomerId = useSelector(selectCustomerId)
  const [accordion, setAccordion] = useState('faq1')
  const [workOrderData, setWorkOrderData] = useState<any>()
  const [selectedCustomer, setSelectedCustomer] = useState<any>()
  const [visible, setVisible] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [totalMoorings, setTotalMoorings] = useState<any>()
  const [mooringPercentage, setMooringPercentage] = useState<any>()
  const [pageNumber, setPageNumber] = useState(0)
  const [pageNumber1, setPageNumber1] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalRecords, setTotalRecords] = useState<number>()
  const [mooringData, setMooringData] = useState<any>()
  const [selectedProduct, setSelectedProduct] = useState<any>()
  const [mooringResponseData, setMooringResponseData] = useState<any>()
  const [leftContainerWidth, setLeftContainerWidth] = useState(false)
  const [rightContainerWidth, setRightContainerWidth] = useState(false)
  const [getMoorings] = useGetMooringsMutation()
  const today = new Date()
  const dateAfter7Days = new Date(today)
  dateAfter7Days.setDate(today.getDate() + 7)
  const formatDate = (dateString: any) => {
    const date = new Date(dateString)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const year = date.getFullYear()
    return `${month}/${day}/${year}`
  }
  const [startDate, setStartDate] = useState<any>(formatDate(today))
  const [endDate, setEndDate] = useState<any>(formatDate(dateAfter7Days))
  // const [dates, setDates] = useState<[Date, Date]>([today, dateAfter7Days])
  const [dates, setDates] = useState<[Date, Date]>()
  const [filterDateFrom, setFilterDateFrom] = useState<any>(formatDate(today))
  const [filterDateTo, setFilterDateTo] = useState<any>(formatDate(dateAfter7Days))

  const handleDateChange = (e: { target: { value: any } }) => {
    const { value } = e.target
    setDates(value)
    if (value && value.length === 2 && value[0] && value[1]) {
      setStartDate(value[0])
      setEndDate(value[1])
    }
  }

  const [getOpenWorkOrderAndMoorings] = useGetAllOpenWorkOrdersAndMooringDueForServiceMutation()
  const [getMooringCount] = useGetMooringsPercentageMutation()
  const toast = useRef<Toast>(null)

  const position: PositionType = [39.4926173, -117.5714859]

  const parseCoordinates = (coordinates: any) => {
    if (!coordinates) return null
    const [latitude, longitude] = coordinates?.split(' ').map(parseFloat)
    return isNaN(latitude) || isNaN(longitude) ? null : [latitude, longitude]
  }

  const gpsCoordinatesArray =
    mooringData &&
    mooringData?.map(
      (mooring: any) => parseCoordinates(mooring.gpsCoordinates) || [-31.896, 114.659],
    )

  const initialPosition = gpsCoordinatesArray?.length > 0 ? gpsCoordinatesArray[0] : position

  const convertStringToArray = (str: any) => {
    return str?.split(' ').map(Number)
  }

  const coordinatesArray = convertStringToArray(mooringResponseData)

  const iconsByStatus = {
    GearOn: GearOnIcon,
    GearOff: GearOffIcon,
    NeedInspection: NeedInspectionIcon,
    NotInUse: NotInUseIcon,
  }

  const statCardsData = [
    [
      { title: 'Total Moorings', percentage: mooringPercentage, count: totalMoorings },
      { title: 'Total Moorings', percentage: mooringPercentage, count: totalMoorings },
    ],
  ]

  const handleToggle = (faq: string) => {
    switch (faq) {
      case 'faq1':
        if (accordion === 'faq1') {
          setAccordion('faq2')
        } else {
          setAccordion('faq1')
        }
        break
      case 'faq2':
        if (accordion === 'faq2') {
          setAccordion('faq3')
        } else {
          setAccordion('faq2')
        }
        break
      case 'faq3':
        if (accordion === 'faq3') {
          setAccordion('faq1')
        } else {
          setAccordion('faq3')
        }
        break
      default:
        setAccordion(faq)
        break
    }
  }

  const onPageChange = (event: any) => {
    setPageNumber(event.page)
    setPageNumber1(event.first)
    setPageSize(event.rows)
  }

  const handleModalClose = () => {
    setVisible(false)
    setEditMode(false)
  }

  const handleEdit = (rowData: any) => {
    setSelectedCustomer(rowData)
    setEditMode(true)
    setVisible(true)
  }

  const firstLastName = (data: any) => {
    if (data.customerResponseDto.firstName === null) return '-'
    else return data.customerResponseDto.firstName + ' ' + data.customerResponseDto.lastName
  }

  const Mooringcolumns: TableColumnProps[] = useMemo(
    () => [
      {
        id: 'id',
        label: 'ID',
        style: {
          fontSize: '12px',
          width: '3vw',
          backgroundColor: '#FFFFFF',
          color: '#000000',
          fontWeight: '700',
        },
      },
      {
        id: 'firstName',
        label: 'Customer Name',
        body: firstLastName,
        style: {
          fontSize: '12px',
          backgroundColor: '#FFFFFF',
          color: '#000000',
          fontWeight: '700',
        },
      },
      {
        id: 'mooringNumber',
        label: 'Mooring Number',
        style: {
          fontSize: '12px',
          backgroundColor: '#FFFFFF',
          color: '#000000',
          fontWeight: '700',
        },
      },

      {
        id: 'mooringServiceDate',
        label: 'Inspection Date',
        style: {
          fontSize: '12px',
          backgroundColor: '#FFFFFF',
          color: '#000000',
          fontWeight: '700',
        },
      },
      {
        id: 'gpsCoordinates',
        label: 'Mooring Location ',
        style: {
          fontSize: '12px',
          backgroundColor: '#FFFFFF',
          color: '#000000',
          fontWeight: '700',
        },
      },
      {
        id: 'mooringDueServiceStatusDto.status',
        label: 'Status',
        style: {
          fontSize: '12px',
          backgroundColor: '#FFFFFF',
          color: '#000000',
          fontWeight: '700',
        },
      },
    ],
    [],
  )

  const TechnicianfirstLastName = (data: any) => {
    return (
      data?.technicianUserResponseDto?.firstName + ' ' + data?.technicianUserResponseDto?.lastName
    )
  }

  const WorkOrderColumns: TableColumnProps[] = useMemo(
    () => [
      {
        id: 'id',
        label: 'Work Order No.',
        style: { fontSize: '10px', width: '4.5vw', backgroundColor: '#FFFFFF', color: '#000000' },
      },
      {
        id: 'mooringResponseDto.mooringNumber',
        label: 'Mooring Number',
        style: { fontSize: '10px', backgroundColor: '#FFFFFF', color: '#000000' },
      },
      {
        id: 'firstName',
        label: 'Customer Name',
        body: firstLastName,
        style: { fontSize: '10px', backgroundColor: '#FFFFFF', color: '#000000' },
      },
      {
        id: 'technicianUserResponseDto.name',
        label: 'Assigned To',
        body: TechnicianfirstLastName,
        style: { fontSize: '10px', backgroundColor: '#FFFFFF', color: '#000000' },
      },
      {
        id: 'dueDate',
        label: 'Date',
        style: { fontSize: '10px', backgroundColor: '#FFFFFF', color: 'black' },
      },
    ],
    [],
  )

  const WorkOrderActionButtonColumn: ActionButtonColumnProps = {
    header: 'Actions',
    buttons: [
      {
        underline: true,
        label: 'view',
        filled: true,
        onClick: (row) => handleEdit(row),
      },
    ],
    style: { fontSize: '10px', width: '4vw', backgroundColor: '#FFFFFF', color: 'black' },
    headerStyle: { backgroundColor: '#FFFFFF' },
  }

  const getMooringsAndWorkOrderData = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await getOpenWorkOrderAndMoorings({
        pageNumber: pageNumber,
        pageSize: pageSize,
        filterDateFrom: filterDateFrom,
        filterDateTo: filterDateTo,
      }).unwrap()
      const { status, content, message, totalSize } = response as MooringAndWorkOrderResponse

      if (status === 200) {
        if (content?.mooringDueServiceResponseDtoList) {
          setIsLoading(false)
          setMooringData(content?.mooringDueServiceResponseDtoList)
          // setSelectedProduct(content?.mooringDueServiceResponseDtoList[0])
        } else {
          setIsLoading(false)
          setMooringData([])
        }
        if (content?.workOrderResponseDtoList) {
          setIsLoading(false)
          setWorkOrderData(content?.workOrderResponseDtoList)
          setTotalRecords(totalSize)
        } else {
          setIsLoading(false)
          setMooringData([])
        }
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
      const { message } = error as ErrorResponse
      console.error('Error fetching moorings data:', error)
    }
  }, [
    getOpenWorkOrderAndMoorings,
    pageSize,
    pageNumber,
    filterDateFrom,
    filterDateTo,
    selectedCustomerId,
  ])

  const getMooringsData = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await getMoorings({}).unwrap()
      const { status, totalSize } = response as MooringResponse
      if (status === 200) {
        if (totalSize > 0) {
          setTotalMoorings(totalSize)
        } else {
          setTotalMoorings(0)
        }
      } else {
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      const { message } = error as ErrorResponse
      console.error('Error fetching moorings data:', error)
    }
  }, [selectedCustomerId])

  const getMooringsCount = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await getMooringCount({}).unwrap()
      const { status, totalSize, content } = response as MooringResponse
      if (status === 200) {
        setMooringPercentage(content)
      } else {
        setMooringPercentage('')
      }
    } catch (error) {
      setIsLoading(false)
      const { message } = error as ErrorResponse
      console.error('Error fetching moorings data:', error)
    }
  }, [selectedCustomerId])

  useEffect(() => {
    if (startDate && endDate) {
      setFilterDateFrom(formatDate(startDate))
      setFilterDateTo(formatDate(endDate))
    }
  }, [startDate, endDate])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getMooringsAndWorkOrderData()
    }, 2000)
    return () => clearTimeout(timeoutId)
  }, [pageSize, pageNumber, filterDateFrom, filterDateTo, selectedCustomerId])

  useEffect(() => {
    getMooringsData()
    getMooringsCount()
  }, [selectedCustomerId, totalMoorings])

  return (
    <>
      <Header header="MOORMANAGE/DASHBOARD" />
      <Toast ref={toast} />
      <div className="">
        <div className="flex lg:flex-row justify-around md:flex-col mt-12">
          <div
            style={{
              marginLeft: '3rem',
            }}>
            <div
              data-testid="mooring-data"
              className="flex flex-col"
              style={{
                height: leftContainerWidth ? '40px' : '300px',
                position: 'relative',
                borderRadius: '10px',
                backgroundColor: '#FFFFFF',
              }}>
              <div
                className={`flex justify-between ${leftContainerWidth ? 'bg-[#00426F] rounded-[10px] h-[50px] ' : 'bg-[#00426F] rounded-tl-[10px] rounded-tr-[10px]'} text-white`}>
                <div className={`flex-1 ${leftContainerWidth ? 'text-center' : ''}`}>
                  <h1 className="p-3 text-xl font-extrabold">Moorings Due for Service</h1>
                </div>

                <div className="pt-4 pr-4" style={{ cursor: 'pointer' }}>
                  {leftContainerWidth && (
                    <div onClick={() => setLeftContainerWidth(false)}>
                      <img src="/assets/images/plus.png" alt="Key Icon" className="p-clickable" />
                    </div>
                  )}
                </div>
              </div>

              <div
                style={{
                  height: '240px',
                  overflowY: 'auto',
                  borderBottomLeftRadius: '10px',
                }}
                className="h-[240px] overflow-auto">
                <DataTableComponent
                  columns={Mooringcolumns}
                  scrollable={true}
                  tableStyle={{
                    backgroundColor: '#FFFFFF',
                    fontSize: '12px',
                    color: '#000000',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  selectionMode="single"
                  onSelectionChange={(e) => {
                    setSelectedProduct(e.value)
                  }}
                  selection={selectedProduct}
                  dataKey="id"
                  onRowClick={(rowData) => {
                    setMooringResponseData(rowData?.data?.gpsCoordinates)
                  }}
                  data={mooringData}
                  emptyMessage={
                    <div className="text-center">
                      <img
                        src="/assets/images/empty.png"
                        alt="Empty Data"
                        className="w-20 mx-auto mb-2"
                      />
                      <p className="text-gray-500">{properties.noDataMessage}</p>
                    </div>
                  }
                />
              </div>

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
            <div className={`${leftContainerWidth ? 'mt-8' : 'mt-4'}`}>
              <CustomDashboardMooringMap
                position={coordinatesArray ? coordinatesArray : initialPosition}
                zoomLevel={10}
                style={{
                  height: leftContainerWidth ? 'calc(100vh - 250px)' : 'calc(100vh - 480px)',
                  minHeight: leftContainerWidth ? 'calc(100vh - 250px)' : 'calc(100vh - 480px)',
                  width: '100%',
                }}
                iconsByStatus={iconsByStatus}
                moorings={mooringData}
                dashboard={true}
                leftContanerWidth={leftContainerWidth}
                setLeftContainer={setLeftContainerWidth}
                rightContanerWidth={rightContainerWidth}
                setRightContainer={setRightContainerWidth}
              />
            </div>
          </div>

          {leftContainerWidth ? (
            <div
              style={{
                height: 'calc(100vh - 350px)',
                minHeight: '720px',
                width: '40px',
                minWidth: '40px',
                backgroundColor: '#00426F',
              }}
              className="rounded-md ml-[20px] mr-[20px]">
              <div
                className="p-3"
                onClick={() => setLeftContainerWidth(false)}
                style={{ cursor: 'pointer' }}>
                <img src="/assets/images/plus.png" alt="Key Icon" className="p-clickable" />
              </div>
              <div
                style={{
                  writingMode: 'vertical-rl',
                  textAlign: 'center',
                  color: 'white',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  letterSpacing: '3px',
                  fontWeight: 700,
                }}
                className="pt-12">
                Calender
              </div>
            </div>
          ) : (
            <div className={`md:ml-12 md:mt-3 lg:mt-0`}>
              <div className="flex  flex-col wrapper ">
                <div
                  className=" px-5 relative mb-4 rounded-xl bg-white border-[1px] border-[#D5E1EA] mr-8"
                  style={{ width: '600px', maxWidth: '600px' }}>
                  <label
                    htmlFor="faq1"
                    className="cursor-pointer flex items-center justify-between h-14"
                    onClick={() => handleToggle('faq1')}>
                    <div className="flex items-center gap-4">
                      <div>
                        <img
                          alt="icon"
                          src="/assets/images/Calendar.svg"
                          style={{ width: '23px' }}
                        />
                      </div>
                      <div>
                        <h1 className="text-[16px] font-[500] text-[#10293A] leading-[18.75px]">
                          Calendar
                        </h1>
                      </div>
                    </div>
                    <div>
                      <div className="">
                        {accordion === 'faq1' ? (
                          <FiMinus style={{ color: '#10293A' }} />
                        ) : (
                          <IoAddOutline style={{ color: '#10293A' }} />
                        )}
                      </div>
                    </div>
                  </label>

                  <div
                    className={`content mt-5 transition-all ease-in-out duration-500 ${accordion === 'faq1' ? '' : 'hidden'}`}>
                    <div
                      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <div
                        className="card flex  justify-items-center"
                        style={{
                          height: 'auto',
                          gap: '0px',
                          borderRadius: '10px',
                          border: '1.13px solid #D5E1EA',
                          backgroundColor: '#D5E1EA',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginBottom: '2rem',
                        }}>
                        <Calendar
                          value={dates}
                          onChange={(e) => handleDateChange(e)}
                          selectionMode="range"
                          hideOnRangeSelection
                          inline
                          style={{
                            width: '520px',
                          }}
                        />
                      </div>{' '}
                    </div>
                  </div>
                </div>
                <div
                  className="tab px-5 relative mb-4 rounded-xl bg-[#FFFFFF] border-[1px] border-[#D5E1EA] mr-8"
                  style={{ width: '600px', maxWidth: '600px' }}>
                  <label
                    htmlFor="faq2"
                    className="cursor-pointer flex items-center justify-between h-14"
                    onClick={() => handleToggle('faq2')}>
                    <div className="flex items-center gap-4">
                      <div>
                        <img alt="icon" src="/assets/images/file.svg" style={{ width: '23px' }} />
                      </div>
                      <div style={{ flexShrink: 1 }}>
                        <h1 className="text-[16px] font-[500] text-[#10293A] leading-[18.75px]">
                          Open Work Orders
                        </h1>
                      </div>
                    </div>
                    <div>
                      <div className="">
                        {accordion === 'faq2' ? (
                          <FiMinus style={{ color: '#10293A' }} />
                        ) : (
                          <IoAddOutline style={{ color: '#10293A' }} />
                        )}
                      </div>
                    </div>
                  </label>
                  <div
                    className={`content transition-all ease-in-out duration-500 ${accordion === 'faq2' ? '' : 'hidden'}`}>
                    <div
                      className={`bg-#00426F overflow-x-hidden table-container flex flex-col`}
                      style={{ height: 'calc(100vh - 550px)' }}>
                      <div className="flex-grow" style={{ overflow: 'auto' }}>
                        <DataTableComponent
                          data={workOrderData}
                          columns={WorkOrderColumns}
                          actionButtons={WorkOrderActionButtonColumn}
                          scrollable={true}
                          tableStyle={{ fontSize: '10px' }}
                          emptyMessage={
                            <div className="text-center mt-8">
                              <img
                                src="/assets/images/empty.png"
                                alt="Empty Data"
                                className="w-20 mx-auto mb-3"
                              />
                              <p className="text-sm text-gray-500">{properties.noDataMessage}</p>
                            </div>
                          }
                        />
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

                <div
                  className="tab px-5 py-3 bg-white border-[1px] border-[#D5E1EA] relative mb-2 rounded-xl mr-8"
                  style={{
                    width: '600px',
                    maxWidth: '600px',
                  }}>
                  <label
                    htmlFor="faq3"
                    className="cursor-pointer flex items-center justify-between h-8"
                    onClick={() => handleToggle('faq3')}>
                    <div className="flex items-center gap-2">
                      <img alt="icon" src="/assets/images/Group.svg" style={{ width: '25px' }} />
                      <div className="ml-2 " style={{ flexShrink: 1 }}>
                        <h1 className="text-[#10293A] font-[500] leading-[18.75px]">
                          Total Moorings
                        </h1>
                      </div>
                    </div>

                    <div className="">
                      {accordion === 'faq3' ? (
                        <FiMinus style={{ color: '#10293A' }} />
                      ) : (
                        <IoAddOutline style={{ color: '#10293A' }} />
                      )}
                    </div>
                  </label>
                  <div
                    className={`content mt-5 transition-all ease-in-out duration-500 ${accordion === 'faq3' ? '' : 'hidden'}`}>
                    <div>
                      {statCardsData?.map((items) => (
                        <StatCard key={items[0].title} items={items} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Dialog
                position="center"
                style={{
                  width: '851px',
                  height: '526px',
                  borderRadius: '1rem',
                }}
                draggable={false}
                visible={visible}
                onHide={handleModalClose}
                header={<h1 className="text-xl font-extrabold text-black ml-4">Work Order</h1>}>
                <AddWorkOrders
                  workOrderData={selectedCustomer}
                  editModeWorkOrder={editMode}
                  setVisible={setVisible}
                  toastRef={toast}
                  closeModal={handleModalClose}
                  isTechnician={true}
                />
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Dashboard
