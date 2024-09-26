import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CustomModal from '../../CustomComponent/CustomModal'
import { InputText } from 'primereact/inputtext'
import {
  DeleteCustomerResponse,
  ErrorResponse,
  MooringWithServiceAreaResponse,
  ServiceAreaPayload,
  ServiceAreaResponse,
} from '../../../Type/ApiTypes'
import {
  useDeleteServiceAreaMutation,
  useGetServiceAreaMutation,
  useGetMooringWithServiceAreaMutation,
} from '../../../Services/MoorManage/MoormanageApi'
import { ActionButtonColumnProps } from '../../../Type/Components/TableTypes'
import InputTextWithHeader from '../../CommonComponent/Table/InputTextWithHeader'
import DataTableComponent from '../../CommonComponent/Table/DataTableComponent'
import { properties } from '../../Utils/MeassageProperties'
import Header from '../../Layout/LayoutComponents/Header'
import { IoSearchSharp } from 'react-icons/io5'
import '../Boatyards/Boatyard.module.css'
import CustomDisplayPositionMap from '../../Map/CustomDisplayPositionMap'
import { Toast } from 'primereact/toast'
import { Params, iconsByStatus } from '../../../Type/CommonType'
import { Dialog } from 'primereact/dialog'
import { ProgressSpinner } from 'primereact/progressspinner'
import { useSelector } from 'react-redux'
import { selectCustomerId } from '../../../Store/Slice/userSlice'
import { FaEdit } from 'react-icons/fa'
import { RiDeleteBin5Fill } from 'react-icons/ri'
import { Paginator } from 'primereact/paginator'
import React from 'react'
import AddServiceModal from './AddServiceModal'
import MooringInformations from '../../CommonComponent/MooringInformations'
import { AddNewButtonStyle, DialogStyle } from '../../Style'
import CustomServiceAreaMoorinMap from '../../Map/CustomServiceAreaMoorinMap'
import { PositionType } from '../../../Type/Components/MapTypes'

const ServiceArea = () => {
  const selectedCustomerId = useSelector(selectCustomerId)
  const userData = useSelector((state: any) => state.user?.userData)
  const [modalVisible, setModalVisible] = useState(false)
  const [serviceAreaData, setServiceAreaData] = useState<ServiceAreaPayload[]>([])
  const [mooringWithServiceAreasData, setMooringWithServiceAreasData] = useState<
    MooringWithServiceAreaResponse[]
  >([])
  const [filteredServiceAreaData, setFilteredServiceAreaData] = useState<ServiceAreaPayload[]>([])
  const [selectedServiceArea, setSelectedServiceArea] = useState<any>()
  const [selectedProduct, setSelectedProduct] = useState()
  const [selectedMooring, setSelectedMooring] = useState()
  const [editMode, setEditMode] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchFieldText, setSearchFieldText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoader, setIsLoader] = useState(false)
  const [dialogVisible, setDialogVisible] = useState(false)
  const [mooringRowData, setMooringRowData] = useState<any>([])
  const [serviceAreaRecord, setServiceAreaRecord] = useState(true)
  const [mooringResponseData, setMooringResponseData] = useState<any>()
  const [leftContainerWidth, setLeftContainerWidth] = useState(false)

  const toast = useRef<Toast>(null)

  const [getServiceArea] = useGetServiceAreaMutation()
  const [deleteServiceArea] = useDeleteServiceAreaMutation()
  const [getMooringsWithServiceArea] = useGetMooringWithServiceAreaMutation()

  const [pageNumber, setPageNumber] = useState(0)
  const [pageNumber1, setPageNumber1] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalRecords, setTotalRecords] = useState<number>()
  const [pageNumberTwo, setPageNumberTwo] = useState(0)
  const [pageNumberOne, setPageNumberOne] = useState(0)
  const [pageSizeTwo, setPageSizeTwo] = useState(10)
  const [totalRecordsTwo, setTotalRecordsTwo] = useState<number>()

  const position: PositionType = [39.4926173, -117.5714859]

  const parseCoordinates = (coordinates: any) => {
    if (!coordinates) return null
    const [latitude, longitude] = coordinates?.split(' ').map(parseFloat)
    return isNaN(latitude) || isNaN(longitude) ? null : [latitude, longitude]
  }

  const gpsCoordinatesArray =
    mooringWithServiceAreasData &&
    mooringWithServiceAreasData?.map(
      (mooring: any) => parseCoordinates(mooring.gpsCoordinates) || [39.4926173, -117.5714859],
    )

  const initialPosition = gpsCoordinatesArray?.length > 0 ? gpsCoordinatesArray[0] : position

  const convertStringToArray = (str: any) => {
    return str?.split(' ').map(Number)
  }

  const coordinatesArray = convertStringToArray(mooringResponseData)

  const onPageChange = (event: any) => {
    setPageNumber(event.page)
    setPageNumber1(event.first)
    setPageSize(event.rows)
  }

  const onPageChangeTwo = (event: any) => {
    setPageNumberTwo(event.page)
    setPageNumberOne(event.first)
    setPageSizeTwo(event.rows)
  }

  const handleMooringTableRowClick = (rowData: any) => {
    setDialogVisible(true)
    setMooringRowData(rowData)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFieldText('')
    setSearchText(e.target.value)
    setSelectedServiceArea('')
    setMooringRowData('')
    setPageNumber(0)
    setPageNumber1(0)
  }

  const handleSearchField = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText('')
    setSearchFieldText(e.target.value)
  }

  const handleButtonClick = () => {
    setModalVisible(true)
  }

  const handleModalClose = () => {
    setModalVisible(false)
    setEditMode(false)
    // setSelectedServiceArea('')
    setMooringRowData('')
  }

  const ActionButtonColumn: ActionButtonColumnProps = {
    header: 'Action',
    buttons: [
      {
        color: 'red',
        label: 'view',
        underline: true,
        onClick: (rowData) => {
          handleMooringTableRowClick(rowData)
        },
      },
    ],
    headerStyle: {
      backgroundColor: '#00426F',
      color: '#FFFFFF',
      height: '3.50rem',
      borderTopRightRadius: '10px',
      borderBottom: '1px solid #C0C0C0',
    },
    style: { borderBottom: '1px solid #D5E1EA' },
  }

  const serviceAreaTableStyle = {
    backgroundColor: '#00426F',
    borderBottom: '1px solid #C0C0C0',
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: '10px',
  }

  const tableColumnsServiceAreas = useMemo(
    () => [
      {
        id: 'id',
        label: 'ID',
        style: serviceAreaTableStyle,
      },
      {
        id: 'mooringNumber',
        label: 'Mooring Number',
        style: serviceAreaTableStyle,
      },
      {
        id: 'boatName',
        label: 'Boat Name',
        style: serviceAreaTableStyle,
      },
    ],
    [],
  )

  const columnStyle = {
    backgroundColor: '#00426F',
    fontSize: '12px',
    fontWeight: '700',
    color: '#FFFFFF',
    padding: '15px',
  }

  const serviceAreaColumns = useMemo(
    () => [
      {
        id: 'id',
        label: 'ID',
        style: columnStyle,
      },
      {
        id: 'serviceAreaName',
        label: 'Name',
        style: columnStyle,
      },
      {
        id: 'mooringInventoried',
        label: 'Total Mooring Inventoried',
        style: columnStyle,
      },
    ],
    [],
  )

  const handleRowClickServiceAreaDetail = (rowData: any) => {
    getMooringsWithServiceAreaData()
    setSelectedServiceArea(rowData)
    setServiceAreaRecord(true)
  }

  const handleEdit = () => {
    if (serviceAreaRecord == true) {
      setModalVisible(true)
      setEditMode(true)
    }
  }

  const handleDelete = async () => {
    if (serviceAreaRecord == true) {
      setIsLoading(true)
      try {
        const response = await deleteServiceArea({ id: selectedServiceArea?.id }).unwrap()
        const { status, message } = response as DeleteCustomerResponse
        if (status === 200) {
          toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Service Area deleted successfully',
            life: 3000,
          })
          setSelectedServiceArea('')
          getServiceAreaData()
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
          detail: message || 'Error while deleting customer',
          life: 3000,
        })
      }
    }

    setServiceAreaRecord(false)
  }

  const parseCoordinate = (coordinates: any) => {
    if (!coordinates) return null
    const [latitude, longitude] = coordinates?.split(' ').map(parseFloat)
    return isNaN(latitude) || isNaN(longitude) ? null : [latitude, longitude]
  }

  const [latitude, longitude] = parseCoordinate(selectedServiceArea?.gpsCoordinates) || []

  const getServiceAreaData = useCallback(async () => {
    setIsLoading(true)
    try {
      let params: Params = {}
      if (searchText) {
        params.searchText = searchText
      }
      if (searchFieldText) {
        params.searchText = searchFieldText
      }
      if (pageNumber) {
        params.pageNumber = pageNumber
      }
      if (pageSize) {
        params.pageSize = pageSize
      }

      await getServiceArea(params)
        .unwrap()
        .then(async (response: any) => {
          const { status, content, message, totalSize } = response as ServiceAreaResponse
          if (status === 200 && Array.isArray(content)) {
            setServiceAreaData(content)
            setSelectedServiceArea(content[0])
            setSelectedMooring(content[0])
            setTotalRecords(totalSize)
            if (selectedServiceArea) {
              const data = content.find((data) => data.id === selectedServiceArea.id)
              if (data) {
                setSelectedServiceArea(data)
              }
            }
            setFilteredServiceAreaData(content)

            const timeoutId = setTimeout(() => {
              setIsLoading(false)
            }, 400)
            return () => {
              clearTimeout(timeoutId)
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
        })
    } catch (error) {
      const { message } = error as ErrorResponse
      setIsLoading(false)
      console.error('Error fetching getServiceAreadata:', message)
    }
  }, [
    getServiceArea,
    searchText,
    searchFieldText,
    selectedCustomerId,
    selectedServiceArea,
    pageSize,
    pageNumber,
  ])

  const getMooringsWithServiceAreaData = async () => {
    try {
      setIsLoading(true)
      await getMooringsWithServiceArea({
        id: selectedServiceArea?.id,
        pageNumber: pageNumberTwo,
        pageSize: pageSizeTwo,
      })
        .unwrap()
        .then(async (response: any) => {
          const { status, content, totalSize } = response as MooringWithServiceAreaResponse
          if (status === 200 && Array.isArray(content) && content.length > 0) {
            setIsLoading(false)
            setMooringWithServiceAreasData(content)
            setMooringResponseData(content[0]?.gpsCoordinates)
            setSelectedProduct(content[0])
            setTotalRecordsTwo(totalSize)
          } else {
            setIsLoading(false)
            setMooringWithServiceAreasData([])
          }
        })
    } catch (error) {
      const { message } = error as ErrorResponse
      setIsLoading(false)
      console.error('Error fetching getMooringsWithServiceAreaData:', error)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getServiceAreaData()
    }, 2000)
    return () => clearTimeout(timeoutId)
  }, [searchText, selectedCustomerId, searchFieldText, pageSize, pageNumber])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (selectedServiceArea) getMooringsWithServiceAreaData()
    }, 600)
    return () => clearTimeout(timeoutId)
  }, [selectedServiceArea, pageSizeTwo, pageNumberTwo])

  useEffect(() => {
    setIsLoader(true)
    const timeoutId = setTimeout(() => {
      setIsLoader(false)
    }, 400)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [selectedServiceArea])

  const random = useMemo(() => {
    return (
      <AddServiceModal
        closeModal={handleModalClose}
        serviceAreaData={getServiceAreaData}
        customerData={selectedServiceArea}
        editMode={editMode}
        setModalVisible={setModalVisible}
        toastRef={toast}
      />
    )
  }, [selectedServiceArea, getServiceAreaData, editMode, toast, setModalVisible, handleModalClose])

  const serviceAreaMooring = useMemo(() => {
    return (
      <>
        <div className={`flex justify-between mt-1 p-3 ml-5 font-normal text-[12px]`}>
          <p className="">
            {`${selectedServiceArea?.address || '-'}, ${selectedServiceArea?.stateResponseDto?.name || '-'}, ${selectedServiceArea?.countryResponseDto?.name || '-'}`}
          </p>
          <p className="mr-[10rem]">{selectedServiceArea?.mooringInventoried || '-'}</p>
          <p className="underline mr-[4rem]">{selectedServiceArea?.gpsCoordinates || '-'}</p>
        </div>

        <div
          className={`h-[300px] mt-[10px] mb-2 sticky`}
          style={{
            flexGrow: 1,
            border: '1px solid #D5E1EA',
            borderRadius: '10px',
            padding: '0px',
            marginLeft: '10px',
            marginRight: '10px',
          }}>
          <CustomServiceAreaMoorinMap
            position={coordinatesArray ? coordinatesArray : initialPosition}
            iconsByStatus={iconsByStatus}
            moorings={mooringWithServiceAreasData}
            zoomLevel={10}
            leftContanerWidth={leftContainerWidth}
            style={{
              height: '300px',
              width: 'auto',
              maxWidth: 'auto',
              flexGrow: 1,
            }}
          />
        </div>

        <div
          className={`bg-#00426F overflow-x-hidden h-[260px] mt-[3px] table-container flex flex-col`}>
          <div className="flex-grow overflow-y-auto">
            <DataTableComponent
              tableStyle={{
                fontSize: '12px',
                color: '#000000',
              }}
              data={mooringWithServiceAreasData || []}
              columns={tableColumnsServiceAreas}
              actionButtons={ActionButtonColumn}
              selectionMode="single"
              dataKey="id"
              onSelectionChange={(e) => {
                setSelectedProduct(e.value)
              }}
              onRowClick={(rowData) => {
                setMooringResponseData(rowData?.data?.gpsCoordinates)
              }}
              selection={selectedProduct}
              style={{
                borderBottom: '1px solid #D5E1EA',
                marginLeft: '5px',
                fontWeight: '400',
                color: '#000000',
              }}
              emptyMessage={
                <div className="text-center mt-2">
                  <img
                    src="/assets/images/empty.png"
                    alt="Empty Data"
                    className="w-14 mx-auto mb-1"
                  />
                  <p className="text-gray-600">{properties.noDataMessage}</p>
                </div>
              }
            />
          </div>
          {isLoader && (
            <ProgressSpinner
              style={{
                position: 'absolute',
                top: '80%',
                left: '66%',
                transform: 'translate(-50%, -50%)',
                width: '50px',
                height: '50px',
              }}
              strokeWidth="4"
            />
          )}
          <div className="mt-auto">
            <Paginator
              first={pageNumberOne}
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
      </>
    )
  }, [
    selectedServiceArea,
    serviceAreaData,
    mooringWithServiceAreasData,
    coordinatesArray,
    mooringResponseData,
    selectedProduct,
    getMooringsWithServiceAreaData,
  ])

  return (
    <div style={{ height: '150vh' }} className={modalVisible ? 'backdrop-blur-lg' : ''}>
      <Toast ref={toast} />
      <Header header="MOORMANAGE/Service Areas" />
      <div className="flex justify-end mr-14 mt-6 ">
        <div className="flex gap-6 ">
          <div>
            <div className="p-input-icon-left">
              <InputText
                value={searchFieldText}
                onChange={handleSearchField}
                placeholder="Search"
                className="h-[44px] w-[237px] cursor-pointer pl-8 rounded-lg text-bold "
              />
              <img
                src="/assets/images/Search.svg"
                alt="Search Icon"
                className="p-clickable"
                style={{
                  position: 'absolute',
                  left: '10px',
                  right: '-10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '18px',
                  height: '18px',
                }}
              />
            </div>
          </div>
          <CustomModal
            buttonText={'ADD NEW'}
            buttonStyle={AddNewButtonStyle}
            icon={<img src="/assets/images/Plus.png" alt="icon" className="w-3.8 h-3.8  mb-0.5" />}
            children={random}
            headerText={
              <h1 className="text-xl font-extrabold text-black ml-4">Add Service Area</h1>
            }
            visible={modalVisible}
            onClick={handleButtonClick}
            onHide={handleModalClose}
            dialogStyle={{
              height: '550px',
              minHeight: '550px',
              ...DialogStyle,
            }}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row mt-3">
        {leftContainerWidth ? (
          <div
            style={{
              height: '740px',
              minHeight: '740px',
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
              Service Area List
            </div>
          </div>
        ) : (
          <div
            style={{
              borderRadius: '5px',
              marginLeft: '1.8rem',
            }}>
            {/* Left Panel */}
            <div className="bg-white rounded-xl border-[1px] border-[#D5E1EA] mb-4 ml-6 md:mb-0 w-[500px]">
              {/* Header */}
              <div className="bg-[#00426F] rounded-tl-[10px] rounded-tr-[10px] text-white relative">
                <h1 className="p-4 text-xl font-extrabold">{properties.serviceAreaDetail}</h1>
                <div
                  className="absolute top-1/2 right-4 transform -translate-y-1/2"
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
                placeholder={'Search by name, ID,address...'}
                iconStyle={{
                  position: 'absolute',
                  left: '15px',
                  top: '65%',
                  transform: 'translateY(-50%)',
                  width: '16px',
                  height: '16px',
                  fontWeight: 'bold',
                }}
                inputTextStyle={{
                  flexGrow: 1,
                  marginTop: '10px',
                  height: '44px',
                  border: '1px solid #C5D9E0',
                  padding: '0 2rem 0 2.5rem',
                  fontSize: '14px',
                  color: '#000000',
                  borderRadius: '4px',
                  minHeight: '44px',
                  fontWeight: 400,
                  backgroundColor: '#FFFFFF',
                }}
              />
              <div
                className={`bg-#00426F overflow-x-hidden h-[590px] mt-[3px] table-container flex flex-col`}>
                <div className="flex-grow overflow-auto">
                  <DataTableComponent
                    tableStyle={{
                      fontSize: '12px',
                      color: '#000000',
                      fontWeight: 500,
                      backgroundColor: '#D9D9D9',
                    }}
                    data={serviceAreaData}
                    selectionMode="single"
                    onSelectionChange={(e: any) => {
                      setSelectedMooring(e.value)
                    }}
                    selection={selectedMooring}
                    rowStyle={(rowData: any) => rowData}
                    dataKey="id"
                    columns={serviceAreaColumns}
                    onRowClick={(row: any) => handleRowClickServiceAreaDetail(row?.data)}
                    emptyMessage={
                      <div className="text-center mt-14">
                        <img
                          src="/assets/images/empty.png"
                          alt="Empty Data"
                          className="w-20 mx-auto mb-4"
                        />
                        <p className="text-gray-500 text-lg">{properties.noDataMessage}</p>
                      </div>
                    }
                  />
                </div>

                <div>
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
        )}
        {isLoading && (
          <ProgressSpinner
            style={{
              position: 'absolute',
              top: '65%',
              left: '20%',
              transform: 'translate(-50%, -50%)',
              width: '50px',
              height: '50px',
            }}
            strokeWidth="4"
          />
        )}

        <div
          data-testid="customer-admin-users-table"
          className="flex-grow bg-[#FFFFFF] rounded-xl border-[1px] border-gray-300 w-[515px] h-[732px] mr-[50px] ml-[30px] mb-0 ">
          <div className="flex flex-col h-full">
            <div className="text-sm font-extrabold rounded-sm w-full bg-[#D9D9D9]">
              <div
                className="flex items-center justify-between bg-[#00426F] rounded-tl-[10px] rounded-tr-[10px]"
                style={{ color: '#FFFFFF' }}>
                <h1 className="p-4 text-xl font-extrabold">
                  {properties.serviceAreaMooringHeader}
                </h1>
                <div className="flex">
                  <FaEdit
                    onClick={handleEdit}
                    className="mr-4 mt-4 text-[white]"
                    data-testid="FaEdit"
                    style={{ cursor: serviceAreaRecord ? 'pointer' : 'not-allowed' }}
                  />
                  <RiDeleteBin5Fill
                    onClick={handleDelete}
                    className="text-white mr-4 mt-4"
                    data-testid="RiDeleteBin5Fill"
                    style={{ cursor: serviceAreaRecord ? 'pointer' : 'not-allowed' }}
                  />
                </div>
              </div>
            </div>
            <div className="bg-[] mt-2 ml-5">
              <div
                className="flex justify-between p-2 mr-10"
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  lineHeight: '12px',
                  marginTop: '-5x',
                }}>
                <p>{properties.address}</p>
                <p>{properties.mooringInventoried}</p>
                <p>{properties.serviceAreaGPSCoordinates}</p>
              </div>
            </div>
            <div className="mt-1">
              <hr style={{ border: '1px solid #D5E1EA' }} />
            </div>

            <div className="flex-grow overflow-auto">
              {selectedServiceArea ? (
                serviceAreaMooring
              ) : (
                <div className="text-center mt-40 mb-10">
                  <img
                    src="/assets/images/empty.png"
                    alt="Empty Data"
                    className="w-20 mx-auto mb-4"
                  />
                  <p className="text-gray-500 text-lg">{properties.noDataMessage}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dialog BOX */}
        <div>
          <Dialog
            draggable={false}
            visible={dialogVisible}
            style={{
              width: '740px',
              minWidth: '300px',
              height: '490px',
              minHeight: '200px',
              borderRadius: '1rem',
              maxHeight: '50% !important',
            }}
            onHide={() => setDialogVisible(false)}
            header={
              <div className="flex gap-4">
                <div className="font-bolder text-[black]">Mooring Information</div>
                {/* <div className="font-bold mt-1">
                    <FaEdit onClick={handleEdit} color="#0098FF" />
                  </div> */}
              </div>
            }>
            <MooringInformations mooringRowData={mooringRowData} />
          </Dialog>
        </div>
      </div>
    </div>
  )
}

export default ServiceArea
