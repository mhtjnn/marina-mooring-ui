// import React from 'react'
import DataTableComponent from '../../../CommonComponent/Table/DataTableComponent'
import { Paginator } from 'primereact/paginator'
import { properties } from '../../../Utils/MeassageProperties'
import { BillingAccordianProps, MooringAccordianProps } from '../../../../Type/AccordianBasedTypes'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ErrorResponse,
  WorkOrderInvoiceResponse,
  WorkOrderPayload,
} from '../../../../Type/ApiTypes'
import { AccountRecievableColumnStyle, AccountRecievableHeaderStyle } from '../../../Utils/Style'
import { ActionButtonColumnProps } from '../../../../Type/Components/TableTypes'
import { useGetWorkOrderInvoicesMutation } from '../../../../Services/MoorServe/MoorserveApi'
import { Params } from '../../../../Type/CommonType'
import { Toast } from 'primereact/toast'
import { useSelector } from 'react-redux'
import { selectCustomerId } from '../../../../Store/Slice/userSlice'

const BillingSection = ({ handleToggle, accordion }: BillingAccordianProps) => {
  const toast = useRef<Toast>(null)
  const selectedCustomerId = useSelector(selectCustomerId)
  const [workOrderDataInvoice, setWorkOrderDataInvoice] = useState<WorkOrderPayload[]>([])
  const [searchInvoice, setSearchInvoice] = useState('')
  const [pageNumberTwo, setPageNumberTwo] = useState(0)
  const [pageNumber2, setPageNumber2] = useState(0)
  const [pageSizeTwo, setPageSizeTwo] = useState(10)
  const [totalRecords, setTotalRecords] = useState<number>()
  const [totalRecordsInvoice, setTotalRecordsInvoice] = useState<number>()
  const [isLoading, setIsLoading] = useState(false)
  const [getWorkOrderInvoice] = useGetWorkOrderInvoicesMutation()

  const firstLastNameBottomSection = (data: any) => {
    if (
      data?.workOrderResponseDto?.customerResponseDto === null &&
      data?.workOrderResponseDto?.customerResponseDto === undefined
    )
      return '-'
    else if (
      data?.workOrderResponseDto?.customerResponseDto?.firstName === null &&
      data?.workOrderResponseDto?.customerResponseDto?.firstName === undefined
    )
      return '-'
    else
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
        id: 'workOrderResponseDto.workOrderNumber',
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
      // {
      //   color: 'black',
      //   label: 'Payments',
      //   filled: true,
      //   fontWeight: 400,
      //   // onClick: (row) => handleBottomSectionActionClick('Payments', row),
      // },
      // {
      //   color: 'black',
      //   label: 'Contact',
      //   filled: true,
      //   // onClick: (row) => handleBottomSectionActionClick('Contact', row),
      // },
      {
        color: 'black',
        label: 'View',
        filled: true,
        // onClick: (row) => handleBottomSectionActionClick('View', row),
      },
    ],
    headerStyle: {
      backgroundColor: '#FFFFFF',
      height: '3.50rem',
      fontSize: '14px',
      fontWeight: 700,
      color: '#000000',
    },
    style: { borderBottom: '1px solid #D5E1EA' },
  }

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
      className="tab relative bg-[#FFFFFF] border-[1px] border-[#D5E1EA] mr-8"
      style={{
        width: '450px',
        maxWidth: '450px',
        marginTop: '0px',
      }}>
      <label
        htmlFor="faq5"
        style={{ backgroundColor: '#10293A' }}
        className="cursor-pointer flex items-center justify-between h-14"
        onClick={() => handleToggle('faq6')}>
        <div className="flex items-center">
          <div style={{ flexShrink: 1 }}>
            <h1 className="p-3 text-white text-lg font-extrabold">{properties.billingHeader}</h1>
          </div>
        </div>
        <div>
          <div className="p-2">
            {accordion === 'faq6' ? (
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
        className={`content mt-5 transition-all ease-in-out duration-500 ${accordion === 'faq6' ? '' : 'hidden'}`}>
        <div
          className={`bg-#00426F overflow-x-hidden  table-container flex flex-col`}
          style={{ height: 'calc(100vh - 580px)' }}>
          <div className="flex-grow" style={{ overflow: 'auto' }}>
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default BillingSection
