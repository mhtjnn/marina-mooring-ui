import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import React, { useRef } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { FaFileUpload } from 'react-icons/fa'
import { ShowImagesProps } from '../../Type/ComponentBasedType'
import { Toast } from 'primereact/toast'

const UploadImages: React.FC<ShowImagesProps> = ({
  handleNoteChange,
  hoveredIndex,
  handleRemoveImage,
  setHoveredIndex,
  handleImageChange,
  setImageVisible,
  imageRequestDtoList,
  isLoading,
  images,
  toastRef,
}) => {
  return (
    <div>
      <Toast ref={toastRef} />
      <div className={`ml-4`} style={{ marginBottom: '60px' }}>
        <div className="flex justify-center text-center">
          <div className="mt-6">
            <input
              id="file-input"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              style={{
                display: 'none',
              }}
            />
            <label
              htmlFor="file-input"
              style={{
                width: '300px',
                height: '40px',
                border: '2px solid #0098FF',
                borderRadius: '0.50rem',
                fontSize: '0.8rem',
                paddingLeft: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
              <FaFileUpload
                style={{
                  fontSize: '29px',
                  color: '#0098FF',
                  marginLeft: '1rem',
                  marginTop: '3px',
                }}
              />
              <div className="border-r-2 border-sky-500  h-9 pl-3"></div>
              <span className="pl-10 mt-1">UPLOAD IMAGES</span>
            </label>
          </div>
        </div>

        <div style={{ marginTop: '40px' }}>
          {images.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-16 flex-wrap">
                {images?.map((image: string | undefined, index: number) => (
                  <div
                    key={index}
                    style={{ position: 'relative', display: 'inline-block' }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}>
                    <AiOutlineDelete
                      onClick={() => handleRemoveImage(index)}
                      style={{
                        position: 'absolute',
                        top: '165px',
                        right: '5px',
                        background: 'red',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        width: '28px',
                        height: '25px',
                        cursor: 'pointer',
                        opacity: hoveredIndex === index ? 1 : 0,
                        transition: 'opacity 0.3s',
                      }}
                    />
                    <img
                      src={image}
                      alt={`Uploaded ${index}`}
                      style={{
                        width: '300px',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '0.5rem',
                        boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                      }}
                    />
                    <div className="mt-2">
                      <InputText
                        value={imageRequestDtoList[index]?.note || ''}
                        onChange={(e) => handleNoteChange(index, e.target.value)}
                        placeholder="Add note"
                        style={{
                          width: '300px',
                          height: '40px',
                          border: '1px solid #D5E1EA',
                          borderRadius: '0.50rem',
                          fontSize: '0.8rem',
                          boxShadow: 'none',
                          paddingLeft: '0.5rem',
                          color: 'black',
                          resize: 'none',
                          marginTop: '10px',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className={`flex gap-4 ml-4 absolute bottom-0 left-0 right-0 `}
        style={{ padding: '16px', backgroundColor: 'white' }}>
        <Button
          label={'Close'}
          onClick={() => setImageVisible(false)}
          style={{
            width: '89px',
            height: '42px',
            backgroundColor: '#0098FF',
            cursor: 'pointer',
            fontWeight: 'bolder',
            fontSize: '1rem',
            boxShadow: 'none',
            color: 'white',
            borderRadius: '0.5rem',
          }}
        />
      </div>
    </div>
  )
}

export default UploadImages
