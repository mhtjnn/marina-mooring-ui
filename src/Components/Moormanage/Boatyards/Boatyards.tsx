import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import CustomModal from '../../CustomComponent/CustomModal'
import AddBoatyards from './AddBoatyards'
import { InputText } from 'primereact/inputtext'
import {
  BoatYardData,
  BoatYardPayload,
  BoatYardResponse,
  DeleteCustomerResponse,
  ErrorResponse,
  MooringWithBoatYardResponse,
} from '../../../Type/ApiTypes'
import {
  useDeleteBoatyardsMutation,
  useGetBoatyardsMutation,
  useGetMooringWithBoatyardMutation,
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
import { Params } from '../../../Type/CommonType'
import { Dialog } from 'primereact/dialog'
import { ProgressSpinner } from 'primereact/progressspinner'
import { useSelector } from 'react-redux'
import { selectCustomerId } from '../../../Store/Slice/userSlice'
import { FaEdit } from 'react-icons/fa'
import { RiDeleteBin5Fill } from 'react-icons/ri'
import { Paginator } from 'primereact/paginator'
import React from 'react'
import MooringInformations from '../../CommonComponent/MooringInformations'
import { AddNewButtonStyle, DialogStyle } from '../../Style'
import { AppContext } from '../../../Services/ContextApi/AppContext'

const Boatyards = () => {
  const selectedCustomerId = useSelector(selectCustomerId)
  const userData = useSelector((state: any) => state.user?.userData)
  const [modalVisible, setModalVisible] = useState(false)
  const [boatyardsData, setboatyardsData] = useState<BoatYardPayload[]>([])
  const [mooringWithBoatyardsData, setMooringWithBoatyardsData] = useState<
    MooringWithBoatYardResponse[]
  >([])
  const [filteredboatyardsData, setFilteredboatyardsData] = useState<BoatYardPayload[]>([])
  const [expandedRows, setExpandedRows] = useState<any>()
  const [selectedBoatYard, setSelectedBoatYard] = useState<any>()
  const [selectedProduct, setSelectedProduct] = useState()
  const [selectedMooring, setSelectedMooring] = useState()
  const [editMode, setEditMode] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchFieldText, setSearchFieldText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoader, setIsLoader] = useState(false)
  const [dialogVisible, setDialogVisible] = useState(false)
  const [mooringRowData, setMooringRowData] = useState<any>([])
  const [boatYardRecord, setBoatyardRecord] = useState(true)
  const toast = useRef<Toast>(null)

  const [getBoatyards] = useGetBoatyardsMutation()
  const [deleteBoatyard] = useDeleteBoatyardsMutation()
  const [getMooringsWithBoatyard] = useGetMooringWithBoatyardMutation()

  const [pageNumber, setPageNumber] = useState(0)
  const [pageNumber1, setPageNumber1] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalRecords, setTotalRecords] = useState<number>()
  const [pageNumberTwo, setPageNumberTwo] = useState(0)
  const [pageNumberOne, setPageNumberOne] = useState(0)
  const [pageSizeTwo, setPageSizeTwo] = useState(10)
  const [totalRecordsTwo, setTotalRecordsTwo] = useState<number>()

  const { isMapModalOpen, IsdialogVisible } = useContext(AppContext)

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
    setSelectedBoatYard('')
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
    setMooringRowData('')
  }

  const ActionButtonColumn: ActionButtonColumnProps = {
    header: '',
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
    headerStyle: { backgroundColor: '#00426F', color: 'black' },
    style: { borderBottom: '1px solid #D5E1EA' },
  }

  const boatyardTableStyle = {
    backgroundColor: '#00426F',
    borderBottom: '1px solid #C0C0C0',
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: '10px',
  }

  const tableColumnsBoatyards = useMemo(
    () => [
      {
        id: 'id',
        label: 'ID',
        style: boatyardTableStyle,
      },
      {
        id: 'mainContact',
        label: 'Main Contact',
        style: boatyardTableStyle,
      },
      {
        id: 'mooringNumber',
        label: 'Mooring Number',
        style: boatyardTableStyle,
      },
      {
        id: 'boatName',
        label: 'Boat Name',
        style: boatyardTableStyle,
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

  const boatYardColumns = useMemo(
    () => [
      {
        id: 'boatyardId',
        label: 'ID',
        style: columnStyle,
      },
      {
        id: 'boatyardName',
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

  const handleRowClickBoatYardDetail = (rowData: any) => {
    setIsLoader(true)
    setSelectedBoatYard('')
    setMooringWithBoatyardsData([])
    setBoatyardRecord(true)
    const timeoutId = setTimeout(() => {
      setSelectedBoatYard(rowData.data)
    }, 600)
    return () => clearTimeout(timeoutId)
  }

  const handleEdit = () => {
    if (boatYardRecord == true) {
      setModalVisible(true)
      setEditMode(true)
    }
  }

  const handleDelete = async () => {
    if (boatYardRecord == true) {
      setIsLoading(true)
      try {
        const response = await deleteBoatyard({ id: selectedBoatYard?.id }).unwrap()
        const { status, message } = response as DeleteCustomerResponse
        if (status === 200) {
          toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: message,
            life: 3000,
          })
          setSelectedBoatYard('')
          getBoatyardsData()
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
          detail: 'Error while deleting customer',
          life: 3000,
        })
      }
    }

    setBoatyardRecord(false)
  }

  const parseCoordinates = (coordinates: any) => {
    if (!coordinates) return null
    const [latitude, longitude] = coordinates?.split(' ').map(parseFloat)
    return isNaN(latitude) || isNaN(longitude) ? null : [latitude, longitude]
  }

  const [latitude, longitude] = parseCoordinates(selectedBoatYard?.gpsCoordinates) || []

  const getBoatyardsData = useCallback(async () => {
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

      await getBoatyards(params)
        .unwrap()
        .then(async (response: any) => {
          const { status, content, message, totalSize } = response as BoatYardResponse
          if (status === 200 && Array.isArray(content)) {
            setboatyardsData(content)
            setSelectedBoatYard(content[0])
            setSelectedMooring(content[0])
            setTotalRecords(totalSize)
            if (selectedBoatYard) {
              const data = content.find((data) => data.id === selectedBoatYard.id)
              if (data) {
                setSelectedBoatYard(data)
              }
            }
            setFilteredboatyardsData(content)

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
      console.error('Error fetching getBoatyardsdata:', message)
    }
  }, [
    getBoatyards,
    searchText,
    searchFieldText,
    selectedCustomerId,
    selectedBoatYard,
    pageSize,
    pageNumber,
  ])

  const getMooringsWithBoatyardData = async () => {
    try {
      setIsLoading(true)
      await getMooringsWithBoatyard({
        id: selectedBoatYard?.id,
        pageNumber: pageNumberTwo,
        pageSize: pageSizeTwo,
      })
        .unwrap()
        .then(async (response: any) => {
          const { status, content, totalSize } = response as MooringWithBoatYardResponse
          if (status === 200 && Array.isArray(content) && content.length > 0) {
            setIsLoading(false)
            setMooringWithBoatyardsData(content)
            setTotalRecordsTwo(totalSize)
          } else {
            setIsLoading(false)
            setMooringWithBoatyardsData([])
          }
        })
    } catch (error) {
      const { message } = error as ErrorResponse
      setIsLoading(false)
      console.error('Error fetching getMooringsWithBoatyardData:', error)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getBoatyardsData()
    }, 2000)
    return () => clearTimeout(timeoutId)
  }, [searchText, selectedCustomerId, searchFieldText, pageSize, pageNumber])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (selectedBoatYard) getMooringsWithBoatyardData()
    }, 600)
    return () => clearTimeout(timeoutId)
  }, [selectedBoatYard, pageSizeTwo, pageNumberTwo])

  useEffect(() => {
    setIsLoader(true)
    const timeoutId = setTimeout(() => {
      setIsLoader(false)
    }, 400)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [selectedBoatYard])

  const random = useMemo(() => {
    return (
      <AddBoatyards
        closeModal={handleModalClose}
        boatYardData={getBoatyardsData}
        customerData={selectedBoatYard}
        editMode={editMode}
        setModalVisible={setModalVisible}
        toastRef={toast}
      />
    )
  }, [selectedBoatYard, getBoatyardsData, editMode, toast, setModalVisible, handleModalClose])

  const BoatyardMoorings = useMemo(() => {
    return (
      <>
        <div className={`flex justify-between mt-4 p-3 ml-5 font-normal text-[12px]`}>
          <p className="">
            {`${selectedBoatYard?.address || '-'}, ${selectedBoatYard?.stateResponseDto?.name || '-'}, ${selectedBoatYard?.countryResponseDto?.name || '-'}`}
          </p>
          <p className="mr-[10rem]">{selectedBoatYard?.mooringInventoried || '-'}</p>
          <p className="underline mr-[4rem]">{selectedBoatYard?.gpsCoordinates || '-'}</p>
        </div>

        <div
          className={` mt-[30px] mb-6 sticky`}
          style={{
            flexGrow: 1,
            border: '1px solid #D5E1EA',
            borderRadius: '10px',
            padding: '0px',
            marginLeft: '10px',
            marginRight: '10px',
          }}>
          <CustomDisplayPositionMap position={[latitude, longitude]} zoomLevel={15} />
        </div>
      </>
    )
  }, [selectedBoatYard, boatyardsData, mooringWithBoatyardsData])

  return (
    <div
      style={{ height: '100vh' }}
      className={modalVisible || IsdialogVisible ? 'backdrop-blur-lg' : ''}>
      <Toast ref={toast} />
      <Header header="MOORMANAGE/Boatyards" />
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
            headerText={<h1 className="text-xl font-extrabold text-black ml-4">Add Boatyard</h1>}
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
        <div
          style={{
            borderRadius: '5px',
            marginLeft: '1.7rem',
          }}>
          {/* Left Panel */}
          <div className="bg-white rounded-xl border-[1px] border-[#D5E1EA] mb-4 ml-6 md:mb-0 w-[700px]">
            {/* Header */}
            <div className="bg-[#00426F] rounded-tl-[10px] rounded-tr-[10px] text-white">
              <h1 className="p-4 text-xl font-extrabold">{properties.boatyardDetail}</h1>
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
              className={`bg-#00426F overflow-x-hidden mt-[3px] table-container flex flex-col`}
              style={{ height: 'calc(100vh - 350px)' }}>
              <div className="flex-grow overflow-auto">
                <DataTableComponent
                  tableStyle={{
                    fontSize: '12px',
                    color: '#000000',
                    fontWeight: 500,
                    backgroundColor: '#D9D9D9',
                  }}
                  data={boatyardsData}
                  selectionMode="single"
                  onSelectionChange={(e: any) => {
                    setSelectedMooring(e.value)
                  }}
                  selection={selectedMooring}
                  rowStyle={(rowData: any) => rowData}
                  dataKey="id"
                  columns={boatYardColumns}
                  onRowClick={(e: any) => handleRowClickBoatYardDetail(e)}
                  emptyMessage={
                    <div className="text-center mt-14">
                      <img
                        src="/assets/images/empty.png"
                        alt="Empty Data"
                        className="w-20 mx-auto mb-4"
                      />
                      <p className="text-gray-500 text-lg ">{properties.noDataMessage}</p>
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
        {isLoading && (
          <ProgressSpinner
            style={{
              position: 'absolute',
              top: '65%',
              left: '32%',
              transform: 'translate(-50%, -50%)',
              width: '50px',
              height: '50px',
            }}
            strokeWidth="4"
          />
        )}

        <div
          data-testid="customer-admin-users-table"
          className="flex-grow bg-[#FFFFFF] rounded-xl border-[1px] border-gray-300 w-[515px]  mr-[50px] ml-[30px] mb-0 ">
          <div className="flex flex-col">
            <div className="text-sm font-extrabold rounded-sm w-full bg-[#D9D9D9]">
              <div
                className="flex items-center justify-between bg-[#00426F] rounded-tl-[10px] rounded-tr-[10px]"
                style={{ color: '#FFFFFF' }}>
                <h1 className="p-4 text-xl font-extrabold">{properties.boatyardMooringHeader}</h1>
                <div className="flex">
                  <FaEdit
                    onClick={handleEdit}
                    className="mr-4 mt-4 text-[white]"
                    data-testid="FaEdit"
                    style={{ cursor: boatYardRecord ? 'pointer' : 'not-allowed' }}
                  />
                  <RiDeleteBin5Fill
                    onClick={handleDelete}
                    className="text-white mr-4 mt-4"
                    data-testid="RiDeleteBin5Fill"
                    style={{ cursor: boatYardRecord ? 'pointer' : 'not-allowed' }}
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
                  lineHeight: '11.72px',
                  marginBottom: '-6px',
                }}>
                <p>{properties.address}</p>
                <p>{properties.mooringInventoried}</p>
                <p>{properties.boatyardGPSCoordinates}</p>
              </div>
            </div>
            <div className="mt-4">
              <hr style={{ border: '1px solid #D5E1EA' }} />
            </div>

            <div className="flex-grow overflow-auto">
              {selectedBoatYard ? (
                <>
                  {BoatyardMoorings}{' '}
                  <div
                    className={`bg-#00426F overflow-x-hidden mt-[3px] table-container flex flex-col`}
                    style={{ height: 'calc(100vh - 575px)' }}>
                    <div className="flex-grow overflow-y-auto">
                      <DataTableComponent
                        tableStyle={{
                          fontSize: '12px',
                          color: '#000000',
                        }}
                        data={mooringWithBoatyardsData || []}
                        columns={tableColumnsBoatyards}
                        actionButtons={ActionButtonColumn}
                        selectionMode="single"
                        dataKey="id"
                        onSelectionChange={(e) => {
                          setSelectedProduct(e.value)
                        }}
                        selection={selectedProduct}
                        rowStyle={(rowData) => rowData}
                        style={{
                          borderBottom: '1px solid #D5E1EA',
                          marginLeft: '5px',
                          fontWeight: '400',
                          color: '#000000',
                        }}
                        emptyMessage={
                          <div className="text-center mt-14">
                            <img
                              src="/assets/images/empty.png"
                              alt="Empty Data"
                              className="w-20 mx-auto mb-4"
                            />
                            <p className="text-gray-500">{properties.noDataMessage}</p>
                          </div>
                        }
                      />
                    </div>
                    {isLoader && (
                      <ProgressSpinner
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '80%',
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
                          zIndex: 1,
                          backgroundColor: 'white',
                          borderTop: '1px solid #D5E1EA',
                          padding: '0.5rem',
                        }}
                      />
                    </div>
                  </div>
                </>
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

        {/* Mooring Informtaion Dialog BOX */}
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
              </div>
            }>
            <MooringInformations mooringRowData={mooringRowData} />
          </Dialog>
        </div>
      </div>
    </div>
  )
}

export default Boatyards
