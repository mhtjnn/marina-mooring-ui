import {
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import CustomModal from '../../CustomComponent/CustomModal'
import AddCustomer from './AddCustomer'
import { FaEdit } from 'react-icons/fa'
import { RiDeleteBin5Fill } from 'react-icons/ri'
import { Dialog } from 'primereact/dialog'
import {
  useDeleteCustomerMutation,
  useGetCustomerMutation,
  useGetCustomerWithMooringWithCustomerImagesMutation,
} from '../../../Services/MoorManage/MoormanageApi'
import {
  CustomerPayload,
  CustomerResponse,
  CustomersWithMooringResponse,
  DeleteCustomerResponse,
  ErrorResponse,
  MooringPayload,
  MooringResponseDtoList,
} from '../../../Type/ApiTypes'
import DataTableComponent from '../../CommonComponent/Table/DataTableComponent'
import Header from '../../Layout/LayoutComponents/Header'
import InputTextWithHeader from '../../CommonComponent/Table/InputTextWithHeader'
import { properties } from '../../Utils/MeassageProperties'
import { Params, iconsByStatus } from '../../../Type/CommonType'
import { Toast } from 'primereact/toast'
import { useSelector } from 'react-redux'
import { selectCustomerId } from '../../../Store/Slice/userSlice'
import CustomMooringPositionMap from '../../Map/CustomMooringPositionMap'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Paginator } from 'primereact/paginator'
import { ActionButtonColumnProps } from '../../../Type/Components/TableTypes'
import { PositionType } from '../../../Type/Components/MapTypes'
import AddImage from './AddImage'
import MooringInformations from '../../CommonComponent/MooringInformations'
import ViewImageDialog from '../../CommonComponent/ViewImageDialog'
import { AddNewButtonStyle, DialogStyle, MooringTableColumnStyle } from '../../Style'
import { AppContext } from '../../../Services/ContextApi/AppContext'
import AddMoorings from '../Moorings/AddMoorings'

const Customer = () => {
  const selectedCustomerId = useSelector(selectCustomerId)
  const [modalVisible, setModalVisible] = useState(false)
  const [customerData, setCustomerData] = useState<CustomerPayload[]>([])
  const [customerImage, setCustomerImage] = useState<any>()
  const [editMode, setEditMode] = useState(false)
  const [editCustomerMode, setEditCustomerMode] = useState(false)
  const [editMooringMode, setEditMooringMode] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>()
  const [customerRecordData, setCustomerRecordData] = useState<any>()
  const [mooringData, setMooringData] = useState<MooringResponseDtoList[]>([])
  const [boatYardData, setBoatYardData] = useState<any[]>([])
  const [mooringRowData, setMooringRowData] = useState<MooringPayload>()
  const [dialogVisible, setDialogVisible] = useState(false)
  const [imageVisible, setImageVisible] = useState(false)
  const [imageData, setImageData] = useState<any>()
  const [imageEditVisible, setImageEditVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedMooring, setSelectedMooring] = useState<any>()
  const [searchText, setSearchText] = useState('')
  const [customerId, setCustomerId] = useState<any>()
  const [isLoading, setIsLoading] = useState(true)
  const [isLoader, setIsLoader] = useState(false)
  const [sortable, setSortable] = useState(false)
  const [getCustomer] = useGetCustomerMutation()
  const [deleteCustomer] = useDeleteCustomerMutation()
  const [getCustomerWithMooringWithCustomerImages] =
    useGetCustomerWithMooringWithCustomerImagesMutation()
  const toast = useRef<Toast>(null)
  const [pageNumber, setPageNumber] = useState(0)
  const [pageNumber1, setPageNumber1] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalRecordsOne, setTotalRecordsOne] = useState<number>()
  const [leftContainerWidth, setLeftContainerWidth] = useState(false)
  const [rightContainerWidth, setRightContainerWidth] = useState(false)
  const [pageNumberTwo, setPageNumberTwo] = useState(0)
  const [pageNumber2, setPageNumber2] = useState(0)
  const [pageSizeTwo, setPageSizeTwo] = useState(10)
  const [totalRecordsTwo, setTotalRecordsTwo] = useState<number>()
  const [accordion, setAccordion] = useState('faq1')
  const [showImage, setShowImage] = useState({ id: '', imageData: '' })
  const { isMapModalOpen, IsdialogVisible, isUploadImageDialogVisible } = useContext(AppContext)
  const [mooringModalVisible, setMooringModalVisible] = useState(false)
  const position: PositionType = [39.4926173, -117.5714859]

  const handleToggle = (faq: SetStateAction<string>) => {
    if (faq === 'faq1' && accordion === 'faq1') {
      setAccordion('faq2')
    } else if (faq === 'faq2' && accordion === 'faq2') {
      setAccordion('faq1')
    } else {
      setAccordion(faq)
    }
  }
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
  const parseCoordinates = (coordinates: any) => {
    if (!coordinates) return null
    const [latitude, longitude] = coordinates?.split(' ').map(parseFloat)
    return isNaN(latitude) || isNaN(longitude) ? null : [latitude, longitude]
  }
  const gpsCoordinatesArray = mooringData.map(
    (mooring) => parseCoordinates(mooring.gpsCoordinates) || [39.4926173, -117.5714859],
  )
  const calculateCenter = (coordinatesArray: any) => {
    if (coordinatesArray.length === 0) {
      return [39.4926173, -117.5714859]
    }
    let totalLat = 0
    let totalLong = 0
    coordinatesArray.forEach(([lat, long]: any) => {
      totalLat += lat
      totalLong += long
    })
    const avgLat = totalLat / coordinatesArray.length
    const avgLong = totalLong / coordinatesArray.length
    return [avgLat, avgLong]
  }

  const initialPosition =
    gpsCoordinatesArray.length > 0 ? calculateCenter(gpsCoordinatesArray) : position

  const handleButtonClick = () => {
    setModalVisible(true)
    setEditMode(false)
    setEditCustomerMode(false)
    setEditMooringMode(false)
  }

  const handleModalClose = () => {
    setModalVisible(false)
    setEditMode(false)
    setEditCustomerMode(false)
    setEditMooringMode(false)
    setDialogVisible(false)
    setMooringModalVisible(false)
    setImageEditVisible(false)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    setPageNumber(0)
    setPageNumber1(0)
  }

  const handleEdit = () => {
    setSelectedCustomer(customerRecordData)
    setEditCustomerMode(true)
    setModalVisible(true)
    setEditMode(true)
  }

  const handleMooringEdit = () => {
    setSelectedCustomer(customerRecordData)
    setEditMooringMode(true)
    setMooringModalVisible(true)
    setEditMode(true)
  }

  const handleDelete = async (rowData: any) => {
    try {
      setIsLoading(true)
      const response = await deleteCustomer({ id: customerRecordData?.id }).unwrap()
      const { status, message } = response as DeleteCustomerResponse
      if (status === 200) {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'User deleted successfully',
          life: 3000,
        })
        getCustomerData()
        setMooringData([])
        setIsLoading(false)
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        })
        setIsLoading(false)
      }
      setCustomerRecordData('')
    } catch (error) {
      const { message: msg } = error as ErrorResponse
      setIsLoading(false)
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: msg,
        life: 3000,
      })
    }
  }

  const handleCustomerTableRowClick = (rowData: any) => {
    setCustomerId(rowData.data.id)
    getCustomersWithMooring(rowData.data.id)
  }

  const handleMooringTableRowClick = (rowData: any) => {
    setDialogVisible(true)
    setMooringRowData(rowData.data)
  }

  const firstLastName = (data: any) => {
    if (data.firstName === null) return '-'
    else return data.firstName + ' ' + data.lastName
  }

  const handleHeaderClick = (columnId: any) => {
    setSortable(!sortable)
  }

  const CustomerTableColumns = useMemo(
    () => [
      {
        id: 'customerId',
        label: 'Customer Id:',
        style: {
          backgroundColor: '#FFFFFF',
          fontWeight: '700',
          fontSize: '12px',
          color: '#000000',
        },
        sortable: false,
      },
      {
        id: 'customerTypeDto.type',
        label: 'Customer Type:',
        style: {
          backgroundColor: '#FFFFFF',
          fontWeight: '700',
          fontSize: '12px',
          color: '#000000',
        },
        onHeaderClick: () => handleHeaderClick('customerType'),
        // sortable: true,
      },
      {
        id: 'firstName',
        label: 'Name:',
        body: firstLastName,
        style: {
          backgroundColor: '#FFFFFF',
          fontWeight: '700',
          fontSize: '12px',
          color: '#000000',
        },
        sortable: false,
      },
      {
        id: 'emailAddress',
        label: 'Email:',
        style: {
          backgroundColor: '#FFFFFF',
          fontWeight: '700',
          fontSize: '12px',
          color: '#000000',
        },
        sortable: false,
      },
      {
        id: 'phone',
        label: 'Phone:',
        style: {
          backgroundColor: '#FFFFFF',
          fontWeight: '700',
          fontSize: '12px',
          color: '#000000',
        },
        sortable: false,
      },
    ],
    [],
  )

  const MooringTableColumn = useMemo(
    () => [
      {
        id: 'id',
        label: 'ID',
        style: {
          backgroundColor: '#FFFFFF',
          fontSize: '12px',
          color: '#000000',
          fontWeight: '700',
          width: '3vw',
        },
      },
      {
        id: 'mooringNumber',
        label: 'Mooring Number',
        style: MooringTableColumnStyle,
      },
      {
        id: 'gpsCoordinates',
        label: 'GPS Coordinates',
        style: MooringTableColumnStyle,
      },
    ],
    [],
  )

  const customerImagesColumns = useMemo(
    () => [
      {
        id: 'id',
        label: 'id',
        style: { width: '100px', backgroundColor: '#FFFFFF', fontWeight: '700', fontSize: '12px' },
      },
      {
        id: 'imageName',
        label: 'Image Name',
        style: { backgroundColor: '#FFFFFF', fontWeight: '700', fontSize: '12px' },
      },
    ],
    [],
  )

  const ActionButtonColumn: ActionButtonColumnProps = useMemo(
    () => ({
      header: 'Action',
      buttons: [
        {
          color: 'black',
          label: 'View Image',
          onClick: (data) => {
            setShowImage((prev) => ({ ...prev, id: data.id, imageData: data.imageData }))
            setImageVisible(true)
          },
          underline: true,
          style: {
            margin: 0,
          },
        },
        {
          color: 'black',
          label: 'Edit',
          onClick: (data) => {
            setImageData(data)
            setImageEditVisible(true)
          },
          underline: true,
          style: {
            margin: 0,
          },
        },
      ],
      headerStyle: {
        backgroundColor: '#FFFFFF',
        height: '3.50rem',
      },
      style: {
        borderBottom: '1px solid #D5E1EA ',
        width: '150px',
        fontWeight: 700,
      },
    }),
    [],
  )

  const getCustomerData = useCallback(async () => {
    setIsLoading(true)
    try {
      let params: Params = {}
      params.searchText = searchText
      pageNumber && (params.pageNumber = pageNumber)
      pageSize && (params.pageSize = pageSize)
      sortable && (params.sortBy = 'customerType')
      const response = await getCustomer(params).unwrap()
      const { status, content, message, totalSize } = response as CustomerResponse
      if (status === 200 && Array.isArray(content)) {
        if (content?.length > 0) {
          setIsLoading(false)
          setCustomerData(content)
          setCustomerId(content[0]?.id)
          setSelectedProduct(content[0])
          setTotalRecordsOne(totalSize)
        } else {
          setIsLoading(false)
          setCustomerRecordData('')
          setMooringData([])
          setBoatYardData([])
          setSelectedMooring('')
          setCustomerData([])
          setCustomerId('')
          setTotalRecordsOne(totalSize)
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
      const { message: msg } = error as ErrorResponse
      console.error('Error occurred while fetching customer data:', msg)
    }
  }, [
    searchText,
    getCustomer,
    selectedCustomerId,
    pageSize,
    pageNumber,
    customerId,
    selectedProduct,
    sortable,
  ])

  const getCustomersWithMooring = async (id: number) => {
    setIsLoading(true)
    setIsLoader(true)
    try {
      const response = await getCustomerWithMooringWithCustomerImages({
        id: id,
        pageNumber: pageNumberTwo,
        pageSize: pageSizeTwo,
      }).unwrap()
      const { status, content, message, totalSize } = response as CustomersWithMooringResponse
      if (status === 200 && Array.isArray(content?.customerResponseDto?.mooringResponseDtoList)) {
        setIsLoading(false)
        setIsLoader(false)
        setTotalRecordsTwo(totalSize)
        setCustomerRecordData(content?.customerResponseDto)
        setCustomerImage(content?.customerResponseDto?.imageDtoList)
        setMooringData(content?.customerResponseDto?.mooringResponseDtoList)
        Array.isArray(content.boatyardNames) && setBoatYardData(content?.boatyardNames)
      } else {
        setIsLoading(false)
        setIsLoader(false)
        setCustomerRecordData('')
        setMooringData([])
        setBoatYardData([])
        toast?.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        })
      }
    } catch (error) {
      setIsLoading(false)
      setIsLoader(false)
      const { message: msg } = error as ErrorResponse
      console.error('Error fetching moorings data:', msg)
    }
  }

  const CustomersList = useMemo(() => {
    return (
      <div
        style={{
          height: '700px',
          minHeight: '700px',
          width: '500px',
          minWidth: '500px',
          backgroundColor: '#FFFFFF',
          position: 'relative',
        }}
        className="ml-[45px] w-[20px] flex-1">
        <div data-testid="customer-data" className="flex flex-col h-full ">
          <div className="flex item-center justify-between bg-[#10293A] rounded-tl-[10px] rounded-tr-[10px] text-white cursor-pointer">
            <div>
              <h1 className="p-4 text-xl font-extrabold">{properties.customerHeader}</h1>
            </div>
            <div
              className="mr-4 mt-[26px]"
              onClick={() => setLeftContainerWidth(true)}
              style={{ cursor: 'pointer' }}>
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
            </div>
          </div>
          <InputTextWithHeader
            value={searchText}
            onChange={handleSearch}
            placeholder="Search by name, ID, phone no.... "
            inputTextStyle={{
              width: '100%',
              height: '44px',
              padding: '0 4rem 0 3rem',
              border: '1px solid #C5D9E0',
              fontSize: '16px',
              color: '#000000',
              borderRadius: '4px',
              minHeight: '44px',
              fontWeight: 400,
              backgroundColor: 'rgb(242 242 242 / 0%)',
            }}
            borderBottom={{ border: '1px solid #D5E1EA' }}
            iconStyle={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '18px',
              height: '18px',
            }}
          />

          <div className="table-container" style={{ overflow: 'auto' }}>
            <DataTableComponent
              data={customerData}
              tableStyle={{
                fontSize: '12px',
                color: '#000000',
                fontWeight: 600,
                backgroundColor: '#D9D9D9',
              }}
              scrollable={true}
              columns={CustomerTableColumns}
              style={{ borderBottom: '1px solid #D5E1EA', fontWeight: '400' }}
              onRowClick={(row) => {
                handleCustomerTableRowClick(row)
              }}
              selectionMode="single"
              onSelectionChange={(e) => {
                setSelectedProduct(e.value)
              }}
              selection={selectedProduct}
              dataKey="id"
              paginator={true}
              rowStyle={(rowData: any) => rowData}
              emptyMessage={
                <div className="text-center mt-40">
                  <img
                    src="/assets/images/empty.png"
                    alt="Empty Data"
                    className="w-28 mx-auto mb-2"
                  />
                  <p className="text-gray-500 text-lg">{properties.noDataMessage}</p>
                </div>
              }
            />
          </div>

          <div className="mt-auto">
            <Paginator
              first={pageNumber1}
              rows={pageSize}
              totalRecords={totalRecordsOne}
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
    )
  }, [customerData, selectedProduct, searchText])

  const CustomerRecordHeader = useMemo(() => {
    return (
      <div className="bg-[#10293A] rounded-t-[10px] flex justify-between">
        <div>
          <h1 className="p-4 text-white text-xl font-extrabold">{properties.customerRecord}</h1>
        </div>
        <div className="flex">
          <>
            <FaEdit
              onClick={handleEdit}
              className="mr-3 mt-[22px] text-[white]"
              data-testid="FaEdit"
              style={{ cursor: 'pointer' }}
            />
            <RiDeleteBin5Fill
              onClick={handleDelete}
              className="text-white mr-2 mt-[22px] "
              data-testid="RiDeleteBin5Fill"
              style={{ cursor: 'pointer' }}
            />
          </>

          <div
            className="p-1 mt-[22px]"
            onClick={() => setRightContainerWidth(true)}
            style={{ cursor: 'pointer' }}>
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
          </div>
        </div>
      </div>
    )
  }, [selectedCustomer, customerRecordData])

  const CustomerDetails = useMemo(() => {
    return (
      <div className="">
        <div className="flex gap-10 p-4">
          <div
            style={{
              fontSize: '14px',
              fontWeight: '400',
              lineHeight: '16.41px',
              color: '#000000',
            }}>
            <p>
              <span className="">Customer Id: </span>
              {customerRecordData?.customerId || '-'}
            </p>
            <p className="mt-4">
              <span className="">Phone: </span>
              {customerRecordData?.phone || '-'}
            </p>
          </div>

          <div
            style={{
              fontSize: '14px',
              fontWeight: '400',
              lineHeight: '16.41px',
              color: '#000000',
              marginLeft: '40px',
            }}>
            <p>
              <span className="">Name: </span>
              {customerRecordData?.firstName && customerRecordData?.lastName
                ? `${customerRecordData.firstName} ${customerRecordData.lastName}`
                : '-'}
            </p>
            <p className="mt-4">
              <span className="">Email: </span>
              {customerRecordData?.emailAddress || '-'}
            </p>
          </div>
        </div>
        <div
          style={{
            fontSize: '14px',
            fontWeight: '400',
            lineHeight: '16.41px',
            color: '#000000',
          }}>
          <p className="ml-4">
            <span className="address-label">Address: </span>
            {(customerRecordData?.address || '-') +
              ', ' +
              (customerRecordData?.city || '-') +
              ', ' +
              (customerRecordData?.stateResponseDto?.name || '-') +
              ', ' +
              (customerRecordData?.countryResponseDto?.name || '-')}
          </p>
          <p className="ml-4 mt-3">
            <span className="address-label">Notes: </span>
            {customerRecordData?.notes || '-'}
          </p>

          <div className="flex mt-2 ml-4 mb-3">
            <div className="mt-1">
              <h1 className="">Boatyard: </h1>
            </div>
            <div className="flex gap-4 ml-2">
              {boatYardData.length > 0 ? (
                boatYardData.map((boatyard, index) => (
                  <p
                    key={index}
                    style={{
                      borderRadius: '5px',
                      fontWeight: '400',
                      fontSize: '12px',
                      color: '#10293A',
                      backgroundColor: '#D5E1EA',
                      padding: '4px',
                    }}>
                    {boatyard}
                  </p>
                ))
              ) : (
                <p
                  style={{
                    fontWeight: '400',
                    fontSize: '12px',
                    color: '#10293A',
                    padding: '4px',
                  }}></p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }, [customerRecordData, boatYardData, selectedCustomer])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getCustomerData()
    }, 600)
    return () => clearTimeout(timeoutId)
  }, [searchText, selectedCustomerId, pageSize, pageNumber, sortable])

  useEffect(() => {
    if (customerId) {
      getCustomersWithMooring(customerId)
    }
  }, [pageNumberTwo, pageSizeTwo, customerId])

  return (
    <>
      <Toast ref={toast} />
      <div
        style={{ height: '150vh' }}
        className={
          modalVisible ||
          imageVisible ||
          imageEditVisible ||
          dialogVisible ||
          IsdialogVisible ||
          isUploadImageDialogVisible ||
          isMapModalOpen.editMode
            ? 'backdrop-blur-lg'
            : ''
        }>
        <Header header={properties.customerPageHeader} />
        <div className="flex justify-end mr-12 ">
          <div className="flex mt-6 ">
            <CustomModal
              buttonText={'ADD NEW'}
              buttonStyle={AddNewButtonStyle}
              icon={<img src="/assets/images/Plus.png" alt="icon" className="w-3.8 h-3.8" />}
              children={
                <AddCustomer
                  customer={selectedCustomer}
                  mooringRowData={mooringRowData}
                  editMode={editMode}
                  editCustomerMode={editCustomerMode}
                  editMooringMode={editMooringMode}
                  closeModal={handleModalClose}
                  getCustomer={getCustomerData}
                  getCustomerRecord={() => {
                    if (customerId) {
                      getCustomersWithMooring(customerId)
                    }
                  }}
                  toastRef={toast}
                />
              }
              headerText={
                editMooringMode ? (
                  <h1 className="text-xxl font-bold text-black ">
                    {properties.mooringInformation}
                  </h1>
                ) : (
                  <h1 className="text-xxl font-bold text-black ">
                    {properties.customerInformation}
                  </h1>
                )
              }
              visible={modalVisible}
              onClick={handleButtonClick}
              onHide={handleModalClose}
              dialogStyle={{
                height: '580px',
                minHeight: '580px',
                overflowY: 'auto',
                ...DialogStyle,
              }}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row mt-3">
          {/* Left Panel */}
          {leftContainerWidth ? (
            <div
              style={{
                height: '700px',
                minHeight: '700px',
                width: '40px',
                minWidth: '40px',
                backgroundColor: '#10293A',
              }}
              className="rounded-md ml-[45px]">
              <div
                className="p-3"
                onClick={() => setLeftContainerWidth(false)}
                style={{ cursor: 'pointer' }}>
                <img src="/assets/images/plus.png" alt="Key Icon" className="p-clickable" />
              </div>
              <div
                style={{
                  writingMode: 'vertical-lr',
                  textAlign: 'center',
                  color: 'white',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotate(180deg)',
                  fontSize: '20px',
                  letterSpacing: '4px',
                }}
                className="pt-14">
                {properties.CustomerList}
              </div>
            </div>
          ) : (
            <>
              {/* Customers List Data Table */}
              {CustomersList}
              {/* Loader */}
              {isLoading && (
                <ProgressSpinner
                  style={{
                    position: 'absolute',
                    top: '65%',
                    left: '34%',
                    transform: 'translate(-50%, -50%)',
                    width: '50px',
                    height: '50px',
                  }}
                  strokeWidth="4"
                />
              )}
            </>
          )}

          {/* middle container */}
          <div
            className={` min-h-[600] rounded-md border-[1px] ml-5 ${modalVisible || imageVisible || isUploadImageDialogVisible || imageEditVisible || dialogVisible || dialogVisible || isMapModalOpen.editMode || IsdialogVisible ? 'blur-screen' : ''}`}
            style={{ flexGrow: '1' }}>
            <CustomMooringPositionMap
              position={initialPosition}
              zoomLevel={15}
              style={{ height: '700px', width: 'auto' }}
              iconsByStatus={iconsByStatus}
              moorings={mooringData}
              customerPage={true}
              setRightContainer={setRightContainerWidth}
              setLeftContainer={setLeftContainerWidth}
              leftContanerWidth={leftContainerWidth}
              rightContanerWidth={rightContainerWidth}
            />
          </div>

          {/* last container */}
          {rightContainerWidth ? (
            <div
              style={{
                height: '700px',
                minHeight: '700px',
                width: '40px',
                minWidth: '40px',
                backgroundColor: '#10293A',
              }}
              className="rounded-md ml-[20px] mr-[20px]">
              <div
                className="p-3"
                onClick={() => setRightContainerWidth(false)}
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
                  letterSpacing: '4px',
                }}
                className="pb-24 pl-2">
                {properties.CustomerDetails}{' '}
              </div>
            </div>
          ) : (
            <div className="ml-5 mr-4">
              {/* Left Panel - Customer Record */}
              <div
                style={{
                  maxWidth: '450px',
                  width: '450px',
                }}
                className="flex-grow border bg-white">
                {CustomerRecordHeader}
                <div style={{ border: '1px solid white', height: '180px', overflowY: 'scroll' }}>
                  {customerRecordData ? (
                    CustomerDetails
                  ) : (
                    <div className="text-center mt-10">
                      <>
                        <img
                          src="/assets/images/empty.png"
                          alt="Empty Data"
                          className="w-20 mx-auto mb-2"
                        />
                        <p className="text-gray-800 text-lg">{properties.noDataMessage}</p>
                      </>
                    </div>
                  )}
                </div>
              </div>

              {isLoader && (
                <ProgressSpinner
                  style={{
                    position: 'absolute',
                    top: '40%',
                    left: '85%',
                    transform: 'translate(-50%, -50%)',
                    width: '50px',
                    height: '50px',
                  }}
                  strokeWidth="4"
                />
              )}

              <div style={{ width: '450px' }} className="flex  flex-col wrapper">
                <div
                  className=" relative  bg-white border-[1px] border-[#D5E1EA] mr-8"
                  style={{
                    width: '450px',
                    maxWidth: '450px',
                    marginBottom: '0px',
                  }}>
                  <label
                    style={{ backgroundColor: '#10293A' }}
                    htmlFor="faq1"
                    className="cursor-pointer flex items-center justify-between h-14"
                    onClick={() => handleToggle('faq1')}>
                    <div className="flex items-center gap-4 ">
                      <div>
                        <h1 className="p-4 text-white text-xl font-extrabold">
                          {properties.mooringHeader}
                        </h1>
                      </div>
                    </div>
                    <div>
                      <div className="mr-2">
                        {accordion === 'faq1' ? (
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
                    className={`content transition-all ease-in-out duration-500 ${accordion === 'faq1' ? '' : 'hidden'}`}>
                    <div style={{ justifyContent: 'center', alignItems: 'center' }}>
                      <div className="flex-grow bg-white rounded-md border">
                        <div
                          style={{
                            fontWeight: '700',
                            color: 'white',
                            padding: '14px',
                            fontSize: '15px',
                          }}>
                          <div
                            className={`bg-#00426F overflow-x-hidden h-[320px] table-container flex flex-col`}>
                            <div className="flex-grow" style={{ overflow: 'auto' }}>
                              <DataTableComponent
                                style={{ borderBottom: '1px solid #D5E1EA', fontWeight: '400' }}
                                scrollable
                                tableStyle={{
                                  fontSize: '12px',
                                  color: '#000000',
                                  fontWeight: 600,
                                  backgroundColor: '#D9D9D9',
                                }}
                                data={mooringData}
                                columns={MooringTableColumn}
                                onRowClick={(rowData) => {
                                  handleMooringTableRowClick(rowData)
                                }}
                                selectionMode="single"
                                onSelectionChange={(e) => {
                                  setSelectedMooring(e.value)
                                }}
                                selection={selectedMooring}
                                dataKey="id"
                                rowStyle={(rowData: any) => rowData}
                                emptyMessage={
                                  <div className="text-center mt-10">
                                    <img
                                      src="/assets/images/empty.png"
                                      alt="Empty Data"
                                      className="w-20 mx-auto mb-2"
                                    />
                                    <p className="text-gray-500 text-lg">
                                      {properties.noDataMessage}
                                    </p>
                                  </div>
                                }
                              />
                            </div>
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
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab relative bg-[#FFFFFF] border-[1px] border-[#D5E1EA] mr-8"
                  style={{
                    width: '450px',
                    maxWidth: '450px',
                    marginTop: '0px',
                  }}>
                  <label
                    htmlFor="faq2"
                    style={{ backgroundColor: '#10293A' }}
                    className="cursor-pointer flex items-center justify-between h-14"
                    onClick={() => handleToggle('faq2')}>
                    <div className="flex items-center">
                      <div style={{ flexShrink: 1 }}>
                        <h1 className="p-3 text-white text-lg font-extrabold">
                          {properties.imageHeader}
                        </h1>
                      </div>
                    </div>
                    <div>
                      <div className="p-2">
                        {accordion === 'faq2' ? (
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
                    className={`content mt-5 transition-all ease-in-out duration-500 ${accordion === 'faq2' ? '' : 'hidden'}`}>
                    <div
                      className={`bg-#00426F overflow-x-hidden h-[330px] table-container flex flex-col`}>
                      <div className="flex-grow" style={{ overflow: 'auto' }}>
                        <DataTableComponent
                          style={{ borderBottom: '1px solid #D5E1EA', fontWeight: '400' }}
                          scrollable
                          tableStyle={{
                            fontSize: '12px',
                            color: '#000000',
                            fontWeight: 600,
                            backgroundColor: '#D9D9D9',
                          }}
                          data={customerImage}
                          columns={customerImagesColumns}
                          selectionMode="single"
                          actionButtons={ActionButtonColumn}
                          selection={selectedMooring}
                          dataKey="id"
                          rowStyle={(rowData: any) => rowData}
                          emptyMessage={
                            <div className="text-center mt-10">
                              <img
                                src="/assets/images/empty.png"
                                alt="Empty Data"
                                className="w-20 mx-auto mb-2"
                              />
                              <p className="text-gray-500 text-lg">{properties.noDataMessage}</p>
                            </div>
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/*Mooring Information Dialog BOX */}
        <Dialog
          position="center"
          style={{
            width: '740px',
            minWidth: '300px',
            height: '503px',
            minHeight: '200px',
            borderRadius: '1rem',
            fontWeight: '400',
            maxHeight: '50% !important',
            cursor: 'alias',
          }}
          draggable={false}
          visible={dialogVisible}
          onHide={() => setDialogVisible(false)}
          headerStyle={{ cursor: 'alias' }}
          header={
            <div className="flex gap-4">
              <div className="font-bolder text-[black]">{properties.mooringInformation}</div>
              <div className="font-bold mt-1">
                <FaEdit onClick={handleMooringEdit} color="#0098FF" style={{ cursor: 'pointer' }} />
              </div>
            </div>
          }>
          <MooringInformations mooringRowData={mooringRowData} />
        </Dialog>

        {/* View Image */}
        <Dialog
          position="center"
          style={{
            width: '740px',
            minWidth: '300px',
            height: '500px',
            borderRadius: '1rem',
            fontWeight: '400',
            cursor: 'alias',
          }}
          draggable={false}
          visible={imageVisible}
          onHide={() => {
            setImageVisible(false)
          }}
          headerStyle={{ cursor: 'alias' }}
          header={properties.imageHeader}>
          <ViewImageDialog
            imageVisible={imageVisible}
            setImageVisible={setImageVisible}
            showImage={showImage}
          />
        </Dialog>

        {/* Image Information */}
        <Dialog
          position="center"
          style={{
            width: '700px',
            height: '400px',
            borderRadius: '1rem',
          }}
          draggable={false}
          visible={imageEditVisible}
          onHide={() => {
            setImageEditVisible(false)
          }}
          headerStyle={{ cursor: 'alias' }}
          header={properties.imageInformation}>
          <AddImage
            imageData={imageData}
            entityId={customerId}
            entity={'Customer'}
            closeModal={handleModalClose}
            getCustomersWithMooring={() => {
              if (customerId) {
                getCustomersWithMooring(customerId)
              }
            }}
          />
        </Dialog>

        {mooringModalVisible && (
          <CustomModal
            button={true}
            children={
              <AddMoorings
                moorings={selectedCustomer}
                mooringRowData={mooringRowData}
                editMode={editMode}
                editCustomerMode={editCustomerMode}
                toastRef={toast}
                closeModal={handleModalClose}
                getCustomer={getCustomerData}
                isEditMooring={true}
                getCustomerRecord={() => {
                  if (customerId) {
                    getCustomersWithMooring(customerId)
                  }
                }}
              />
            }
            headerText={<h1 className="text-xxl font-bold text-black">Mooring Information</h1>}
            visible={mooringModalVisible}
            onHide={handleModalClose}
            dialogStyle={{
              width: '800px',
              minWidth: '800px',
              height: '630px',
              minHeight: '630px',
              borderRadius: '1rem',
              maxHeight: '95% !important',
            }}
          />
        )}
      </div>
    </>
  )
}

export default Customer
