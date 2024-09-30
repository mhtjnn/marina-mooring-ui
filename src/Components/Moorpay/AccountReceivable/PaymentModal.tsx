import React, { useCallback, useEffect, useRef, useState } from 'react'
import { PaymentModalProps } from '../../../Type/ComponentBasedType'
import InputComponent from '../../CommonComponent/InputComponent'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { useSavePaymentMutation } from '../../../Services/MoorServe/MoorserveApi'
import { Toast } from 'primereact/toast'
import { ErrorResponse, SaveUserResponse } from '../../../Type/ApiTypes'
import { PaymentOptionType } from '../../CommonComponent/MetaDataComponent/MetaDataApi'
import { ProgressSpinner } from 'primereact/progressspinner'

const PaymentModal: React.FC<PaymentModalProps> = ({ onHide, workOrderInvoiceId }) => {
  const [amount, setAmount] = useState<any>()
  const [paymentOption, setPaymentOption] = useState<any>()
  const [paymentOptionTypes, setPaymentOptionTypes] = useState<any>()
  const [isLoading, setIsLoading] = useState(true)
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})
  const [savePayment] = useSavePaymentMutation()
  const { getPaymentOptionType } = PaymentOptionType()
  const toastRef = useRef<Toast>(null)

  const fetchDataAndUpdate = async () => {
    const { paymentOptionType } = await getPaymentOptionType()

    if (paymentOptionType !== null) {
      setIsLoading(false)
      setPaymentOptionTypes(paymentOptionType)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key
    if (!/^[0-9]$/.test(key) && key !== 'Backspace' && key !== 'Tab' && key !== '.') {
      e.preventDefault()
    }
  }

  const validateFields = () => {
    const errors: { [key: string]: string } = {}
    if (!amount) errors.amount = 'Amount is required'
    if (!paymentOption) errors.paymentOption = 'Payment option is required'

    setFieldErrors(errors)
    return errors
  }

  const handleSavePayment = async () => {
    const errors = validateFields()
    if (Object.keys(errors).length > 0) {
      return
    }

    try {
      setIsLoading(true)
      const savePaymentPayload = {
        paymentTypeId: paymentOption?.id,
        amount: amount,
      }
      const response = await savePayment({
        payload: savePaymentPayload,
        workOrderInvoiceId: workOrderInvoiceId,
      }).unwrap()
      const { status, message } = response as SaveUserResponse
      if (status === 200 || status === 201) {
        toastRef?.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: message,
          life: 3000,
        })
        setIsLoading(false)
        onHide()
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
      setIsLoading(false)
      const { data } = error as ErrorResponse
      toastRef?.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: data?.message,
        life: 3000,
      })
    }
  }

  useEffect(() => {
    fetchDataAndUpdate()
  }, [])

  return (
    <>
      <Toast ref={toastRef} />

      <div style={{ paddingBottom: '50px' }} className={isLoading ? 'blurred' : ''}>
        <div className="flex gap-6">
          <div className="mt-">
            <span className="font-medium text-sm text-[#000000]">
              <div className="flex gap-1">
                Type
                <p className="text-red-600">*</p>
              </div>
            </span>
            <div className="mt-2">
              <Dropdown
                id="paymentOption"
                value={paymentOption}
                options={paymentOptionTypes}
                onChange={(e) => {
                  setPaymentOption(e.target.value)
                  setFieldErrors({ ...fieldErrors, paymentOption: '' })
                }}
                optionLabel="type"
                placeholder="Select payment option"
                style={{
                  width: '230px',
                  height: '32px',
                  border: fieldErrors.paymentOption ? '1px solid red' : '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  color: 'black',
                }}
              />
              <p className="" id="paymentOption">
                {fieldErrors.paymentOption && (
                  <small className="p-error">{fieldErrors.paymentOption}</small>
                )}
              </p>
            </div>
          </div>

          <div>
            <span className="font-medium text-sm text-[#000000]">
              <div className="flex gap-1">
                Amount:
                <p className="text-red-600">*</p>
              </div>
            </span>
            <div className="mt-2">
              <InputComponent
                type="number"
                value={amount}
                onKeyDown={handleKeyDown}
                onChange={(e) => {
                  setAmount(e.target.value)
                  setFieldErrors({ ...fieldErrors, amount: '' })
                }}
                style={{
                  width: '230px',
                  height: '32px',
                  border: fieldErrors.amount ? '1px solid red' : '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.8rem',
                  paddingLeft: '0.5rem',
                }}
              />
              <p className="" id="amount">
                {fieldErrors.amount && <small className="p-error">{fieldErrors.amount}</small>}
              </p>
            </div>
          </div>
        </div>
        {isLoading && (
          <ProgressSpinner
            style={{
              position: 'absolute',
              top: '50%',
              left: '40%',
              transform: 'translate(-50%, -50%)',
              width: '50px',
              height: '50px',
            }}
            strokeWidth="4"
          />
        )}
        <div className="flex gap-6 ml-1 mt-40">
          <div
            className={`"flex gap-6 bottom-2 absolute left-7"`}
            style={{
              width: '100%',
              height: '65px',
              backgroundColor: 'white',
              padding: '0 12px',
              bottom: '0px',
            }}>
            <Button
              label={'Save'}
              onClick={handleSavePayment}
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
                marginTop: '4px',
              }}
            />

            <Button
              onClick={onHide}
              label="CANCEL"
              severity="danger"
              text={true}
              style={{
                backgroundColor: 'white',
                color: '#000000',
                border: 'none',
                width: '89px',
                height: '42px',
                marginTop: '4px',
              }}
            />
            <Toast ref={toastRef} />
          </div>
        </div>
      </div>
    </>
  )
}

export default PaymentModal
