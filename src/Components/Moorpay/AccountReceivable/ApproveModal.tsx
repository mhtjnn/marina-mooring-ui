import React, { useState, useRef } from 'react'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { ApproveModalProps } from '../../../Type/ComponentBasedType'
import InputComponent from '../../CommonComponent/InputComponent'
import { Params } from '../../../Type/CommonType'
import { useApproveWorkOrderMutation } from '../../../Services/MoorServe/MoorserveApi'
import { ErrorResponse, WorkOrderResponse } from '../../../Type/ApiTypes'

const ApproveModal: React.FC<ApproveModalProps> = ({
  id,
  toast,
  setVisible,
  closeModal,
  getWorkOrderWithPendingPayApproval,
  getOutStandingInvoice,
}) => {
  const [invoiceAmount, setInvoiceAmount] = useState<any>()
  const [errorMessage, setErrorMessage] = useState<{ [key: string]: string }>({})
  const [approveWorkOrder] = useApproveWorkOrderMutation()

  const validateFields = () => {
    const errors: { [key: string]: string } = {}

    if (!invoiceAmount) {
      errors.invoiceAmount = 'Invoice Amount is required'
    }
    setErrorMessage(errors)
    return Object.keys(errors).length === 0
  }

  const handleInvoiceAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '')
    setInvoiceAmount(value)
    setErrorMessage({})
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key
    if (!/^[0-9]$/.test(key) && key !== 'Backspace' && key !== 'Tab' && key !== '.') {
      e.preventDefault()
    }
  }

  const handleBack = () => {
    setVisible(false)
  }

  const ApproveWorkOrderMethod = async () => {
    if (!validateFields()) {
      return
    }
    try {
      const params: Params = {}
      if (invoiceAmount) {
        params.invoiceAmount = invoiceAmount
      }
      const response = await approveWorkOrder({ id: id, invoiceAmount: invoiceAmount }).unwrap()
      const { status, message } = response as WorkOrderResponse
      if (status === 200) {
        closeModal()
        getWorkOrderWithPendingPayApproval()
        getOutStandingInvoice()
        toast?.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: message,
          life: 3000,
        })
      } else {
        closeModal()
        getWorkOrderWithPendingPayApproval()
        getOutStandingInvoice()
        toast?.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        })
      }
    } catch (error) {
      const { message: msg } = error as ErrorResponse
      console.error('Error occurred while fetching customer data:', msg)
    }
  }

  return (
    <>
      <div>
        <Toast ref={toast} />

        <div className=" mt-4">
          <span className="font-medium text-sm text-[#000000]">
            <div className="flex gap-2 ml-2">
              Invoice Amount
              <p className="text-red-600">*</p>
            </div>
          </span>
          <div className="mt-1 ml-1 text-[#000000]">
            <div className="">
              <InputComponent
                type="number"
                value={invoiceAmount}
                onKeyDown={handleKeyDown}
                onChange={handleInvoiceAmountChange}
                style={{
                  width: '450px',
                  height: '40px',
                  border: errorMessage.invoiceAmount ? '1px solid red' : '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  boxShadow: 'none',
                  paddingLeft: '0.5rem',
                  fontSize: '0.8rem',
                }}
              />
            </div>
          </div>
          <p>
            {errorMessage.invoiceAmount && (
              <small className="p-error">{errorMessage.invoiceAmount}</small>
            )}
          </p>
        </div>
      </div>
      {/* Save and Back buttons */}
      <div
        className={`"flex  absolute "`}
        style={{
          width: '100%',
          height: '65px',
          backgroundColor: 'white',
          padding: '0 12px',
          bottom: '0px',
        }}>
        <Button
          label={'Save'}
          onClick={ApproveWorkOrderMethod}
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
            marginTop: '15px',
          }}
        />
        <Button
          onClick={handleBack}
          label={'Back'}
          text={true}
          style={{
            backgroundColor: 'white',
            color: '#000000',
            border: 'none',
            width: '89px',
            height: '42px',
            marginTop: '15px',
          }}
        />
      </div>
    </>
  )
}

export default ApproveModal
