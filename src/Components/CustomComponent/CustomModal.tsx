import React, { useState } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'

export const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: "''",
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.white',
  borderRadius: '25px',
  p: 3,
  maxHeight: '90vh',
  overflowY: 'auto',
}
interface CustomModalProps {
  onClick: () => void
  visible: boolean
  style?: React.CSSProperties
  onHide: () => void
  children?: React.ReactNode
  header?: React.ReactNode
  label?: string
  icon?: boolean
}

const CustomModal: React.FC<CustomModalProps> = ({
  onClick,
  visible,
  style,
  onHide,
  children,
  header,
  label,
  icon,
}) => {
  const [internalVisible, setInternalVisible] = useState<boolean>(false)

  return (
    <>
      <div className="flex gap-4">
        <Button
          onClick={() => {
            setInternalVisible(true)
          }}
          className="shadow-none"
          style={style}>
          {!icon && (
            <img
              src="/assets/images/plus.png"
              alt="icon"
              className="w-4 ml-3 mr-3"
              style={{
                filter: 'invert(100%)',
                color: 'white',
                fontWeight: 'bolder',
              }}
            />
          )}
          {label ? label : 'ADD NEW'}
        </Button>

        <Dialog
          header={header}
          visible={visible || internalVisible}
          style={{
            width: '60vw',
            // height: '100vh',
            borderRadius: '1rem',
            maxHeight: '95% !important'
          }}
          onHide={() => {
            onHide()
            setInternalVisible(false)
          }}>
          {children}
        </Dialog>
      </div>
    </>
  )
}

export default CustomModal
