import CustomModal from '../../CustomComponent/CustomModal'
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  SetStateAction,
  useContext,
} from 'react'
import {
  useDeleteMooringsMutation,
  useGetCustomerWithMooringWithMooringImagesMutation,
  useGetMooringsMutation,
} from '../../../Services/MoorManage/MoormanageApi'
import {
  CustomersWithMooringResponse,
  DeleteCustomerResponse,
  ErrorResponse,
  MooringPayload,
  MooringResponse,
  MooringResponseDtoList,
} from '../../../Type/ApiTypes'
import { FaEdit } from 'react-icons/fa'
import { Dialog } from 'primereact/dialog'
import { Params } from '../../../Type/CommonType'
import DataTableComponent from '../../CommonComponent/Table/DataTableComponent'
import InputTextWithHeader from '../../CommonComponent/Table/InputTextWithHeader'
import { properties } from '../../Utils/MeassageProperties'
import Header from '../../Layout/LayoutComponents/Header'
import { Toast } from 'primereact/toast'
import { useSelector } from 'react-redux'
import CustomMooringPositionMap from '../../Map/CustomMooringPositionMap'
import { RiDeleteBin5Fill } from 'react-icons/ri'
import { ProgressSpinner } from 'primereact/progressspinner'
import AddCustomer from '../Customer/AddCustomer'
import { selectCustomerId } from '../../../Store/Slice/userSlice'
import { Paginator } from 'primereact/paginator'
import { PositionType } from '../../../Type/Components/MapTypes'
import { GearOffIcon, GearOnIcon, NeedInspectionIcon, NotInUseIcon } from '../../Map/DefaultIcon'
import AddMoorings from './AddMoorings'
import { ActionButtonColumnProps } from '../../../Type/Components/TableTypes'
import AddImage from '../Customer/AddImage'
import ViewImageDialog from '../../CommonComponent/ViewImageDialog'
import MooringInformations from '../../CommonComponent/MooringInformations'
import { AddNewButtonStyle, DialogStyle } from '../../Utils/Style'
import { AppContext } from '../../../Services/ContextApi/AppContext'

const Moorings = () => {
  const selectedCustomerId: any = useSelector(selectCustomerId)
  const [modalVisible, setModalVisible] = useState(false)
  const [mooringData, setMooringData] = useState<MooringPayload[]>([])
  const [customerRecordData, setCustomerRecordData] = useState<any>()
  const [mooringResponseData, setMooringResponseData] = useState<any>()
  const [selectedMooringResponseData, setSelectedMooringResponseData] = useState<any>()
  const [boatYardData, setBoatYardData] = useState<any[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<any>()
  const [mooringRowData, setMooringRowData] = useState<MooringPayload>()
  const [mooringGPSResponseData, setMooringGPSResponseData] = useState<any>()
  const [GPSResponseData, setGPSResponseData] = useState<any>()
  const [editMode, setEditMode] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>()
  const [rowClickedActionInProgress, setRowClickedActionInProgress] = useState(false)
  const [selectedMooring, setSelectedMooring] = useState<any>()
  const [searchText, setSearchText] = useState('')
  const [customerId, setCustomerId] = useState<any>()
  const [mooringId, setMooringId] = useState<any>()
  const [isLoading, setIsLoading] = useState(true)
  const [isLoader, setIsLoader] = useState(false)
  const [dialogVisible, setDialogVisible] = useState(false)
  const [editCustomerMode, setEditCustomerMode] = useState(false)
  const [customerModalVisible, setCustomerModalVisible] = useState(false)
  const [accordion, setAccordion] = useState('faq1')
  const [isEditMooring, setIsEditMooring] = useState(false)
  const [mooringImage, setMooringImage] = useState<any>()
  const [showImage, setShowImage] = useState({ id: '', imageData: '' })
  const [imageVisible, setImageVisible] = useState(false)
  const [imageData, setImageData] = useState<any>()
  const [imageEditVisible, setImageEditVisible] = useState(false)
  const [leftContainerWidth, setLeftContainerWidth] = useState(false)
  const [rightContainerWidth, setRightContainerWidth] = useState(false)
  const toast = useRef<Toast>(null)
  const [getMoorings] = useGetMooringsMutation()
  const [deleteMooring] = useDeleteMooringsMutation()
  const [getCustomerWithMooringWithMooringImages] =
    useGetCustomerWithMooringWithMooringImagesMutation()

  const [pageNumber, setPageNumber] = useState(0)
  const [pageNumber1, setPageNumber1] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalRecords, setTotalRecords] = useState<number>()

  const [pageNumberTwo, setPageNumberTwo] = useState(0)
  const [pageNumber2, setPageNumber2] = useState(0)
  const [pageSizeTwo, setPageSizeTwo] = useState(10)
  const [totalRecordsTwo, setTotalRecordsTwo] = useState<number>()
  const { isMapModalOpen, IsdialogVisible, isUploadImageDialogVisible } = useContext(AppContext)

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

  const handleToggle = (faq: SetStateAction<string>) => {
    if (faq === 'faq1' && accordion === 'faq1') {
      setAccordion('faq2')
    } else if (faq === 'faq2' && accordion === 'faq2') {
      setAccordion('faq1')
    } else {
      setAccordion(faq)
    }
  }

  const position: PositionType = [39.4926173, -117.5714859]

  const parseCoordinates = (coordinates: any) => {
    if (!coordinates) return null
    const [latitude, longitude] = coordinates?.split(' ').map(parseFloat)
    return isNaN(latitude) || isNaN(longitude) ? null : [latitude, longitude]
  }

  const gpsCoordinatesArray =
    mooringResponseData &&
    mooringResponseData?.map(
      (mooring: any) => parseCoordinates(mooring.gpsCoordinates) || [39.4926173, -117.5714859],
    )

  const initialPosition = gpsCoordinatesArray?.length > 0 ? gpsCoordinatesArray[0] : position

  const convertStringToArray = (str: any) => {
    return str?.split(' ').map(Number)
  }

  const coordinatesArray = convertStringToArray(GPSResponseData)

  const iconsByStatus = {
    GearOn: GearOnIcon,
    GearOff: GearOffIcon,
    NeedInspection: NeedInspectionIcon,
    NotInUse: NotInUseIcon,
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    setCustomerRecordData('')
    setBoatYardData([])
    setMooringResponseData([])
    setPageNumber(0)
    setPageNumber1(0)
  }

  const handleModalClose = () => {
    setModalVisible(false)
    setCustomerModalVisible(false)
    setDialogVisible(false)
    setEditCustomerMode(false)
    setEditMode(false)
    setImageEditVisible(false)
    setIsEditMooring(false)
  }

  const handleMooringRowClick = async (rowData: any) => {
    await getCustomersWithMooring(rowData?.customerId, rowData?.id)
    setCustomerId(rowData?.customerId)
    setMooringId(rowData?.id)
  }

  const handleEdit = (rowData: any) => {
    setCustomerModalVisible(true)
    setSelectedCustomer(rowData)
    setEditCustomerMode(true)
    setEditMode(true)
  }

  const handleDelete = async () => {
    try {
      setIsLoading(true)
      const response = await deleteMooring({ id: mooringId }).unwrap()
      const { status, message } = response as DeleteCustomerResponse
      if (status === 200) {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: message,
          life: 3000,
        })
        getMooringsData()
        setCustomerRecordData('')
        setIsLoading(false)
      } else {
        setIsLoading(false)
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        })
      }
    } catch (error) {
      const { message } = error as ErrorResponse
      setIsLoading(false)
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 3000,
      })
    }
  }

  const handleMooringEdit = () => {
    setEditMode(true)
    setModalVisible(true)
    setSelectedCustomer(customerRecordData)
    setIsEditMooring(true)
  }
  const serviceArea = (rowData: any) =>
    rowData?.serviceAreaResponseDto?.serviceAreaName !== null ? (
      rowData?.serviceAreaResponseDto?.serviceAreaName
    ) : (
      <div className={'ml-5'}>-</div>
    )
  const gpsCoordinatesValue = (data: any) => {
    if (data?.gpsCoordinates === null) return <div className={'ml-8'}>-</div>
    else return data?.gpsCoordinates
  }
  const tableColumns = useMemo(
    () => [
      {
        id: 'id',
        label: 'ID',
        style: {
          borderBottom: '1px solid #C0C0C0',
          fontWeight: '700',
          color: '#000000',
          width: '3vw',
          backgroundColor: '#FFFFFF',
        },
      },
      {
        id: 'mooringNumber',
        label: 'Mooring Number',
        style: {
          borderBottom: '1px solid #C0C0C0',
          backgroundColor: '#FFFFFF',
          fontWeight: '700',
          color: '#000000',
        },
      },
      {
        id: 'customerName',
        label: 'Customer Name',
        body: (rowData: any) => (rowData?.customerName !== null ? rowData?.customerName : '-'),
        style: {
          borderBottom: '1px solid #C0C0C0',
          backgroundColor: '#FFFFFF',
          fontWeight: '700',
          color: '#000000',
        },
      },
      {
        id: 'serviceAreaResponseDto.serviceAreaName',
        label: 'Service Area',
        body: serviceArea,
        style: {
          borderBottom: '1px solid #C0C0C0',
          backgroundColor: '#FFFFFF',
          fontWeight: '700',
          color: '#000000',
        },
      },
      {
        id: 'gpsCoordinates',
        label: 'GPS Coordinates',
        body: gpsCoordinatesValue,
        style: {
          borderBottom: '1px solid #C0C0C0',
          backgroundColor: '#FFFFFF',
          fontWeight: '700',
          color: '#000000',
        },
      },
    ],
    [],
  )

  const tableColumnsMoorings = useMemo(
    () => [
      {
        id: 'id',
        label: 'ID:',
        style: {
          borderBottom: '1px solid #C0C0C0',
          fontWeight: '700',
          color: '#000000',
          width: '3vw',
          fontSize: '12px',
          backgroundColor: '#FFFFFF',
        },
      },
      {
        id: 'mooringNumber',
        label: 'Mooring Number:',
        style: {
          borderBottom: '1px solid #C0C0C0',
          backgroundColor: '#FFFFFF',
          fontSize: '12px',
          fontWeight: '700',
          color: '#000000',
        },
      },
      {
        id: 'gpsCoordinates',
        label: 'GPS Coordinates:',
        body: gpsCoordinatesValue,
        style: {
          borderBottom: '1px solid #C0C0C0',
          backgroundColor: '#FFFFFF',
          fontSize: '12px',
          fontWeight: '700',
          color: '#000000',
        },
      },
    ],
    [],
  )

  const columnStyle = {
    backgroundColor: '#FFFFFF',
    fontWeight: '700',
    fontSize: '12px',
  }
  const customerImagesColumns = useMemo(
    () => [
      {
        id: 'id',
        label: 'id',
        style: {
          backgroundColor: '#FFFFFF',
          fontWeight: '700',
          fontSize: '12px',
        },
      },

      {
        id: 'imageName',
        label: 'Image Name',
        style: columnStyle,
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
            setShowImage((prev) => ({ ...prev, id: data?.id, imageData: data?.imageData }))
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

  const getMooringsData = useCallback(async () => {
    setIsLoading(true)
    try {
      let params: Params = {}
      params.searchText = searchText
      pageNumber && (params.pageNumber = pageNumber)
      pageSize && (params.pageSize = pageSize)
      const response = await getMoorings(params).unwrap()
      const { status, content, message, totalSize } = response as MooringResponse
      if (status === 200 && Array.isArray(content.mooringResponseDtoList)) {
        if (content?.mooringResponseDtoList?.length > 0) {
          setIsLoading(false)
          setMooringData(content?.mooringResponseDtoList)
          setSelectedMooringResponseData(content?.mooringResponseDtoList?.[0])
          setMooringGPSResponseData(content?.mooringWithGPSCoordinateResponseList)
          setCustomerId(content?.mooringResponseDtoList?.[0]?.customerId)
          setMooringId(content?.mooringResponseDtoList?.[0]?.id)
          setSelectedProduct(content?.mooringResponseDtoList?.[0])
          setTotalRecords(totalSize)
        } else {
          setIsLoading(false)
          setCustomerRecordData('')
          setSelectedProduct('')
          setSelectedMooring('')
          setMooringData([])
          setBoatYardData([])
          setCustomerId('')
          setTotalRecords(totalSize)
          setMooringResponseData([])
          setMooringGPSResponseData([])
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
    searchText,
    getMoorings,
    selectedCustomerId,
    pageSize,
    pageNumber,
    customerId,
    selectedProduct,
  ])

  const getCustomersWithMooring = async (id: number, givenMooringId?: number) => {
    givenMooringId = givenMooringId ?? mooringId
    setIsLoader(true)
    try {
      const response = await getCustomerWithMooringWithMooringImages({
        id: id,
        pageNumber: pageNumberTwo,
        pageSize: pageSizeTwo,
      }).unwrap()
      const { status, content, totalSize } = response as CustomersWithMooringResponse
      if (
        status === 200 &&
        Array.isArray(content?.customerResponseDto?.mooringResponseDtoList) &&
        Array.isArray(content.boatyardNames)
      ) {
        setIsLoading(false)
        setIsLoader(false)
        setCustomerRecordData(content?.customerResponseDto)
        setBoatYardData(content?.boatyardNames)
        setMooringResponseData(content?.customerResponseDto?.mooringResponseDtoList)
        setTotalRecordsTwo(totalSize)
        const allMooringImages: any = []
        content?.customerResponseDto?.mooringResponseDtoList?.forEach(
          (mooring: MooringResponseDtoList) => {
            if (mooring?.id === givenMooringId) {
              allMooringImages.push(...mooring?.imageDtoList)
            } else {
              setMooringImage('')
            }
          },
        )
        setMooringImage(allMooringImages)
      } else {
        setIsLoader(false)
        setIsLoading(false)
        setCustomerRecordData('')
        setMooringResponseData([])
        setMooringImage('')
      }
    } catch (error) {
      setIsLoading(false)
      setIsLoader(false)
      const { message } = error as ErrorResponse
      console.error('Error fetching moorings data:', error)
    }
  }

  const getAddress = (customerRecordData: any) => {
    const { address, city, stateResponseDto, countryResponseDto } = customerRecordData || {}
    const components = [address, city, stateResponseDto?.name, countryResponseDto?.name]
    const filteredComponents = components.filter(Boolean)
    return filteredComponents.length > 0 ? filteredComponents.join(', ') : '-'
  }
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
            {getAddress(customerRecordData)}
          </p>
          <p className="ml-4 mt-3">
            <span className="address-label">Notes: </span>
            {customerRecordData?.notes || '-'}
          </p>

          <div className="flex mt-2 ml-4 mb-3 overflow-x-auto">
            <div className="mt-1">
              <h1 className="">Boatyard: </h1>
            </div>
            <div className="flex gap-4 ml-2">
              {boatYardData.length > 0 ? (
                boatYardData?.map((boatyard, index) => (
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
                  }}>
                  -
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }, [customerRecordData, boatYardData, selectedCustomer])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getMooringsData()
    }, 2000)
    return () => clearTimeout(timeoutId)
  }, [searchText, selectedCustomerId, pageSize, pageNumber])

  useEffect(() => {
    if (customerId) {
      getCustomersWithMooring(customerId)
    }
  }, [pageNumberTwo, pageSizeTwo, customerId, selectedCustomerId])

  return (
    <>
      <Toast ref={toast} />
      <div
        style={{ height: '100vh' }}
        className={
          modalVisible ||
          dialogVisible ||
          imageEditVisible ||
          imageVisible ||
          customerModalVisible ||
          IsdialogVisible ||
          isUploadImageDialogVisible ||
          isMapModalOpen.editMode
            ? 'backdrop-blur-lg'
            : ''
        }>
        <Header header={properties.MoormanageMoorings} />
        <div className="flex justify-end mr-12 ">
          <div className="flex mt-6">
            <CustomModal
              buttonText={'ADD NEW'}
              buttonStyle={AddNewButtonStyle}
              icon={<img src="/assets/images/Plus.png" alt="icon" className="w-3.8 h-3.8" />}
              children={
                <AddMoorings
                  moorings={selectedCustomer}
                  mooringRowData={mooringRowData}
                  editMode={editMode}
                  editCustomerMode={editCustomerMode}
                  toastRef={toast}
                  closeModal={handleModalClose}
                  getCustomer={getMooringsData}
                  isEditMooring={isEditMooring}
                  getCustomerRecord={() => {
                    if (customerId) {
                      getCustomersWithMooring(customerId)
                    }
                  }}
                />
              }
              headerText={<h1 className="text-xxl font-bold text-black ">Mooring Information</h1>}
              visible={modalVisible}
              onClick={() => {
                setModalVisible(true)
              }}
              onHide={handleModalClose}
              dialogStyle={{
                height: '630px',
                minHeight: '630px',
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
                backgroundColor: '#00426F',
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
                className="pt-12">
                Mooring List
              </div>
            </div>
          ) : (
            <>
              <div
                style={{
                  height: 'calc(100vh - 200px)',
                  minHeight: 'calc(100vh - 200px)',
                  width: '500px',
                  minWidth: '500px',
                  backgroundColor: '#FFFFFF',
                  position: 'relative',
                }}
                className="ml-[45px] w-[20px] flex-1">
                <div data-testid="customer-data" className="flex flex-col h-full ">
                  <div className="flex item-center justify-between bg-[#00426F]  rounded-tl-[10px] rounded-tr-[10px] text-white cursor-pointer">
                    <div>
                      <h1 className="p-4 text-xl font-extrabold">{properties.mooringHeader}</h1>
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
                      data={mooringData}
                      tableStyle={{
                        fontSize: '12px',
                        color: '#000000',
                        opacity: rowClickedActionInProgress ? 0.5 : 1,
                        fontWeight: 600,
                        backgroundColor: '#D9D9D9',
                      }}
                      scrollable={true}
                      columns={tableColumns}
                      style={{ borderBottom: '1px solid #D5E1EA', fontWeight: '400' }}
                      onRowClick={async (row: any) => {
                        if (rowClickedActionInProgress) return null
                        setRowClickedActionInProgress(true)
                        try {
                          await handleMooringRowClick(row?.data)
                        } finally {
                          setRowClickedActionInProgress(false)
                        }
                        setSelectedMooringResponseData(row?.data)
                        setGPSResponseData(row?.data?.gpsCoordinates)
                      }}
                      selectionMode="single"
                      onSelectionChange={(e) => {
                        setSelectedProduct(e.value)
                      }}
                      selection={selectedProduct}
                      dataKey="id"
                      rowStyle={(rowData: any) => rowData}
                      emptyMessage={
                        <div className="text-center mt-40">
                          <img
                            src="/assets/images/empty.png"
                            alt="Empty Data"
                            className="w-28 mx-auto mb-4"
                          />
                          <p className="text-gray-500 text-lg">No data available</p>
                        </div>
                      }
                    />
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
                      }}
                    />
                  </div>
                </div>
              </div>
              {isLoading && (
                <ProgressSpinner
                  style={{
                    position: 'absolute',
                    top: '60%',
                    left: '25%',
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
            className={`rounded-md border-[1px] ml-5 ${modalVisible || customerModalVisible || isUploadImageDialogVisible || imageVisible || imageEditVisible || dialogVisible || IsdialogVisible || isUploadImageDialogVisible || isMapModalOpen.editMode ? 'blur-screen' : ''}`}
            style={{ flexGrow: '1', height: 'calc(100vh - 200px)' }}>
            <CustomMooringPositionMap
              position={coordinatesArray ? coordinatesArray : initialPosition}
              zoomLevel={10}
              style={{
                height: 'calc(100vh - 200px)',
                width: 'auto',
                maxWidth: 'auto',
                flexGrow: 1,
              }}
              iconsByStatus={iconsByStatus}
              moorings={mooringGPSResponseData}
              mooringData={selectedMooringResponseData}
              rightContanerWidth={rightContainerWidth}
              leftContanerWidth={leftContainerWidth}
              setRightContainer={setRightContainerWidth}
              setLeftContainer={setLeftContainerWidth}
            />
          </div>

          {/* Right Panel */}
          {rightContainerWidth ? (
            <div
              style={{
                height: '700px',
                minHeight: '700px',
                width: '40px',
                minWidth: '40px',
                backgroundColor: '#00426F',
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
                className="pb-20 pl-2">
                Mooring Details
              </div>
            </div>
          ) : (
            <div className="ml-5 mr-4">
              <div
                style={{
                  maxWidth: '450px',
                  width: '450px',
                }}
                className="flex-grow border bg-white">
                <div className="bg-[#00426F]  rounded-t-[10px] flex justify-between">
                  <div>
                    <h1 className="p-4 text-white text-xl font-extrabold">
                      {properties.customerRecord}
                    </h1>
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
                        className="text-white mr-2 mt-[22px]"
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
                        <p className="text-gray-800 text-lg">No data available</p>
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
                    left: '80%',
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
                    style={{ backgroundColor: '#00426F' }}
                    htmlFor="faq1"
                    className="cursor-pointer flex items-center justify-between h-14"
                    onClick={() => handleToggle('faq1')}>
                    <div className="flex items-center gap-4 ">
                      <div>
                        <h1 className="p-4 text-white text-xl font-extrabold">
                          {properties.customerMooringHeader}
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
                    className={`content  transition-all ease-in-out duration-500 ${accordion === 'faq1' ? '' : 'hidden'}`}>
                    <div
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <div className="flex-grow bg-white rounded-md border">
                        <div
                          style={{
                            fontWeight: '700',
                            color: 'white',
                            padding: '14px',
                            fontSize: '15px',
                          }}>
                          <div
                            className={`bg-#00426F overflow-x-hidden table-container flex flex-col`}
                            style={{ height: 'calc(100vh - 600px)' }}>
                            <div className="flex-grow" style={{ overflow: 'auto' }}>
                              <DataTableComponent
                                style={{ borderBottom: '1px solid #D5E1EA', fontWeight: '400' }}
                                scrollable
                                tableStyle={{
                                  fontSize: '12px',
                                  color: '#000000',
                                  fontWeight: 600,
                                  backgroundColor: '#D9D9D9',
                                  cursor: 'pointer',
                                }}
                                data={mooringResponseData}
                                columns={tableColumnsMoorings}
                                onRowClick={(rowData: any) => {
                                  setDialogVisible(true)
                                  setMooringRowData(rowData.data)
                                }}
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
                                    <p className="text-gray-500 text-lg">No data available</p>
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
                    style={{ backgroundColor: '#00426F' }}
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
                          />
                        )}
                      </div>
                    </div>
                  </label>
                  <div
                    className={`content mt-5 transition-all ease-in-out duration-500 ${accordion === 'faq2' ? '' : 'hidden'}`}>
                    <div
                      className={`bg-#00426F overflow-x-hidden table-container flex flex-col`}
                      style={{ height: 'calc(100vh - 580px)' }}>
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
                          data={mooringImage}
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
                              <p className="text-gray-500 text-lg">No data available</p>
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

        {/* Mooring Information */}
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
              <div className="font-bolder text-[black]">Mooring Information</div>
              <div className="font-bold mt-1">
                <FaEdit onClick={handleMooringEdit} color="#0098FF" style={{ cursor: 'pointer' }} />
              </div>
            </div>
          }>
          <MooringInformations mooringRowData={mooringRowData} />
        </Dialog>

        {/*Edit Image Information */}
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
          header={'Image Information'}>
          <AddImage
            imageData={imageData}
            entityId={mooringId}
            entity={'Mooring'}
            closeModal={handleModalClose}
            getCustomersWithMooring={() => {
              if (customerId) {
                getCustomersWithMooring(customerId)
              }
            }}
          />
        </Dialog>

        {/* View Image */}
        <ViewImageDialog
          imageVisible={imageVisible}
          setImageVisible={setImageVisible}
          showImage={showImage}
        />

        {customerModalVisible && (
          <CustomModal
            button={true}
            children={
              <AddCustomer
                customer={customerRecordData}
                mooringRowData={mooringRowData}
                editMode={editMode}
                editCustomerMode={editCustomerMode}
                editMooringMode={false}
                closeModal={handleModalClose}
                getCustomer={getMooringsData}
                getCustomerRecord={() => {
                  if (customerId) {
                    getCustomersWithMooring(customerId)
                  }
                }}
                toastRef={toast}
              />
            }
            headerText={
              customerModalVisible ? (
                <h1 className="text-xxl font-bold text-black ">Customer Information</h1>
              ) : (
                <h1 className="text-xxl font-bold text-black ">Mooring Information</h1>
              )
            }
            visible={customerModalVisible}
            onHide={handleModalClose}
            dialogStyle={{
              width: '800px',
              minWidth: '800px',
              height: editCustomerMode ? '500px' : '630px',
              minHeight: editCustomerMode ? '500px' : '630px',
              borderRadius: '1rem',
              maxHeight: '95% !important',
              overflowY: 'auto',
            }}
          />
        )}
      </div>
    </>
  )
}

export default Moorings
