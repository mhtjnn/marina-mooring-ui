import { Button } from 'primereact/button'
import React, { useRef, useState } from 'react'
import InputComponent from '../../CommonComponent/InputComponent'
import { InputText } from 'primereact/inputtext'
import { ImageDataProps } from '../../../Type/CommonType'
import { useUpdateImageMutation } from '../../../Services/MoorManage/MoormanageApi'
import { CustomerResponse, ErrorResponse } from '../../../Type/ApiTypes'
import { Toast } from 'primereact/toast'
import { ProgressSpinner } from 'primereact/progressspinner'

const AddImage: React.FC<ImageDataProps> = ({
  imageData,
  entityId,
  entity,
  closeModal,
  getCustomersWithMooring,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [imageName, setImageName] = useState(imageData?.imageName)
  const [note, setNote] = useState(imageData?.note)
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})
  const [editImage] = useUpdateImageMutation()
  const toastRef = useRef<Toast>(null)

  const validateFields = () => {
    let firstError = ''
    const errors: { [key: string]: string } = {}

    if (!imageName) {
      errors.imageName = 'Image name is required'
      if (!firstError) firstError = 'imageName'
    }
    if (!note) {
      errors.note = 'Note is required'
      if (!firstError) firstError = 'note'
    }
    setFieldErrors(errors)
    return errors
  }

  const handleInputChange = (field: string, value: string) => {
    if (field === 'imageName') {
      setImageName(value)
    } else if (field === 'note') {
      setNote(value)
    }

    if (fieldErrors[field]) {
      setFieldErrors({
        ...fieldErrors,
        [field]: '',
      })
    }
  }

  const handleSubmit = async () => {
    const errors = validateFields()
    if (Object.keys(errors).length > 0) {
      return
    }
    try {
      setIsLoading(true)
      const editImagePayload = {
        imageName: imageName,
        note: note,
      }
      const response = await editImage({
        payload: editImagePayload,
        id: imageData?.id,
        entity: entity,
        entityId: entityId,
      }).unwrap()
      const { status, message } = response as CustomerResponse
      if (status === 200 || status === 201) {
        setIsLoading(false)
        toastRef?.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: message,
          life: 3000,
        })
        closeModal()
        getCustomersWithMooring()
      } else {
        setIsLoading(false)
        toastRef?.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        })
      }
    } catch (error) {
      const { message, data } = error as ErrorResponse
      setIsLoading(false)
      toastRef?.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: message || data?.message,
        life: 3000,
      })
    }
  }

  return (
    <div>
      <Toast ref={toastRef} />
      <div className={isLoading ? 'blurred' : ''}>
        <div>
          <div className="mt-5 ml-3">
            <div className="ml-1 text-black font-semibold text-sm">
              <span style={{ fontWeight: '400', fontSize: '14px', color: '#000000' }}>
                <div className="flex gap-1">
                  Image Name
                  <p className="text-red-600">*</p>
                </div>
              </span>
            </div>
            <div className="mt-2">
              <InputText
                value={imageName}
                onChange={(e) => handleInputChange('imageName', e.target.value)}
                type="text"
                style={{
                  width: '230px',
                  height: '32px',
                  borderRadius: '0.50rem',
                  fontSize: '0.70rem',
                  padding: '1em',
                  border: fieldErrors.imageName ? '1px solid red' : '1px solid #D5E1EA',
                }}
              />
            </div>
            {fieldErrors.imageName && (
              <small className="p-error" style={{ color: 'red' }}>
                {fieldErrors.imageName}
              </small>
            )}
          </div>
        </div>
        {isLoading && (
          <ProgressSpinner
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '50px',
              height: '50px',
            }}
            strokeWidth="4"
          />
        )}
        <div className="py-3 pl-3 mb-20 mt-4 rounded-lg" style={{ height: '90px' }}>
          <div className="flex">
            <div className="mt-2 mr-12">
              <div className="">
                <span style={{ fontWeight: '400', fontSize: '14px' }}>
                  <div className="flex gap-1">
                    Note
                    <p className="text-red-600">*</p>
                  </div>
                </span>
              </div>
              <div className="mt-1">
                <InputComponent
                  value={note}
                  onChange={(e) => handleInputChange('note', e.target.value)}
                  style={{
                    width: '600px',
                    height: '50px',
                    borderRadius: '0.50rem',
                    fontSize: '0.70rem',
                    boxShadow: 'none',
                    padding: '10px',
                    border: fieldErrors.note ? '1px solid red' : '1px solid #D5E1EA',
                  }}
                />
                {fieldErrors.note && (
                  <small className="p-error" style={{ color: 'red' }}>
                    {fieldErrors.note}
                  </small>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`flex gap-6 absolute left-6 ${isLoading ? 'blurred' : ''}`}
        style={{
          width: '100%',
          height: '80px',
          backgroundColor: 'white',
          padding: '0 12px',
          bottom: '0px',
        }}>
        <Button
          onClick={handleSubmit}
          label={'Save'}
          style={{
            width: '89px',
            height: '42px',
            backgroundColor: '#0098FF',
            cursor: 'pointer',
            fontWeight: 'bolder',
            fontSize: '1rem',
            boxShadow: 'none',
            color: 'white',
            borderRadius: '0.50rem',
            marginTop: '10px',
          }}
        />
        <Button
          onClick={closeModal}
          label={'Back'}
          text={true}
          style={{
            backgroundColor: 'white',
            color: '#000000',
            border: 'none',
            width: '89px',
            height: '42px',
            marginTop: '10px',
          }}
        />
      </div>
    </div>
  )
}

export default AddImage
