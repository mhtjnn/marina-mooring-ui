import React from 'react'
import { viewImageProp } from '../../Type/CommonType'

const ViewImage: React.FC<viewImageProp> = ({ handleZoomOut, handleZoomIn, scale, showImage }) => {
  const modernButtonStyle = {
    width: '40px',
    height: '40px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0',
    borderRadius: '50%',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
  }
  return (
    <div>
      <div>
        <hr className="border border-[#000000] my-0 mx-0"></hr>
      </div>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '90%',
          overflow: 'auto',
        }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}>
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              transition: 'transform 0.2s',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <img
              style={{
                width: 'auto',
                height: 'auto',
                maxWidth: '100%',
                maxHeight: '100%',
                display: 'block',
              }}
              src={`data:image/jpeg;base64,${showImage.imageData}`}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: '85px',
          right: '40px',
          display: 'flex',
          gap: '10px',
        }}>
        <button onClick={handleZoomIn} style={modernButtonStyle}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#007bff" />
            <path
              d="M12 5v14M5 12h14"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button onClick={handleZoomOut} style={modernButtonStyle}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#007bff" />
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
    </div>
  )
}

export default ViewImage
