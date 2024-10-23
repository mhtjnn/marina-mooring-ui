import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useGetCustomerMutation } from '../../../Services/MoorManage/MoormanageApi'
import { CustomerResponse, ErrorResponse } from '../../../Type/ApiTypes'
import { Toast } from 'primereact/toast'
import { FormFillProps } from '../../../Type/ComponentBasedType'
import { ProgressSpinner } from 'primereact/progressspinner'

const FormFill: React.FC<FormFillProps> = ({ formOpen }) => {
  const [getCustomer] = useGetCustomerMutation()

  const [isLoading, setIsLoading] = useState(true)
  const [customerData, setCustomerData] = useState<any[]>([])
  const [fieldsError, setFieldsError] = useState<{ [key: string]: string }>({})
  const toast = useRef<Toast>(null)
  const [formData, setFormData] = useState<any>({
    customerName: '',
    form: '',
    mooring: '',
  })

  const validateFields = () => {
    const errors: { [key: string]: string } = {}

    if (!formData.form) {
      errors.form = 'Form is required'
    }

    if (!formData.customerName) {
      errors.customerName = 'Customer Name is required'
    }

    if (!formData.mooring) {
      errors.mooring = 'Mooring is required'
    }

    setFieldsError(errors)
    return errors
  }

  const getCustomerData = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await getCustomer({}).unwrap()
      const { status, content, message, totalSize } = response as CustomerResponse
      if (status === 200 && Array.isArray(content)) {
        if (content?.length > 0) {
          setIsLoading(false)
          const extractedData = content.map((item) => {
            const fullname = `${item?.firstName} ${item?.lastName}`
            return {
              label: fullname,
              id: item?.id,
            }
          })
          setCustomerData(extractedData)
        } else {
          setIsLoading(false)

          setCustomerData([])
        }
      } else {
        setIsLoading(false)
        toast?.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        })
      }
    } catch (error) {
      setIsLoading(false)
      const { message: msg } = error as ErrorResponse
      console.error('Error occurred while fetching customer data:', msg)
    }
  }, [getCustomer])

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

  const saveForm = () => {
    const errors = validateFields()
    if (Object.keys(errors).length > 0) {
      setFieldsError(errors)
      Object.values(errors).forEach((message) => {
        toast.current?.show({ severity: 'error', summary: 'Validation Error', detail: message })
      })
      return
    }

    toast.current?.show({
      severity: 'success',
      summary: 'Success',
      detail: 'Form saved successfully!',
    })
  }

  useEffect(() => {
    getCustomerData()
  }, [getCustomerData])

  return (
    <>
      <div className={`"w-full h-full ml-4" ${isLoading ? 'blurred' : ''}`}>
        <div className="flex gap-6">
          <div>
            <span className="font-medium text-sm text-[#000000]">
              <div className="flex gap-1">
                Form
                <p className="text-red-600">*</p>
              </div>
            </span>
            <div className="mt-1">
              <Dropdown
                // value={formData.customerName}
                onChange={(e) => handleInputChange('form', e.value)}
                options={[]}
                optionLabel="label"
                disabled={isLoading}
                style={{
                  width: '230px',
                  height: '32px',
                  border: fieldsError.form ? '1px solid red' : '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.8rem',
                  paddingLeft: '0.5rem',
                }}
              />
              <p className="" id="form">
                {fieldsError.form && <small className="p-error">{fieldsError.form}</small>}
              </p>
            </div>
          </div>
          <div>
            <span className="font-medium text-sm text-[#000000]">
              <div className="flex gap-1">
                Customer
                <p className="text-red-600">*</p>
              </div>
            </span>
            <div className="mt-1">
              <Dropdown
                value={formData.customerName}
                onChange={(e) => handleInputChange('customerName', e.value)}
                options={customerData}
                optionLabel="label"
                disabled={isLoading}
                style={{
                  width: '230px',
                  height: '32px',
                  border: fieldsError.customerName ? '1px solid red' : '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.8rem',
                  paddingLeft: '0.5rem',
                }}
              />
              <p className="" id="customerName">
                {fieldsError.customerName && (
                  <small className="p-error">{fieldsError.customerName}</small>
                )}
              </p>
            </div>
          </div>

          {isLoading && (
            <ProgressSpinner
              style={{
                position: 'absolute',
                top: '40%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '50px',
                height: '50px',
              }}
              strokeWidth="4"
            />
          )}

          <div>
            <span className="font-medium text-sm text-[#000000]">
              <div className="flex gap-1">
                Mooring
                <p className="text-red-600">*</p>
              </div>
            </span>
            <div className="mt-1">
              <Dropdown
                // value={formData.mooring}
                onChange={(e) => handleInputChange('mooring', e.value)}
                options={[]}
                optionLabel="label"
                disabled={isLoading}
                style={{
                  width: '230px',
                  height: '32px',
                  border: fieldsError.mooring ? '1px solid red' : '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.8rem',
                  paddingLeft: '0.5rem',
                }}
              />
              <p className="" id="mooringName">
                {fieldsError.mooring && <small className="p-error">{fieldsError.mooring}</small>}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`"flex gap-6 bottom-2 absolute left-6" ${isLoading ? 'blurred' : ''}`}
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
            width: '89px',
            height: '42px',
            backgroundColor: '#0098FF',
            cursor: 'pointer',
            fontWeight: 'bolder',
            fontSize: '14px',
            boxShadow: 'none',
            color: 'white',
            borderRadius: '0.50rem',
            marginTop: '1rem',
          }}
        />
        <Button
          onClick={() => {
            formOpen()
          }}
          label={'Back'}
          text={true}
          style={{
            backgroundColor: 'white',
            color: '#000000',
            border: 'none',
            width: '89px',
            fontSize: '14px',
            height: '42px',
            fontWeight: '500',
            marginTop: '1rem',
          }}
        />
      </div>
    </>
  )
}

export default FormFill
