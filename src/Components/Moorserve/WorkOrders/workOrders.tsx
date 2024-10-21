import { SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from 'primereact/button'
import AddWorkOrders from './AddWorkOrders'
import { ErrorResponse, WorkOrderPayload, WorkOrderResponse } from '../../../Type/ApiTypes'
import {
  useDeleteVoiceMemoMutation,
  useGetVoiceMemoMutation,
  useGetWorkOrderByIdMutation,
  useGetWorkOrdersMutation,
} from '../../../Services/MoorServe/MoorserveApi'
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
import ViewImageDialog from '../../CommonComponent/ViewImageDialog'
import { Dialog } from 'primereact/dialog'
import AddImage from '../../Moormanage/Customer/AddImage'
import PopUpCustomModal from '../../CustomComponent/PopUpCustomModal'
import VoiceMemoPlayer from '../../CommonComponent/VoiceMemoPlayer'

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
  const [accordion, setAccordion] = useState('faq1')
  const [totalRecords, setTotalRecords] = useState<number>()
  const [completedWorkOrder, setCompletedOrder] = useState<string>('No')
  const [voiceMemo, setVoiceMemo] = useState<any>()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [workOrderImages, setWorkOrderImages] = useState<any>()
  const [showImage, setShowImage] = useState({ id: '', imageData: '' })
  const [playVoiceMemo, setPlayVoiceMemo] = useState<any>()
  const [imageVisible, setImageVisible] = useState(false)
  const [voiceMemoVisible, setVoiceMemoVisible] = useState(false)
  const [imageData, setImageData] = useState<any>()
  const [imageEditVisible, setImageEditVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [workOrderId, setWorkOrderId] = useState<any>()
  const [getWorkOrder] = useGetWorkOrdersMutation()
  const [getWorkOrderById] = useGetWorkOrderByIdMutation()
  const [getVoiceMemo] = useGetVoiceMemoMutation()
  const [deleteVoiceMemo] = useDeleteVoiceMemoMutation()

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

  const handleWorkOrderTableRowClick = (rowData: any) => {
    setWorkOrderId(rowData?.data?.id)
    getWorkOrderDataById(rowData?.data?.id)
  }

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
    style: { borderBottom: '1px solid #D5E1EA' },
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

  const workOrderImagesColumns = useMemo(
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

  const workOrderVoiceMemoColumns = useMemo(
    () => [
      {
        id: 'id',
        label: 'id',
        style: { width: '100px', backgroundColor: '#FFFFFF', fontWeight: '700', fontSize: '12px' },
      },
      {
        id: 'name',
        label: 'VoiceMemo Name',
        style: { backgroundColor: '#FFFFFF', fontWeight: '700', fontSize: '12px' },
      },
    ],
    [],
  )

  const WorkOrderActionButtonColumn: ActionButtonColumnProps = useMemo(
    () => ({
      header: 'Action',
      buttons: [
        {
          color: 'black',
          label: 'View Image',
          onClick: (data) => {
            setShowImage((prev) => ({ ...prev, id: data?.id, imageData: data?.encodedData }))
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

  const WorkOrderVoiceMemoActionButtonColumn: ActionButtonColumnProps = useMemo(
    () => ({
      header: 'Action',
      buttons: [
        {
          color: 'black',
          label: 'Play',
          onClick: (data) => {
            getWorkOrderVoiceMemo(data?.id)
            setVoiceMemoVisible(true)
          },
          underline: true,
          style: {
            margin: 0,
          },
        },
        {
          color: 'red',
          label: 'Delete',
          onClick: (data) => {
            deleteWorkOrderVoiceMemo(data?.id, workOrderId)
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
        setSelectedProduct(content[0])
        setWorkOrderId(content[0]?.id)
        setIsLoading(false)
        setTotalRecords(totalSize)
      } else {
        setIsLoading(false)
        setWorkOrderId('')
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
  }, [
    searchText,
    selectedCustomerId,
    selectedProduct,
    workOrderId,
    pageNumber,
    pageSize,
    completedWorkOrder,
  ])

  const getWorkOrderDataById = async (id: any) => {
    setIsLoading(true)
    try {
      const response = await getWorkOrderById({ id: id }).unwrap()
      const { status, content, message, totalSize } = response as WorkOrderResponse
      if (status === 200) {
        setWorkOrderImages(content?.imageResponseDtoList)
        setVoiceMemo(content?.voiceMEMOResponseDtoList)
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
  }

  const getWorkOrderVoiceMemo = async (id: any) => {
    setIsLoading(true)
    try {
      const response = await getVoiceMemo({ id: id }).unwrap()
      const { status, content, message, totalSize } = response as WorkOrderResponse
      if (status === 200) {
        setPlayVoiceMemo(content)
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
  }

  const deleteWorkOrderVoiceMemo = async (id: any, workOrderID?: any) => {
    setIsLoading(true)
    try {
      const response = await deleteVoiceMemo({ id: id }).unwrap()
      const { status, content, message, totalSize } = response as WorkOrderResponse
      if (status === 200) {
        setIsLoading(false)
        if (workOrderId) getWorkOrderDataById(workOrderId)
        toast?.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: message,
          life: 3000,
        })
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
  }

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
  useEffect(() => {
    if (workOrderId) {
      getWorkOrderDataById(workOrderId)
    }
  }, [workOrderId])

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
        <div className="flex flex-col md:flex-row mt-3">
          <div
            style={{
              height: 'calc(100vh - 180px)',
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
                selectionMode="single"
                onSelectionChange={(e) => {
                  setSelectedProduct(e.value)
                }}
                onRowClick={(row) => {
                  handleWorkOrderTableRowClick(row)
                }}
                selection={selectedProduct}
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
                }}
              />
            </div>
          </div>

          <div className="flex flex-col wrapper mt-3">
            <div
              className="relative bg-white  border-[#D5E1EA] mr-8"
              style={{
                width: '450px',
                maxWidth: '450px',
                marginBottom: '0px',
              }}>
              <label
                style={{ backgroundColor: '#00426F' }}
                htmlFor="faq1"
                className="cursor-pointer flex items-center justify-between h-14 rounded-md"
                onClick={() => handleToggle('faq1')}>
                <div className="flex items-center gap-4 ">
                  <div>
                    <h1 className="p-4 text-white text-xl font-extrabold">WorkOrder Images</h1>
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
              {/* WorkOrderImages Data Table */}
              <div
                className={`content transition-all ease-in-out duration-500  ${accordion === 'faq1' ? '' : 'hidden'}`}>
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
                        className={`bg-#00426F overflow-x-hidden table-container flex flex-col`}
                        style={{ height: 'calc(100vh - 340px)' }}>
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
                            data={workOrderImages}
                            columns={workOrderImagesColumns}
                            selectionMode="single"
                            actionButtons={WorkOrderActionButtonColumn}
                            selection={selectedImage}
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
                className="bg-#00426F cursor-pointer flex items-center justify-between h-14 rounded-md"
                onClick={() => handleToggle('faq2')}>
                <div className="flex items-center">
                  <div style={{ flexShrink: 1 }}>
                    <h1 className="p-3 text-white text-lg font-extrabold">Voice Memo </h1>
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
              {/* Voice Memo */}
              <div
                className={`content mt-5 transition-all ease-in-out duration-500 ${accordion === 'faq2' ? '' : 'hidden'}`}>
                <div
                  className={`bg-#00426F overflow-x-hidden  table-container flex flex-col`}
                  style={{ height: 'calc(100vh - 320px)' }}>
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
                      data={voiceMemo}
                      columns={workOrderVoiceMemoColumns}
                      selectionMode="single"
                      actionButtons={WorkOrderVoiceMemoActionButtonColumn}
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
        {/* )} */}
      </div>
      {/* View Image */}
      <PopUpCustomModal
        style={{
          width: '740px',
          minWidth: '300px',
          height: '500px',
          minHeight: '500px',
        }}
        visible={imageVisible}
        onHide={() => {
          setImageVisible(false)
        }}
        header={properties.imageHeader}
        children={
          <ViewImageDialog
            imageVisible={imageVisible}
            setImageVisible={setImageVisible}
            showImage={showImage}
          />
        }></PopUpCustomModal>

      {/* Image Information */}
      <PopUpCustomModal
        style={{
          width: '700px',
          minWidth: '700px',
          height: '400px',
          minHeight: '400px',
        }}
        visible={imageEditVisible}
        onHide={() => {
          setImageEditVisible(false)
        }}
        header={properties.imageInformation}
        children={
          <AddImage
            imageData={imageData}
            entityId={workOrderId}
            entity={'WorkOrder'}
            closeModal={handleModalClose}
            getCustomersWithMooring={() => {
              if (workOrderId) {
                getWorkOrderDataById(workOrderId)
              }
            }}
          />
        }></PopUpCustomModal>
      {/* Play Voice Memo */}
      <PopUpCustomModal
        style={{
          width: '740px',
          minWidth: '300px',
          height: '500px',
          minHeight: '500px',
        }}
        visible={voiceMemoVisible}
        onHide={() => {
          setVoiceMemoVisible(false)
        }}
        header={properties.voiceMemoHeader}
        children={
          <VoiceMemoPlayer
            imageVisible={voiceMemoVisible}
            setImageVisible={setVoiceMemoVisible}
            voiceMemo={playVoiceMemo}
          />
        }></PopUpCustomModal>
    </div>
  )
}
export default WorkOrders
