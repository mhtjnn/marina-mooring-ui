import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CustomModal from '../../CustomComponent/CustomModal'
import AddVendor from './AddVendor'
import { InputText } from 'primereact/inputtext'
import {
  useDeleteVendorMutation,
  useGetVendorsMutation,
} from '../../../Services/MoorManage/MoormanageApi'
import { DeleteCustomerResponse, VendorPayload, VendorResponse } from '../../../Type/ApiTypes'
import { ActionButtonColumnProps } from '../../../Type/Components/TableTypes'
import Header from '../../Layout/LayoutComponents/Header'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Toast } from 'primereact/toast'
import { Params } from '../../../Type/CommonType'
import { useSelector } from 'react-redux'
import { selectCustomerId } from '../../../Store/Slice/userSlice'
import DataTableComponent from '../../CommonComponent/Table/DataTableComponent'
import { Paginator } from 'primereact/paginator'
import { properties } from '../../Utils/MeassageProperties'
import { AddNewButtonStyle, DialogStyle, VendorcolumnStyle } from '../../Style'

const Vendors = () => {
  const selectedCustomerId = useSelector(selectCustomerId)
  const [modalVisible, setModalVisible] = useState(false)
  const [vendorData, setVendorData] = useState<VendorPayload[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<any>()
  const [editMode, setEditMode] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [pageNumber, setPageNumber] = useState(0)
  const [pageNumber1, setPageNumber1] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalRecords, setTotalRecords] = useState<number>()
  const toast = useRef<Toast>(null)
  const [getVendors] = useGetVendorsMutation()
  const [deleteVendor] = useDeleteVendorMutation()
  const navigate = useNavigate()

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

  const getVendorData = useCallback(async () => {
    setIsLoading(true)
    try {
      let params: Params = {}
      searchText && (params.searchText = searchText)
      pageNumber && (params.pageNumber = pageNumber)
      pageSize && (params.pageSize = pageSize)
      await getVendors(params)
        .unwrap()
        .then(async (response: any) => {
          const { status, content, message, totalSize } = response as VendorResponse
          if (status === 200 && Array.isArray(content)) {
            setIsLoading(false)
            setVendorData(content)
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
        })
    } catch (error) {
      setIsLoading(false)
      console.error('Error fetching getBoatyardsdata:', error)
    }
  }, [getVendors, searchText, selectedCustomerId, pageSize, pageNumber])

  const handleEdit = (rowData: any) => {
    setModalVisible(true)
    setSelectedCustomer(rowData)
    setEditMode(true)
  }

  const handleDelete = async (rowData: any) => {
    setIsLoading(true)
    try {
      const response = await deleteVendor({ id: rowData?.id }).unwrap()
      const { status, message } = response as DeleteCustomerResponse
      if (status === 200) {
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
      getVendorData()
    } catch (error) {
      setIsLoading(false)
      console.error('Error deleting customer:', error)
    }
  }

  const handleModalClose = () => {
    setModalVisible(false)
    setEditMode(false)
  }

  const VendorColumns = useMemo(
    () => [
      {
        id: 'vendorName',
        label: 'Vendor Name',
        style: {
          ...VendorcolumnStyle,
          borderTopLeftRadius: '10px',
        },
      },
      {
        id: 'companyPhoneNumber',
        label: 'Phone Number',
        style: VendorcolumnStyle,
        className: 'phone',
      },
      {
        id: 'companyEmail',
        label: 'Email Address',
        style: VendorcolumnStyle,
        className: 'email',
      },
      {
        id: 'inventoryItems',
        label: 'Inventory Items',
        style: VendorcolumnStyle,
      },
    ],
    [],
  )

  const ActionButtonColumn: ActionButtonColumnProps = {
    header: 'Action',
    buttons: [
      {
        color: 'black',
        label: 'View Inventory',
        onClick: (rowData) => {
          navigate(`/moormanage/inventoryDetails?vendorId=${rowData.id}`)
        },
        underline: true,
        style: {
          margin: 0,
        },
      },
      {
        color: 'green',
        label: 'Edit',
        onClick: handleEdit,
        underline: true,
      },
      {
        color: 'red',
        label: 'Delete',
        onClick: (rowData) => {
          handleDelete(rowData)
        },
        underline: true,
      },
    ],
    headerStyle: {
      backgroundColor: '#00426F',
      color: '#FFFFFF',
      height: '3.50rem',
      borderTopRightRadius: '10px',
      borderBottom: '1px solid #C0C0C0',
    },
    style: {
      borderBottom: '1px solid #D5E1EA ',
      width: '14rem',
      fontWeight: 700,
    },
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(true)
      getVendorData()
    }, 600)
    return () => clearTimeout(timeoutId)
  }, [searchText, selectedCustomerId, pageSize, pageNumber, selectedCustomerId])

  return (
    <>
      <Toast ref={toast} />
      <div style={{ height: '150vh' }} className={modalVisible ? 'backdrop-blur-lg' : ''}>
        <Header header="MOORMANAGE/Vendor" />
        <div className="flex justify-end">
          <div className="flex gap-4 mr-12 mt-6">
            <div>
              <div className="p-input-icon-left">
                <InputText
                  value={searchText}
                  onChange={handleSearch}
                  placeholder="Search"
                  className="h-[44px] w-[237px] cursor-pointer pl-8 rounded-lg text-bold  "
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
              icon={<img src="/assets/images/Plus.png" alt="icon" className="w-3.8 h-3.8" />}
              children={
                <AddVendor
                  vendors={selectedCustomer}
                  editMode={editMode}
                  closeModal={handleModalClose}
                  getVendor={getVendorData}
                  toastRef={toast}
                />
              }
              headerText={
                <h1 style={{ fontWeight: '500', fontSize: '24px', color: '#000000' }}>
                  Add Vendor
                </h1>
              }
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

        <div
          style={{
            height: '700px',
            borderRadius: '10px',
            border: '1px solid #D5E1EA',
            backgroundColor: '#FFFFFF',
            position: 'relative',
          }}
          className={`ml-[3rem] mr-[2.30rem] mt-3 `}>
          <div data-testid="customer" className="flex flex-col h-full ">
            <div className="flex-grow overflow-auto">
              <DataTableComponent
                tableStyle={{
                  fontSize: '12px',
                  color: '#000000',
                  fontWeight: 600,
                  backgroundColor: '#F9FAFB',
                  cursor: 'pointer',
                }}
                data={vendorData}
                columns={VendorColumns}
                actionButtons={ActionButtonColumn}
                style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #D5E1EA' }}
                emptyMessage={
                  <div className="text-center mt-40">
                    <img
                      src="/assets/images/empty.png"
                      alt="Empty Data"
                      className="w-28 mx-auto mb-4"
                    />
                    <p className="text-gray-500 font-[600] text-lg">{properties.noDataMessage}</p>
                    <div data-testid="progress">
                      {isLoading && (
                        <ProgressSpinner
                          style={{
                            position: 'absolute',
                            top: '70%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '50px',
                            height: '50px',
                          }}
                          strokeWidth="4"
                        />
                      )}
                    </div>
                  </div>
                }
              />
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
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Vendors
