import React from 'react'
import { AddMooringProps, AddMooringPropss } from '../../../Type/ComponentBasedType'
const AddMooringInCustomer: React.FC<AddMooringPropss> = ({
  checkedMooring,
  setCheckedMooring,
}) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedMooring(e.target.checked ?? false)
  }
  return (
    <div className="flex gap-4 mt-4">
      <label className="custom-checkbox-container">
        <input
          type="checkbox"
          onChange={handleCheckboxChange}
          checked={checkedMooring}
          className="custom-checkbox-input"
          style={{
            border: '1px solid #D5E1EA',
            height: '22px',
            width: '22px',
            borderRadius: '5px',
          }}
        />
        <span className="custom-checkbox"></span>
      </label>
      <p className="font-medium text-lg text-[#000000] ml-4">Mooring Information</p>
    </div>
  )
}

export default AddMooringInCustomer
