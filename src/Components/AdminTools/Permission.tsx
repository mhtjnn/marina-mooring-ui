import { useEffect, useMemo, useRef, useState } from 'react'
import CustomModal from '../CustomComponent/CustomModal'
import DataTableComponent from '../CommonComponent/Table/DataTableComponent'
import Header from '../Layout/LayoutComponents/Header'
import { InputText } from 'primereact/inputtext'
import { ActionButtonColumnProps } from '../../Type/Components/TableTypes'
import { useSelector } from 'react-redux'
import {
  CustomerPayload,
  DeleteUserResponse,
  ErrorResponse,
  GetUserResponse,
} from '../../Type/ApiTypes'
import { useDeleteUserMutation, useGetUsersMutation } from '../../Services/AdminTools/AdminToolsApi'
import AddNewCustomer from './AddNewCustomer'
import { Toast } from 'primereact/toast'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Paginator } from 'primereact/paginator'
import { Params } from '../../Type/CommonType'
import { properties } from '../Utils/MeassageProperties'
import { Dialog } from 'primereact/dialog'
import ResetPassword from './ResetPassword'
import { AddNewButtonStyle, DialogStyle } from '../Style'

const Permission = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>()
  const [searchInput, setSearchInput] = useState('')
  const userData = useSelector((state: any) => state.user?.userData)
  const customerAdminId = userData?.id
  const [getUser] = useGetUsersMutation()
  const [deleteUser] = useDeleteUserMutation()
  const [getCustomerOwnerUserData, setgetCustomerOwnerUserData] = useState<CustomerPayload[]>([])
  const toast = useRef<Toast>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [totalRecords, setTotalRecords] = useState<number>()
  const [pageNumber, setPageNumber] = useState(0)
  const [pageNumber1, setPageNumber1] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [selectedRow, setSelectedRow] = useState<any>()
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)

  const onPageChange = (event: any) => {
    setPageNumber(event.page)
    setPageNumber1(event.first)
    setPageSize(event.rows)
  }

  const firstLastName = (data: any) => {
    if (data.firstName === null) return '-'
    else return data.firstName + ' ' + data.lastName
  }

  const handleEditButtonClick = (rowData: any) => {
    setEditMode(true)
    setModalVisible(true)
    setSelectedCustomer(rowData)
  }
  const handleResetModalClose = () => {
    setIsPasswordModalOpen(false)
    setIsResetModalOpen(false)
    setSelectedRow('')
  }

  const columnStyle = {
    borderBottom: '1px solid #D5E1EA',
    backgroundColor: '#FFFFFF',
    color: '#000000',
    fontWeight: 700,
  }

  const tableColumnsPermission = useMemo(
    () => [
      {
        id: 'id',
        label: 'ID',
        style: columnStyle,
      },
      {
        id: 'name',
        label: 'Name',
        body: firstLastName,
        style: columnStyle,
      },

      {
        id: 'email',
        label: 'Email',
        style: columnStyle,
      },

      {
        id: 'phoneNumber',
        label: 'Phone',
        style: columnStyle,
      },

      {
        id: 'roleResponseDto.name',
        label: 'Role',
        style: columnStyle,
      },
    ],

    [],
  )

  const ActionButtonColumn: ActionButtonColumnProps = {
    header: 'Action',
    style: {
      fontSize: '12px',
      fontWeight: 700,
      borderBottom: '1px solid #D5E1EA',
    },
    buttons: [
      {
        color: 'black',
        label: 'Edit',
        underline: true,
        onClick: (rowData) => handleEditButtonClick(rowData),
      },

      {
        color: 'red',
        label: 'Delete',
        underline: true,

        onClick: (rowData) => handleDeleteButtonClick(rowData),
      },
      {
        color: 'black',
        label: 'Reset Password',
        underline: true,
        onClick: (rowData) => {
          setSelectedRow(rowData)
          setIsPasswordModalOpen(true)
        },
      },
    ],
    headerStyle: columnStyle,
  }

  const handleButtonClick = () => {
    setModalVisible(true)
    setSelectedCustomer('')
  }

  const handleModalClose = () => {
    setModalVisible(false)
    setEditMode(false)
    setSelectedCustomer('')
  }

  const handleDeleteButtonClick = async (rowData: any) => {
    setIsLoading(true)
    try {
      const response = await deleteUser({
        userId: rowData.id,
        customerAdminId: rowData.customerAdminId,
      }).unwrap()
      const { status } = response as DeleteUserResponse
      if (status === 200) {
        setIsLoading(false)
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'User Deleted Successfully ',
          life: 3000,
        })
        getCustomerAdminsUsers()
      }
    } catch (error) {
      const { message: msg } = error as ErrorResponse
      setIsLoading(false)
      console.error('Error occurred while fetching customer data:', msg)
    }
  }

  const getCustomerAdminsUsers = async () => {
    setIsLoading(true)
    try {
      let params: Params = {}
      if (searchInput) {
        params.searchText = searchInput
      }
      if (pageNumber) {
        params.pageNumber = pageNumber
      }
      if (pageSize) {
        params.pageSize = pageSize
      }
      const response = await getUser(params).unwrap()
      const { status, content, totalSize } = response as GetUserResponse
      if (status === 200 && Array.isArray(content)) {
        setIsLoading(false)
        setgetCustomerOwnerUserData(content)
        setTotalRecords(totalSize)
      }
    } catch (error) {
      const { message: msg } = error as ErrorResponse
      setIsLoading(false)
      console.error('Error occurred while fetching customer data:', msg)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getCustomerAdminsUsers()
    }, 600)
    return () => clearTimeout(timeoutId)
  }, [searchInput, pageNumber, pageSize])

  return (
    <>
      <div style={{ height: '150vh' }} className={modalVisible ? 'backdrop-blur-lg' : ''}>
        <Header header="MOORMANAGE/Permission" />
        <div className="flex mr-12 justify-end">
          <Toast ref={toast} />
          <div className="mt-5 mr-5 relative">
            <InputText
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value)
                setPageNumber(0)
                setPageNumber1(0)
              }}
              placeholder="Search by name, ID, Role, phone no..."
              style={{
                width: '378px',
                height: '44px',
                padding: '0 4rem 0 3rem',
                border: '1px solid #C5D9E0',
                fontSize: '16px',
                color: '#00426F',
                borderRadius: '4px',
                minHeight: '44px',
                fontWeight: 500,
              }}
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

          <div className="mt-[20px]">
            <CustomModal
              buttonText={'ADD NEW'}
              onClick={handleButtonClick}
              icon={<img src="/assets/images/Plus.png" alt="icon" className="w-3.8 h-3.8 mb-0.5" />}
              buttonStyle={AddNewButtonStyle}
              visible={modalVisible}
              onHide={handleModalClose}
              dialogStyle={{
                height: editMode ? '500px' : '600px',
                minHeight: editMode ? '500px' : '600px',
                ...DialogStyle,
              }}
              headerText={<h1 className="text-xl font-bold text-#000000 ml-4">New User</h1>}>
              <AddNewCustomer
                customerAdminId={customerAdminId}
                editMode={editMode}
                getUser={getCustomerAdminsUsers}
                closeModal={handleModalClose}
                setIsVisible={setModalVisible}
                setModalVisible={setModalVisible}
                customerData={selectedCustomer}
                permission={true}
                passWordDisplay={editMode}
                toastRef={toast}
                setSelectedCustomerUser={() => {}}
                setSelectedCustomer={() => {}}
              />
            </CustomModal>
          </div>
        </div>

        <div
          className={`flex gap-10 ml-6 mt-8 ${isLoading ? 'blur-screen' : ''}`}
          style={{
            paddingRight: '40px',
            paddingLeft: '25px',
          }}>
          <div
            className="bg-[#FFFFFF] border-[1px] border-gray-300  rounded-lg"
            style={{
              flexGrow: 1,
              borderRadius: '10px',
              minHeight: 'calc(40vw - 550px)',
            }}>
            <div className="text-md font-semibold rounded-t-lg bg-[#00426F]">
              <h1 className="p-4 text-white">{properties.Users}</h1>
            </div>
            <div
              data-testid="customer-admin-data"
              className="flex flex-col  "
              style={{ height: '550px' }}>
              <div className="flex-grow overflow-auto">
                <DataTableComponent
                  tableStyle={{
                    fontSize: '12px',
                    color: '#000000',
                    fontWeight: 600,
                    backgroundColor: '#D9D9D9',
                    borderRadius: '0 0 10px 10px',
                    overflow: 'auto',
                  }}
                  scrollable={true}
                  data={getCustomerOwnerUserData}
                  columns={tableColumnsPermission}
                  actionButtons={ActionButtonColumn}
                  style={{ borderBottom: '1px solid #D5E1EA', fontWeight: '500' }}
                  emptyMessage={
                    <div className="text-center mt-14">
                      <img
                        src="/assets/images/empty.png"
                        alt="Empty Data"
                        className="w-20 mx-auto mb-4"
                      />
                      <p className="text-gray-500">No data available</p>
                      {isLoading && (
                        <ProgressSpinner
                          style={{
                            position: 'absolute',
                            top: '80%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '50px',
                            height: '50px',
                          }}
                          strokeWidth="4"
                        />
                      )}
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

export default Permission
