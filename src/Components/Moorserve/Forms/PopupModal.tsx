import React, { useState } from 'react'
import { Dialog } from 'primereact/dialog' // For modal
import { Chips } from 'primereact/chips' // For displaying chips
import { InputText } from 'primereact/inputtext' // For input field
import { Button } from 'primereact/button'

interface PopupModalProps {
  mooringResponse: { boatName: string; mooringNumber: string; serviceArea: string } // Example data structure
  visible: boolean
  onHide: () => void
}

const PopupModal: React.FC<PopupModalProps> = ({ mooringResponse, visible, onHide }) => {
  const [selectedValue, setSelectedValue] = useState<string>('') // State to hold selected value

  // Handle chip selection and fill the input automatically
  const handleChipClick = (value: string) => {
    setSelectedValue(value) // Fill the input field with the selected chip value
  }

  return (
    <Dialog
      header="Select Mooring Info"
      visible={visible}
      onHide={onHide}
      style={{ width: '400px' }}>
      <div className="p-field">
        <label htmlFor="boatName">Boat Name</label>
        <Chips
          value={[]} // Empty chips, as you want to use chips to show selectable values
          itemTemplate={() => (
            <Button
              label={mooringResponse.boatName}
              className="p-chip"
              onClick={() => handleChipClick(mooringResponse.boatName)}
            />
          )}
        />
      </div>
      <div className="p-field">
        <label htmlFor="mooringNumber">Mooring Number</label>
        <Chips
          value={[]}
          itemTemplate={() => (
            <Button
              label={mooringResponse.mooringNumber}
              className="p-chip"
              onClick={() => handleChipClick(mooringResponse.mooringNumber)}
            />
          )}
        />
      </div>
      <div className="p-field">
        <label htmlFor="serviceArea">Service Area</label>
        <Chips
          value={[]}
          itemTemplate={() => (
            <Button
              label={mooringResponse.serviceArea}
              className="p-chip"
              onClick={() => handleChipClick(mooringResponse.serviceArea)}
            />
          )}
        />
      </div>
      <div className="p-field">
        <label htmlFor="selectedInput">Selected Value</label>
        <InputText
          id="selectedInput"
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)}
        />
      </div>
      <Button
        label="Add"
        icon="pi pi-check"
        onClick={() => console.log('Added value:', selectedValue)}
      />
    </Dialog>
  )
}

export default PopupModal
