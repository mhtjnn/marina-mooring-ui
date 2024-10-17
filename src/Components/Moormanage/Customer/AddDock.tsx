import React from 'react';
import { AddDockProps } from '../../../Type/ComponentBasedType';



const AddDock: React.FC<AddDockProps> = ({ checkedDock, setCheckedDock, editCustomerMode }) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedDock(e.target.checked ?? false);
  };

  return (
    <div className={`flex gap-4 mt-1 ${editCustomerMode ? '!mb-14' : ''}`}>
      <label className="custom-checkbox-container">
        <input
          type="checkbox"
          onChange={handleCheckboxChange}
          checked={checkedDock}
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
      <p className="font-medium text-lg text-[#000000] mt-5 ml-[14px]">Add Dock</p>
    </div>
  );
};

export default AddDock;
