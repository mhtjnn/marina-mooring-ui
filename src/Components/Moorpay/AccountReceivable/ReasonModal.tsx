import React, { useState, useRef } from 'react'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { ReasonModalProps } from '../../../Type/ComponentBasedType'
import { Params } from '../../../Type/CommonType'
import { ErrorResponse, WorkOrderResponse } from '../../../Type/ApiTypes'
import { useDenyWorkOrderMutation } from '../../../Services/MoorServe/MoorserveApi'
import InputComponent from '../../CommonComponent/InputComponent'

const ReasonModal: React.FC<ReasonModalProps> = ({
  selectedRowData,
  setVisible,
  closeModal,
  getWorkOrderWithPendingPayApproval,
  getOutStandingInvoice,
  toast,
}) => {
  const [reasonDetails, setReasonDetails] = useState<any>()
  const [errorMessage, setErrorMessage] = useState<{ [key: string]: string }>({})
  const [denyWorkOrder] = useDenyWorkOrderMutation()
  const validateFields = () => {
    const errors: { [key: string]: string } = {}
    if (!reasonDetails) {
      errors.reasonDetails = 'Reason is required'
    }
    setErrorMessage(errors)
    return Object.keys(errors).length === 0
  }
  const handleBack = () => {
    setVisible(false)
  }

  const DenyWorkOrderMethod = async () => {
    if (!validateFields()) {
      return
    }
    try {
      const params: Params = {}
      if (reasonDetails) {
        params.reportProblem = reasonDetails
      }

      const response = await denyWorkOrder({
        id: selectedRowData,
        reportProblem: reasonDetails,
      }).unwrap()
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
              Reason
              <p className="text-red-600">*</p>
            </div>
          </span>
          <div className="mt-1 ml-1 text-[#000000]">
            <div className="">
              <InputComponent
                value={reasonDetails}
                onChange={(e) => {
                  setReasonDetails(e.target.value)
                  setErrorMessage({})
                }}
                style={{
                  width: '450px',
                  height: '50px',
                  border: errorMessage.reasonDetails ? '1px solid red' : '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  boxShadow: 'none',
                  paddingLeft: '0.5rem',
                  fontSize: '0.8rem',
                  resize: 'none',
                }}
              />
            </div>
          </div>
          <p>
            {errorMessage.reasonDetails && (
              <small className="p-error">{errorMessage.reasonDetails}</small>
            )}
          </p>
        </div>
      </div>
      {/* Save and Back buttons */}
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
          onClick={DenyWorkOrderMethod}
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
          onClick={handleBack}
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
    </>
  )
}

export default ReasonModal
