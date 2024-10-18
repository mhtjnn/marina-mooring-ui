import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AddWorkOrders from '../../Moorserve/WorkOrders/AddWorkOrders'
import { ActionButtonColumnProps } from '../../../Type/Components/TableTypes'
import Header from '../../Layout/LayoutComponents/Header'
import DataTableComponent from '../../CommonComponent/Table/DataTableComponent'
import { Paginator } from 'primereact/paginator'
import { ProgressSpinner } from 'primereact/progressspinner'
import PaymentModal from './PaymentModal'
import { InputText } from 'primereact/inputtext'
import { useSelector } from 'react-redux'
import { selectCustomerId } from '../../../Store/Slice/userSlice'
import { Toast } from 'primereact/toast'
import { Params } from '../../../Type/CommonType'
import ReasonModal from './ReasonModal'
import ApproveModal from './ApproveModal'
import { properties } from '../../Utils/MeassageProperties'
import PopUpCustomModal from '../../CustomComponent/PopUpCustomModal'
import {
  useGetCompletedWorkOrderWithPendingPayApprovalMutation,
  useGetWorkOrderInvoicesMutation,
} from '../../../Services/MoorServe/MoorserveApi'
import {
  ErrorResponse,
  WorkOrderInvoiceResponse,
  WorkOrderPayload,
  WorkOrderResponse,
} from '../../../Type/ApiTypes'
import {
  AccountRecievableColumnStyle,
  AccountRecievableHeaderStyle,
  WorkOrderPendingApprovalDataTableHeaderStyle,
  WorkOrderPendingApprovalDataTableStyle,
} from '../../Utils/Style'
import { firstLastName } from '../../Helper/Helper'

const AccountRecievable = () => {
  const toast = useRef<Toast>(null)
  const selectedCustomerId = useSelector(selectCustomerId)
  const [amount, setamount] = useState()
  const [pageNumber, setPageNumber] = useState(0)
  const [pageNumber1, setPageNumber1] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [pageNumberTwo, setPageNumberTwo] = useState(0)
  const [pageNumber2, setPageNumber2] = useState(0)
  const [pageSizeTwo, setPageSizeTwo] = useState(10)
  const [totalRecords, setTotalRecords] = useState<number>()
  const [totalRecordsInvoice, setTotalRecordsInvoice] = useState<number>()
  const [isLoading, setIsLoading] = useState(false)
  const [denyModalOpen, setDenyModalOpen] = useState(false)
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [workOrderId, setWorkOrderId] = useState<any>()
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [addWorkOrderModal, setAddWorkOrderModal] = useState(false)
  const [searchApproval, setSearchApproval] = useState('')
  const [searchInvoice, setSearchInvoice] = useState('')
  const [workOrderData, setWorkOrderData] = useState<WorkOrderPayload[]>([])
  const [workOrderDataInvoice, setWorkOrderDataInvoice] = useState<WorkOrderPayload[]>([])
  const [selectedRowData, setSelectedRowData] = useState<any>()
  const [selectedWorkOrderRowData, setSelectedWorkOredrRowData] = useState<any>()
  const [isAccountRecievable, setIsAccountRecievable] = useState(false)
  const [isInvoice, setIsInvoice] = useState(false)
  const [getCompletedWorkOrderWithPendingPayApproval] =
    useGetCompletedWorkOrderWithPendingPayApprovalMutation()
  const [getWorkOrderInvoice] = useGetWorkOrderInvoicesMutation()
  const handleSearchApproval = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchApproval(e.target.value)
  }
  const handleSearchInvoice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInvoice(e.target.value)
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
  const handleModalClose = () => {
    setIsPaymentModalOpen(false)
    setDenyModalOpen(false)
    setAddWorkOrderModal(false)
    setApproveModalOpen(false)
    setSelectedWorkOredrRowData('')
  }
  const handleBottomSectionActionClick = (action: string, row: any) => {
    if (action === 'Payments') {
      setIsPaymentModalOpen(true)
      setSelectedWorkOredrRowData(row?.id)
    } else if (action === 'Contact') {
      setIsLoading(true)
      window.location.href = `mailto:`
      setIsLoading(false)
    } else if (action === 'View') {
      setSelectedWorkOredrRowData(row?.workOrderResponseDto)
      setAddWorkOrderModal(true)
      setIsAccountRecievable(true)
      setIsInvoice(true)
    }
  }
  const getWorkOrderWithPendingPayApproval = useCallback(async () => {
    setIsLoading(true)
    try {
      const params: Params = {}
      if (searchApproval) {
        params.searchText = searchApproval
      }
      if (pageNumber) {
        params.pageNumber = pageNumber
      }
      if (pageSize) {
        params.pageSize = pageSize
      }
      const response = await getCompletedWorkOrderWithPendingPayApproval(params).unwrap()
      const { status, content, message, totalSize } = response as WorkOrderResponse
      if ((status === 200 || status === 201) && Array.isArray(content)) {
        setWorkOrderData(content)
        setIsLoading(false)
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
    } catch (error) {
      const { message: msg } = error as ErrorResponse
      setIsLoading(false)
      console.error('Error occurred while fetching customer data:', msg)
    }
  }, [searchApproval, selectedCustomerId, pageNumber, pageSize])

  const getOutStandingInvoice = useCallback(async () => {
    setIsLoading(true)
    try {
      const params: Params = {}
      if (searchInvoice) {
        params.searchText = searchInvoice
      }
      if (pageNumberTwo) {
        params.pageNumber = pageNumberTwo
      }
      if (pageSizeTwo) {
        params.pageSize = pageSizeTwo
      }
      const response = await getWorkOrderInvoice(params).unwrap()
      const { status, content, message, totalSize } = response as WorkOrderInvoiceResponse
      if ((status === 200 || status === 201) && Array.isArray(content)) {
        setWorkOrderDataInvoice(content)
        setIsLoading(false)
        setTotalRecordsInvoice(totalSize)
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
  }, [searchInvoice, selectedCustomerId, pageNumberTwo, pageSizeTwo])

  const accountRecievableTableColumn = useMemo(
    () => [
      { id: 'workOrderNumber', label: 'Work Order Number', style: AccountRecievableColumnStyle },
      {
        id: 'customerName',
        label: 'Customer Name',
        body: firstLastName,
        style: AccountRecievableColumnStyle,
      },
      { id: 'completedDate', label: 'Completed Date', style: AccountRecievableColumnStyle },
      { id: 'workOrderStatusDto.status', label: 'Status', style: AccountRecievableColumnStyle },
    ],
    [],
  )

  const handleActionTopSectionClick = (action: string, row: any) => {
    if (action === 'Approve') {
      setamount(row.cost)
      setWorkOrderId(row?.id)
      setApproveModalOpen(true)
    } else if (action === 'Deny') {
      setSelectedRowData(row?.id)
      setDenyModalOpen(true)
    } else if (action === 'View') {
      setSelectedWorkOredrRowData(row)
      setAddWorkOrderModal(true)
      setIsAccountRecievable(true)
    }
  }

  const ActionButtonColumn: ActionButtonColumnProps = {
    header: 'Actions',
    buttons: [
      {
        label: 'Approve',
        filled: true,
        onClick: (row: any) => handleActionTopSectionClick('Approve', row),
      },
      {
        label: 'Deny',
        filled: true,
        onClick: (row: any) => handleActionTopSectionClick('Deny', row),
      },
      {
        label: 'View',
        filled: true,
        onClick: (row: any) => handleActionTopSectionClick('View', row),
      },
    ],
    headerStyle: { ...AccountRecievableHeaderStyle },
    style: { borderBottom: '1px solid #D5E1EA', fontWeight: '400' },
  }

  const firstLastNameBottomSection = (data: any) => {
    return (
      data?.workOrderResponseDto?.customerResponseDto?.firstName +
      ' ' +
      data?.workOrderResponseDto?.customerResponseDto?.lastName
    )
  }
  const invoiceAmount = (data: any) => {
    return '$' + '' + data?.invoiceAmount
  }
  const outstandingInvoiceTableColumn = useMemo(
    () => [
      {
        id: 'workOrderResponseDto?.workOrderNumber',
        label: 'Work Order Number',
        style: AccountRecievableColumnStyle,
      },
      {
        id: 'customerResponseDto',
        label: 'Customer Name',
        body: firstLastNameBottomSection,
        style: AccountRecievableColumnStyle,
      },
      { id: 'invoiceDate', label: 'Invoice Date', style: AccountRecievableColumnStyle },
      {
        id: 'invoiceAmount',
        label: 'Invoice Amount',
        body: invoiceAmount,
        style: AccountRecievableColumnStyle,
      },
      {
        id: 'workOrderInvoiceStatusDto.lastModifiedBy',
        label: 'Last Contact Time',
        style: AccountRecievableColumnStyle,
      },
      {
        id: 'workOrderInvoiceStatusDto.status',
        label: 'Status',
        style: AccountRecievableColumnStyle,
      },
    ],
    [],
  )

  const ActionButtonColumnInvoice: ActionButtonColumnProps = {
    header: 'Actions',
    buttons: [
      {
        color: 'black',
        label: 'Payments',
        filled: true,
        fontWeight: 400,
        onClick: (row) => handleBottomSectionActionClick('Payments', row),
      },
      {
        color: 'black',
        label: 'Contact',
        filled: true,
        onClick: (row) => handleBottomSectionActionClick('Contact', row),
      },
      {
        color: 'black',
        label: 'View',
        filled: true,
        onClick: (row) => handleBottomSectionActionClick('View', row),
      },
    ],
    headerStyle: { ...AccountRecievableHeaderStyle },
    style: { borderBottom: '1px solid #D5E1EA' },
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      getWorkOrderWithPendingPayApproval()
    }, 600)
    return () => {
      clearTimeout(handler)
    }
  }, [searchApproval, pageNumber, pageSize, selectedCustomerId, getWorkOrderWithPendingPayApproval])

  useEffect(() => {
    const handler = setTimeout(() => {
      getOutStandingInvoice()
    }, 600)
    return () => {
      clearTimeout(handler)
    }
  }, [searchInvoice, pageNumberTwo, pageSizeTwo, selectedCustomerId, getOutStandingInvoice])

  return (
    <div
      style={{ height: '100vh' }}
      className={
        isPaymentModalOpen || approveModalOpen || denyModalOpen || addWorkOrderModal
          ? 'backdrop-blur-lg'
          : ''
      }>
      <Header header="MOORPAY/Account Receivable" />
      <Toast ref={toast} />
      {/* Work Orders Pending Approval Data Table  */}
      <div
        style={{ ...WorkOrderPendingApprovalDataTableStyle }}
        className="bg-[F2F2F2] ml-12 mt-6 mr-14">
        <div className="flex flex-wrap align-items-center justify-between  bg-[#00426F] p-2   rounded-tl-[10px] rounded-tr-[10px]">
          <span
            style={{
              ...WorkOrderPendingApprovalDataTableHeaderStyle,
            }}>
            {properties.WorkOrdersPendingApprovalHeaders}
          </span>
          <div className="relative inline-block">
            <div className="relative">
              <img
                src="/assets/images/Search.png"
                alt="search icon"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                data-testid="search-icon"
              />
              <InputText
                value={searchApproval}
                onChange={handleSearchApproval}
                placeholder="Search"
                id="placeholderText"
                className="pl-10 w-[237px] bg-[#00426F] h-[35px] rounded-lg border text-[white] border-[#D5E1EA] placeholder:text-[#FFFFFF]  focus:outline-none"
              />
            </div>
          </div>
        </div>
        <div className="h-[40vh] overflow-auto">
          <DataTableComponent
            tableStyle={{
              fontSize: '13px',
              color: '#000000',
              fontWeight: 700,
            }}
            data={workOrderData}
            columns={accountRecievableTableColumn}
            actionButtons={ActionButtonColumn}
            style={{ borderBottom: '1px solid #D5E1EA', fontWeight: '400' }}
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
              borderBottomRightRadius: '10px',
              borderBottomLeftRadius: '10px',
            }}
          />
        </div>
      </div>
      {/* Outstanding Invoices Data Table  */}
      <div
        style={{
          ...WorkOrderPendingApprovalDataTableStyle,
          marginBottom: '20px',
        }}
        className="bg-[F2F2F2] ml-12 mt-6 mr-14">
        <div className="flex flex-wrap align-items-center justify-between  bg-[#00426F] p-2   rounded-tl-[10px] rounded-tr-[10px]">
          <span
            style={{
              ...WorkOrderPendingApprovalDataTableHeaderStyle,
            }}>
            {properties.OutstandingInvoicesHeader}{' '}
          </span>

          <div className="relative inline-block">
            <div className="relative">
              <img
                src="/assets/images/Search.png"
                alt="search icon"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                data-testid="search-icon"
              />
              <InputText
                value={searchInvoice}
                onChange={handleSearchInvoice}
                placeholder="Search"
                id="placeholderText"
                className="pl-10 w-[237px] bg-[#00426F] h-[35px] rounded-lg border text-[white] border-[#D5E1EA] placeholder:text-[#FFFFFF]  focus:outline-none"
              />
            </div>
          </div>
        </div>
        <div className="h-[45vh] overflow-auto">
          <DataTableComponent
            tableStyle={{
              fontSize: '13px',
              color: '#000000',
              fontWeight: 700,
            }}
            data={workOrderDataInvoice}
            columns={outstandingInvoiceTableColumn}
            actionButtons={ActionButtonColumnInvoice}
            style={{ borderBottom: '1px solid #D5E1EA', fontWeight: '400' }}
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
          <div className="text-center">
            {isLoading && (
              <ProgressSpinner
                style={{
                  position: 'absolute',
                  top: '45%',
                  left: '60%',
                  transform: 'translate(-50%, -50%)',
                  width: '50px',
                  height: '50px',
                }}
                strokeWidth="4"
              />
            )}
          </div>
        </div>
        <div>
          <Paginator
            first={pageNumber2}
            rows={pageSizeTwo}
            totalRecords={totalRecordsInvoice}
            rowsPerPageOptions={[5, 10, 20, 30]}
            onPageChange={onPageChangeTwo}
            style={{
              position: 'sticky',
              bottom: 0,
              zIndex: 1,
              backgroundColor: 'white',
              borderTop: '1px solid #D5E1EA',
              padding: '0.5rem',
              borderBottomRightRadius: '10px',
              borderBottomLeftRadius: '10px',
              height: '50px',
              marginBottom: '10px',
            }}
          />
        </div>
      </div>
      {/* Payment Modal */}
      <PopUpCustomModal
        style={{
          width: '600px',
          minWidth: '600px',
          height: '270px',
          minHeight: '270px',
        }}
        visible={isPaymentModalOpen}
        header="Payment"
        onHide={handleModalClose}
        children={
          <PaymentModal
            onHide={handleModalClose}
            workOrderInvoiceId={selectedWorkOrderRowData}
            onSavePayment={() => {
              setIsPaymentModalOpen(false)
            }}
          />
        }></PopUpCustomModal>
      {/* Approve Modal */}
      <PopUpCustomModal
        style={{
          width: '520px',
          minWidth: '520px',
          height: '260px',
          minHeight: '260px',
        }}
        visible={approveModalOpen}
        header="Approve"
        onHide={handleModalClose}
        children={
          <ApproveModal
            id={workOrderId}
            toast={toast}
            amountValue={amount}
            setVisible={() => {
              setApproveModalOpen(false)
            }}
            getWorkOrderWithPendingPayApproval={getWorkOrderWithPendingPayApproval}
            getOutStandingInvoice={getOutStandingInvoice}
            closeModal={() => {
              handleModalClose()
            }}
          />
        }></PopUpCustomModal>
      {/* Reason Modal */}
      <PopUpCustomModal
        style={{
          width: '520px',
          minWidth: '520px',
          height: '260px',
          minHeight: '260px',
        }}
        visible={denyModalOpen}
        header="Deny"
        onHide={handleModalClose}
        children={
          <ReasonModal
            selectedRowData={selectedRowData}
            toast={toast}
            setVisible={() => {
              setDenyModalOpen(false)
            }}
            getWorkOrderWithPendingPayApproval={getWorkOrderWithPendingPayApproval}
            getOutStandingInvoice={getOutStandingInvoice}
            closeModal={() => {
              handleModalClose()
            }}
          />
        }></PopUpCustomModal>
      {/*view button */}
      <PopUpCustomModal
        style={{
          width: '851px',
          minWidth: '851px',
          height: '526px',
          minHeight: '526px',
        }}
        visible={addWorkOrderModal}
        header={<h1 className="text-xl font-extrabold text-black ml-4">Work Order</h1>}
        onHide={handleModalClose}
        children={
          <AddWorkOrders
            workOrderData={selectedWorkOrderRowData}
            isAccountRecievable={isAccountRecievable}
            getWorkOrderWithPendingPayApproval={getWorkOrderWithPendingPayApproval}
            getOutStandingInvoice={getOutStandingInvoice}
            editModeWorkOrder={true}
            isInvoice={isInvoice}
            isTechnician={true}
            setVisible={() => {
              setAddWorkOrderModal(false)
            }}
            closeModal={() => {
              handleModalClose()
            }}
          />
        }></PopUpCustomModal>
    </div>
  )
}

export default AccountRecievable
