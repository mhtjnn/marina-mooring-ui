import React from 'react'
import DataTableComponent from '../../../CommonComponent/Table/DataTableComponent'
import { AccordianProps } from '../../../../Type/ComponentBasedType'

const NotesSection = ({
  properties,
  accordion,
  handleToggle,
  workOrderData,
  workOrderColumns,
}: AccordianProps) => (
  <div
    className="tab relative bg-[#FFFFFF] border-[1px] border-[#D5E1EA] mr-8"
    style={{ width: '450px' }}>
    <label
      style={{ backgroundColor: '#10293A' }}
      className="cursor-pointer flex items-center justify-between h-14"
      onClick={() => handleToggle('faq4')}>
      <h1 className="p-4 text-white text-xl font-extrabold">{properties.workOrderHeader}</h1>
      {/* Toggle Icon */}
      <div className="p-2">
        {accordion === 'faq4' ? (
          <svg width="24" height="4" viewBox="0 0 11 3" fill="none">
            <path
              d="M10.125 1.5C10.125 1.92188 9.77344 2.25 9.375 2.25H1.125C0.703125 2.25 0.375 1.92188 0.375 1.5C0.375 1.10156 0.703125 0.75 1.125 0.75H9.375C9.77344 0.75 10.125 1.10156 10.125 1.5Z"
              fill="white"
            />
          </svg>
        ) : (
          <img src="/assets/images/plus.png" alt="Key Icon" className="p-clickable" />
        )}
      </div>
    </label>
    <div
      className={`content mt-5 transition-all ease-in-out duration-500 ${accordion === 'faq4' ? '' : 'hidden'}`}>
      <DataTableComponent
        data={workOrderData}
        columns={workOrderColumns}
        // Add other props as needed
      />
    </div>
  </div>
)

export default NotesSection
