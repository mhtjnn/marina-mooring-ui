import React, { useRef, useState } from 'react'
import InputComponent from '../../CommonComponent/InputComponent'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { useUploadFormMutation } from '../../../Services/MoorServe/MoorserveApi'
import { FaTrash } from 'react-icons/fa'
import { ErrorResponse, formUpload } from '../../../Type/ApiTypes'
import { FormDataProps } from '../../../Type/ComponentBasedType'

const AddForm: React.FC<FormDataProps> = ({ closeModal, getFormsData }) => {
  const [uploadForm] = useUploadFormMutation()
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState<number | null>(null)
  const [encodedFile, setEncodedFile] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [fieldsError, setFieldsError] = useState<{ [key: string]: string }>({})
  const toastRef = useRef<Toast>(null)
  const toast = useRef<Toast>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<any>({
    customerName: '',
    formName: '',
    uploadFile: '',
  })

  const validateFields = () => {
    const errors: { [key: string]: string } = {}
    if (!formData.formName) {
      errors.formName = 'Form Name is required'
    }
    setFieldsError(errors)
    return errors
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    })

    if (fieldsError[field]) {
      setFieldsError({
        ...fieldsError,
        [field]: '',
      })
    }
  }

  const encodeFileToBase64 = (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setEncodedFile(base64String)
    }
    reader.readAsDataURL(file)
  }

  const saveForm = async () => {
    const errors = validateFields()
    if (Object.keys(errors).length > 0) {
      setFieldsError(errors)
      return
    }
    if (!encodedFile) {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Upload file is required',
      })
      return
    }
    try {
      const payload = {
        formName: formData.formName,
        fileName: fileName,
        encodedFormData: encodedFile,
      }
      const response = await uploadForm(payload).unwrap()
      const { status, message } = response as formUpload
      if (status === 200 || status === 201) {
        toastRef.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: message,
          life: 3000,
        })
        closeModal()
        getFormsData()
      } else {
        toastRef?.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        })
      }
    } catch (error) {
      const { message, data } = error as ErrorResponse
      toastRef?.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: message || data?.message,
        life: 3000,
      })
    }
  }

  const handleClickUploadButton = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.type === 'application/pdf') {
        setUploadFile(file)
        setFileName(file.name)
        setFileSize(file.size)
        setFormData({ ...formData, uploadFile: file })
        setUploadStatus('success')
        setFieldsError({ ...fieldsError, uploadFile: '' })
        encodeFileToBase64(file)
        toastRef.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'File uploaded successfully!',
          life: 3000,
        })
      } else {
        setUploadFile(null)
        setFileName('')
        setFileSize(null)
        setUploadStatus('error')
        toastRef.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Only PDF files are allowed',
          life: 3000,
        })
      }
    }
  }

  const handleRemoveFile = () => {
    setUploadFile(null)
    setFileName('')
    setFileSize(null)
    setEncodedFile(null)
    setUploadStatus('idle')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <Toast ref={toastRef} />
      <Toast ref={toast} />

      <div className="ml-4">
        <div className="flex gap-6">
          <div>
            <span className="font-medium text-sm text-[#000000]">
              <div className="flex gap-1">
                Form Name
                <p className="text-red-600">*</p>
              </div>
            </span>
            <div className="mt-1">
              <InputComponent
                value={formData.formName}
                onChange={(e) => handleInputChange('formName', e.target.value)}
                style={{
                  width: '230px',
                  height: '32px',
                  border: fieldsError.formName ? '1px solid red' : '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.8rem',
                  paddingLeft: '0.5rem',
                }}
              />
              {fieldsError.formName && <small className="p-error">{fieldsError.formName}</small>}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <span className="font-medium text-sm text-[#000000]">
            <div className="flex gap-1">
              Upload File
              <p className="text-red-600">*</p>
            </div>
          </span>

          <div
            className="mt-2 flex justify-center items-center flex-col p-4"
            style={{
              width: '100%',
              height: '150px',
              border: '1px dashed #D5E1EA',
              borderRadius: '0.50rem',
              cursor: uploadStatus === 'success' ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={uploadStatus === 'idle' ? handleClickUploadButton : undefined}>
            {uploadStatus === 'idle' && (
              <div>
                <img
                  src="/assets/images/file.png"
                  alt="Upload Icon"
                  style={{
                    maxWidth: '50px',
                    maxHeight: '50px',
                    objectFit: 'contain',
                    marginLeft: '0.70rem',
                  }}
                />
                <p className="mt-2">Choose file</p>
              </div>
            )}
            {uploadStatus === 'success' && uploadFile && (
              <div>
                <div>
                  <label>
                    <strong>File Name:</strong>
                    <input
                      type="text"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      style={{
                        marginLeft: '10px',
                        padding: '5px',
                        border: '1px solid #D5E1EA',
                        borderRadius: '4px',
                      }}
                    />
                  </label>
                </div>
                <p>
                  <strong>File Size:</strong> {Math.round(fileSize! / 1024)} KB
                </p>
                <button
                  className="mt-2 text-red-600 flex items-center"
                  onClick={handleRemoveFile}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                  <FaTrash className="mr-2" />
                  Remove File
                </button>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: 'none' }}
            onChange={handleFileChange}
            accept=".pdf"
          />
        </div>

        <div
          className="flex gap-6 bottom-2 absolute left-7"
          style={{
            width: '100%',
            height: '80px',
            backgroundColor: 'white',
            padding: '0 12px',
            bottom: '0px',
          }}>
          <Button
            onClick={saveForm}
            label={'Save'}
            style={{
              width: '100px',
              height: '42px',
              border: 'none',
              backgroundColor: '#007bff',
              color: 'white',
              borderRadius: '0.50rem',
              marginTop: '10px',
            }}
          />
          <Button
            onClick={() => {
              closeModal()
            }}
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
    </>
  )
}

export default AddForm
