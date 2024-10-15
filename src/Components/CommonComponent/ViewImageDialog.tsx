import React, { useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { ViewImageProps } from '../../Type/ComponentBasedType'

const ViewImageDialog: React.FC<ViewImageProps> = ({
  imageVisible,
  setImageVisible,
  showImage,
}) => {
  const [scale, setScale] = useState(1)

  const handleZoomIn = () => {
    setScale((prevScale) => prevScale + 0.1)
  }

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.1))
  }

  const ButtonStyle = {
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    padding: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }

  return (
    <Dialog
      position="center"
      style={{
        width: '80vw',
        minWidth: '300px',
        height: '80vh',
        borderRadius: '1rem',
        fontWeight: '400',
        display: 'flex',
      }}
      draggable={false}
      visible={imageVisible}
      onHide={() => {
        setImageVisible(false)
        setScale(1)
      }}
      headerStyle={{ cursor: 'alias' }}
      header="">
      <div
        style={{
          display: 'flex',
          height: '100%',
        }}>
        {/* Sidebar for zoom controls */}
        <div
          style={{
            width: '60px',
            backgroundColor: '#f4f4f4',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
            borderRight: '1px solid #ddd',
          }}>
          <button onClick={handleZoomIn} style={ButtonStyle}>
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="12" fill="black" />
              <path
                d="M12 5v14M5 12h14"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button onClick={handleZoomOut} style={ButtonStyle}>
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="12" fill="black" />
              <path
                d="M5 12h14"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Image viewing area */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            overflow: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px',
          }}>
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'center',
              transition: 'transform 0.2s',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <img
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                display: 'block',
              }}
              src={`data:image/jpeg;base64,${showImage.imageData}`}
            />
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default ViewImageDialog
