// src/components/Common/CustomModal.tsx
import React from 'react'
import { Dialog } from 'primereact/dialog'
import { PopUpCustomModalProps } from '../../Type/ComponentBasedType'

const PopUpCustomModal: React.FC<PopUpCustomModalProps> = ({
  visible,
  header,
  onHide,
  children,
  style,
}) => {
  return (
    <div className="card flex justify-content-center">
      <Dialog
        position="center"
        style={{
          ...style,
          borderRadius: '1rem',
          fontWeight: '400',
          cursor: 'alias',
        }}
        draggable={false}
        headerStyle={{ cursor: 'alias' }}
        visible={visible}
        onHide={onHide}
        header={header}
        modal={false}
        className="custom-modal">
        {children}
      </Dialog>
    </div>
  )
}

export default PopUpCustomModal
