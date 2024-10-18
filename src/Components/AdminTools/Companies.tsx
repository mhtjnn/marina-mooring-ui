import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CustomModal from '../CustomComponent/CustomModal'
import DataTableComponent from '../CommonComponent/Table/DataTableComponent'
import { properties } from '../Utils/MeassageProperties'
import { ActionButtonColumnProps } from '../../Type/Components/TableTypes'
import { CustomerPayload, DeleteCustomerResponse, GetUserResponse } from '../../Type/ApiTypes'
import Header from '../Layout/LayoutComponents/Header'
import { Params, Role } from '../../Type/CommonType'
import { useDeleteUserMutation, useGetUsersMutation } from '../../Services/AdminTools/AdminToolsApi'
import AddNewCustomer from './AddNewCustomer'
import './CustomerOwner.module.css'
import InputTextWithHeader from '../CommonComponent/Table/InputTextWithHeader'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Toast } from 'primereact/toast'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectCustomerId,
  selectCustomerName,
  setCustomerId,
  setCustomerName,
} from '../../Store/Slice/userSlice'
import { Paginator } from 'primereact/paginator'
import { VirtualScroller } from 'primereact/virtualscroller'
import { Dialog } from 'primereact/dialog'
import ResetPassword from './ResetPassword'
import { AddNewButtonStyle, DialogStyle } from '../Utils/Style'

const CustomerOwner = () => {
  const dispatch = useDispatch()
  const selectedCustomerId = useSelector(selectCustomerId)
  const selectedCustomerName = useSelector(selectCustomerName)
  const [modalVisible, setModalVisible] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>()
  const [selectedCustomerUser, setSelectedCustomerUser] = useState<any>()
  const [editMode, setEditMode] = useState(false)
  const [editCustomer, setEditCustomer] = useState(false)
  const [passWordDisplay, setPassWordDisplay] = useState(false)
  const [selectedRow, setSelectedRow] = useState<any>()
  const [customerUpdated, setCustomerUpdated] = useState(false)
  const [customerAdminId, setCustomerAdminId] = useState('')
  const [searchText, setSearchText] = useState('')
  const [searchUsersText, setSearchUsersText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoader, setIsLoader] = useState(true)
  const [getCustomerOwnerData, setgetCustomerOwnerData] = useState<CustomerPayload[]>([])
  const [getCustomerOwnerUserData, setgetCustomerOwnerUserData] = useState<CustomerPayload[]>([])
  const [selectedProduct, setSelectedProduct] = useState()
  const [getUser] = useGetUsersMutation()
  const [deleteCustomerOwner] = useDeleteUserMutation()

  const toast = useRef<Toast>(null)
  const [pageNumber, setPageNumber] = useState(0)
  const [pageNumber1, setPageNumber1] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalRecords, setTotalRecords] = useState<number>()

  const [pageNumberTwo, setPageNumberTwo] = useState(0)
  const [pageNumberOne, setPageNumberOne] = useState(0)
  const [pageSizeTwo, setPageSizeTwo] = useState(10)
  const [totalRecordsTwo, setTotalRecordsTwo] = useState<number>()

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

  const handleModalClose = () => {
    setPassWordDisplay(false)
    setModalVisible(false)
    setSelectedCustomerUser('')
    setSelectedCustomer('')
    setEditCustomer(false)
    setEditMode(false)
    setCustomerUpdated(true)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageNumber(0)
    setPageNumber1(0)
    setSearchText(e.target.value)
  }

  const handleUsersSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageNumberTwo(0)
    setPageNumberOne(0)
    setSearchUsersText(e.target.value)
  }

  const handleEditButtonClick = (rowData: any) => {
    setPassWordDisplay(true)
    setSelectedCustomer(rowData)
    setModalVisible(true)
    setEditCustomer(false)
    setEditMode(true)
  }

  const handleEditButtonUsersClick = (rowData: any) => {
    setSelectedCustomerUser(rowData)
    setPassWordDisplay(true)
    setEditCustomer(true)
    setModalVisible(true)
  }

  const handleResetModalClose = () => {
    setIsPasswordModalOpen(false)
    setIsResetModalOpen(false)
    setSelectedRow('')
  }

  const ActionButtonColumn: ActionButtonColumnProps = {
    header: 'Action',
    buttons: [
      {
        color: 'black',
        label: 'Edit',
        underline: true,
        fontWeight: 500,
        onClick: (rowData) => handleEditButtonClick(rowData),
      },
      {
        color: 'black',
        label: 'Disable',
        underline: true,
        fontWeight: 500,
        onClick: (rowData) => handleDeleteCustomerOwner(rowData),
      },
      {
        color: 'black',
        label: 'Reset Password',
        underline: true,
        fontWeight: 700,
        onClick: (rowData) => {
          setSelectedRow(rowData)
          setIsPasswordModalOpen(true)
        },
      },
    ],
    headerStyle: {
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #D5E1EA',
      color: '#000000',
      fontWeight: 700,
      width: '10vw',
    },
    style: { borderBottom: '1px solid #D5E1EA' },
  }

  const columnStyle = {
    borderBottom: '1px solid #D5E1EA',
    backgroundColor: '#FFFFFF',
    color: '#000000',
    fontWeight: 700,
  }

  const firstLastNameCustomerOwner = (data: any) => {
    if (data?.firstName === null) return '-'
    else return data?.firstName + ' ' + data?.lastName
  }

  const customerOwnerTableColumn = useMemo(
    () => [
      {
        id: 'id',
        label: 'ID',
        style: { ...columnStyle, width: '4vw' },
      },
      {
        id: 'name',
        label: 'Name',
        body: firstLastNameCustomerOwner,
        style: { ...columnStyle, width: '4vw' },
      },
      {
        id: 'phoneNumber',
        label: 'Phone',
        style: { ...columnStyle, width: '5vw' },
      },
    ],

    [],
  )

  const ActionButtonUsersColumn: ActionButtonColumnProps = {
    header: 'Action',
    buttons: [
      {
        color: 'black',
        label: 'Edit',
        underline: true,
        fontWeight: 700,
        onClick: (rowData) => handleEditButtonUsersClick(rowData),
      },

      {
        color: 'black',
        label: 'Disable',
        underline: true,
        fontWeight: 700,
        onClick: (rowData) => handleDeleteCustomerOwnerUser(rowData),
      },

      {
        color: 'black',
        label: 'Reset Password',
        underline: true,
        fontWeight: 700,
        onClick: (rowData) => {
          setSelectedRow(rowData)
          setIsResetModalOpen(true)
        },
      },
    ],
    headerStyle: {
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #D5E1EA',
      color: '#000000',
      fontWeight: 700,
      width: '10vw',
    },
    style: { borderBottom: '1px solid #D5E1EA' },
  }

  const firstLastName = (data: any) => {
    if (data?.firstName === null) return '-'
    else return data?.firstName + ' ' + data?.lastName
  }

  const customerOwnerUserTableColumn = useMemo(
    () => [
      {
        id: 'id',
        label: 'ID',
        style: {
          borderBottom: '1px solid #D5E1EA',
          backgroundColor: '#FFFFFF',
          color: '#000000',
          fontWeight: 700,
          width: '3vw',
        },
      },
      {
        id: 'name',
        label: 'Name',
        body: firstLastName,
        style: {
          borderBottom: '1px solid #D5E1EA',
          backgroundColor: '#FFFFFF',
          color: '#000000',
          fontWeight: 700,
          width: '8vw',
        },
      },
      {
        id: 'email',
        label: 'Email',
        style: {
          borderBottom: '1px solid #D5E1EA',
          backgroundColor: '#FFFFFF',
          color: '#000000',
          fontWeight: 700,
          width: '8vw',
        },
      },
      {
        id: 'phoneNumber',
        label: 'Phone',
        style: {
          borderBottom: '1px solid #D5E1EA',
          backgroundColor: '#FFFFFF',
          color: '#000000',
          fontWeight: 700,
          width: '7vw',
        },
      },
      {
        id: 'roleResponseDto?.name',
        label: 'Role',
        style: {
          borderBottom: '1px solid #D5E1EA',
          backgroundColor: '#FFFFFF',
          color: '#000000',
          fontWeight: 700,
          width: '7vw',
        },
      },
    ],
    [],
  )

  const getUserHandler = useCallback(async () => {
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
      dispatch(setCustomerId(''))
      dispatch(setCustomerName(''))
      const response = await getUser(params).unwrap()
      const { status, message, content, totalSize, currentSize } = response as GetUserResponse
      if (status === 200 && Array.isArray(content)) {
        setIsLoading(false)
        if (selectedCustomerId) {
          dispatch(setCustomerId(selectedCustomerId))
          dispatch(setCustomerName(selectedCustomerName))
        } else {
          dispatch(setCustomerId(content[0]?.id))
          dispatch(setCustomerName(content[0]?.name))
        }
        if (content.length > 0) {
          setgetCustomerOwnerData(content)
          setSelectedProduct(content[0])
          setTotalRecords(totalSize)
        } else {
          setgetCustomerOwnerData([])
        }
      } else {
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Error occurred while fetching customer data:', error)
    }
  }, [getUser, searchText, pageSize, pageNumber, selectedProduct])

  const getCustomerAdminsUsers = useCallback(
    async (id: any) => {
      setIsLoader(true)
      try {
        let params: Params = {}
        if (searchUsersText) {
          params.searchText = searchUsersText
        }
        if (pageNumberTwo) {
          params.pageNumber = pageNumberTwo
        }
        if (pageSizeTwo) {
          params.pageSize = pageSizeTwo
        }
        const response = await getUser(params).unwrap()
        const { status, message, content, totalSize, currentSize } = response as GetUserResponse
        if (status === 200 && Array.isArray(content)) {
          setIsLoader(false)
          if (content.length > 0) {
            setgetCustomerOwnerUserData(content)
            setCustomerAdminId(id)
            setTotalRecordsTwo(totalSize)
          } else {
            setgetCustomerOwnerUserData([])
            setCustomerAdminId(id)
          }
        } else {
          setIsLoader(false)
          setgetCustomerOwnerUserData([])
        }
      } catch (error) {
        setIsLoading(false)
        console.error('Error occurred while fetching customer data:', error)
      }
    },
    [searchUsersText, pageSizeTwo, pageNumberTwo],
  )

  const handleDeleteCustomerOwner = async (rowData: any) => {
    setIsLoading(true)
    try {
      let params: Params = {}
      if (rowData?.customerOwnerId) {
        params.customerOwnerId = rowData?.customerOwnerId
      }
      const response = await deleteCustomerOwner({
        userId: rowData?.id,
      }).unwrap()
      const { status, message } = response as DeleteCustomerResponse
      if (status === 200) {
        getUserHandler()
        setIsLoading(false)
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: message,
          life: 3000,
        })
      } else {
        setIsLoading(false)
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        })
      }
      getUserHandler()
    } catch (error) {
      setIsLoading(false)
      console.error('Error deleting customer:', error)
    }
  }

  const handleDeleteCustomerOwnerUser = async (rowData: any) => {
    setIsLoading(true)
    try {
      const response = await deleteCustomerOwner({
        userId: rowData?.id,
        customerOwnerId: rowData?.customerOwnerId,
      }).unwrap()
      const { status, message } = response as DeleteCustomerResponse
      if (status === 200) {
        getCustomerAdminsUsers(selectedCustomerId)
        setIsLoading(false)
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: message,
          life: 3000,
        })
      } else {
        setIsLoading(false)
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        })
      }
      getCustomerAdminsUsers(selectedCustomerId)
    } catch (error) {
      setIsLoading(false)
      console.error('Error deleting customer:', error)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getUserHandler()
    }, 600)
    return () => clearTimeout(timeoutId)
  }, [searchText, pageSize, pageNumber])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (selectedCustomerId) {
        getCustomerAdminsUsers(selectedCustomerId)
      }
    }, 600)
    return () => clearTimeout(timeoutId)
  }, [searchUsersText, selectedCustomerId, pageNumberTwo, pageSizeTwo])

  return (
    <>
      <Toast ref={toast} />
      <div style={{ height: '100vh' }} className={modalVisible ? 'backdrop-blur-lg' : ''}>
        <Header header="MOORMANAGE/Permission" customer={customerUpdated} />

        <div className="flex mr-12 justify-end ">
          <div className="mt-6">
            <CustomModal
              buttonText={'ADD NEW'}
              buttonStyle={AddNewButtonStyle}
              onHide={handleModalClose}
              dialogStyle={{
                height: editMode ? '500px' : '600px',
                minHeight: editMode ? '500px' : '600px',
                ...DialogStyle,
              }}
              icon={<img src="/assets/images/Plus.png" alt="icon" className="w-3.8 h-3.8 " />}
              children={
                <AddNewCustomer
                  customerAdminId={customerAdminId ? customerAdminId : ''}
                  customerData={selectedCustomerUser || selectedCustomer}
                  editMode={editMode}
                  editCustomerMode={editCustomer}
                  getUser={getUserHandler}
                  getCustomerUser={() => {
                    if (customerAdminId) {
                      getCustomerAdminsUsers(customerAdminId)
                    }
                  }}
                  closeModal={() => {
                    handleModalClose()
                  }}
                  setModalVisible={setModalVisible}
                  setEditCustomer={setEditCustomer}
                  setIsVisible={() => {}}
                  passWordDisplay={passWordDisplay}
                  customerUsers={getCustomerOwnerData}
                  toastRef={toast}
                  setSelectedCustomerUser={setSelectedCustomerUser}
                  setSelectedCustomer={setSelectedCustomer}
                  setSelectedCustomerUsers={setgetCustomerOwnerUserData}
                  setIsCustomerUpdated={setCustomerUpdated}
                />
              }
              headerText={<span className="font-large text-2xl text-[#000000] ml-4">New User</span>}
              visible={modalVisible}
              onClick={() => {
                setEditMode(false)
                setModalVisible(true)
                setSelectedCustomerUser('')
                setSelectedCustomer('')
                setEditCustomer(false)
              }}
            />
          </div>
        </div>

        <div className={`flex flex-col md:flex-row gap-10 ml-8 mt-3`}>
          <div className="flex-1 border border-gray-300 bg-white rounded-lg md:ml-10 overflow-hidden">
            <div className="text-md font-semibold rounded-t-lg bg-[#00426F]">
              <h1 className="p-4 text-xl font-extrabold  text-white">
                {properties.CustomersOwner}
              </h1>
            </div>
            <InputTextWithHeader
              value={searchText}
              onChange={handleSearch}
              placeholder="Search by name, ID, phone no...."
              inputTextStyle={{
                width: '100%',
                height: '44px',
                padding: '0 2rem 0 2.5rem',
                border: '1px solid #C5D9E0',
                fontSize: '14px',
                color: '#000000',
                borderRadius: '4px',
                fontWeight: 400,
                backgroundColor: '#FFFFFF',
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
            <div
              data-testid="customerData"
              className="flex flex-col overflow-hidden p-4"
              style={{ height: 'calc(100vh - 350px)' }}>
              <div className="flex-grow relative overflow-auto">
                <DataTableComponent
                  data={getCustomerOwnerData}
                  tableStyle={{
                    fontSize: '12px',
                    color: '#000000',
                    fontWeight: 600,
                    backgroundColor: '#F9FAFB',
                  }}
                  selectionMode="single"
                  onSelectionChange={(e) => {
                    setSelectedProduct(e.value)
                  }}
                  selection={selectedProduct}
                  dataKey="id"
                  rowStyle={(rowData) => rowData}
                  columns={customerOwnerTableColumn}
                  onRowClick={(e) => {
                    dispatch(setCustomerName(e.data?.firstName + ' ' + e.data?.lastName))
                    dispatch(setCustomerId(e.data?.id))
                  }}
                  style={{ borderBottom: '1px solid #D5E1EA', fontWeight: '500' }}
                  actionButtons={ActionButtonColumn}
                  emptyMessage={
                    <div className="flex flex-col justify-center items-center h-full mt-40">
                      <img src="/assets/images/empty.png" alt="Empty Data" className="w-32 mb-4" />
                      <p className="text-gray-500">{properties.noDataMessage}</p>
                    </div>
                  }
                />
              </div>
              <div data-testid="progress">
                {isLoading && (
                  <ProgressSpinner
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '40%',
                      transform: 'translate(-50%, -50%)',
                      width: '50px',
                      height: '50px',
                    }}
                    strokeWidth="4"
                  />
                )}
              </div>
              <div data-testid="paginatorOne" className="mt-auto">
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
                    marginBottom: '-20px',
                  }}
                />
              </div>
            </div>
          </div>

          <div
            className={`flex-1 border border-gray-300 bg-white rounded-lg md:mr-10 overflow-hidden`}>
            <div className="text-md font-semibold rounded-t-lg bg-[#00426F]">
              <h1 className="p-4 text-xl font-extrabold  text-white">
                {properties.CustomerOwnerUsers}
              </h1>
            </div>
            <InputTextWithHeader
              value={searchUsersText}
              onChange={handleUsersSearch}
              placeholder="Search by name, ID, Email, Role, phone no..."
              inputTextStyle={{
                width: '100%',
                height: '44px',
                border: '1px solid #C5D9E0',
                padding: '0 2rem 0 2.5rem',
                fontSize: '14px',
                color: '#000000',
                borderRadius: '4px',
                fontWeight: 400,
                backgroundColor: '#FFFFFF',
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

            <div
              data-testid="customerDataAdmin"
              className="flex flex-col overflow-hidden p-4"
              style={{ height: 'calc(100vh - 350px)' }}>
              <div className="flex-grow relative overflow-auto">
                <DataTableComponent
                  tableStyle={{
                    fontSize: '12px',
                    color: '#000000',
                    fontWeight: 600,
                    backgroundColor: '#F9FAFB',
                  }}
                  scrollable={true}
                  data={getCustomerOwnerUserData}
                  columns={customerOwnerUserTableColumn}
                  actionButtons={ActionButtonUsersColumn}
                  style={{ borderBottom: '1px solid #D5E1EA', fontWeight: '500' }}
                  emptyMessage={
                    <div className="text-center mt-40">
                      <img
                        src="/assets/images/empty.png"
                        alt="Empty Data"
                        className="w-32 mx-auto mb-4"
                      />
                      <p className="text-gray-500">{properties.noDataMessage}</p>
                    </div>
                  }
                />
              </div>
              <div data-testid="progress">
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
              </div>
              <div data-testid="paginatorTwo" className="mt-auto">
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
                    marginBottom: '-20px',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        position="center"
        style={{
          width: '650px',
          minWidth: '650px',
          height: '500px',
          minHeight: '500px',
          borderRadius: '1rem',
          fontWeight: '400',
          cursor: 'alias',
        }}
        draggable={false}
        headerStyle={{ cursor: 'alias' }}
        header="Reset Password"
        onHide={handleResetModalClose}
        visible={isPasswordModalOpen}>
        <ResetPassword customerId={selectedRow} isResetModalOpen={handleResetModalClose} />
      </Dialog>

      <Dialog
        position="center"
        style={{
          width: '650px',
          minWidth: '650px',
          height: '500px',
          minHeight: '500px',
          borderRadius: '1rem',
          fontWeight: '400',
          cursor: 'alias',
        }}
        draggable={false}
        headerStyle={{ cursor: 'alias' }}
        header="Reset Password"
        onHide={handleResetModalClose}
        visible={isResetModalOpen}>
        <ResetPassword customerId={selectedRow} isResetModalOpen={handleResetModalClose} />
      </Dialog>
    </>
  )
}

export default CustomerOwner
