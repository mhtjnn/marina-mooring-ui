import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import DataTableComponent from '../CommonComponent/Table/DataTableComponent'
import Header from '../Layout/LayoutComponents/Header'
import { useSelector } from 'react-redux'
import { CustomerPayload, CustomerResponse, ErrorResponse } from '../../Type/ApiTypes'
import { Toast } from 'primereact/toast'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Paginator } from 'primereact/paginator'
import { DropdownCellProps, Params, State } from '../../Type/CommonType'
import { properties } from '../Utils/MeassageProperties'
import { Dropdown } from 'primereact/dropdown'
import { QuickBooksCustomerData } from '../CommonComponent/MetaDataComponent/MetaDataApi'
import { useGetCustomerMutation } from '../../Services/MoorManage/MoormanageApi'
import { selectCustomerId } from '../../Store/Slice/userSlice'
import {
  useEditMapCustomerToQuickBookMutation,
  useMapCustomerToQuickBookMutation,
} from '../../Services/AdminTools/AdminToolsApi'

const Settings = () => {
  const selectedCustomerId = useSelector(selectCustomerId)
  const [quickBookCustomer, setQuickBookCustomer] = useState<{ label: any; id: any }[]>([])

  const [getCustomer] = useGetCustomerMutation()
  const toast = useRef<Toast>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [totalRecords, setTotalRecords] = useState<number>()
  const [pageNumber, setPageNumber] = useState(0)
  const [pageNumber1, setPageNumber1] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [currentlyEditing, setCurrentlyEditing] = useState<any>(null)
  const [dropdownValues, setDropdownValues] = useState<{ [key: string]: string }>({})
  const [savedValues, setSavedValues] = useState<{ [key: string]: string }>({})
  const [customerData, setCustomerData] = useState<CustomerPayload[]>([])
  const [dropdownDisabled, setDropdownDisabled] = useState<{ [key: string]: boolean }>({})
  const { getQuickBookCustomerData } = QuickBooksCustomerData()
  const [mapCustomerToQuickBook] = useMapCustomerToQuickBookMutation()
  const [editMapCustomerToQuickBook] = useEditMapCustomerToQuickBookMutation()

  const onPageChange = (event: any) => {
    setPageNumber(event.page)
    setPageNumber1(event.first)
    setPageSize(event.rows)
  }
  const columnStyle = {
    borderBottom: '1px solid #D5E1EA',
    backgroundColor: '#FFFFFF',
    color: '#000000',
    fontWeight: 700,
  }

  const firstLastName = (data: any) => {
    if (data.firstName === null) return '-'
    if (data.lasttName === null) return '-'
    else return data.firstName + ' ' + data.lastName
  }

  const tableColumnsPermission = useMemo(
    () => [
      {
        id: 'firstName',
        label: 'Customer Name',
        body: firstLastName,
        style: columnStyle,
      },
      {
        id: 'quickbookCustomerResponseDto.id',
        label: 'QuickBook Customer Name',
        style: columnStyle,
        body: (rowData: {
          id: string
          label: string
          dropdownValue: string
          quickbookCustomerId: any
          quickbookCustomerResponseDto: any
        }) => (
          <>
            <Dropdown
              optionLabel="label"
              optionValue="quickbookCustomerId"
              value={
                dropdownValues[rowData.id] ||
                (rowData?.quickbookCustomerResponseDto?.quickbookCustomerFirstName &&
                  (rowData?.quickbookCustomerResponseDto?.quickbookCustomerFirstName === null
                    ? '-'
                    : rowData?.quickbookCustomerResponseDto?.quickbookCustomerFirstName) +
                    ' ' +
                    (rowData?.quickbookCustomerResponseDto?.quickbookCustomerLastName === null
                      ? '-'
                      : rowData?.quickbookCustomerResponseDto?.quickbookCustomerLastName))
              }
              // value={
              //   dropdownValues[rowData.id] ||
              //   rowData?.quickbookCustomerResponseDto?.quickbookCustomerFirstName +
              //     ' ' +
              //     rowData?.quickbookCustomerResponseDto?.quickbookCustomerLastName
              // }
              options={quickBookCustomer?.map?.((option: any) => {
                return { ...option, value: option.quickbookCustomerId }
              })}
              disabled={
                (rowData?.quickbookCustomerResponseDto?.id || !!dropdownDisabled[rowData.id]) &&
                rowData?.id !== currentlyEditing
              }
              onChange={(e) => {
                setDropdownValues({
                  ...dropdownValues,
                  [rowData.id]: e.target.value,
                })
              }}
              editable
              dataKey="id"
              style={{
                height: '32px',
                border: '1px solid #D5E1EA',
                borderRadius: '0.50rem',
                fontSize: '0.8rem',
                width: '40%',
                textAlign: 'center',
              }}
            />
          </>
        ),
      },
      {
        id: 'Action',
        label: 'Action',
        style: columnStyle,
        body: (rowData: any) => (
          <span
            className={`cursor-pointer underline ${savedValues[rowData.id] ? 'black' : 'text-green-500'}`}
            onClick={() => {
              const dropdownValue = dropdownValues[rowData.id]
              const hasDropdownSelected =
                rowData?.quickbookCustomerResponseDto?.id || savedValues[rowData.id]
              if (rowData.id === currentlyEditing) {
                // UpdateMapCustomerToQuickBook(rowData)
                MapCustomerToQuickBook(rowData)
                setCurrentlyEditing(null)
              } else if (dropdownValue || hasDropdownSelected) {
                if (!(savedValues[rowData?.id] || rowData?.quickbookCustomerResponseDto?.id)) {
                  MapCustomerToQuickBook(rowData)
                } else {
                  setCurrentlyEditing(rowData.id)
                }
              }
            }}>
            {rowData.id === currentlyEditing
              ? 'Save'
              : rowData?.quickbookCustomerResponseDto?.id || savedValues[rowData.id]
                ? 'Edit'
                : 'Save'}
          </span>
        ),
      },
    ],
    [dropdownValues, savedValues, dropdownDisabled, quickBookCustomer, currentlyEditing],
  )

  const getCustomerData = useCallback(async () => {
    setIsLoading(true)
    try {
      let params: Params = {}
      if (pageNumber) {
        params.pageNumber = pageNumber
      }
      if (pageSize) {
        params.pageSize = pageSize
      }

      const response = await getCustomer(params).unwrap()
      const { status, content, message, totalSize } = response as CustomerResponse
      if (status === 200 && Array.isArray(content)) {
        if (content?.length > 0) {
          setIsLoading(false)
          setCustomerData(content)
          setTotalRecords(totalSize)
        } else {
          setIsLoading(false)

          setCustomerData([])
          setTotalRecords(totalSize)
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
  }, [getCustomer, selectedCustomerId, pageSize, pageNumber])

  const fetchDataAndUpdate = useCallback(async () => {
    const { quickBookCustomerData } = await getQuickBookCustomerData()
    if (quickBookCustomerData !== null) {
      const parsedData = quickBookCustomerData?.map((item: any) => ({
        label: item.quickbookCustomerFirstName + ' ' + item.quickbookCustomerLastName,
        id: item.id,
        quickbookCustomerId: item.quickbookCustomerId,
      }))
      setQuickBookCustomer(parsedData)
    }
  }, [])

  const MapCustomerToQuickBook = async (rowData: any) => {
    try {
      setIsLoading(true)
      const selectedValue: any = dropdownValues[rowData.id]
      const response = await mapCustomerToQuickBook({
        quickbookCustomerId: selectedValue || rowData?.quickbookCustomerResponseDto?.id,
        customerId: rowData?.id,
      }).unwrap()
      const { status, message } = response as CustomerResponse
      if (status === 200 || status === 201) {
        setDropdownDisabled((prevState) => ({ ...prevState, [rowData.id]: true }))
        setSavedValues((prevState) => ({ ...prevState, [rowData.id]: dropdownValues[rowData.id] }))
        setIsLoading(false)
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
      const { message, data } = error as ErrorResponse
      setIsLoading(false)
      toast?.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: message || data?.message,
        life: 3000,
      })
    }
  }

  const UpdateMapCustomerToQuickBook = async (rowData: any) => {
    try {
      setIsLoading(true)
      const response = await editMapCustomerToQuickBook({
        customerId: rowData?.id,
        quickbookCustomerId: Object.values(dropdownValues)?.map((value: any) => value.id)?.[0],
      }).unwrap()
      const { status, message } = response as CustomerResponse
      if (status === 200 || status === 201) {
        setDropdownDisabled((prevState) => ({ ...prevState, [rowData.id]: true }))
        setSavedValues((prevState) => ({ ...prevState, [rowData.id]: dropdownValues[rowData.id] }))
        setIsLoading(false)
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
      const { message, data } = error as ErrorResponse
      setIsLoading(false)
      toast?.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: data?.message,
        life: 3000,
      })
    }
  }

  useEffect(() => {
    fetchDataAndUpdate()
  }, [selectedCustomerId])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getCustomerData()
    }, 600)
    return () => clearTimeout(timeoutId)
  }, [selectedCustomerId, pageSize, pageNumber])

  return (
    <div>
      <Header header="MOORMANAGE/Permission" />
      <Toast ref={toast} />
      <div
        className={`flex gap-10 ml-6 mt-6`}
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
            <h1 className="p-4 text-xl font-extrabold  text-white">{properties.Settings}</h1>
          </div>
          <div
            data-testid="customer-admin-data"
            className="flex flex-col"
            style={{ height: '700px' }}>
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
                data={customerData}
                columns={tableColumnsPermission}
                style={{ borderBottom: '1px solid #D5E1EA', fontWeight: '500' }}
                emptyMessage={
                  <div className="text-center mt-14">
                    <img
                      src="/assets/images/empty.png"
                      alt="Empty Data"
                      className="w-20 mx-auto mb-4"
                    />
                    <p className="text-gray-500">{properties.noDataMessage}</p>
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
  )
}

export default Settings
