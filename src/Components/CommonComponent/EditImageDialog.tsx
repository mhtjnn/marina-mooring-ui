import React from 'react'
import { Dialog } from 'primereact/dialog'
import { EditImageProps } from '../../Type/ComponentBasedType'
import AddImage from '../Moormanage/Customer/AddImage'

const EditImageDialog: React.FC<EditImageProps> = ({
  imageEditVisible,
  setImageEditVisible,
  imageData,
  customerId,
  entity,
  handleModalClose,
  getCustomersWithMooring,
}) => {
  return (
    <Dialog
      position="center"
      style={{
        width: '700px',
        height: '400px',
        borderRadius: '1rem',
      }}
      draggable={false}
      visible={imageEditVisible}
      onHide={() => {
        setImageEditVisible(false)
      }}
      headerStyle={{ cursor: 'alias' }}
      header="Image Information">
      <AddImage
        imageData={imageData}
        entityId={customerId}
        entity={entity}
        closeModal={handleModalClose}
        getCustomersWithMooring={() => {
          if (customerId) {
            getCustomersWithMooring()
          }
        }}
      />
    </Dialog>
  )
}

export default EditImageDialog
