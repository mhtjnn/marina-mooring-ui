import React from 'react'
import DataTableComponent from '../../../CommonComponent/Table/DataTableComponent'
import { properties } from '../../../Utils/MeassageProperties'
import { ImagesAccordianProps } from '../../../../Type/AccordianBasedTypes'

const ImagesSection = ({
  accordion,
  handleToggle,
  customerImage,
  customerImagesColumns,
  ActionButtonColumn,
  selectedMooring,
}: ImagesAccordianProps) => (
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
      onClick={() => handleToggle('faq3')}>
      <div className="flex items-center">
        <div style={{ flexShrink: 1 }}>
          <h1 className="p-3 text-white text-lg font-extrabold">{properties.imageHeader}</h1>
        </div>
      </div>
      <div>
        <div className="p-2">
          {accordion === 'faq3' ? (
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
            <img src="/assets/images/plus.png" alt="Key Icon" className="p-clickable" style={{}} />
          )}
        </div>
      </div>
    </label>
    <div
      className={`content mt-5 transition-all ease-in-out duration-500 ${accordion === 'faq3' ? '' : 'hidden'}`}>
      <div
        className={`bg-#00426F overflow-x-hidden  table-container flex flex-col`}
        style={{ height: 'calc(100vh - 580px)' }}>
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
)

export default ImagesSection
