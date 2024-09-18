import { useEffect, useMemo, useRef, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import CustomModal from '../../CustomComponent/CustomModal'
import {
  ErrorResponse,
  FormsPayload,
  FormsResponse,
  ViewFormsResponse,
} from '../../../Type/ApiTypes'
import {
  useDeleteFormMutation,
  useDownloadFormMutation,
  useGetFormsMutation,
  useGetViewFormMutation,
} from '../../../Services/MoorServe/MoorserveApi'
import { Button } from 'primereact/button'
import useSubmit from '../../../Services/CustomHook/useSubmit'
import FormFields from '../../CustomComponent/FormFields'
import Header from '../../Layout/LayoutComponents/Header'
import AddCustomer from '../../Moormanage/Customer/AddCustomer'
import DataTableComponent from '../../CommonComponent/Table/DataTableComponent'
import { ActionButtonColumnProps } from '../../../Type/Components/TableTypes'
import { FormDataa } from '../../Utils/CustomData'
import { InputText } from 'primereact/inputtext'
import AddForm from './AddForm'
import { Paginator } from 'primereact/paginator'
import { Params } from '../../../Type/CommonType'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Dialog } from 'primereact/dialog'
import FormFill from './FormFill'
import { properties } from '../../Utils/MeassageProperties'
import { useSelector } from 'react-redux'
import { selectCustomerId } from '../../../Store/Slice/userSlice'
import Preview from './Preview'
import { Toast } from 'primereact/toast'
import { convertBytetoUrl } from '../../Helper/Helper'
import PDFEditor from './PdfEditor'

const Forms = () => {
  const selectedCustomerId = useSelector(selectCustomerId)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewPdf, setViewPdf] = useState<any>()
  const [formsData, setFormsData] = useState<FormsPayload[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [pageNumber, setPageNumber] = useState(0)
  const [pageNumber1, setPageNumber1] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalRecords, setTotalRecords] = useState<number>()
  const [getForms] = useGetFormsMutation()
  const [deleteForm] = useDeleteFormMutation()
  const [getViewForms] = useGetViewFormMutation()
  const toastRef = useRef<Toast>(null)
  const toast = useRef<Toast>(null)

  const onPageChange = (event: any) => {
    setPageNumber(event.page)
    setPageNumber1(event.first)
    setPageSize(event.rows)
  }
  const handleButtonClick = () => {
    setIsModalOpen(true)
  }
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageNumber(0)
    setPageNumber1(0)
    setSearchText(e.target.value)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleDownload = async (rowData: any) => {
    setIsLoading(true)
    try {
      const dummyUrl = convertBytetoUrl(rowData.formData)
      const link = document.createElement('a')
      link.href = dummyUrl
      const name = rowData.fileName
      link.setAttribute('download', name)
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      const { message } = error as ErrorResponse
      setIsLoading(false)
      console.error('Error fetching forms:', error)
    }
  }

  const handleDelete = async (rowData: any) => {
    setIsLoading(true)
    try {
      const response = await deleteForm({
        id: rowData.id,
      }).unwrap()
      const { status, message } = response as FormsResponse
      if (status === 200) {
        setIsLoading(false)
        toastRef?.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: message,
          life: 3000,
        })
      } else {
        setIsLoading(false)
        toastRef?.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        })
      }
    } catch (error) {
      const { message, data } = error as ErrorResponse
      setIsLoading(false)
      toastRef?.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: message || data?.message,
        life: 3000,
      })
    }
    getFormsData()
  }

  const getFormsData = async () => {
    setIsLoading(true)
    try {
      let params: Params = {}
      params.searchText = searchText
      if (pageNumber) {
        params.pageNumber = pageNumber
      }
      if (pageSize) {
        params.pageSize = pageSize
      }
      const response = await getForms(params).unwrap()
      const { status, message, content, totalSize } = response as FormsResponse
      if (status === 200 && Array.isArray(content)) {
        setIsLoading(false)
        setFormsData(content)
        setTotalRecords(totalSize)
      } else {
        setFormsData([])
        setTotalRecords(totalSize)
        setIsLoading(false)
        toastRef?.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        })
      }
    } catch (error) {
      const { message, data } = error as ErrorResponse
      setIsLoading(false)
      toastRef?.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: message || data?.message,
        life: 3000,
      })
    }
  }

  const viewFormsData = async (id: any) => {
    setIsLoading(true)
    try {
      const response = await getViewForms({ id: id }).unwrap()
      const { status, content, message } = response as ViewFormsResponse
      if (status === 200) {
        setIsLoading(false)
        setViewPdf(content)
      } else {
        setViewPdf('')
        setIsLoading(false)
        toastRef?.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        })
      }
    } catch (error) {
      const { message, data } = error as ErrorResponse
      setIsLoading(false)
      toastRef?.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: message || data?.message,
        life: 3000,
      })
    }
  }

  const downloadFormsData = async (id: any) => {
    try {
      const response = await getViewForms({ id: id }).unwrap()
      const { status, content, message } = response as ViewFormsResponse
      if (status === 200) {
        handleDownload(content)
        setIsLoading(false)
      } else {
        setViewPdf('')
        setIsLoading(false)
        toastRef?.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        })
      }
    } catch (error) {
      const { message, data } = error as ErrorResponse
      setIsLoading(false)
      toastRef?.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: message || data?.message,
        life: 3000,
      })
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getFormsData()
    }, 2000)
    return () => clearTimeout(timeoutId)
  }, [selectedCustomerId, searchText, pageNumber, pageSize])

  const columnStyle = {
    backgroundColor: '#FFFFFF',
    color: '#000000',
    fontWeight: '500',
    fontSize: '12px',
  }

  const FormsColumns = useMemo(
    () => [
      {
        id: 'id',
        label: 'ID',
        style: columnStyle,
      },
      {
        id: 'submittedBy',
        label: 'Submitted by',
        style: columnStyle,
      },
      {
        id: 'formName',
        label: 'Form Name',
        style: columnStyle,
      },
      {
        id: 'submittedDate',
        label: 'Submitted Date',
        style: columnStyle,
      },
    ],
    [],
  )
  const ActionButtonColumn: ActionButtonColumnProps = {
    header: 'Action',
    buttons: [
      {
        color: 'black',
        label: 'View',
        underline: true,
        onClick: (rowData: any) => viewFormsData(rowData.id),
      },
      {
        color: 'black',
        label: 'Download',
        underline: true,
        onClick: (rowData: any) => downloadFormsData(rowData.id),
      },
      {
        color: 'red',
        label: 'Delete',
        underline: true,
        onClick: (rowData: any) => handleDelete(rowData),
      },
    ],
    headerStyle: {
      backgroundColor: '#FFFFFF',
      color: '#000000',
      fontWeight: '500',
      fontSize: '12px',
    },
    style: { borderBottom: '1px solid #D5E1EA', backgroundColor: '#FFFFFF', fontWeight: '400' },
  }

  return (
    <>
      <Toast ref={toastRef} />
      <Toast ref={toast} />
      <div style={{ height: '150vh' }} className={isModalOpen ? 'backdrop-blur-lg' : ''}>
        <Header header="MOORSERVE/Forms Library" />

        <div className="flex justify-end">
          <div className="flex mr-16 mt-6">
            <CustomModal
              buttonText={'Upload New'}
              buttonStyle={{
                width: '121px',
                height: '44px',
                minHeight: '44px',
                backgroundColor: '#0098FF',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                color: 'white',
                borderRadius: '0.50rem',
                marginLeft: '8px',
                boxShadow: 'none',
              }}
              children={
                <AddForm
                  closeModal={handleModalClose}
                  getFormsData={getFormsData}
                  toastRef={toast}
                />
              }
              headerText={<h1 className="text-xl font-extrabold text-black ml-4">Form Details</h1>}
              visible={isModalOpen}
              onClick={handleButtonClick}
              onHide={handleModalClose}
              dialogStyle={{
                width: '851px',
                minWidth: '851px',
                height: '496px',
                minHeight: '496px',
                borderRadius: '1rem',
                maxHeight: '95% !important',
              }}
            />
          </div>
        </div>

        <div
          style={{
            height: '712px',
            gap: '0px',
            borderRadius: '10px',
            border: '1px solid #D5E1EA',
            opacity: '0px',
            backgroundColor: '#FFFFFF',
          }}
          className="bg-[F2F2F2]  ml-12  mt-3 mr-14">
          <div className="flex flex-wrap align-items-center justify-between  bg-[#00426F] p-2   rounded-tl-[10px] rounded-tr-[10px]">
            <span className=" p-2 text-xl font-extrabold text-white">Forms</span>

            <div className="relative inline-block">
              <div className="relative mt-1">
                <img
                  src="/assets/images/Search.png"
                  alt="search icon"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  data-testid="search-icon"
                />
                <InputText
                  placeholder="Search"
                  onChange={handleSearch}
                  id="placeholderText"
                  className="pl-10 w-[237px] bg-[#00426F] h-[35px] rounded-lg border text-[white] 
                  border-[#D5E1EA] placeholder:text-[#FFFFFF]  focus:outline-none overflow-hidden"
                />
              </div>
            </div>
          </div>

          <div
            data-testid="customer-admin-data"
            className="flex flex-col  "
            style={{ height: '630px' }}>
            <div className="flex-grow overflow-auto">
              <DataTableComponent
                tableStyle={{
                  fontSize: '12px',
                  color: '#000000',
                  fontWeight: 600,
                  backgroundColor: '#D9D9D9',
                  cursor: 'pointer',
                }}
                data={formsData}
                columns={FormsColumns}
                actionButtons={ActionButtonColumn}
                style={{ borderBottom: '1px solid #D5E1EA', fontWeight: '400' }}
                emptyMessage={
                  <div className="text-center mt-40">
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
        </div>

        {viewPdf && (
          <Preview
            fileData={viewPdf?.encodedData}
            fileName={viewPdf?.formName}
            onClose={() => setViewPdf(null)}
          />
        )}
      </div>
    </>
  )
}

export default Forms
