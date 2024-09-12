import React, { useMemo } from 'react'
import DataTableComponent from '../../CommonComponent/Table/DataTableComponent'
import { ProgressSpinner } from 'primereact/progressspinner'
import { properties } from '../../Utils/MeassageProperties'
import { Paginator } from 'primereact/paginator'
import { FaEdit } from 'react-icons/fa'
import { RiDeleteBin5Fill } from 'react-icons/ri'

interface ActionButtonColumnProps {
  header: string
  buttons: Array<{
    color: string
    label: string
    onClick: (data: any) => void
    underline: boolean
    style: React.CSSProperties
  }>
  headerStyle: React.CSSProperties
  style: React.CSSProperties
}

interface CustomerDataTableProps {
  rightContainerWidth: boolean
  setRightContainerWidth: (width: boolean) => void
  customerRecordData?: any[] | object
  CustomerDetails?: React.ReactNode
  isLoader?: boolean
  handleToggle: (accordionId: string) => void
  accordion?: string
  mooringData?: any[]
  MooringTableColumn?: any[]
  handleMooringTableRowClick?: any
  setSelectedMooring?: any
  selectedMooring?: any
  pageNumber2?: number
  pageSizeTwo?: number
  totalRecordsTwo?: number
  onPageChangeTwo?: (event: any) => void
  customerImage?: any[]
  customerImagesColumns?: any[]
  actionButtons?: ActionButtonColumnProps
  ActionButtonColumn?: any
  selectedCustomer?: any
  handleEdit?: () => void
  handleDelete?: any
}

const CustomerDataTable: React.FC<CustomerDataTableProps> = ({
  rightContainerWidth,
  setRightContainerWidth,
  selectedCustomer,
  customerRecordData,
  CustomerDetails,
  isLoader,
  handleToggle,
  accordion,
  mooringData,
  MooringTableColumn,
  handleMooringTableRowClick,
  setSelectedMooring,
  selectedMooring,
  pageNumber2,
  pageSizeTwo,
  totalRecordsTwo,
  onPageChangeTwo,
  customerImage,
  customerImagesColumns,
  ActionButtonColumn,
  handleEdit,
  handleDelete,
}) => {
  const CustomerRecordHeader = useMemo(() => {
    return (
      <div className="bg-[#10293A] rounded-t-[10px] flex justify-between">
        <div className="text-sm font-semibold rounded-t-md">
          <h1 className="p-3 text-white text-lg font-extrabold">{properties.customerRecord}</h1>
        </div>
        <div className="flex">
          <>
            <FaEdit
              onClick={handleEdit}
              className="mr-3 mt-[19px] text-[white]"
              data-testid="FaEdit"
              style={{ cursor: 'pointer' }}
            />
            <RiDeleteBin5Fill
              onClick={handleDelete}
              className="text-white mr-2 mt-[19px] "
              data-testid="RiDeleteBin5Fill"
              style={{ cursor: 'pointer' }}
            />
          </>

          <div
            className="p-1 mt-[20px]"
            onClick={() => setRightContainerWidth(true)}
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
      </div>
    )
  }, [selectedCustomer, customerRecordData])

  return (
    <>
      <div>
        {rightContainerWidth ? (
          <div
            style={{
              height: '700px',
              minHeight: '700px',
              width: '40px',
              minWidth: '40px',
              backgroundColor: '#10293A',
            }}
            className="rounded-md ml-[20px] mr-[20px]">
            <div
              className="p-3"
              onClick={() => setRightContainerWidth(false)}
              style={{ cursor: 'pointer' }}>
              <img src="/assets/images/plus.png" alt="Key Icon" className="p-clickable" />
            </div>
            <div
              style={{
                writingMode: 'vertical-rl',
                textAlign: 'center',
                color: 'white',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // transform: 'rotate(180deg)',
                fontSize: '20px',
                letterSpacing: '4px',
              }}
              className="pb-24 pl-2">
              Customer Details
            </div>
          </div>
        ) : (
          <div className="ml-5 mr-4">
            {/* Left Panel - Customer Record */}
            <div
              style={{
                maxWidth: '450px',
                width: '450px',
              }}
              className="flex-grow border bg-white">
              {CustomerRecordHeader}
              <div style={{ border: '1px solid white', height: '180px', overflowY: 'scroll' }}>
                {customerRecordData ? (
                  CustomerDetails
                ) : (
                  <div className="text-center mt-10">
                    <>
                      <img
                        src="/assets/images/empty.png"
                        alt="Empty Data"
                        className="w-20 mx-auto mb-2"
                      />
                      <p className="text-gray-800 text-lg">{properties.noDataMessage}</p>
                    </>
                  </div>
                )}
              </div>
            </div>

            {isLoader && (
              <ProgressSpinner
                style={{
                  position: 'absolute',
                  top: '40%',
                  left: '85%',
                  transform: 'translate(-50%, -50%)',
                  width: '50px',
                  height: '50px',
                }}
                strokeWidth="4"
              />
            )}

            <div style={{ width: '450px' }} className="flex  flex-col wrapper">
              <div
                className=" relative  bg-white border-[1px] border-[#D5E1EA] mr-8"
                style={{
                  width: '450px',
                  maxWidth: '450px',
                  marginBottom: '0px',
                }}>
                <label
                  style={{ backgroundColor: '#10293A' }}
                  htmlFor="faq1"
                  className="cursor-pointer flex items-center justify-between h-14"
                  onClick={() => handleToggle('faq1')}>
                  <div className="flex items-center gap-4 ">
                    <div>
                      <h1 className="p-3 text-white text-lg font-extrabold">
                        {properties.mooringHeader}
                      </h1>
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
                <div
                  className={`content  transition-all ease-in-out duration-500 ${accordion === 'faq1' ? '' : 'hidden'}`}>
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
                          className={`bg-#00426F overflow-x-hidden h-[320px]  table-container flex flex-col`}>
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
                              data={mooringData}
                              columns={MooringTableColumn}
                              onRowClick={(rowData) => {
                                handleMooringTableRowClick(rowData)
                              }}
                              selectionMode="single"
                              onSelectionChange={(e) => {
                                setSelectedMooring(e.value)
                              }}
                              selection={selectedMooring}
                              dataKey="id"
                              rowStyle={(rowData: any) => rowData}
                              emptyMessage={
                                <div className="text-center mt-10">
                                  <img
                                    src="/assets/images/empty.png"
                                    alt="Empty Data"
                                    className="w-20 mx-auto mb-2"
                                  />
                                  <p className="text-gray-500 text-lg">
                                    {properties.noDataMessage}
                                  </p>
                                </div>
                              }
                            />
                          </div>
                          <Paginator
                            first={pageNumber2}
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
                  style={{ backgroundColor: '#10293A' }}
                  className="cursor-pointer flex items-center justify-between h-14"
                  onClick={() => handleToggle('faq2')}>
                  <div className="flex items-center">
                    <div style={{ flexShrink: 1 }}>
                      <h1 className="p-3 text-white text-lg font-extrabold">
                        {properties.imageHeader}
                      </h1>
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
                <div
                  className={`content mt-5 transition-all ease-in-out duration-500 ${accordion === 'faq2' ? '' : 'hidden'}`}>
                  <div
                    className={`bg-#00426F overflow-x-hidden h-[330px] table-container flex flex-col`}>
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
                        data={customerImage}
                        columns={customerImagesColumns}
                        selectionMode="single"
                        actionButtons={ActionButtonColumn}
                        selection={selectedMooring}
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
        )}
      </div>
    </>
  )
}

export default CustomerDataTable
