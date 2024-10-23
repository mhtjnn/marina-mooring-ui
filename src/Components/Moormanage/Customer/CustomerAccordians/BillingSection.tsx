// import React from 'react'
import DataTableComponent from '../../../CommonComponent/Table/DataTableComponent'
import { Paginator } from 'primereact/paginator'
import { properties } from '../../../Utils/MeassageProperties'
import { MooringAccordianProps } from '../../../../Type/AccordianBasedTypes'

const MooringSection = ({
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
}: MooringAccordianProps) => (
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
      onClick={() => handleToggle('faq2')}>
      <div className="flex items-center gap-4 ">
        <div>
          <h1 className="p-4 text-white text-xl font-extrabold">{properties.mooringHeader}</h1>
        </div>
      </div>
      <div>
        <div className="mr-2">
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
            <img src="/assets/images/plus.png" alt="Key Icon" className="p-clickable" />
          )}
        </div>
      </div>
    </label>
    {/* Mooring Data Table */}
    <div
      className={`content transition-all ease-in-out duration-500 ${accordion === 'faq2' ? '' : 'hidden'}`}>
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
              style={{ height: 'calc(100vh - 600px)' }}>
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
                      <p className="text-gray-500 text-lg">{properties.noDataMessage}</p>
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
)

export default MooringSection
